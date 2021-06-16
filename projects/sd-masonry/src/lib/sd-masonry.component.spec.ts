import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdMasonryComponent } from './sd-masonry.component';

describe('SdMasonryComponent', () => {
  let component: SdMasonryComponent;
  let fixture: ComponentFixture<SdMasonryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdMasonryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdMasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
