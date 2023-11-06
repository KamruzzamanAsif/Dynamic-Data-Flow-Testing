import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import Graph from "./Graph";
import GetGraphItems from "./libs/GetGraphItems";

const Canvas = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [trigger, setTrigger] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");

  // Function to update the graph based on the code snippet
  const updateGraph = (newCodeSnippet: any) => {
    const [newNodes, newEdges] = GetGraphItems(newCodeSnippet);
    setCodeSnippet(newCodeSnippet);
    setNodes(newNodes);
    setEdges(newEdges);
    setTrigger(false);
  };

  useEffect(() => {
    setTrigger(true);
  }, [codeSnippet]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {trigger == true ? <Graph nodes={nodes} edges={edges} /> : ""}
      <div className="h-screen w-full border-2 border-blue-500 bg-slate-400">
        <CodeEditor setCodeSnippet={updateGraph} />
      </div>
    </div>
  );
};

export default Canvas;
