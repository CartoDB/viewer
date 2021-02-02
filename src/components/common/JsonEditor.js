import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-idle_fingers';

export default function JSONEditor(props) {
  const [text, setText] = useState(JSON.stringify(props.json, null, 2));
  function handleChange(text, event) {
    // Parse JSON, while capturing and ignoring exceptions
    try {
      text && JSON.parse(text);
      setText(text);
      if (props.onJsonUpdated) {
        props.onJsonUpdated(text);
      }
    } catch (error) {
      // ignore error, user is editing and not yet correct JSON
    }
  }

  useEffect(() => {
    setText(JSON.stringify(props.json, null, 2));
  }, [props.json]);

  const onLoad = (editor) => {
    props.onLoad(editor);
  };

  return (
    <div className='json-form'>
      <AceEditor
        width='100%'
        height='100%'
        mode='json'
        theme='idle_fingers'
        onChange={handleChange}
        name='AceEditorDiv'
        editorProps={{ $blockScrolling: true }}
        wrapEnabled={true}
        value={text}
        onLoad={onLoad}
      />
    </div>
  );
}
