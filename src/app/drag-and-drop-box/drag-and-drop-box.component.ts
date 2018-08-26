import {Component, ElementRef, AfterContentInit, OnDestroy, NgZone, EventEmitter, Output} from '@angular/core';

import * as createDebug from 'debug';
import {DragDrop} from './drag-drop';

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
export class DragAndDropBoxComponent implements AfterContentInit, OnDestroy {

  private dragAndDrop: DragDrop;

  constructor(private elementRef: ElementRef, private zone: NgZone) {
  }

  @Output()
  public emitFilesDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitFilesEnter: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitFilesOver: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitFilesLeave: EventEmitter<File[]> = new EventEmitter<File[]>();

  private emitFileEvent(emitter: EventEmitter<File[]>, type: string, files: File[]) {
    debug(`drag/drop:${type} event`);
    this.zone.run(() => {
      emitter.emit(files);
    });
  }

  ngAfterContentInit() {
    const e = this.elementRef.nativeElement;
    const divDrop = e.childNodes[0];
    this.dragAndDrop = new DragDrop(divDrop, {
      onDrop: (files) => {
        this.emitFileEvent(this.emitFilesDrop, 'drop', files);
      },
      onDragEnter: (files) => {
        this.emitFileEvent(this.emitFilesEnter, 'enter', files);
      },
      /*
      onDragOver: (files) => {
        this.emitFileEvent(this.onFileOver, 'over', files);
      },*/
      onDragLeave: (files) => {
        this.emitFileEvent(this.emitFilesOver, 'leave', files);
      }
    });
  }

  ngOnDestroy() {
    this.dragAndDrop.remove();
  }
}
