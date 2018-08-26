import {Component, ElementRef, AfterContentInit, NgZone, EventEmitter, Output} from '@angular/core';

import * as dragDrop from 'drag-drop'
import * as createDebug from 'debug';

const debug = createDebug('audio-tag-analyzer:drag-and-drop');

/*
interface IFileDropEvent {
  files: File[];
  pos;
  fileList;
  directories: any[];
}*/

@Component({
  selector: 'app-drag-and-drop-box',
  template: '<div class="jumbotron"><ng-content></ng-content></div>',
  styleUrls: ['./drag-and-drop-box.component.css']
})
export class DragAndDropBoxComponent implements AfterContentInit {

  constructor(private elementRef: ElementRef, private zone: NgZone) {
  }

  @Output()
  public onFilesDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public onFilesEnter: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public onFilesOver: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public onFilesLeave: EventEmitter<File[]> = new EventEmitter<File[]>();

  private emitFileEvent(emitter: EventEmitter<File[]>, type: string, files: File[]) {
    debug(`drag/drop:${type} event`);
    this.zone.run(() => {
      emitter.emit(files);
    });
  }

  ngAfterContentInit() {
    const e = this.elementRef.nativeElement;
    const divDrop = e.childNodes[0];
    dragDrop(divDrop, {
      onDrop: (files) => {
        this.emitFileEvent(this.onFilesDrop, 'drop', files);
      },
      onDragEnter: (files) => {
        this.emitFileEvent(this.onFilesEnter, 'enter', files);
      },
      /*
      onDragOver: (files) => {
        this.emitFileEvent(this.onFileOver, 'over', files);
      },*/
      onDragLeave: (files) => {
        this.emitFileEvent(this.onFilesOver, 'leave', files);
      }
    })
  }

}
