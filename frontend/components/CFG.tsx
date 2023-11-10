import mermaid from "mermaid";
import { useEffect } from "react";
import getCFGRender from "./libs/CFGRender";

interface CFGProps {
  code: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
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
        <div key={i}>
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
