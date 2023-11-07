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

  // Regular expression to match variable declarations
  const variableDeclarationRegex = /\b(\w+)\s+(\w+)(\s*=\s*[^;]+)?\s*;/g;

  let match;
  while ((match = variableDeclarationRegex.exec(code)) !== null) {
    const variableName = match[2];
    if (!cKeywords.includes(variableName)) {
      variableSet.add(variableName);
    }
  }

  return Array.from(variableSet);
}

export default function getCFGRender(code: string): string {
  complexity.regions = 0
  lines = [""]
  const startNode = new Node("Start")
  const endNode = new Node("End")

  for (const line of code.split("\n")) {
    lines.push(line)
  }

  const variables: string[] = getDistinctVariables(code);
  console.log("Distinct variables:", variables);


  makeGraph(1, lines.length, startNode, endNode)
  renderString = `flowchart TD
     `
  DFS(startNode)

  console.log(renderString)

  return renderString
}

function DFS(node: Node) {
  node.isVisited = true

  for (const neighbor of node.children) {
    // append string
    const sourceID = getNodeID(node.label)
    const destinationID = getNodeID(neighbor.label)
    const appendString = `;${sourceID}(${node.label})-->${destinationID}(${neighbor.label})`
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