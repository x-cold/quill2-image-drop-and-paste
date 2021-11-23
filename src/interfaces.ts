import Quill from 'quill';

export interface Options {
  test?: string;
}

export abstract class QuillImageDropAndPaste {
  public quill;

  public options: Options;

  public constructor(quill: Quill, option: Options) {
    this.quill = quill;
    this.options = option;
  }

  protected abstract handleDrop(e: DragEvent): void;

  protected abstract handlePaste(e: ClipboardEvent): void;
}
