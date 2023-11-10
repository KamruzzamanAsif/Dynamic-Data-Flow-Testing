import { useCallback, useState } from "react";
import CFG from "../CFG";
import { getDistinctVariables } from "../libs/CFGRender";

const defaultCode = `#include <stdio.h>
void main()
{
    int num1, rem1;
 
    printf("Input an integer : ");
    scanf("%d", &num1);
    rem1 = num1 % 2;
    if (rem1 == 0)
        printf("%d is an even integer", num1);
    else
        printf("%d is an odd integer", num1);
}`;

const Flowchart = ({ editorRef }: any | null) => {
  const [code, setCode] = useState(defaultCode);

  const fetchCode = useCallback(() => {
    setCode(editorRef.current.getValue());
  }, [editorRef]);

  return (
    <div>
      <CFG code={code} />
      <div className="flex flex-row">
        <button
          onClick={fetchCode}
          className="m-5 text-white rounded-xl bg-green-700 p-5"
        >
          Load Code
        </button>
        <span className="flex justify-center items-center">
          All Variables:{" >> "}
        </span>
        <div className="flex flex-row">
          {getDistinctVariables(code).map((val, i) => (
            <div key={i} className="m-5 text-white rounded-xl bg-red-700 p-5">
              <p>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flowchart;
