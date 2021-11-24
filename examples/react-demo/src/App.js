import React from 'react';
import Quill from 'quill';
import Quill2ImageDropAndPaste from 'quill2-image-drop-and-paste';

import 'quill/dist/quill.snow.css';

const Delta = Quill.import('delta');

const mockUpload = (file) => new Promise(resolve => {
  // TODO: uploader
  const url = 'https://cdn.nlark.com/yuque/0/2021/jpeg/103147/1637414393290-33a1c232-f002-44ab-b52b-c2f61d193965.jpeg?x-oss-process=image%2Fresize%2Cw_750%2Climit_0';
  setTimeout(() => resolve(url), 300);
});
export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      quill: null,
      upload: {},
      image: {
        type: '', // image's mimeType
        dataUrl: null, // image's base64 string
        blob: null, // image's BLOB object
        file: null, // image's File object
      }
    };
  }

  componentDidMount() {
    Quill.register('modules/imageDropAndPaste', Quill2ImageDropAndPaste);
    const quill = new Quill('#editor-container', {
      modules: {
        toolbar: [['bold', 'italic'], ['link', 'image']],
        imageDropAndPaste: {
          upload: mockUpload,
        },
        uploader: {
          handler: this.imageHandler.bind(this),
        }
      },
      placeholder: 'Copy & paste, or drag an image here...',
      readOnly: false,
      theme: 'snow'
    });
    this.setState({ quill });
  }

  imageHandler(range, files) {
    const promises = files.map(mockUpload);
    Promise.all(promises).then(images => {
      console.log(images)
      const update = images.reduce((delta, image) => {
        return delta.insert({ image });
      }, new Delta().retain(range.index).delete(range.length));
      this.state.quill.updateContents(update, 'user');
      this.state.quill.setSelection(
        range.index + images.length,
        0,
        'silent',
      );
    });
  }

  render() {
    const { image } = this.state;

    return (
      <div className="App">
        <h1>React Example</h1>
        <div id="editor-container" style={{ height: '320px' }}></div>

        <div>
          <h4>Preview image from BLOB URL:</h4>
          {image.blob &&
            <img src={URL.createObjectURL(image.blob)} alt="preview blob" />
          }
        </div>

        <hr />

        <div>
          <h4>Get file infomation from File Object:</h4>
          {image.file &&
            <div>
              <b>name:</b> <span>{image.file.name}</span> <br />
              <b>size:</b> <span>{image.file.size}</span> <br />
              <b>type:</b> <span>{image.file.type}</span>
            </div>
          }
        </div>
      </div>
    );
  }
}
