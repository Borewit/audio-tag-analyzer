import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DragAndDropBoxComponent } from './drag-and-drop-box.component';

describe('DragAndDropBoxComponent', () => {
  let component: DragAndDropBoxComponent;
  let fixture: ComponentFixture<DragAndDropBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAndDropBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
