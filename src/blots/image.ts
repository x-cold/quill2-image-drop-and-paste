// import parchment from 'parchment';

import Quill from 'quill';

const parchment = Quill.import('parchment');
// const Embed = Quill.import('blots/embed');
// const InlineBlot = Quill.import('blots/inline');

class LoadingImage extends parchment.EmbedBlot {
  static create(src: string) {
    const node = super.create(src);

    const image = document.createElement('img');
    image.setAttribute('src', src);
    node.appendChild(image);
    node.setAttribute('data-src', src);
    return node;
  }

  static value(domNode: HTMLParagraphElement) {
    return domNode.getAttribute('data-src') || '';
  }
}

LoadingImage.blotName = 'loading-iamge';
LoadingImage.className = 'ql-image-uploading';
LoadingImage.tagName = 'SECTION';

export default LoadingImage;
