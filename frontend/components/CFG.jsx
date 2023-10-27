import React from 'react';
import getCFGRender from './libs/CFGRender';

const defaultCode = `#include <stdio.h>

int main(void) {
  int i = 0;

  if (i > 5) {
    printf("Greater than 5");
  } 
  return 0;
}`

const CFG = () => {
    return(
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">CFG:</h2>

            {getCFGRender(defaultCode)}
        </div>
    );
};

export default CFG;