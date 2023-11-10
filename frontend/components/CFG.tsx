import mermaid from "mermaid";
import { useEffect } from "react";
import getCFGRender from "./libs/CFGRender";

interface CFGProps {
  code: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  // Set custom configuration options for Mermaid
  // For example, you can adjust the width and height
  flowchart: {
    useMaxWidth: false,
    width: 800, // Set your desired width
    height: 600, // Set your desired height
  },
});

const CFG = ({ code }: CFGProps) => {
  const graphs: any[] = getCFGRender(code);
  console.log("Graph", graphs);

  useEffect(() => {
    mermaid.contentLoaded();
  }, [code, graphs]);

  return (
    <div key={code} className="flex flex-col justify-center items-center">
      {graphs.map((graph, i) => (
        <div key={i} className="mb-4">
          <div key={code} className={`mermaid bg-blue-200 w-full h-full`}>
            {graph}
          </div>
          <div>
            <hr />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CFG;
