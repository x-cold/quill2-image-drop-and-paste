import Quill, { RangeStatic } from 'quill';
import {
  img2Blob, isImageOp, getOpImage,
} from './utils';
import { QuillImageDropAndPaste, Options, Op } from './interfaces';

const Delta = Quill.import('delta');

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
    this.injectUploaderHandler();
  }

  /**
   * With quill2 editor, you should only set options.handler of uploader module.
   * It will automatically replace images from dataurl to url via your custom image handler.
   * Related issue: https://github.com/quilljs/quill/issues/863#issuecomment-240579430
   *
   * Source code for handling paste event: https://github.com/quilljs/quill/blob/d2bd71d758dd0bb707801ca3e07b9919ece748ca/modules/uploader.js#L8
   * Source code for handling drop event: https://github.com/quilljs/quill/blob/d2bd71d758dd0bb707801ca3e07b9919ece748ca/modules/clipboard.js#L156
   */
  injectUploaderHandler() {
    const imageHandler = (range: RangeStatic, files: Blob[]) => {
      const promises = files.map(this.options.upload);
      Promise.all(promises).then((images) => {
        const update = images.reduce(
          (delta, image) => delta.insert({ image }),
          new Delta().retain(range.index).delete(range.length),
        );
        this.quill.updateContents(update, 'user');
        this.quill.setSelection(
          range.index + images.length,
          0,
          'silent',
        );
      });
    };
    const uploader = this.quill
      .getModule('uploader');
    uploader.options.handler = imageHandler;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  handleDrop(e: DragEvent): void {
    // TODO: elegant implements for paste or drop images / videos
  }

  handlePaste(e: ClipboardEvent): void {
    if (!e.clipboardData) {
      return;
    }
    if (e.clipboardData.types.includes('text/html') && !e.clipboardData.types.includes('Files')) {
      this.uploadAndReplaceImgs();
    }
  }

  uploadAndReplaceImgs() {
    const delta = this.quill.getContents();
    for (let i = 0; i < delta.ops.length; i += 1) {
      const op = delta.ops[i];
      // Replace original url to target url
      if (isImageOp(op)) {
        this.handleImg(op);
      }
    }
  }

  async handleImg(op: Op): Promise<void> {
    const image = getOpImage(op);
    const imageElement = document.querySelector(`img[src="${image}"]`);
    if (!imageElement) {
      console.warn('Can not read img element of url: %s', image);
      return;
    }
    const file = await img2Blob(imageElement as HTMLImageElement, {});
    const url = await this.options.upload(file);
    const delta = this.quill.getContents();
    const index = delta.ops.findIndex((_op: Op) => isImageOp(_op) && getOpImage(_op) === image);
    const newOp: Op = {
      attributes: op.attributes,
      insert: {
        image: url,
      },
    };
    // const previousDelta = new Delta(delta.ops.slice(0, index));
    // const previousLength = previousDelta.length();
    // const newDelta = new Delta().retain(previousLength + 1).delete(1).insert(newOp);
    const newDelta = new Delta([
      ...delta.ops.slice(0, index),
      newOp,
      ...delta.ops.slice(index + 1),
    ]);
    this.quill.setContents(newDelta, 'api');
  }
}

export default ImageDropAndPaste;
