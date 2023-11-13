import React, { useState } from "react";
import Graph from "../components/Graph";

const WelcomePage: React.FC = () => {
  const [graphInfo, setGraphInfo] = useState<string[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const inputGraphString = `S(Start)-->1(1, 2, 3, 4, 5, 6, 7, 8 rem1 : Define, 8, );
    1(1, 2, 3, 4, 5, 6, 7, 8 rem1 : Define, 8, )-->9(9, );
    9(9, )-->10(10, );
    9(9, )-->11(11, 12, 13 rem1 : c-use, 14, 15, );
    10(10, )-->11(11, 12, 13 rem1 : c-use, 14, 15, );
    11(11, 12, 13 rem1 : c-use, 14, 15, )-->E(End)`;

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

  const handleClick = () => {
    const myGraph = new Graph();

    const graphObject = myGraph.createGraph(graphString);
    addLog("Whole Graph", graphObject);
    console.log("Whole Graph", graphObject);

    myGraph.findAndSoteAllTypesofNodes();

    const AU_paths = myGraph.getAllUsesPaths();
    addLog("[ok] APU paths", AU_paths, " ::TOTAL:: ", AU_paths.length);
    console.log("[ok] APU paths", AU_paths, AU_paths.length);

    const APU_paths = myGraph.getAllPusePaths();
    addLog("[ok] APU paths", APU_paths, " ::TOTAL:: ", APU_paths.length);
    console.log("[ok] APU paths", APU_paths, APU_paths.length);

    const ACU_paths = myGraph.getAllCusePaths();
    addLog("[ok] ACU paths", ACU_paths, " ::TOTAL:: ", ACU_paths.length);
    console.log("[ok] APU paths", APU_paths, APU_paths.length);

    const APUC_paths = myGraph.getAllPSomeC();
    addLog("[ok] APUC paths", APUC_paths, " ::TOTAL:: ", APUC_paths.length);

    const ACUP_paths = myGraph.getAllCSomeP();
    addLog("[ok] ACUP paths", ACUP_paths, " ::TOTAL:: ", ACUP_paths.length);
    console.log("[ok] ACUP paths", ACUP_paths, ACUP_paths.length);

    const ADU_paths = myGraph.getAllDUPaths();
    addLog("[ok] ADUP paths", ADU_paths, " ::TOTAL:: ", ADU_paths.length);
    console.log("[ok] ADUP paths", ADU_paths, ADU_paths.length);

    const AD_paths = myGraph.getAllDefinitionPaths();
    addLog("[ok] AD paths", AD_paths, " ::TOTAL:: ", AD_paths.length);
    console.log("[ok] AD paths", AD_paths);
  };

  const addLog = (...logs: any[]) => {
    setConsoleLogs((prevLogs) => [...prevLogs, logs.join(" ")]);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <button
        onClick={handleClick}
        className="bg-black text-white text-xl px-6 py-2 rounded-md mb-4"
      >
        Generate Path
      </button>
      <textarea
        value={consoleLogs.join("\n")}
        readOnly
        className="w-full h-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default WelcomePage;
