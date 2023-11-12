// GraphDisplay.tsx

import React, { useEffect, useState } from 'react';
import Graph from './libs/DFD_Graph';  // Adjust the import path based on your project structure

const GraphDisplay: React.FC = () => {
  const [duPaths, setDuPaths] = useState<string[]>([]);

  useEffect(() => {
    // Your graph string
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
    // Create an instance of the Graph class
    const graph = new Graph();

    // Create the graph
    const rootNode = graph.createGraph(graphString);

    // Find and categorize nodes
    graph.findAndSoteAllTypesofNodes();

    // Get all DU paths
    const allDuPaths = graph.getAllDuPaths();
    console.log("All DU Paths", allDuPaths);

    // Update state with paths
    setDuPaths(allDuPaths);
  }, []);

  return (
    <div>
      <h2>All DU Paths:</h2>
      <ul>
        {duPaths.map((path, index) => (
          <li key={index}>{`${index + 1}. ${path}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default GraphDisplay;
