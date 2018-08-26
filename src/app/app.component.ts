import {Component, NgZone} from '@angular/core';
import * as mm from 'music-metadata-browser';

import fileReaderStream from 'filereader-stream';

import * as createDebug from 'debug';
import {commonLabels, formatLabels, TagLabel} from "./format-tags";

const debug = createDebug('audio-tag-analyzer:app');

interface IValue {
  text: string,
  ref?: string
}

interface TagText {
  key: string,
  label: IValue
  value: IValue[]
}

interface IUpload {
  file: File,
  metadata?: mm.IAudioMetadata,
  parseError?: Error
}

interface ITagList {
  title: string,
  key: string,
  tags?: TagText[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public uploads: IUpload[];

  public tagLists: ITagList[] = [{
    title: 'Format',
    key: 'format'
  }, {
    title: 'Generic tags',
    key: 'common'
  }];

  constructor(private zone: NgZone) {
  }

  public handleFilesDropped(files: File[]) {
    this.uploads = []; // initialize results
    this.parseFiles(files);
  }

  public handleFilesEnter(event) {
    console.log(event);
  }

  public handleFilesLeave(event) {
    console.log(event);
  }

  private prepareTags(labels: TagLabel[], tags: mm.ICommonTagsResult): TagText[] {
    return labels.filter(label => tags.hasOwnProperty(label.key)).map(label => {
        const av = Array.isArray(tags[label.key]) ? tags[label.key] : [tags[label.key]];
        return {
          key: label.key,
          label: {text: label.label, ref: label.keyRef},
          value: av.map(v => {
            return {
              text: label.toText ? label.toText(v) : v,
              ref: label.valueRef ? label.valueRef(v) : undefined
            };
          })
        };
      }
    );
  }

  private parseFiles(files: File[]): Promise<void> {
    const file: File = files.shift();
    if (file) {

      const upload: IUpload = {
        file
      };
      this.uploads.push(upload);
      debug('Start parsing file %s', file.name);
      const stream = fileReaderStream(file);
      return mm.parseStream(stream, file.type).then(metadata => {
        return this.zone.run(() => {
          debug('Completed parsing of %s:', file.name, metadata);
          upload.metadata = metadata;
          this.tagLists[0].tags = this.prepareTags(formatLabels, metadata.format);
          this.tagLists[1].tags = this.prepareTags(commonLabels, metadata.common);
          return this.parseFiles(files);
        });
      }).catch(err => {
        return this.zone.run(() => {
          debug('Error: ' + err.message);
          upload.parseError = err.message;
        });
      });
    }
  }

}
