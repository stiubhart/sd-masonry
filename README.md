
# SdMasonry  
  
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.14.  
  
#### Angular Component for organising child components in a masonry layout

The masonry grid is hastily calculated using `sdMasonryWidth` and `sdMasonryHeight` on each item on an array that you provide. Much faster than working this out on the fly after render that you see on other masonry layout packages. From there, you may add as much or as little data you want to each item which will be passed to one of your own component to do with what you will.
 
Did I mention sd-masonry also flawlessly handles pagination. Simply add more items to your `data` object

## Install  
  
`npm i sd-masonry` 

## Usage

Import `SdMasonryModule` into your app's modules:
```typescript
import { SdMasonryModule } from 'sd-masonry';

@NgModule({
  imports: [SdMasonryModule],
  ...
})
```

@Params
* `component`: Component Class (required)
* `data`: array (required)
* `maxGridGap`: number (optional - default 10px)
* `maxTotalColCount`: number (optional - default 10px)
>`<sd-masonry [component]="component" [data]="data" maxGridGap="0" maxTotalColCount="15"></sd-masonry>`

`maxGrigGap` and `maxTotalColCount` will automatically reduce in size depending on the container size

#### Component Class
Your component will be passed each item in your `data` array above in the form of an `item` object. Your component will need to be ready to grab it - `@Input() item`
>  @Input() item: {sdMasonryWidth: number, sdMasonryHeight: number, ... };  
  
## Getting Started - A Walk-through

Start a new project `ng new my-sd-masonry`

replace `app.component.ts` with the following
```typescript
import { Component, Input } from '@angular/core';  

@Component({  
    selector: 'app-root',  
    template: `<div style="margin: 40px 100px;"><sd-masonry [component]="component" [data]="data"></sd-masonry></div>`,  
})  
export class AppComponent {  
  
    /** Required by sd-masonry */  
    public component = ItemComponent; /** ItemComponent declared below */  
  
    /** Required by sd-masonry (id and url properties are only required by ItemComponent in this example) */
    public data: {sdMasonryWidth: number, sdMasonryHeight: number, id?: number, url?: string}[];  
  
    private page1 = [  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 1, url: 'https://via.placeholder.com/1000x1500/947/000/?text=1+-+1000x1500' },  
        { sdMasonryWidth: 1512, sdMasonryHeight: 1006, id: 2, url: 'https://via.placeholder.com/1512x1006/69c/000/?text=2+-+1512x1006' },  
        { sdMasonryWidth: 1507, sdMasonryHeight: 1004, id: 3, url: 'https://via.placeholder.com/1507x1004/a5b/000/?text=3+-+1507x1004' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 4, url: 'https://via.placeholder.com/1000x1500/3c2/000/?text=4+-+1000x1500' },  
        { sdMasonryWidth: 1086, sdMasonryHeight: 1629, id: 5, url: 'https://via.placeholder.com/1086x1629/ae4/000/?text=5+-+1086x1629' },  
        { sdMasonryWidth: 1376, sdMasonryHeight: 1720, id: 6, url: 'https://via.placeholder.com/1376x1720/5c7/000/?text=6+-+1376x1720' },  
        { sdMasonryWidth: 1488, sdMasonryHeight: 992, id: 7, url: 'https://via.placeholder.com/1488x992/dbd/000/?text=7+-+1488x992' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1351, id: 8, url: 'https://via.placeholder.com/1000x1351/c8b/000/?text=8+-+1000x1351' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 9, url: 'https://via.placeholder.com/1000x1500/2b3/000/?text=9+-+1000x1500' },  
        { sdMasonryWidth: 1374, sdMasonryHeight: 917, id: 10, url: 'https://via.placeholder.com/1374x917/468/000/?text=10+-+1374x917' },  
        { sdMasonryWidth: 708, sdMasonryHeight: 1060, id: 11, url: 'https://via.placeholder.com/708x1060/2c7/000/?text=11+-+708x1060' },  
        { sdMasonryWidth: 1368, sdMasonryHeight: 912, id: 12, url: 'https://via.placeholder.com/1368x912/a3a/000/?text=12+-+1368x912' },  
        { sdMasonryWidth: 888, sdMasonryHeight: 1291, id: 13, url: 'https://via.placeholder.com/888x1291/7ec/000/?text=13+-+888x1291' },  
        { sdMasonryWidth: 912, sdMasonryHeight: 1368, id: 14, url: 'https://via.placeholder.com/912x1368/1e3/000/?text=14+-+912x1368' },  
        { sdMasonryWidth: 1693, sdMasonryHeight: 1123, id: 15, url: 'https://via.placeholder.com/1693x1123/989/000/?text=15+-+1693x1123' },  
        { sdMasonryWidth: 1326, sdMasonryHeight: 1988, id: 16, url: 'https://via.placeholder.com/1326x1988/583/000/?text=16+-+1326x1988' },  
        { sdMasonryWidth: 1200, sdMasonryHeight: 1500, id: 17, url: 'https://via.placeholder.com/1200x1500/b9e/000/?text=17+-+1200x1500' },  
        { sdMasonryWidth: 1734, sdMasonryHeight: 1771, id: 18, url: 'https://via.placeholder.com/1734x1771/889/000/?text=18+-+1734x1771' },  
        { sdMasonryWidth: 817, sdMasonryHeight: 561, id: 19, url: 'https://via.placeholder.com/817x561/a5a/000/?text=19+-+817x561' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 20, url: 'https://via.placeholder.com/1000x1500/5bd/000/?text=20+-+1000x1500' },  
        { sdMasonryWidth: 931, sdMasonryHeight: 1396, id: 21, url: 'https://via.placeholder.com/931x1396/d69/000/?text=21+-+931x1396' },  
        { sdMasonryWidth: 1006, sdMasonryHeight: 1512, id: 22, url: 'https://via.placeholder.com/1006x1512/2bb/000/?text=22+-+1006x1512' },  
        { sdMasonryWidth: 1146, sdMasonryHeight: 764, id: 23, url: 'https://via.placeholder.com/1146x764/68e/000/?text=23+-+1146x764' },  
        { sdMasonryWidth: 1840, sdMasonryHeight: 1228, id: 24, url: 'https://via.placeholder.com/1840x1228/8bd/000/?text=24+-+1840x1228' },  
        { sdMasonryWidth: 750, sdMasonryHeight: 500, id: 25, url: 'https://via.placeholder.com/750x500/891/000/?text=25+-+750x500' },  
        { sdMasonryWidth: 1182, sdMasonryHeight: 1000, id: 26, url: 'https://via.placeholder.com/1182x1000/464/000/?text=26+-+1182x1000' },  
        { sdMasonryWidth: 1396, sdMasonryHeight: 2092, id: 27, url: 'https://via.placeholder.com/1396x2092/d5d/000/?text=27+-+1396x2092' },  
        { sdMasonryWidth: 666, sdMasonryHeight: 1000, id: 28, url: 'https://via.placeholder.com/666x1000/989/000/?text=28+-+666x1000' },  
        { sdMasonryWidth: 931, sdMasonryHeight: 698, id: 29, url: 'https://via.placeholder.com/931x698/6c6/000/?text=29+-+931x698' },  
        { sdMasonryWidth: 1023, sdMasonryHeight: 1535, id: 30, url: 'https://via.placeholder.com/1023x1535/122/000/?text=30+-+1023x1535' },  
    ];  
  
    private page2 = [  
        { sdMasonryWidth: 855, sdMasonryHeight: 1282, id: 31, url: 'https://via.placeholder.com/855x1282/89e/000/?text=31+-+855x1282' },  
        { sdMasonryWidth: 967, sdMasonryHeight: 1450, id: 32, url: 'https://via.placeholder.com/967x1450/752/000/?text=32+-+967x1450' },  
        { sdMasonryWidth: 1680, sdMasonryHeight: 1120, id: 33, url: 'https://via.placeholder.com/1680x1120/871/000/?text=33+-+1680x1120' },  
        { sdMasonryWidth: 1060, sdMasonryHeight: 708, id: 34, url: 'https://via.placeholder.com/1060x708/211/000/?text=34+-+1060x708' },  
        { sdMasonryWidth: 1500, sdMasonryHeight: 1000, id: 35, url: 'https://via.placeholder.com/1500x1000/6a8/000/?text=35+-+1500x1000' },  
        { sdMasonryWidth: 1015, sdMasonryHeight: 1522, id: 36, url: 'https://via.placeholder.com/1015x1522/137/000/?text=36+-+1015x1522' },  
        { sdMasonryWidth: 1252, sdMasonryHeight: 765, id: 37, url: 'https://via.placeholder.com/1252x765/1db/000/?text=37+-+1252x765' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 38, url: 'https://via.placeholder.com/1000x1500/ec6/000/?text=38+-+1000x1500' },  
        { sdMasonryWidth: 864, sdMasonryHeight: 1296, id: 39, url: 'https://via.placeholder.com/864x1296/a9b/000/?text=39+-+864x1296' },  
        { sdMasonryWidth: 760, sdMasonryHeight: 760, id: 40, url: 'https://via.placeholder.com/760x760/77e/000/?text=40+-+760x760' },  
        { sdMasonryWidth: 1500, sdMasonryHeight: 1000, id: 41, url: 'https://via.placeholder.com/1500x1000/686/000/?text=41+-+1500x1000' },  
        { sdMasonryWidth: 966, sdMasonryHeight: 1296, id: 42, url: 'https://via.placeholder.com/966x1296/987/000/?text=42+-+966x1296' },  
        { sdMasonryWidth: 1152, sdMasonryHeight: 768, id: 43, url: 'https://via.placeholder.com/1152x768/214/000/?text=43+-+1152x768' },  
        { sdMasonryWidth: 1004, sdMasonryHeight: 1385, id: 44, url: 'https://via.placeholder.com/1004x1385/c6c/000/?text=44+-+1004x1385' },  
        { sdMasonryWidth: 1016, sdMasonryHeight: 677, id: 45, url: 'https://via.placeholder.com/1016x677/776/000/?text=45+-+1016x677' },  
        { sdMasonryWidth: 864, sdMasonryHeight: 1296, id: 46, url: 'https://via.placeholder.com/864x1296/2ec/000/?text=46+-+864x1296' },  
        { sdMasonryWidth: 526, sdMasonryHeight: 750, id: 47, url: 'https://via.placeholder.com/526x750/565/000/?text=47+-+526x750' },  
        { sdMasonryWidth: 600, sdMasonryHeight: 750, id: 48, url: 'https://via.placeholder.com/600x750/62e/000/?text=48+-+600x750' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 49, url: 'https://via.placeholder.com/1000x1500/7a7/000/?text=49+-+1000x1500' },  
        { sdMasonryWidth: 1040, sdMasonryHeight: 1560, id: 50, url: 'https://via.placeholder.com/1040x1560/d16/000/?text=50+-+1040x1560' },  
        { sdMasonryWidth: 1040, sdMasonryHeight: 1560, id: 51, url: 'https://via.placeholder.com/1040x1560/e4a/000/?text=51+-+1040x1560' },  
        { sdMasonryWidth: 1040, sdMasonryHeight: 1560, id: 52, url: 'https://via.placeholder.com/1040x1560/6b4/000/?text=52+-+1040x1560' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1500, id: 53, url: 'https://via.placeholder.com/1000x1500/81e/000/?text=53+-+1000x1500' },  
        { sdMasonryWidth: 1120, sdMasonryHeight: 1680, id: 54, url: 'https://via.placeholder.com/1120x1680/7de/000/?text=54+-+1120x1680' },  
        { sdMasonryWidth: 722, sdMasonryHeight: 1084, id: 55, url: 'https://via.placeholder.com/722x1084/d96/000/?text=55+-+722x1084' },  
        { sdMasonryWidth: 1000, sdMasonryHeight: 1250, id: 56, url: 'https://via.placeholder.com/1000x1250/e5a/000/?text=56+-+1000x1250' },  
        { sdMasonryWidth: 945, sdMasonryHeight: 1417, id: 57, url: 'https://via.placeholder.com/945x1417/92b/000/?text=57+-+945x1417' },  
        { sdMasonryWidth: 912, sdMasonryHeight: 1283, id: 58, url: 'https://via.placeholder.com/912x1283/63c/000/?text=58+-+912x1283' },  
        { sdMasonryWidth: 1197, sdMasonryHeight: 1820, id: 59, url: 'https://via.placeholder.com/1197x1820/e6a/000/?text=59+-+1197x1820' },  
        { sdMasonryWidth: 987, sdMasonryHeight: 1480, id: 60, url: 'https://via.placeholder.com/987x1480/6de/000/?text=60+-+987x1480' },  
    ];  
  
    /**  
     * Populate this.data 
     */  
    constructor() {  
        this.data = this.page1; /** Loading in Page 1 */  
  
        setTimeout(() => {  
            this.data = this.data.concat(this.page2); /** Loading in Page 2 */  
        }, 5000);  
    }  
}  
  
  
/**  
 * Your own child component for each sd-masonry cell 
 */
@Component({  
    selector: 'app-item-image',  
    template: `<img [src]="item.url" [alt]="item.id">`,  
    styles: ['img { width: 100%; height: 100%; object-fit: cover; border-radius: 5px;}'],  
})  
export class ItemComponent {  
    @Input() item: {sdMasonryWidth: number, sdMasonryHeight: number, id?: number, url?: string};
}
``` 

Update `app.module.ts` to include `SdMasonryModule` and `ItemComponent`
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent, ItemComponent } from './app.component';
import { SdMasonryModule } from 'sd-masonry';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent
  ],
  entryComponents: [ItemComponent],
  imports: [
    BrowserModule,
    SdMasonryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Output
![Masonry Output Screen-shot](https://raw.githubusercontent.com/stiubhart/sd-masonry/master/masonry-shot.png)

## Animation Example

Why not try adding in your own animation to the mix?  Just edit your `ItemComponent` like so :
```typescript
import {animate, state, style, transition, trigger} from '@angular/animations';

// ...

@Component({
    selector: 'app-item-image',
    template: `<img [@scaleAnimation]="state" [src]="item.url" [alt]="item.masonryStyle">`,
    styles: ['img { width: 100%; height: 100%; object-fit: cover;}'],
    animations: [trigger('scaleAnimation', [
        state('beginning', style({transform: 'scale(0)', opacity: 0})),
            state('end', style({transform: 'scale(1)', opacity: 1})),
            transition('beginning => end', [animate('300ms')]),
        ])]
})
export class ItemComponent implements OnInit{

    @Input() item: {adMasonryWidth: number, sdMasonryHeight: number, id?: number, url?: string};
    public state = 'beginning';

    ngOnInit(): void {
        setTimeout(() => {
            this.state = 'end';
        }, Math.random() * 600);
    }
}
```
Remember to update `app.module.ts` to import the `BrowserAnimationsModule`
```typescript
imports: [
    BrowserModule,
    SdMasonryModule,
    BrowserAnimationsModule
],
```

## Upping the game

If you chose to include an `id` property, you'll also be able individually update an item's property, add a new item into the middle of the stack, and delete an item. Try updating your `app.component.ts` to the following  
```typescript
    private newItem = { sdMasonryWidth: 1368, sdMasonryHeight: 2739, id: 61, url: 'https://via.placeholder.com/966x1296/000/fff/?text=NEW+ITEM' };

    /**
     * Populate this.data
     */
    constructor() {

        const delay = 2000;
        let i = 2;

        /** Loading in Page 1 */
        this.data = this.page1;

        /** Change an item's properties (and dimensions) - changing background to red */
        setTimeout(() => {
            this.data = this.data.map(item => {
                if (item.id === 23) {
                    item.url = 'https://via.placeholder.com/146x430/f00/000/?text=23+-+146x430';
                    item.sdMasonryWidth = 146;
                    item.sdMasonryHeight = 430;
                }
                return item;
            });
        }, delay * i++);

        /** Add a new item randomly into the stack */
        setTimeout(() => {
            this.data.splice(12, 0, this.newItem);
            this.data = [].concat(this.data); /** sd-masonry uses ngOnChange(), so mutated data won't trigger that lifecycle event 😔 */
        }, delay * i++);

        /** Loading in Page 2 */
        setTimeout(() => {
            this.data = this.data.concat(this.page2);
        }, delay * i++);

        /** Now... Let's remove the item we just added */
        setTimeout(() => {
            this.data = this.data.filter((item, index) => index !== 12);
        }, delay * i++);
    }
```

## Troubleshooting
If you're getting `Ivy` errors, you may need to update `tsconfig.json` or `tsconfig.app.json` with
```typescript
  "angularCompilerOptions": {
    "enableIvy": false
  }
```
## Further help  
  
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
