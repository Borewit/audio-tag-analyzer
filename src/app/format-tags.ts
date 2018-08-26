import {IAudioMetadata} from 'music-metadata-browser';

export interface TagLabel {
  /**
   * API tag property name
   */
  key: string;
  /**
   * Human readable label describing key
   */
  label: string;
  /**
   * Convert tag label to human readable string
   * @param v {any} Tag value
   * @returns {string} Human readable string
   */
  toText?: (value: any) => string;
  keyRef?: string;
  valueRef?: (value: string) => string;
}

export const formatLabels: TagLabel[] =
  [
    {
      key: 'dataformat',
      label: 'Data format'
    }, {
    key: 'tagTypes',
    label: 'Tag header type(s)'
  }, {
    key: 'duration',
    label: 'Duration',
    toText: v => Math.round(v * 100) / 100 + ' seconds'
  }, {
    key: 'bitrate',
    label: 'Bit-rate',
    toText: v => Math.round(v / 1000) + ' kbps'
  }, {
    key: 'sampleRate',
    label: 'Sample-rate',
    toText: v => Math.round(v / 100) / 10 + ' hz'
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

const mbBaseUrl = 'https://musicbrainz.org';

export const commonLabels: TagLabel[] =
  [
    {
      key: 'title',
      label: 'Track title'
    }, {
    key: 'titlesort',
    label: 'Track title, formatted for alphabetic ordering'
  }, {
    key: 'track',
    label: 'Track number',
    toText: v => v.of ? `${v.no} / ${v.of}` : `${v.no}`
  }, {
    key: 'disk',
    label: 'Disk or media number',
    toText: v => v.of ? `${v.no} / ${v.of}` : `${v.no}`
  }, {
    key: 'artist',
    label: 'Artist'
  }, {
    key: 'artists',
    label: 'Artists'
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
    key: 'albumsort',
    label: 'Album title, formatted for alphabetic ordering'
  }, {
    key: 'originalalbum',
    label: 'Original release title'
  }, {
    key: 'date',
    label: 'Release date'
  }, {
    key: 'originaldate',
    label: 'Original release date'
  }, {
    key: 'originalyear',
    label: 'Original release year',
  }, {
    key: 'media',
    label: 'Release Format'
  }, {
    key: 'label',
    label: 'Release label name(s)'
  }, {
    key: 'catalognumber',
    label: 'Release catalog number(s)',
    keyRef: 'https://musicbrainz.org/doc/Release/Catalog_Number'
  }, {
    key: 'comment',
    label: 'Comments'
  }, {
    key: 'genre',
    label: 'Genres'
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
    key: 'originalartist',
    label: 'Original track artists.'
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
    keyRef: mbBaseUrl + '/History:Release_Status'
  }, {
    key: 'releasetype',
    label: 'Release type',
    keyRef: 'https://musicbrainz.org/doc/Release_Group/Type'
  }, {
    key: 'releasecountry',
    label: 'Release country',
    keyRef: mbBaseUrl + '/Release_Country'
  }, {
    key: 'barcode',
    label: 'Release barcode',
    keyRef: 'https://musicbrainz.org/doc/Barcode',
    valueRef: (v) => 'https://www.barcodelookup.com/' + v
  }, {
    key: 'isrc',
    label: 'ISRC',
    keyRef: 'https://musicbrainz.org/doc/ISRC',
    valueRef: (v) => 'https://isrcsearch.ifpi.org/#!/search?isrcCode=' + v + '&tab=lookup&showReleases=0&start=0&number=10'
  }, {
    key: 'asin',
    label: 'ASIN',
    keyRef: 'https://musicbrainz.org/doc/ASIN'
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
    key: 'musicbrainz_recordingid',
    label: 'Release recording MBID',
    keyRef: 'https://musicbrainz.org/doc/Recording',
    valueRef: (v) => mbBaseUrl + '/recording/' + v
  }, {
    key: 'musicbrainz_trackid',
    label: 'Release track MBID',
    keyRef: 'https://musicbrainz.org/doc/MusicBrainz_Identifier',
    valueRef: (v) => mbBaseUrl + '/recording/' + v
  }, {
    key: 'musicbrainz_albumid',
    label: 'Album release MBID',
    keyRef: 'https://musicbrainz.org/doc/Release',
    valueRef: (v) => mbBaseUrl + '/release/' + v
  }, {
    key: 'musicbrainz_artistid',
    label: 'Track artists MBIDs',
    keyRef: 'https://musicbrainz.org/doc/Artist',
    valueRef: (v) => mbBaseUrl + '/artist/' + v
  }, {
    key: 'musicbrainz_albumartistid',
    label: 'Album artists',
    keyRef: 'https://musicbrainz.org/doc/Artist',
    valueRef: (v) => mbBaseUrl + '/artist/' + v
  }, {
    key: 'musicbrainz_releasegroupid',
    label: 'Release group MBID',
    keyRef: 'https://musicbrainz.org/doc/Release_Group',
    valueRef: (v) => mbBaseUrl + '/release-group/' + v
  }, {
    key: 'musicbrainz_workid',
    label: 'Work MBID',
    keyRef: 'https://musicbrainz.org/doc/Work',
    valueRef: (v) => mbBaseUrl + '/work/' + v
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
    label: 'Acoust ID',
    keyRef: 'https://en.wikipedia.org/wiki/Acoustic_fingerprint',
    valueRef: (v) => 'https://acoustid.org/track/' + v
  }, {
    key: 'acoustid_fingerprint',
    label: 'AcoustID Fingerprint',
    keyRef: 'https://acoustid.org/'
  }, {
    key: 'musicip_puid',
    label: 'PUIDs',
    keyRef: 'https://musicbrainz.org/doc/Fingerprinting#PUID'
  }, {
    key: 'musicip_fingerprint',
    label: 'MusicIP Fingerprint), not sure which algorithm.'
  }, {
    key: 'discogs_artist_id',
    label: 'Discogs artist ID',
    valueRef: (v) => 'https://www.discogs.com/artist/' + v
  }, {
    key: 'discogs_label_id',
    label: 'Discogs label ID',
    valueRef: (v) => 'https://www.discogs.com/label/' + v
  }, {
    key: 'discogs_master_release_id',
    label: 'Discogs master release ID',
    valueRef: (v) => 'https://www.discogs.com/master/' + v
  }, {
    key: 'discogs_votes',
    label: 'Discogs votes'
  }, {
    key: 'discogs_rating',
    label: 'Discogs rating'
  }, {
    key: 'discogs_release_id',
    label: 'Discogs release identifier',
    valueRef: (v) => 'https://www.discogs.com/release/' + v
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
    label: 'Notes'
  }, {
    key: 'key',
    label: 'Initial key'
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
