import Editor from "@monaco-editor/react";
import { useRef } from "react";

export default function CodeEditor(props: any) {
  const editorRef: any = useRef(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  function showValue() {
    props.setCodeSnippet(editorRef.current.getValue());
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-col justify-center items-center">
        {/* Add your headline */}
        <h1 className="text-3xl mb-4">C Code Viewer 🚀</h1>{" "}
        <Editor
          height="85vh"
          width="50vw"
          defaultLanguage="c"
          defaultValue="printf('hello world')"
          onMount={handleEditorDidMount}
          theme="vs-dark"
        />
      </div>
      <div className="flex justify-center mb-2">
        <button
          className="border-2 bg-yellow-100 rounded-lg p-4 hover:bg-yellow-200"
          onClick={showValue}
        >
          Show value
        </button>
      </div>
    </div>
  );
}
