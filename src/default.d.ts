declare module 'parchment' {
  class EmbedBlot {
    static create(src: string): HTMLElement;
    static value(domNode: HTMLElement): string;

    static blotName: string;

    static className: string;

    static tagName: string;
  }
}
