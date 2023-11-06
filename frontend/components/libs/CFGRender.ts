import makeGraph from "./Graph"
import Node from "./Node"

export const complexity = {
  regions: 0,
}
export let lines: Array<string>
let renderString = `flowchart TD
    `

export default function getCFGRender(code: string): string {
  complexity.regions = 0
  lines = [""]
  const startNode = new Node("Start")
  const endNode = new Node("End")

  for (const line of code.split("\n")) {
    lines.push(line)
  }

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