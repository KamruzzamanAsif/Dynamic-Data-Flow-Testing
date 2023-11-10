import makeGraph from "./Graph"
import Node from "./Node"

export const complexity = {
  regions: 0,
}
export let lines: Array<string>
let renderString = `flowchart TD`

const cKeywords: string[] = [
  "auto", "break", "case", "char", "const", "continue", "default", "do", "include", "main",
  "double", "else", "enum", "extern", "float", "for", "goto", "if",
  "int", "long", "register", "return", "short", "signed", "sizeof",
  "static", "struct", "switch", "typedef", "union", "unsigned", "void",
  "volatile", "while"
];



export function getDistinctVariables(code: string): string[] {
  const variableSet = new Set<string>();

  // Regular expression to match variable declarations with constraints
  const variableDeclarationRegex = /\b(?:int|char|float|double|long)\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\b/g;

  let match;

  while ((match = variableDeclarationRegex.exec(code)) !== null) {
    const variablesDeclaration = match[1].split(",").map(variable => variable.trim());

    for (const variable of variablesDeclaration) {
      if (variable !== "") {
        variableSet.add(variable);
      }
    }
  }

  return Array.from(variableSet);
}

export default function getCFGRender(code: string): string[] {
  complexity.regions = 0
  lines = [""];
  let graphs = []

  // const startNode = new Node("Start")
  // const endNode = new Node("End")

  for (const line of code.split("\n")) {
    lines.push(line)
  }

  const variables: string[] = getDistinctVariables(code);
  console.log("Distinct variables:", variables);

  for (const variable of variables) {
    const startNode = new Node("Start")
    const endNode = new Node("End")

    makeGraph(1, lines.length, startNode, endNode, variable)
    // makeGraph(1, lines.length, startNode, endNode)
    renderString = `flowchart TD`
    DFS(startNode)
    console.log(renderString)
    graphs.push(renderString);
  }


  // makeGraph(1, lines.length, startNode, endNode)
  // renderString = `flowchart TD
  //    `
  // DFS(startNode)

  // console.log(renderString)

  return graphs;
}

function DFS(node: Node) {
  node.isVisited = true

  for (const neighbor of node.children) {
    // append string
    const sourceID = getNodeID(node.label)
    let destinationID = getNodeID(neighbor.label)

    const appendString = `;\n${sourceID}(${node.label})-->${destinationID}(${neighbor.label})`
    if (!renderString.includes(appendString) && sourceID !== destinationID) {
      renderString += appendString
    }
  }

  for (const neighbor of node.children) {
    if (!neighbor.isVisited) {
      DFS(neighbor)
    }
  }
}

function getNodeID(label: string) {
  if (label === "Start" || label === "End") {
    return label[0]
  }
  return label.substring(0, label.indexOf(","))
}