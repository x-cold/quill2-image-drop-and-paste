import Quill from 'quill';
import { QuillImageDropAndPaste, Options } from './interfaces';

class ImageDropAndPaste extends QuillImageDropAndPaste {
  quill: Quill;

  options: Options;

  constructor(quill: Quill, options: Options) {
    super(quill, options);
    this.quill = quill;
    this.options = options;

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  handleDrop(e: DragEvent): void {
    console.log('-----drop', e, this.quill);
  }

  handlePaste(e: ClipboardEvent): void {
    console.log('-----paste', e, this.quill);
  }
}

export default ImageDropAndPaste;
