import React, { useRef, useEffect } from 'react';
// @ts-ignore
import Quill2ImageDropAndPaste from 'quill2-image-drop-and-paste';
import Quill from 'quill';

import 'quill/dist/quill.snow.css';
import './index.css';

Quill.register('modules/imageDropAndPaste', Quill2ImageDropAndPaste);

const mockUpload = (file: Blob, originalUrl?: string) => new Promise(resolve => {
  // TODO: uploader
  const url = 'https://cdn.nlark.com/yuque/0/2021/jpeg/103147/1637414393290-33a1c232-f002-44ab-b52b-c2f61d193965.jpeg?x-oss-process=image%2Fresize%2Cw_750%2Climit_0';
  setTimeout(() => resolve(url), 5000);
});

const App: React.FC<{}> = (props) => {
  const quillInstance = useRef<Quill>();

  useEffect(() => {
    if (quillInstance.current) {
      return;
    }
    const quill = new Quill('#editor-container', {
      modules: {
        toolbar: [['bold', 'italic'], ['link', 'image']],
        imageDropAndPaste: {
          upload: mockUpload,
          imageDomainAllowList: [
            'cdn.nlark.com'
          ],
          imageAllowMatch(url: string) {

          }
        },
        history: {
          userOnly: true,
        },
      },
      placeholder: 'Copy & paste, or drag an image here...',
      readOnly: false,
      theme: 'snow'
    });
    quillInstance.current = quill;
  }, []);

  return (
    <div className="App" style={{ width: 960, margin: 'auto' }}>
      <h1>React Example</h1>
      <p>Back to <a href="https://github.com/x-cold/quill2-image-drop-and-paste">homepage</a> of quill2-image-drop-and-paste</p>
      <div id="editor-container" style={{ height: '640px' }}></div>
      <p>The image uploader is mocked function, and the image url will consistently change to: <br /> 'https://cdn.nlark.com/yuque/0/2021/jpeg/103147/1637414393290-33a1c232-f002-44ab-b52b-c2f61d193965.jpeg?x-oss-process=image%2Fresize%2Cw_750%2Climit_0'</p>
    </div>
  );
}

export default App;
