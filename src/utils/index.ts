import { Op } from '../interfaces';

export const url2Img = (url: string): Promise<HTMLImageElement> => new Promise(
  (resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = (): void => {
      resolve(img);
    };
    img.onerror = reject;
  },
);

/**
 * 使用 Canvas 将图片 url 转为带 水印的 Blob
 * @param img Image 实例
 * @param watermarkOptions 水印选项
 * @param watermarkOptions text 水印文本内容
 * @param watermarkOptions x x轴位置
 * @param watermarkOptions y y轴位置
 * @param watermarkOptions font 水印文本字体
 * @param watermarkOptions fillStyle 水印文本样式
 * @param watermarkOptions imgAlpha 图片透明度 0~1
 * @param watermarkOptions textAlpha 水印文本透明度 0~1
 * @param watermarkOptions textAlign 水印文本对齐方式
 */
export const img2Blob = (img: HTMLImageElement, {
  text = '',
  x = 0,
  y = 0,
  font = '24px serif',
  fillStyle = 'red',
  imgAlpha = 1,
  textAlpha = 1,
  textAlign = 'center' as CanvasTextAlign,
}): Promise<Blob> => new Promise(
  (resolve, reject) => {
    if (!img) {
      reject();
    }
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.globalAlpha = imgAlpha;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.save();
    if (text) {
      ctx.globalAlpha = textAlpha;
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.textAlign = textAlign;
      ctx.fillText(text, x || canvas.width / 2, y || canvas.height / 2);
    }
    canvas.toBlob((blob) => resolve(blob as Blob));
  },
);

export const isImageOp = (op: Op) => op.insert !== 'undefined' && typeof op.insert !== 'string' && (op.insert as { image: string }).image;

export const getOpImage = (op: Op): string => {
  const { image = '' } = op.insert as { image: string };
  return image;
};
