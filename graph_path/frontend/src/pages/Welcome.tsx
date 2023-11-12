import React, { useState } from "react";
import Graph from "../components/Graph";

const WelcomePage: React.FC = () => {
  const [graphInfo, setGraphInfo] = useState<string[]>([]);

  const handleClick = () => {
    // Example usage:

    // const graphString = `S(Start)-->1(1, 2, 3, 4, 5, 6, 7, 8 work : Define, 9 work : p-use, );
    // 1(1, 2, 3, 4, 5, 6, 7, 8 work : Define, 9 work : p-use, )-->9(9, );
    // 9(9, )-->10(10, 11, 12, );
    // 9(9, )-->13(13, );
    // 10(10, 11, 12, )-->13(13, );
    // 13(13, )-->E(End)`;

    // Book Example Graph (for varibale 'work')
    const graphString = `S(Start)-->0(0, 1 work : Define);
    0(0, 1 work : Define)-->2(2 work : p-use, );
    2(2 work : p-use, )-->3(3, );
    2(2 work : p-use, )-->16(16, 17, );
    3(3, )-->4(4 work : p-use, );
    4(4 work : p-use, )-->5(5, 6 work : p-use, );
    4(4 work : p-use, )-->15(15, );
    5(5, 6 work : p-use, )-->7(7 work: c-use, );
    5(5, 6 work : p-use, )-->8(8, 9, 10 work: c-use, );
    7(7 work: c-use, )-->14(14, );
    8(8, 9, 10 work: c-use, )-->11(11, );
    11(11, )-->12(12, );
    11(11, )-->13(13, );
    12(12, )-->13(13, );
    13(13, )-->14(14, );
    14(14, )-->15(15, );
    15(15, )-->16(16, 17, );
    16(16, 17, )-->E(End)`;

    const graphString2 = `S(Start)-->0(0 payment : Define, 1, );
    0(0 payment : Define, 1, )-->2(2, );
    2(2, )-->16(16 payment : c-use, 17, );
    2(2, )-->3(3 payment : Define, );
    3(3 payment : Define, )-->4(4, );
    4(4, )-->15(15, );
    4(4, )-->5(5, 6, );
    5(5, 6, )-->7(7 payment: Define, payment: c-use, );
    5(5, 6, )-->8(8, 9, 10 payment: Define, payment: c-use, );
    7(7 payment: Define, payment: c-use, )-->14(14, );
    8(8, 9, 10 payment: Define, payment: c-use, )-->11(11 payment : p-use, );
    11(11 payment : p-use, )-->12(12 payment : Define, payment : c-use, );
    11(11 payment : p-use, )-->13(13, );
    12(12 payment : Define, payment : c-use, )-->13(13, );
    13(13, )-->14(14, );
    14(14, )-->15(15, );
    15(15, )-->16(16 payment : c-use, 17, );
    16(16 payment : c-use, 17, )-->E(End)`;

    const myGraph = new Graph();
    // const myGraph2 = new Graph();

    const graphObject = myGraph.createGraph(graphString2);
    // console.log("Whole Graph", graphObject);

    myGraph.findAndSoteAllTypesofNodes();

    const AU_paths = myGraph.getAllUsesPaths();
    // console.log("[ok], AU paths", AU_paths, "Count: ", AU_paths.length);

    // APU Path good
    // const APU_paths = myGraph.getAllPusePaths();
    // console.log("[ok], APU paths", APU_paths, "Count: ", APU_paths.length);


    // ACU Path good
    // const ACU_paths = myGraph.getAllCusePaths();
    // console.log("[ok], ACU paths", ACU_paths, "Count: ", ACU_paths.length);

    const APUC_paths = myGraph.getAllPSomeC();
    console.log("APUC paths\n", APUC_paths, "\nCount: ", APUC_paths.length);

    const ACUP_paths = myGraph.getAllCSomeP();
    console.log("ACUP paths\n", ACUP_paths, "\nCount: ", ACUP_paths.length);
    

    const ADU_paths = myGraph.getAllDUPaths();
    // console.log("[ok] AU paths", ADU_paths, "Count: ", ADU_paths.length);

    
    // const AD_paths = myGraph.getAllDefinitionPaths();
    // console.log("[ok] AD paths", AD_paths);
  };

  return (
    <div className="h-screen flex items-center justify-center">
        <button
          onClick={handleClick}
          className="bg-black text-white text-xl px-6 py-2 rounded-md"
        >
          Click me
        </button>
      </div>
  );
};

export default WelcomePage;
