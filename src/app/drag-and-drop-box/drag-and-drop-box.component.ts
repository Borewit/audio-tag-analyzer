import {Component, ElementRef, AfterContentInit, OnDestroy, NgZone, EventEmitter, Output} from '@angular/core';

import * as createDebug from 'debug';
import * as dragDrop from 'drag-drop';

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

  private dragAndDrop;

  constructor(private elementRef: ElementRef, private zone: NgZone) {
  }

  @Output()
  public emitDropFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitEnterFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitOverFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitLeaveFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Output()
  public emitDropText: EventEmitter<string> = new EventEmitter<string>();

  private emitFileEvent(emitter: EventEmitter<File[] | string>, type: string, files: File[] | string) {
    debug(`drag/drop:${type} event`);
    this.zone.run(() => {
      emitter.emit(files);
    });
  }

  ngAfterContentInit() {
    const e = this.elementRef.nativeElement;
    const divDrop = e.childNodes[0];
    this.dragAndDrop = dragDrop(divDrop, {
      onDrop: (files) => {
        this.emitFileEvent(this.emitDropFiles, 'drop', files);
      },
      onDragEnter: (files) => {
        this.emitFileEvent(this.emitEnterFiles, 'enter', files);
      },
      onDragLeave: (files) => {
        this.emitFileEvent(this.emitOverFiles, 'leave', files);
      },
      onDropText: (text: string) => {
        this.emitFileEvent(this.emitDropText, 'text', text);
      }
    });
  }

  ngOnDestroy() {
    this.dragAndDrop.remove();
  }
}
