import * as flatten from 'flatten';
import * as parallel from 'run-parallel';
import {ProcessEntry} from './process-entry';

/**
 * Based on https://github.com/feross/drag-drop/blob/master/index.js,
 * written by Feross Aboukhadijeh
 */
export class DragDrop {

  private timeout;

  constructor(private elem, private listeners) {
    if (typeof elem === 'string') {
      const selector = elem;
      this.elem = window.document.querySelector(elem);
      if (!elem) {
        throw new Error('"' + selector + '" does not match any HTML elements');
      }
    }

    if (!elem) {
      throw new Error('"' + elem + '" is not a valid HTML element');
    }

    if (typeof listeners === 'function') {
      this.listeners = {onDrop: listeners};
    }

    elem.addEventListener('dragenter', this.onDragEnter, false);
    elem.addEventListener('dragover', this.onDragOver, false);
    elem.addEventListener('dragleave', this.onDragLeave, false);
    elem.addEventListener('drop', this.onDrop, false);
  }

  public remove() {
    this.removeDragClass();
    this.elem.removeEventListener('dragenter', this.onDragEnter, false);
    this.elem.removeEventListener('dragover', this.onDragOver, false);
    this.elem.removeEventListener('dragleave', this.onDragLeave, false);
    this.elem.removeEventListener('drop', this.onDrop, false);
  }

  private onDragEnter = (e) => {
    if (this.listeners.onDragEnter) {
      this.listeners.onDragEnter(e);
    }

    // Prevent event
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  private onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.listeners.onDragOver) {
      this.listeners.onDragOver(e);
    }

    if (e.dataTransfer.items) {
      // Only add "drag" class when `items` contains items that are able to be
      // handled by the registered listeners (files vs. text)
      const items = Array.from(e.dataTransfer.items) as any[];
      const fileItems = items.filter(item => item.kind === 'file');
      const textItems = items.filter(item => item.kind === 'string');

      if (fileItems.length === 0) {
        if (!this.listeners.onDropText || !this.listeners.onDrop || textItems.length === 0) {
          return;
        }
      }
    }

    this.elem.classList.add('drag');
    clearTimeout(this.timeout);

    e.dataTransfer.dropEffect = 'copy';

    return false;
  }

  private onDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.listeners.onDragLeave) {
      this.listeners.onDragLeave(e);
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.removeDragClass, 50);

    return false;
  }

  private onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.listeners.onDragLeave) {
      this.listeners.onDragLeave(e);
    }

    clearTimeout(this.timeout);
    this.removeDragClass();

    const pos = {
      x: e.clientX,
      y: e.clientY
    };

    // text drop support
    const text = e.dataTransfer.getData('text');
    if (text && this.listeners.onDropText) {
      this.listeners.onDropText(text, pos);
    }

    // File drop support. The `dataTransfer.items` API supports directories, so we
    // use it instead of `dataTransfer.files`, even though it's much more
    // complicated to use.
    // See: https://github.com/feross/drag-drop/issues/39
    if (this.listeners.onDrop && e.dataTransfer.items) {
      const fileList = e.dataTransfer.files;

      // Handle directories in Chrome using the proprietary FileSystem API
      const items = Array.from(e.dataTransfer.items as any[]).filter(item => {
        return item.kind === 'file';
      });

      if (items.length === 0) {
        return;
      }

      parallel(items.map(item => {
        return _cb => {
          new ProcessEntry(item.webkitGetAsEntry()).process(_cb);
        };
      }), (err, results) => {
        // This catches permission errors with file:// in Chrome. This should never
        // throw in production code, so the user does not need to use try-catch.
        if (err) {
          throw err;
        }

        const entries = flatten(results);

        const files = entries.filter(item => {
          return item.isFile;
        });

        const directories = entries.filter(item => {
          return item.isDirectory;
        });

        this.listeners.onDrop(files, pos, fileList, directories);
      });
    }
    return false;
  }

  removeDragClass() {
    this.elem.classList.remove('drag');
  }
}


