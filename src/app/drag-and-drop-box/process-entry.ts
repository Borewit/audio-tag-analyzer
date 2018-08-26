import * as parallel from 'run-parallel';

export class ProcessEntry {

  private entries = [];
  private reader;

  constructor(private entry) {
  }

  public process(cb) {
    if (this.entry.isFile) {
      this.entry.file(file => {
        file.fullPath = this.entry.fullPath; // preserve pathing for consumer
        file.isFile = true;
        file.isDirectory = false;
        cb(null, file);
      }, (err) => {
        cb(err);
      });
    } else if (this.entry.isDirectory) {
      this.reader = this.entry.createReader();
      this.readEntries(cb);
    }
  }

  readEntries(cb) {
    this.reader.readEntries(entries_ => {
      if (entries_.length > 0) {
        this.entries = this.entries.concat(Array.from(entries_));
        this.readEntries(cb); // continue reading entries until `readEntries` returns no more
      } else {
        this.doneEntries(cb);
      }
    });
  }

  doneEntries(cb) {
    parallel(this.entries.map(entry => {
      return _cb => new ProcessEntry(this.entry).process(_cb);
    }), (err, results) => {
      if (err) {
        cb(err);
      } else {
        results.push({
          fullPath: this.entry.fullPath,
          name: this.entry.name,
          isFile: false,
          isDirectory: true
        });
        cb(null, results);
      }
    });
  }
}
