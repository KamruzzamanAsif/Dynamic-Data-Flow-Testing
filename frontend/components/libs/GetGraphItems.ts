import { MarkerType } from "reactflow";
import getCFGRender from "./CFGRender";

// const defaultCode = `#include <stdio.h>
// int main() {
//     int num;
//     printf("Enter an integer: ");
//     scanf("%d", &num);

//     // true if num is perfectly divisible by 2
//     if(num % 2 == 0)
//         printf("%d is even.", num);
//     else
//         printf("%d is odd.", num);
    
//     return 0;
// }`

const trimLabel = (label: any) => {
  let index = "";
  let content = "";

  // console.log("LABEL: ", label);
  [index, content] = label.split("(");
  if (label == "S(Start)" || label == "E(End)") {
    content = content.slice(0, content.length - 1);
  } else {
    content = content.slice(0, content.length - 3);
  }

  return [index, content];
};

const updatePosition = (id: any, nodes: any) => {
  for (let i = 0; i < nodes.length; i++) {
    console.log("N: ", nodes[i].id, "I: ", id);
    if (nodes[i].id == id) {
      console.log("ID: ", id);
      // nodes[i].position.y = nodes[i].position.y + 100;
      nodes[i].position.x = nodes[i].position.x + 200;
    }
  }
}

const configureNodePosition = (nodes: any, edges: any[]) => {

  let x = 0;
  let y = 0;

  for (let i = 0; i < nodes.length; i++) {
    x = x;
    y = i * 80;
    nodes[i].position.x = x;
    nodes[i].position.y = y;
  }

  for (let i = 0; i < edges.length; i++) {
    if (i < edges.length - 1) {
      let nextSrc = edges[i + 1].source;
      if (nextSrc == edges[i].source) {
        console.log("HERE...", nextSrc, "---", edges[i].source);
        updatePosition(edges[i].target, nodes)
      }
    }
  }
}

export default function GetGraphItems(codeSnippet: string) {
  const cfg = getCFGRender(codeSnippet);

  const nodeItems = [];
  const edgeItems = [];
  const addedLabels = new Set();

  let connectedNodes = cfg.split("-->");
  let connectedEdges = cfg.split(";");

  //calculating the edges
  for (let i = 1; i < connectedEdges.length; i++) {
    let srcId = "";
    let srcContent = "";
    let targetId = "";
    let targetContent = "";

    const [sourceNodeStr, targetNodeStr] = connectedEdges[i].split("-->");

    console.log("SRC: ", sourceNodeStr, "T: ", targetNodeStr);
    // format: { id: "e1-2", source: "1", target: "2", animated: true }
    [srcId, srcContent] = trimLabel(sourceNodeStr);
    [targetId, targetContent] = trimLabel(targetNodeStr);

    const edge = {
      id: `e${srcId}-${targetId}`,
      source: srcId,
      target: targetId,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 50,
        color: 'blue',
      },
      animated: true,
    };

    // setNodes.push(edge);
    edgeItems.push(edge);
  }

  // calculating the nodes
  for (let i = 0; i < connectedNodes.length; i++) {
    const line = connectedNodes[i].split(";");
    let label = line[0].trim();
    if (i == 0) {
      label = line[1].trim();
    }

    if (!addedLabels.has(label)) {
      let [index, content] = trimLabel(label);

      const node = {
        id: index,
        position: { x: 0, y: 100 },
        data: { label: content },
      };
      // console.log("node: ", node);

      nodeItems.push(node);
      addedLabels.add(label); // Add label to the set to prevent duplicates
    }
  }

  // Sort the nodeItems array based on the "id" property
  nodeItems.sort((a, b) => {
    if (a.id === "S") return -1; // "Start" comes first
    if (b.id === "S") return 1;  // "Start" comes first
    if (a.id === "E") return 1;  // "End" comes last
    if (b.id === "E") return -1; // "End" comes last
    return parseInt(a.id) - parseInt(b.id);
  });

  configureNodePosition(nodeItems, edgeItems);

  return [nodeItems, edgeItems];
}
