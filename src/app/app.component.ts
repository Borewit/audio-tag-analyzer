import {Component, NgZone} from '@angular/core';
import * as mm from 'music-metadata-browser';

import * as createDebug from 'debug';

import {commonLabels, formatLabels, TagLabel} from './format-tags';

const debug = createDebug('audio-tag-analyzer');

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
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Flac_logo_vector.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/ea/Mp3.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/02/Opus_logo2.svg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8d/Xiph.Org_logo_square.svg',
  'https://www.shareicon.net/download/2015/12/08/684232_file.svg',
  'http://www.wavpack.com/wavpacklogo.svg'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public results: IFileAnalysis[];

  public tagLists: ITagList[] = [{
    title: 'Format',
    key: 'format'
  }, {
    title: 'Generic tags',
    key: 'common'
  }];

  public logos = logos;

  public nativeTags: {type: string, tags: {id: string, value: string}[]}[] = [];

  public version = {
    app: require('../../package.json').version,
    mmb: require('../../node_modules/music-metadata-browser/package.json').version,
    mm: require('../../node_modules/music-metadata/package.json').version
  };

  constructor(private zone: NgZone) {
  }

  public async handleFilesDropped(files: File[]) {
    this.results = []; // initialize results
    debug('handleFilesDropped', files);
    for (const file of files) {
      debug('Start parsing file %s', file.name);
      await this.parseFile(file);
    }
  }

  public handleTextDropped(text) {
    this.results = []; // initialize results
    if (text.indexOf('http') === 0) {
      return this.parseUsingHttp(text);
    } else {
    }
  }

  public handleFilesEnter(event) {
    debug('handleFilesEnter', event);
  }

  public handleFilesLeave(event) {
    console.log('handleFilesLeave', event);
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

  private prepareNativeTags(tags): {type: string, tags: {id: string, value: string}[]}[] {
    return Object.keys(tags).map(type => {
      return {
        type,
        tags: tags[type]
      };
    });
  }

  private parseUsingHttp(url: string): Promise<void> {
    debug('Converting HTTP to stream using: ' + url);

    const file: IUrlAsFile = {
      name: url,
      type: '?'
    };

    const result: IFileAnalysis = {
      file
    };
    this.results.push(result);

    return mm.fetchFromUrl(url).then(metadata => {

      this.zone.run(() => {

        debug('Completed parsing of %s:', file.name, metadata);
        result.metadata = metadata;
        this.tagLists[0].tags = this.prepareTags(formatLabels, metadata.format);
        this.tagLists[1].tags = this.prepareTags(commonLabels, metadata.common);
        this.nativeTags = this.prepareNativeTags(metadata.native);
      });
    }).catch(err => {
      this.zone.run<void>(() => {
        debug('Error: ' + err.message);
        result.parseError = err.message;
      });
    }) as any;
  }

  private parseFile(file: File): Promise<void> {
    debug('Parsing %s of type %s', file.name, file.type);
    const result: IFileAnalysis = {
      file
    };
    this.results.push(result);
    return mm.parseBlob(file).then(metadata => {
      this.zone.run(() => {
        debug('Completed parsing of %s:', file.name, metadata);
        result.metadata = metadata;
        this.tagLists[0].tags = this.prepareTags(formatLabels, metadata.format);
        this.tagLists[1].tags = this.prepareTags(commonLabels, metadata.common);
        this.nativeTags = this.prepareNativeTags(metadata.native);
      });
    }).catch(err => {
      this.zone.run<void>(() => {
        debug('Error: ' + err.message);
        result.parseError = err.message;
      });
    });
  }

}
