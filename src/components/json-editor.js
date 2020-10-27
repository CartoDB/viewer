import {useState} from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';

export default function JSONEditor(props) {
  const [text, setText] = useState(JSON.stringify(props.json, null, 2));
  function handleChange(text, event){

    // Parse JSON, while capturing and ignoring exceptions
    try {
      text && JSON.parse(text);
      setText(text);
      if (props.onChange) {
        props.onChange(text);
      }
    } catch (error) {
      // ignore error, user is editing and not yet correct JSON
    }
  }

  return (
    <div className='json-form'>
      <AceEditor
                width="500px"
                height="500px"
                mode="json"
                theme="github"
                onChange={handleChange}
                name="AceEditorDiv"
                editorProps={{$blockScrolling: true}}
                wrapEnabled={true}
                value={text}
              />
    </div>
  );
  
}