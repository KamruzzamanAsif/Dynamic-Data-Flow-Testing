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
    renderString = `flowchart TD`
    DFS(startNode)
    console.log(renderString)
    graphs.push(processRenderedString(renderString));
  }


  // makeGraph(1, lines.length, startNode, endNode)
  // renderString = `flowchart TD
  //    `
  // DFS(startNode)

  // console.log(renderString)

  return graphs;
}

function processRenderedString(data: string): string {
  // let data = "flowchart TD;\nS(Start)-->1(1,  2,  3,  4,  5,  6,  7 num1 : Define, 8 num1 : c-use, );\n1(1,  2,  3,  4,  5,  6,  7 num1 : Define, 8 num1 : c-use, )-->9(9, );\n9(9, )-->10(10,  );\n9(9, )-->11(11, 12,  13 num1 : c-use, 13 num1 : c-use, 14,  15,  );\n10(10,  )-->11(11, 12,  13 num1 : c-use, 13 num1 : c-use, 14,  15,  );\n11(11, 12,  13 num1 : c-use, 13 num1 : c-use, 14,  15,  )-->E(End)"
  let words = data.split('\n');
  let new_data = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i] == 'flowchart TD;') {
      new_data += words[i] + '\n';
      continue;
    };

    new_data += processLine(words[i]) + '\n';
    // console.log(processLine(words[i]));
  }

  return new_data;
}

function processLine(input: string): string {

  const parts = input.split("-->");

  if (parts.length !== 2) {
    // Invalid line format
    return input;
  }

  const processedParts = parts.map(part => {
    let new_arr = []
    const elements = part.trim().split('(');

    let num = parseInt(elements[0], 10);
    let snum = num.toString();

    if (isNaN(num)) {
      new_arr.push(elements[0]);
    } else {
      new_arr.push(snum);
    }


    const regex = /\(([^)]+)\)/g;

    let match;
    while ((match = regex.exec(part)) !== null) {
      new_arr.push('(' + match[1] + ')');
    }

    return new_arr.join('');
  });

  let ans = processedParts.join("-->");
  return ans + ';';
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