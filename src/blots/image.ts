import Quill from 'quill';

// Reference: https://github.com/NoelOConnell/quill-image-uploader/blob/98907e3af69730c2bc5a9d1d9da59c4ac5f486a0/src/blots/image.js

const Block = Quill.import('blots/block');

class LoadingImage extends Block {
  static create(src: string | true) {
    const node = super.create(src);
    if (src === true) return node;

    const image = document.createElement('img');
    image.setAttribute('src', src);
    node.appendChild(image);
    return node;
  }

  deleteAt(index: number, length: number) {
    super.deleteAt(index, length);
    this.cache = {};
  }

  static value(domNode: HTMLSpanElement) {
    const { src, custom } = domNode.dataset;
    return { src, custom };
  }
}

LoadingImage.blotName = 'loadingIamge';
LoadingImage.className = 'image-uploading';
LoadingImage.tagName = 'span';

export default LoadingImage;
