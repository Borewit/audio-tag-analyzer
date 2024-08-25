import {Component, ViewChild} from '@angular/core';
import * as mm from 'music-metadata';

import { commonLabels, formatLabels, TagLabel } from './format-tags';
import {FilePondOptions} from "filepond";
import {FilePondComponent} from "ngx-filepond";
import {uint8ArrayToBase64} from "uint8array-extras";

interface IValue {
  text: string;
  ref?: string;
}

interface ITagText {
  key: string;
  label: IValue;
  value: IValue[];
}

interface IUrlAsFile {
  name: string;
  type: string;
}

interface IFileAnalysis {
  fileId: string;
  file: File | IUrlAsFile;
  metadata?: mm.IAudioMetadata;
  parseError?: Error;
}

interface ITagList {
  title: string;
  key: string;
  tags?: ITagText[];
}

const logos = [
  'https://upload.wikimedia.org/wikipedia/commons/a/a2/FLAC_logo_vector.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/ea/Mp3.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/02/Opus_logo2.svg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8d/Xiph.Org_logo_square.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/76/Windows_Media_Player_simplified_logo.svg',
  'https://www.wavpack.com/wavpacklogo.svg'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('myPond') myPond: FilePondComponent

  public results: IFileAnalysis[] = [];

  public tagLists: ITagList[] = [{
    title: 'Format',
    key: 'format'
  }, {
    title: 'Generic tags',
    key: 'common'
  }];

  public logos = logos;

  public nativeTags: { type: string, tags: { id: string, value: string }[] }[] = [];

  public version = {
    app: require('../../package.json').version,
    mm: require('../../node_modules/music-metadata/package.json').version
  };

  pondOptions: FilePondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop your audio files here...'
  }

  pondFiles: FilePondOptions["files"] = []

  constructor() {
  }

  public pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  public pondHandleAddFile(event: any) {
    if (event?.file) {
      console.info(`A file was added id=${event.file.id}`);
      this.parseFile(event.file.id, event.file.file);
    }
  }

  public pondHandleRemoveFile(event: any) {
    console.info(`File id=${event.file.id} was removed`);
    this.results = this.results.filter(result => result.fileId != event.file.id);
  }

  public pondHandleActivateFile(event: any) {
    console.info(`File id=${event.file.id} was activated`);
  }

  public base64Encode(buffer: Uint8Array): string {
    return uint8ArrayToBase64(buffer)
  }

  private prepareTags(labels: TagLabel[], tags): ITagText[] {
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

  private prepareNativeTags(tags): { type: string, tags: { id: string, value: string }[] }[] {
    return Object.keys(tags).map(type => {
      return {
        type,
        tags: tags[type]
      };
    });
  }

  private async parseFile(fileId: string, file: File) {
    const t0 = new Date().getTime();
    console.info('Parsing %s of type %s, id=%s', file.name, file.type, fileId);
    const result: IFileAnalysis = {
      fileId,
      file
    };
    this.results.push(result);
    try {
      const metadata = await mm.parseBlob(file);
      const t1 = new Date().getTime();
      const duration = t1 - t0;
      console.debug(`Parsing took ${duration} ms`);
      console.debug('Completed parsing of %s:', file.name, metadata);
      result.metadata = metadata;
      this.tagLists[0].tags = this.prepareTags(formatLabels, metadata.format);
      this.tagLists[1].tags = this.prepareTags(commonLabels, metadata.common);
      this.nativeTags = this.prepareNativeTags(metadata.native);
    } catch (err) {
      console.error(err);
      result.parseError = err.message;
    }
  }
}
