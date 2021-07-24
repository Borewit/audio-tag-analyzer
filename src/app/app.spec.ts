import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {DragAndDropBoxComponent} from './drag-and-drop-box/drag-and-drop-box.component';
import { NgMathPipesModule } from 'angular-pipes';
describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DragAndDropBoxComponent
      ],
      imports: [
        NgMathPipesModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  const title = 'Audio Tag Analyzer';

  it(`should have a tag-list'`, waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.tagLists.length).toBe(2);
  }));

  it('should render title in a h1 tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(title);
  }));

});
