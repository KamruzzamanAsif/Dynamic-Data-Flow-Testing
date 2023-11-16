import { complexity, lines } from './CFGRender';
import Node from "./Node";

//! Issues:
// TODO
/**
 * 1. Sometimes c-use can't be defined
 * 2. Sometimes graph generation fails as we have the node name like '8 var: p-use' which should be only '8'
 * 3. Also the the node which is marked as 'define/p-use/c-use' shouldn't be repeated
 */

function isInsideConditional(line: any, variable: any): any {
  return (
    line.includes(`if`) ||
    line.includes(`else if`) ||
    line.includes(`while`)
  ) && line.includes(variable);
}

export default function makeGraph(
  firstLine: number,
  lastLine: number,
  entryNode: Node,
  exitNode: Node,
  variable: string,
) {

  complexity.regions++

  let currentNode = new Node("")
  entryNode.addChild(currentNode)
  let isVariableDefined = false;

  for (let i = firstLine; i < lastLine; i++) {

    if (lines[i].includes("//")) {
      console.log("It's a comment")
      continue;
    }

    // Variable assignment or input statement (Define)
    if ((lines[i].includes(`${variable} = `) || (lines[i].includes("scanf")) && lines[i].includes(`&${variable}`))) {
      console.log('INSIDE DEFINE-SCANF', variable)
      currentNode.label += i.toString() + ` ${variable} : Define, `;
      isVariableDefined = true;
      //continue;
    }

    //! Check for C-use (computational use)
    if (
      (lines[i].includes("printf") && lines[i].includes(`${variable}`)) ||
      (lines[i].includes(`= ${variable}`) ||
        lines[i].includes(`+ ${variable}`) || lines[i].includes(`- ${variable}`) ||
        lines[i].includes(`* ${variable}`) || lines[i].includes(`/ ${variable}`) ||
        lines[i].includes(`% ${variable}`))
    ) {
      console.log('INSIDE C-USE: ', variable)
      if (!currentNode.label.includes(i.toString()))
        currentNode.label += i.toString() + ` ${variable} : c-use, `;
      else
        currentNode.label += ` ${variable} : c-use, `;
    }

    if (
      lines[i].includes("if") ||
      lines[i].includes("while") ||
      lines[i].includes("for") || lines[i].includes("do")
    ) {

      if (currentNode.label === "") {
        currentNode.label = i.toString() + ", "
      }

      let IFExists = lines[i].includes("if")
      let FORExists = lines[i].includes("for")
      let WHILEExists = lines[i].includes("while")
      let DOExists = lines[i].includes("do")
      let ELSEExists = false
      let startNode = new Node("");

      if (lines[i].includes(variable)) {
        startNode = new Node(i.toString() + ` ${variable} : p-use, `)   //! kahini ekhane
      } else {
        startNode = new Node(i.toString() + ", ")   //! kahini ekhane
      }

      currentNode.addChild(startNode)
      let endLine = findClosingBrace(i) // where the conditional block ends
      const endNode = new Node(endLine.toString() + ", ")

      console.log('Start: ', i, 'End: ', endLine)
      makeGraph(i + 1, endLine, startNode, endNode, variable)


      currentNode = endNode
      i = endLine

      if (lines[endLine].includes("else")) {
        ELSEExists = true
        const newEndLine = findClosingBrace(endLine) // Extended where the conditional block ends
        endNode.label = newEndLine.toString() + ", "
        makeGraph(endLine + 1, newEndLine, startNode, endNode, variable)
        i = newEndLine
      }

      // BUG: Remove one extra arrow for Entry-controlled loops
      if (IFExists || FORExists || WHILEExists) {
        if (!ELSEExists) {
          startNode.addChild(endNode)
        }
      }
      if (FORExists || WHILEExists || DOExists) {
        endNode.addChild(startNode)
      }

    } else {
      if (!currentNode.label.includes(i.toString()))
        currentNode.label += i.toString() + ",  "
    }

  }

  currentNode.addChild(exitNode)
}

// TODO: Make a better parser not dependent on Braces
function findClosingBrace(firstLine: number): number {

  try {
    if (!lines[firstLine].includes("{")) {
      throw "Line does not have an opening brace"
    }
  } catch (e) {
    console.error(e)
  }

  for (let i = firstLine + 1, ignoreCount = 0; ; i++) {
    if (lines[i].includes("}") && ignoreCount == 0) {
      return i
    }
    if (lines[i].includes("{")) {
      ignoreCount++
    }
    if (lines[i].includes("}")) {
      ignoreCount--
    }
  }
}
