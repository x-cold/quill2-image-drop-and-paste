import Quill, { RangeStatic } from 'quill';
import LoadingImage from './blots/image';
import {
  img2Blob, isImageOp, getImageUrlOfOp, isDataURL, url2Img,
} from './utils';
import {
  QuillImageDropAndPaste, Options, Op, ImageStatus,
} from './interfaces';

const Delta = Quill.import('delta');

// TODO: this is an invalid usage
Quill.register({ 'formats/loading-image': LoadingImage }, true);

const defaultOptions: Required<Options> = {
  imageAllowMatch: () => false,
  imageDomainAllowList: [],
  async upload(file: Blob, originalUrl: string) {
    return originalUrl;
  },
};

class ImageDropAndPaste extends QuillImageDropAndPaste {
  quill: Quill;

  options: Required<Options>;

  private altMap = new Map<string, string>();

  private urlMap = new Map<string, string>();

  constructor(quill: Quill, options: Options) {
    super(quill, options);
    this.quill = quill;

    this.options = {
      ...defaultOptions,
      ...options,
    };

    if (!options) {
      return;
    }

    this.options.imageDomainAllowList?.push(window.location.hostname);
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
      const promises = files.map((file: Blob) => this.options.upload(file));
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
      this.restoreImages();
    }
  }

  shouldImageRestore(url: string) {
    const allowList = this.options.imageDomainAllowList;
    const match = this.options.imageAllowMatch;
    if (isDataURL(url)) {
      return true;
    }
    const { hostname } = new URL(url);
    if (allowList.includes(hostname)) {
      return false;
    }
    return !match(hostname);
  }

  async restoreImage(op: Op): Promise<void> {
    const originalUrl = getImageUrlOfOp(op);
    if (!this.shouldImageRestore(originalUrl)) {
      return;
    }
    try {
      // const imageElement = !isDataURL(originalUrl)
      //   ? this.quill.root.querySelector(`img[src="${originalUrl}"]`)
      //   : url2Img(originalUrl);
      const imageElement = await url2Img(originalUrl);
      if (!imageElement) {
        console.warn('Can not read img element of url: %s', originalUrl);
        return;
      }
      const { attributes } = op;
      const cachedUrl = this.urlMap.get(originalUrl);
      if (typeof cachedUrl === 'string') {
        this.modifyImageDelta(originalUrl, cachedUrl, ImageStatus.SUCCESS);
        return;
      }
      if (attributes?.alt === ImageStatus.LOADING) {
        // If the image matches loading status, do nothing to avoid repeated loading.
        return;
      }
      // TODO: base64 encode image has a too large string length
      this.modifyImageDelta(originalUrl, '', ImageStatus.LOADING);
      if (!this.altMap.has(originalUrl)) {
        this.altMap.set(originalUrl, attributes?.alt || '');
        const file = await img2Blob(imageElement as HTMLImageElement, {});
        // const file = await getLoadedImage(imageElement as HTMLImageElement);
        // const file = await convertURLtoFile(originalUrl);
        const targetUrl = await this.options.upload(file, originalUrl);
        this.urlMap.set(originalUrl, targetUrl);
        this.modifyImageDelta(originalUrl, targetUrl, ImageStatus.SUCCESS);
      }
    } catch (error) {
      console.warn(error);
      this.modifyImageDelta(originalUrl, '', ImageStatus.ERROR);
    }
  }

  restoreImages() {
    const delta = this.quill.getContents();
    for (let i = 0; i < delta.ops.length; i += 1) {
      const op = delta.ops[i];
      // Replace original url to target url
      if (isImageOp(op)) {
        this.restoreImage(op);
      }
    }
  }

  async modifyImageDelta(originalUrl: string, targetUrl: string, status: ImageStatus) {
    const delta = this.quill.getContents();
    const newOps = delta.ops.map((op) => {
      const matchedImage = isImageOp(op) && getImageUrlOfOp(op) === originalUrl;
      if (!matchedImage) {
        return op;
      }
      const { attributes } = op;
      const finalStatus = targetUrl
        ? ImageStatus.SUCCESS
        : status;
      const alt = finalStatus === ImageStatus.SUCCESS
        ? this.altMap.get(originalUrl)
        : status;
      const finalUrl = targetUrl || originalUrl;
      const newOp: Op = {
        attributes: {
          ...(attributes || {}),
          alt,
        },
        insert: {
          image: finalUrl,
        },
        // insert: status !== ImageStatus.LOADING
        //   ? {
        //     image: targetUrl || originalUrl,
        //   }
        //   : {
        //     [LoadingImage.blotName]: originalUrl,
        //   },
      };
      return newOp;
    });
    const newDelta = new Delta(newOps);
    this.quill.setContents(newDelta, 'silent');
  }
}

export default ImageDropAndPaste;

export {
  LoadingImage,
};
