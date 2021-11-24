import Quill from 'quill';
import {
  url2Img, img2Blob, isImageOp, getOpImage,
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
  }

  handleDrop(e: DragEvent): void {
    console.log('-----drop', e, this.quill);
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
      // 非平台内图片重新上传，替换为 cdn 地址
      if (isImageOp(op)) {
        this.handleImg(op);
      }
    }
  }

  async handleImg(op: Op): Promise<void> {
    const image = getOpImage(op);
    const img = await url2Img(image);
    const file = await img2Blob(img, {});
    const url = await this.options.upload(file);
    const delta = this.quill.getContents();
    const index = delta.ops.findIndex((_op: Op) => isImageOp(_op) && getOpImage(_op) === image);
    const newOp: Op = {
      attributes: op.attributes,
      insert: {
        image: url,
      },
    };
    const newDelta = new Delta([
      ...delta.ops.slice(0, index),
      newOp,
      ...delta.ops.slice(index + 1),
    ]);
    this.quill.setContents(newDelta);
  }
}

export default ImageDropAndPaste;
