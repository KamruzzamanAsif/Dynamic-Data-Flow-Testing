import { useRef } from "react";
import CodeEditor from "./CodeEditor";
import Flowchart from "./Diagram/Diagram";

const Canvas = () => {
  const editorRef = useRef(null);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-screen w-3/6 overflow-auto">
        {/* Flowchart takes the remaining height and is scrollable */}
        <Flowchart editorRef={editorRef} />
      </div>
      <div className="h-screen w-3/6 border-2 border-blue-500 bg-slate-400">
        {/* CodeEditor has a fixed height */}
        <CodeEditor ref={editorRef} />
      </div>
    </div>
  );
};

export default Canvas;
