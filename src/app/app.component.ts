import {Component} from '@angular/core';
import * as mm from 'music-metadata-browser';
import {FileSystemFileEntry, UploadEvent} from "ngx-file-drop";

import fileReaderStream from 'filereader-stream'

interface TagLabel {
  key: string,
  label,
  _toString?: (md: mm.IAudioMetadata) => string,
  keyRef?: string
}

interface TagText {
  key: string,
  label: string,
  value: string,
  ref?: string
}

const formatLabels: TagLabel[] =
  [
    {
      key: 'dataformat',
      label: 'Data format'
    }, {
    key: 'tagTypes',
    label: 'Tag header type(s)',
    _toString: v => v.join(', ')
  }, {
    key: 'duration',
    label: 'Duration',
    _toString: v => Math.round(v * 100) / 100 + ' seconds'
  }, {
    key: 'bitrate',
    label: 'Bit-rate',
    _toString: v => Math.round(v / 1000) + ' kbps'
  }, {
    key: 'sampleRate',
    label: 'Sample-rate',
    _toString: v => Math.round(v / 100) / 10 + ' hz'
  }, {
    key: 'bitsPerSample',
    label: 'Audio bit depth'
  }, {
    key: 'encoder',
    label: 'Encoder name'
  }, {
    key: 'codecProfile',
    label: 'Codec profile'
  }, {
    key: 'lossless',
    label: 'Lossless?'
  }, {
    key: 'numberOfChannels',
    label: 'Number of channels'
  }, {
    key: 'audioMD5',
    label: 'Audio MD5 hash'
  }
  ];

const commonLabels: TagLabel[] =
  [
    {
      key: 'title',
      label: 'Track title'
    }, {
    key: 'track',
    label: 'Track number',
    _toString: v => v.of ? `${v.no} / ${v.of}` : `${v.no}`
  }, {
    key: 'disk',
    label: 'Disk or media number',
    _toString: v => v.of ? `${v.no} / ${v.of}` : `${v.no}`
  }, {
    key: 'artist',
    label: 'Artist'
  }, {
    key: 'artists',
    label: 'Artists',
    _toString: v => v.join(', ')
  }, {
    key: 'albumartist',
    label: 'Album artist'
  }, {
    key: 'year',
    label: 'Release year'
  }, {
    key: 'album',
    label: 'Album'
  }, {
    key: 'date',
    label: 'Release date'
  }, {
    key: 'originaldate',
    label: 'Original release date'
  }, {
    key: 'originalyear',
    label: 'Original release year'
  }, {
    key: 'comment',
    label: 'Comments'
  }, {
    key: 'discogs_artist_id',
    label: 'Discogs artist ID'
  }, {
    key: 'discogs_label_id',
    label: 'Discogs label ID'
  }, {
    key: 'discogs_master_release_id',
    label: 'Discogs master release ID'
  }, {
    key: 'discogs_votes',
    label: 'Discogs votes'
  }, {
    key: 'discogs_rating',
    label: 'Discogs rating'
  }, {
    key: 'genre',
    label: 'Genres',
    _toString: v => v.join(', ')
  }/*, {
    key: 'picture',
    label: 'Embedded cover art'
  }*/, {
    key: 'composer',
    label: 'Composer'
  }, {
    key: 'lyrics',
    label: 'Lyricist'
  }, {
    key: 'albumsort',
    label: 'Album title, formatted for alphabetic ordering'
  }, {
    key: 'titlesort',
    label: 'Track title, formatted for alphabetic ordering'
  }, {
    key: 'work',
    label: 'The canonical title of the work',
    keyRef: 'https://musicbrainz.org/doc/Work'
  }, {
    key: 'artistsort',
    label: 'Track artist sort name'
  }, {
    key: 'albumartistsort',
    label: 'Album artist sort name'
  }, {
    key: 'composersort',
    label: 'Composer, formatted for alphabetic ordering'
  }, {
    key: 'lyricist',
    label: 'Lyricist, formatted for alphabetic ordering'
  }, {
    key: 'writer',
    label: 'Writer'
  }, {
    key: 'conductor',
    label: 'Conductor'
  }, {
    key: 'remixer',
    label: 'Remixer(s)'
  }, {
    key: 'arranger',
    label: 'Arranger'
  }, {
    key: 'engineer',
    label: 'Engineer(s)'
  }, {
    key: 'producer',
    label: 'Producer(s)'
  }, {
    key: 'djmixer',
    label: 'Mix-DJ(s)'
  }, {
    key: 'mixer',
    label: 'Mixed by'
  }, {
    key: 'label',
    label: 'Release label name(s)'
  }, {
    key: 'grouping',
    label: 'Content group description.'
  }, {
    key: 'subtitle',
    label: 'Contains the subtitle of the content'
  }, {
    key: 'discsubtitle',
    label: 'The Media Title given to a specific disc'
  }, {
    key: 'totaltracks',
    label: 'The total number of tracks'
  }, {
    key: 'totaldiscs',
    label: 'The total number of discs'
  }, {
    key: 'compilation',
    label: 'Is part of compilation'
  }, {
    key: 'rating',
    label: 'Object holding rating score [0..1]'
  }, {
    key: 'bpm',
    label: 'Beats Per Minute (BPM)'
  }, {
    key: 'mood',
    label: 'Keywords to reflect the mood of the audio'
  }, {
    key: 'media',
    label: 'Release Format'
  }, {
    key: 'catalognumber',
    label: 'Release catalog number(s)',
    keyRef: 'https://musicbrainz.org/doc/Release/Catalog_Number'
  }, {
    key: 'show',
    label: 'TV show title'
  }, {
    key: 'showsort',
    label: 'TV show sorting title'
  }, {
    key: 'podcast',
    label: 'ToDo',
    keyRef: 'https://github.com/Borewit/music-metadata/issues/13'
  }, {
    key: 'podcasturl',
    label: 'ToDo',
    keyRef: 'https://github.com/Borewit/music-metadata/issues/13'
  }, {
    key: 'releasestatus',
    label: 'Releases status',
    keyRef: 'https://wiki.musicbrainz.org/History:Release_Status'
  }, {
    key: 'releasetype',
    label: 'Release type',
    keyRef: 'https://musicbrainz.org/doc/Release_Group/Type'
  }, {
    key: 'releasecountry',
    label: 'Release country',
    keyRef: 'https://wiki.musicbrainz.org/Release_Country'
  }, {
    key: 'script',
    label: 'Release Script',
    keyRef: 'https://picard.musicbrainz.org/docs/tags/'
  }, {
    key: 'language',
    label: 'Language used in metadata'
  }, {
    key: 'copyright',
    label: 'Copyright.'
  }, {
    key: 'license',
    label: 'License'
  }, {
    key: 'encodedby',
    label: 'Encoded by (person/organisation)'
  }, {
    key: 'encodersettings',
    label: 'Encoder Settings'
  }, {
    key: 'gapless',
    label: 'Gapless album indicator'
  }, {
    key: 'barcode',
    label: 'Release barcode',
    keyRef: 'https://musicbrainz.org/doc/Barcode'
  }, {
    key: 'isrc',
    label: 'ISRC',
    keyRef: 'https://musicbrainz.org/doc/ISRC'
  }, {
    key: 'asin',
    label: 'ASIN',
    keyRef: 'https://musicbrainz.org/doc/ASIN'
  }, {
    key: 'musicbrainz_recordingid',
    label: 'Release recording MBID',
    keyRef: 'https://musicbrainz.org/doc/Recording'
  }, {
    key: 'musicbrainz_trackid',
    label: 'Release track MBID',
    keyRef: 'https://musicbrainz.org/doc/MusicBrainz_Identifier'
  }, {
    key: 'musicbrainz_albumid',
    label: 'Album release MBID',
    keyRef: 'https://musicbrainz.org/doc/Release'
  }, {
    key: 'musicbrainz_artistid',
    label: 'Track artists MBIDs',
    keyRef: 'https://musicbrainz.org/doc/Artist'
  }, {
    key: 'musicbrainz_albumartistid',
    label: 'Album (written on cover)',
    keyRef: 'https://musicbrainz.org/doc/Artist'
  }, {
    key: 'musicbrainz_releasegroupid',
    label: 'Release group MBID',
    keyRef: 'https://musicbrainz.org/doc/Release_Group'
  }, {
    key: 'musicbrainz_workid',
    label: 'Work MBID',
    keyRef: 'https://musicbrainz.org/doc/Work'
  }, {
    key: 'musicbrainz_trmid',
    label: 'TRM Acoustic ID',
    keyRef: 'https://musicbrainz.org/doc/Fingerprinting#TRM'
  }, {
    key: 'musicbrainz_discid',
    label: 'Disc ID',
    keyRef: 'https://musicbrainz.org/doc/Disc_ID'
  }, {
    key: 'acoustid_id',
    label: 'Acoust ID.',
    keyRef: 'https://en.wikipedia.org/wiki/Acoustic_fingerprint'
  }, {
    key: 'acoustid_fingerprint',
    label: 'AcoustID Fingerprint',
    keyRef: 'https://picard.musicbrainz.org/docs/mappings/'
  }, {
    key: 'musicip_puid',
    label: 'PUIDs',
    keyRef: 'https://musicbrainz.org/doc/Fingerprinting#PUID'
  }, {
    key: 'musicip_fingerprint',
    label: 'MusicIP Fingerprint), not sure which algorithm.'
  }, {
    key: 'website',
    label: 'URL of website'
  }, {
    key: 'performer:instrument',
    label: 'Performer relationship types, instrument can also be vocals.'
  }, {
    key: 'averageLevel',
    label: 'Average gain level.'
  }, {
    key: 'peakLevel',
    label: 'Peak gain level.'
  }, {
    key: 'notes',
    label: 'Similar to comments'
  }, {
    key: 'notes',
    label: 'Initial key'
  }, {
    key: 'originalalbum',
    label: 'Original release title'
  }, {
    key: 'originalartist',
    label: 'Original track artists.'
  }, {
    key: 'discogs_release_id',
    label: 'Discogs release identifier'
  }, {
    key: 'replaygain_track_peak',
    label: '_ToDo_: difference with peakLevel?'
  }, {
    key: 'replaygain_track_gain',
    label: '_ToDo_: difference with averageLevel'
  }, {
    key: 'technician',
    label: 'Technician who digitized subject'
  }
  ];

interface IUpload {
  fileEntry: FileSystemFileEntry,
  file?: File,
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

  public uploads: IUpload[] = [];

  public tagLists: ITagList[] = [{
    title: 'Format',
    key: 'format'
  },{
    title: 'Generic tags',
    key: 'common'
  }];

  public dropped(event: UploadEvent) {

    this.uploads = event.files
      .filter(droppedFile => {
        return droppedFile.fileEntry.isFile;
      })
      .map(droppedFile => {
        return {fileEntry: droppedFile.fileEntry as FileSystemFileEntry};
      });

    this.parseFiles(0);
  }

  private prepareTags(labels: TagLabel[], tags: mm.ICommonTagsResult): TagText[] {
    return labels.filter(label => tags.hasOwnProperty(label.key)).map(label => {
        return {
          key: label.key,
          label: label.label,
          value: label._toString ? label._toString(tags[label.key]) : tags[label.key],
          ref: label.keyRef
        };
      }
    );
  }

  private parseFiles(i) {
    if (i < this.uploads.length) {
      const upload = this.uploads[i];
      upload.fileEntry.file(file => {
        console.log("fileEntry: %o", upload.fileEntry);
        console.log("file: %o", file);
        upload.file = file;
        const stream = fileReaderStream(file);
        mm.parseStream(stream, file.type).then(metadata => {
          console.log(metadata);
          upload.metadata = metadata;
          this.tagLists[0].tags = this.prepareTags(formatLabels, metadata.format);
          this.tagLists[1].tags = this.prepareTags(commonLabels, metadata.common);
          this.parseFiles(++i);
        }).catch(err => {
          console.error(err);
          upload.parseError = err;
        });
      });
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

}
