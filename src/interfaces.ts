import Quill from 'quill';

export interface Options {
  upload(file: Blob, originalUrl?: string): Promise<string>;
  imageDomainAllowList?: string[];
  imageAllowMatch?: (url: string) => boolean;
}

export abstract class QuillImageDropAndPaste {
  public quill;

  public options: Options;

  public constructor(quill: Quill, options: Options) {
    this.quill = quill;
    this.options = options;
  }

  protected abstract handleDrop(e: DragEvent): void;

  protected abstract handlePaste(e: ClipboardEvent): void;
}

export interface Op {
  // only one property out of {insert, delete, retain} will be present
  insert?: string | object;
  delete?: number;
  retain?: number;
  attributes?: AttributeMap;
}

export interface AttributeMap {
  [key: string]: any;
}

export enum ImageStatus {
  LOADING = 'ql-image-loading',
  SUCCESS = 'ql-image-success',
  ERROR = 'ql-image-error',
}
