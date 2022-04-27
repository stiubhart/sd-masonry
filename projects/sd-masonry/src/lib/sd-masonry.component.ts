import {
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EmbeddedViewRef,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'sd-masonry',
  template: `
      <div class="masonry-container" #masonryContainer [style]="'margin: ' + gridGap + 'px auto'">
          <div class="grid-wrapper" [style]="parentStyle">
                <ng-container #masonryContent></ng-container>
          </div>
      </div>
  `,
})
export class SdMasonryComponent implements OnInit, OnChanges {

  /** data must have sdMasonryWidth and sdMasonryHeight properties at the root of each array element */
  @Input() data: {sdMasonryWidth: number, sdMasonryHeight: number, id?: number|string}[];
  public sdMasonryData: {sdMasonryWidth: number, sdMasonryHeight: number, sdMasonryStyle?: string, sdMasonryId?: number}[];
  @Input() component: Type<any>;
  @Input() maxTotalColCount = 10;
  @Input() maxGridGap = 10;
  public totalColCount = 10;
  public gridGap = 10;
  @ViewChild('masonryContainer') masonryContainer: ElementRef;
  @ViewChild('masonryContent', {read: ViewContainerRef}) masonryContent;
  private cells: {} = {};
  private colDimension: number;
  public parentStyle: string;
  private lastUsableRowForPage = 1;
  private sdMasonryStylesRendered: any[] = [];
  private areas = [];
  private medianArea: number;
  private newOrRemovedItem = false;
  private newPage = false;

  constructor(
      private resolver: ComponentFactoryResolver,
  ) {}

  /**
   * Start building the parent and item styles for Masonry Layout
   */
  ngOnInit(): void {
    this.checkRequiredFields();

    this.sdMasonryData = JSON.parse(JSON.stringify(this.data)); /** Because we want to mutate this.data with our own properties */

    setTimeout(() => {
      this.addSdMasonryIdToItems();
      this.getGridWrapperStyle();
      this.buildSdMasonryStyles();
      this.buildComponentItems();
    }, 0);
  }

  /**
   * When this.data has changed
   * i.e when a new page or item has been added/deleted or an item's property has changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.newPage = false;
    this.newOrRemovedItem = false;

    if (this.sdMasonryData) {
      const tempSdMasonryData = this.remapSdMasonryData();
      const anyRemoved = this.handleAnyRemovedItems();
      this.newOrRemovedItem = (this.newOrRemovedItem) ? this.newOrRemovedItem : anyRemoved;

      this.sdMasonryData = tempSdMasonryData;
    } else {
      this.sdMasonryData = [];
    }

    this.addSdMasonryIdToItems();

    if (this.newPage) {
      const lastUsableRowForPage = (Object.keys(this.cells).length - 2);
      this.lastUsableRowForPage = (lastUsableRowForPage > 1) ? lastUsableRowForPage : 1;
    }

    if (this.newOrRemovedItem) {
      this.lastUsableRowForPage = 1;
      this.cells = {};
    }

    this.buildSdMasonryStyles(this.newOrRemovedItem);
    this.buildComponentItems();
  }

  /**
   * Re-map sdMasonryData with the new this.data but grab the old sdMasonryStyle
   * if it exists using item's id or index if id doesn't exist
   */
  remapSdMasonryData(): {sdMasonryWidth: number, sdMasonryHeight: number, sdMasonryStyle?: string, sdMasonryId?: number}[] {
    const len = this.sdMasonryData.length;

    return this.data.map((item, index: number) => {
      const masonryItem = (this.sdMasonryData[0].hasOwnProperty('id')) ?
          this.sdMasonryData.find((sdMasonryDataItem) => sdMasonryDataItem.sdMasonryId === item.id) :
          this.sdMasonryData[index];

      if (masonryItem) {
        /**
         * masonryItem exists, copy the old sdMasonryId and sdMasonryStyle and pop it into the new item
         */
        if ((item as any).sdMasonryWidth === masonryItem.sdMasonryWidth && (item as any).sdMasonryHeight === masonryItem.sdMasonryHeight) {
          (item as any).sdMasonryStyle = masonryItem.sdMasonryStyle;
        } else {
          this.newOrRemovedItem = true;
        }

        (item as any).sdMasonryId = masonryItem.sdMasonryId;
      } else {
        /**
         * masonryItem doesn't exist. This means a new one has been added (re-calculate all styles)
         * or appended (newPage i.e don't re-calculate previous styles)
         */
        if (index + 1 < len) {
          this.newOrRemovedItem = true;
        } else {
          this.newPage = true;
        }
      }

      return item;
    });
  }

  /**
   * Check for removed items. Destroy the component and remove its reference.
   * Returns boolean (true if any items have been removed
   */
  handleAnyRemovedItems(): boolean {
    this.addSdMasonryIdToItems();

    let newOrRemovedItem = false;
    this.sdMasonryData.map((item, index) => {
      const dataItemRemoved = (this.data[0].hasOwnProperty('id')) ?
          this.data.find((dataItem) => dataItem.id === item.sdMasonryId) :
          this.data[index];

      if (! dataItemRemoved) {
        this.sdMasonryStylesRendered[item.sdMasonryId]?.destroy();
        setTimeout(() => {
          this.sdMasonryStylesRendered.splice(item.sdMasonryId);
        }, 0);
        newOrRemovedItem = true;
      }
    });

    return newOrRemovedItem;
  }

  /**
   * loop through each masonry data item and add an id to it. If id exists, use that
   * (works better when adding and removing individual items) otherwise create a random id
   */
  addSdMasonryIdToItems(): void {
    this.sdMasonryData.forEach((item) => {
      if (! item.hasOwnProperty('sdMasonryId')) {
        item.sdMasonryId =  (item.hasOwnProperty('id')) ?
            item.sdMasonryId = (item as any).id :
            Math.round(Math.random() * 100000000);
      }
    });
  }

  /**
   * From the users this.component input where they pass in a component class, create an instance of it
   * in the this.masonryContent for each sdMasonryData item. Also add the sdMasonryStyle attribute to the
   * host view.
   */
  buildComponentItems(): void {
    this.sdMasonryData?.forEach((item: {sdMasonryWidth: number, sdMasonryHeight: number, sdMasonryStyle?: string, sdMasonryId: number}) => {
      const forwardItem = JSON.parse(JSON.stringify(item));
      delete forwardItem.sdMasonryId;
      delete forwardItem.sdMasonryStyle;

      /** We already have this item in the Rendered stack - maybe update it? */
      if (this.sdMasonryStylesRendered[item.sdMasonryId]) {
        /** Update item */
        const instanceRef = (this.sdMasonryStylesRendered[item.sdMasonryId].instance as {item: any});
        instanceRef.item = forwardItem;

        /** Update the componentRef with the new style */
        const viewRef = (this.sdMasonryStylesRendered[item.sdMasonryId].hostView as EmbeddedViewRef<any>);
        const oldStyle: string = (viewRef.rootNodes[0] as HTMLElement).getAttribute('style');
        if (item.sdMasonryStyle !== oldStyle) {
          (viewRef.rootNodes[0] as HTMLElement).setAttribute('style', item.sdMasonryStyle);
        }

        return;
      }

      /** Build and add in this.masonryContent */
      const factory = this.resolver.resolveComponentFactory(this.component);
      const componentRef = this.masonryContent.createComponent(factory);

      (componentRef.instance as {item: any}).item = forwardItem;
      /** Add Style to hostView */
      ((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement).setAttribute('style', item.sdMasonryStyle);

      this.sdMasonryStylesRendered[item.sdMasonryId] = componentRef;
    });
  }

  /**
   * Throw error if we don't have component or data attributes inputted
   */
  checkRequiredFields(): void {
    if (! this.component) {
      throw new TypeError(`'component' attribute is required`);
    }

    if (! this.data) {
      throw new TypeError(`'data' attribute is required`);
    }

    if (this.maxTotalColCount < 3) {
      throw new TypeError(`'maxTotalColCount' must be 3 or more`);
    }

    this.sdMasonryData.forEach((item) => {
      const idString = (item.hasOwnProperty('id')) ? ` with id '${(item as any).id}' is ` : ' ';
      if (! item.hasOwnProperty('sdMasonryHeight')) {
        throw new TypeError(`item${idString}missing property sdMasonryHeight`);
      }

      if (! item.hasOwnProperty('sdMasonryWidth')) {
        throw new TypeError(`item${idString}missing property sdMasonryWidth`);
      }
    });
  }

  /**
   * Get parent style based on element width and total number of columns required
   */
  @HostListener('window:resize', ['$event'])
  getGridWrapperStyle(event?): string {
    if (! this.masonryContainer) {
      return;
    }

    this.getColCountAndGridGap();

    /** columnDimension = (masonryContainer width - gridGaps) / totalColumns */
    const containerWidth = (this.masonryContainer.nativeElement as HTMLElement).offsetWidth;
    this.colDimension = (containerWidth - (this.gridGap * this.totalColCount - this.gridGap)) / this.totalColCount;

    let style = 'grid-template-columns: ';

    for (let i = 0; i < this.totalColCount; i++) {
      style += this.colDimension + 'px ';
    }

    this.parentStyle = `display: grid; ${style}; grid-gap: ${this.gridGap}px`;

    /** On screen resize, reset and re-calculate all styles */
    if (event?.type === 'resize') {
      this.lastUsableRowForPage = 1;
      this.cells = {};

      this.buildSdMasonryStyles(true);
      this.buildComponentItems();
    }

    return style;
  }

  /**
   * Based on screen size and this.maxColCount/this.maxGridGap, work out what values we'll actually use
   */
  getColCountAndGridGap(): void {
    const containerWidth = (this.masonryContainer.nativeElement as HTMLElement).offsetWidth;
    let factor = 1;

    if (containerWidth <= 500) { factor = 0.25; }
    if (containerWidth <= 800) { factor = 0.5; }
    if (containerWidth <= 1024) { factor = 0.75; }

    this.totalColCount = Math.ceil(this.maxTotalColCount * factor);
    this.gridGap = Math.ceil(this.maxGridGap * factor);

    if (containerWidth <= 500 || this.totalColCount < 3) {
      this.totalColCount = 3;
    }
  }

  /**
   * Add a `sdMasonryStyle` property to each item in the this.sdMasonryData array
   */
  buildSdMasonryStyles(reCalcAllStyles?: boolean): void {
    if (! this.sdMasonryData || ! this.colDimension) {
      return;
    }

    this.getSetMedianArea(reCalcAllStyles);

    this.sdMasonryData.forEach((result) => {
      if (reCalcAllStyles || ! result.hasOwnProperty('sdMasonryStyle')) {
        result.sdMasonryStyle = this.getImageColRowSpan(result.sdMasonryWidth, result.sdMasonryHeight);
      }
    });
  }

  /**
   * Get and set the average area from the data set who's not been included in
   * a previous calculation
   */
  getSetMedianArea(reCalcAllStyles?: boolean): void {
    this.areas = [];
    this.sdMasonryData.forEach((result) => {
      if (reCalcAllStyles || ! result.hasOwnProperty('sdMasonryStyle')) {
        const area = result.sdMasonryWidth * result.sdMasonryHeight;
        if (area) {
          this.areas.push(area);
        }
      }
    });

    this.medianArea = this.median(this.areas);
  }

  /**
   * Calculate the median value from an array of numbers
   */
  median(values): number {
    if (values.length === 0) {
      return 0;
    }

    values.sort((a, b) => {
      return a - b;
    });

    const half = Math.floor(values.length / 2);

    if (values.length % 2) {
      return values[half];
    }

    return (values[half - 1] + values[half]) / 2.0;
  }

  /**
   * Get the style attributes for an image given its width and height
   * i.e. an image 400 X 200 may return:
   *      grid-column: 3 / span 2 ; grid-row: 1 / span 1 ; height: 103px
   *
   * grid-column and grid-row are worked out by finding the first available
   * cell in the grid that'll accommodate that image size/dimensions (while
   * adhering to the this.lastUsableRowForPage rule - for pagination reasons)
   */
  getImageColRowSpan(width: number, height: number): string {
    const ratio = width / height;
    const area = width * height;

    let colSpan = 1;
    let rowSpan = 1;
    if (ratio >= 1.25) { colSpan = 2; }
    if (ratio >= 1.55) { colSpan = 3; }
    if (ratio <= 0.75) { rowSpan = 2; }
    if (ratio <= 0.45) { rowSpan = 3; }

    if (area > this.medianArea && colSpan !== 3 && rowSpan !== 3) {
      colSpan++;
      rowSpan++;
    }

    if (colSpan === 3 && rowSpan === 3) {
      colSpan = 2;
      rowSpan = 2;
    }

    const colSpanStyle = `/ span ${colSpan} `;
    const rowSpanStyle = `/ span ${rowSpan} `;

    const requiredCells = this.findAvailableCellsRequired(rowSpan, colSpan);

    const rowNum: number = parseInt(Object.keys(requiredCells)[0], 10);
    const colNum: number = parseInt(requiredCells[rowNum][0], 10);
    const heightStyle = `height: ${(this.colDimension * rowSpan) + (this.gridGap * (rowSpan - 1))}px`;

    return `grid-column: ${colNum} ${colSpanStyle}; grid-row: ${rowNum} ${rowSpanStyle}; ${heightStyle}`;
  }

  /**
   * With the help of getCellsRequired(), find the first set of free cells
   * from this.cells grid that can fit a given image's row and col span
   */
  findAvailableCellsRequired(rowSpan: number, colSpan: number): [] {
    let spaceFound = false;
    let col = 1;
    let row = this.lastUsableRowForPage; /** Prevents images from new pages filling an empty space too far into a previous page */
    let requiredCells;

    do {
      requiredCells = this.getCellsRequired(row, col, rowSpan, colSpan);

      if (! requiredCells || ! this.areAllRequiredCellsFree(requiredCells)) {
        if (col !== this.totalColCount) {
          col++;
        } else {
          col = 1;
          row++;
        }
      } else {
        /** Fill up all the cells required by this image */
        this.populateCellsWith(requiredCells);
        spaceFound = true;
      }
    } while (! spaceFound);

    return requiredCells;
  }

  /**
   * Return the coordinates of each cell required for an image given its
   * start row & cell and the span of each
   */
  getCellsRequired(startRow, startCell, rowSpan, cellSpan): object {
    const requiredCells = {};

    for (let i = 0; i < rowSpan; i++) {
      for (let j = 0; j < cellSpan; j++) {
        if (startCell + j > this.totalColCount) {
          return null;
        }

        if (! requiredCells[startRow + i]) {
          requiredCells[startRow + i] = [startCell + j];
        } else {
          requiredCells[startRow + i].push(startCell + j);
        }
      }
    }

    return requiredCells;
  }

  /**
   * From an object of cell coordinates, find out if all required cells are free in
   * the this.cells grid
   */
  areAllRequiredCellsFree(requiredCells): boolean {
    let noFilledCellsFound = true;
    for (const [row, cols] of Object.entries(requiredCells)) {
      [].concat(cols).forEach((col) => {
        if (this.cells && this.cells[row] && this.cells[row].includes(col)) {
          noFilledCellsFound = false;
        }
      });
    }

    return noFilledCellsFound;
  }

  /**
   * Now we have a set of required cells for an image and we know the space is free, we can
   * populate the this.cells grid with this image's cell locations
   */
  populateCellsWith(requiredCells): void {
    for (const [row, cols] of Object.entries(requiredCells)) {
      [].concat(cols).forEach((col) => {
        if (! this.cells[row]) {
          this.cells[row] = [col];
        } else {
          this.cells[row].push(col);
        }

        /** Removes duplicates - shouldn't have any anyway of course 👀 */
        this.cells[row] = [...new Set(this.cells[row])];
      });
    }
  }
}
