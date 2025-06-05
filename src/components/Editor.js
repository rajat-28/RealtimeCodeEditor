import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag"; 
import ACTIONS from "../Actions";
       

const Editor = ({socketRef,roomId,onCodeChange}) => {
  const textareaRef = useRef(null);
  const editorRef = useRef(null); 

  useEffect(() => {
    if (!textareaRef.current || editorRef.current) return;

    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: { name: "javascript", json: true },
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    editorRef.current.on("change",(instance, changes) => {
      console.log("changes are ",changes);
      const {origin} = changes;
      const code = instance.getValue();
      onCodeChange(code); 
      if(origin !== "setValue"){
        console.log("it is emitting",code);
        socketRef.current.emit(ACTIONS.CODE_CHANGE,{
          roomId,
          code
        })
      }
      // console.log(code);
    });
    

    
    // editorRef.current.setValue(`console.log("Hello, World!");\n\n// Write your code here...\n`);

  }, []);

  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        console.log("recieving the data",code);
        if(code !== null){
          editorRef.current.setValue(code);
        }
      })
    }
    return () =>{
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  },[socketRef.current])

 
  return (
    <div className="editorContainer">
                  <img src="/push_run.png" alt="logo"  className="editorWatermark" />

      <textarea ref={textareaRef}></textarea>;
    </div>
  );
};

export default Editor;
