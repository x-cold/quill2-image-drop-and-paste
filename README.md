quill2-image-drop-and-paste
---


[![NPM version][npm-image]][npm-url]
[![build status][gitflow-image]][gitflow-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/quill2-image-drop-and-paste.svg?style=flat-square
[npm-url]: https://npmjs.org/package/quill2-image-drop-and-paste
[gitflow-image]: https://github.com/x-cold/quill2-image-drop-and-paste/actions/workflows/nodejs.yml/badge.svg?branch=master
[gitflow-url]: https://github.com/x-cold/quill2-image-drop-and-paste/actions/workflows/nodejs.yml
[codecov-image]: https://codecov.io/gh/x-cold/quill2-image-drop-and-paste/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/x-cold/quill2-image-drop-and-paste
[download-image]: https://badgen.net/npm/dt/quill2-image-drop-and-paste
[download-url]: https://npmjs.org/package/quill2-image-drop-and-paste

A quill plugin to deal with pasting and droping images and html including images. [[Example]((https://x-cold.github.io/quill2-image-drop-and-paste/react-demo/))].

![Paste html](https://github.com/x-cold/quill2-image-drop-and-paste/blob/master/screenshots/paste-html.gif)

## Usage

- Install the plugin

```bash
npm i -S quill2-image-drop-and-paste
```

- Register the plugin and init quill instance

```ts
import Quill from 'quill';
import Quill2ImageDropAndPaste from 'quill2-image-drop-and-paste';

Quill.register('modules/imageDropAndPaste', Quill2ImageDropAndPaste);

const quill = new Quill('#editor-container', {
  modules: {
    // ...
    imageDropAndPaste: {
      upload: uploadImage,
      imageDomainAllowList: [
        'cdn.nlark.com'
      ],
      imageAllowMatch(url: string) {

      },
    },
    history: {
      userOnly: true, // Recommend to turn on this option
    },
    // ...
  },
});

function uploadImage(file: Blob, originalUrl: string): string {

}
```

- API documents: https://x-cold.github.io/quill2-image-drop-and-paste/

## Examples

- React Demo
  - [Online showcase](https://x-cold.github.io/quill2-image-drop-and-paste/react-demo/)
  - [Source code](https://github.com/x-cold/quill2-image-drop-and-paste/tree/master/examples/react-demo)

## Development

### NPM scripts

 - `npm lint`: Eslint code
 - `npm lint:fix`: Eslint code and try to fix problems
 - `npm start`: Realtime complie code
 - `npm run docs`: Generate type documents
 - `npm run build`: Build ths dist products
 - `npm run release`: The same as `npm run release:patch`
 - `npm run release:patch`: Automatically upgrade patch versioin and update CHANGELOG.md
 - `npm run release:minor`: Automatically upgrade minor versioin and update CHANGELOG.md
 - `npm run release:major`: Automatically upgrade major versioin and update CHANGELOG.md
 - `npm run test`: Run test suite via jest with code coverage
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run deploy`: Deploy github pages

### Cookbook

- Local development

```bash
npm install
npm start
```

- Local demo

```
cd exmaples/react-demo
npm install
npm link ../../
npm start
```

- Build

```bash
npm run build
```

- Publish the package following [semantic version](https://semver.org/)

```
npm publish
```
