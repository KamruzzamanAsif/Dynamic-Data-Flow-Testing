import React from 'react';
import Graph from '../components/Graph'


const WelcomePage: React.FC = () => {
  
  const handleClick = () => {
    // Example usage:

    // const graphString = `S(Start)-->1(1, 2, 3, 4, 5, 6, 7, 8 rem1 : Define, 9 rem1 : p-use, );
    // 1(1, 2, 3, 4, 5, 6, 7, 8 rem1 : Define, 9 rem1 : p-use, )-->9(9, );
    // 9(9, )-->10(10, 11, 12, );
    // 9(9, )-->13(13, );
    // 10(10, 11, 12, )-->13(13, );
    // 13(13, )-->E(End)`;


    // Book Example Graph (for varibale 'work')
    const graphString = `S(Start)-->0(0, 1 rem1 : Define);
    0(0, 1 rem1 : Define)-->2(2, rem1 : p-use);
    2(2, rem1 : p-use)-->3(3, );
    2(2, rem1 : p-use)-->16(16,17, );
    3(3, )-->4(4, rem1 : p-use);
    4(4, rem1 : p-use)-->5(5, 6, rem1 : p-use);
    4(4, rem1 : p-use)-->15(15, );
    5(5, 6, rem1 : p-use)-->7(7, rem1: c-use);
    5(5, 6, rem1 : p-use)-->8(8, 9, 10, rem1: c-use);
    7(7, rem1: c-use)-->14(14, );
    8(8, 9, 10, rem1: c-use)-->11(11, );
    14(14, )-->15(15, );
    15(15, )-->16(16,17, );
    13(13, )-->14(14, );
    11(11, )-->12(12, );
    11(11, )-->13(13, );
    12(12, )-->13(13, );
    13(13, )-->E(End)`;


    const myGraph = new Graph();
    const graphObject = myGraph.createGraph(graphString);
    console.log("Whole Graph", graphObject);

    myGraph.findAndSoteAllTypesofNodes();
    const AD_paths = myGraph.getAllDefinitionPaths();
    console.log("AD paths", AD_paths);

    const ACU_paths = myGraph.getAllCusePaths();
    console.log("ACU paths", ACU_paths);

    const APU_paths = myGraph.getAllPusePaths();
    console.log("APU paths", APU_paths);

    const AU_paths = myGraph.getAllDUPaths();
    console.log("ADUP paths", AU_paths);

    const APUC_paths = myGraph.getAllPuseSomeCusePaths();
    console.log("APUC paths", APUC_paths);

    const ACUP_paths = myGraph.getAllPuseSomeCusePaths();
    console.log("ACUP paths", ACUP_paths);
  };

  return (
    <>
      <button onClick={handleClick}>Click me</button>
    </>
  );
};

export default WelcomePage;
