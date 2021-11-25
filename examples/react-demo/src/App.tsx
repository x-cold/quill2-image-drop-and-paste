import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
// @ts-ignore
import Quill2ImageDropAndPaste from 'quill2-image-drop-and-paste';

import 'quill/dist/quill.snow.css';

Quill.register('modules/imageDropAndPaste', Quill2ImageDropAndPaste);

const mockUpload = (file: Blob) => new Promise(resolve => {
  // TODO: uploader
  const url = 'https://cdn.nlark.com/yuque/0/2021/jpeg/103147/1637414393290-33a1c232-f002-44ab-b52b-c2f61d193965.jpeg?x-oss-process=image%2Fresize%2Cw_750%2Climit_0';
  setTimeout(() => resolve(url), 300);
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

  return  (
    <div className="App">
      <h1>React Example</h1>
      <div id="editor-container" style={{ height: '320px' }}></div>
    </div>
  );
}

export default App;
