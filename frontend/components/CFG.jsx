import React from 'react';
import getCFGRender from './libs/CFGRender';
import makeGraph from './libs/Graph';

const esprima = require('esprima');
const esgraph = require('esgraph');
const estraverse = require('estraverse');
// const escodegen = require('escodegen');

// Your input source code
const sourceCode = `
int main()
{
    int a;
    printf("Enter a: ");
    scanf("%d", &a);

    //logic
    if (a % 2 == 0) {
        printf("The given number is EVEN");
    }
    else {
        printf("The given number is ODD");
    }
    return 0;
}
`;


const CFG = () => {
  // Parse the code
  // const ast = esprima.parse(sourceCode);
  // const ast = esprima.parse(sourceCode, { loc: true });
  // console.log("AST", ast);

  // // Generate a control flow graph (CFG)
  // const cfg = esgraph(ast);

  // console.log("CFG:", cfg);

  // // // Convert the CFG to a DOT format (or JSON) for visualization
  // const dot = esgraph.dot(cfg, { counter: 0, source: sourceCode });

  // console.log(dot);

   let a = getCFGRender(sourceCode);
   console.log(a);

  return(
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">CFG:</h2>

          {/* {getCFGRender(defaultCode)} */}
      </div>
  );
};

export default CFG;
