import { Editor, OnMount } from "@monaco-editor/react";
import { forwardRef, useCallback } from "react";

export const defaultCode = `#include <stdio.h>
void main()
{
    int num1, rem1;
 
    printf("Input an integer : ");
    scanf("%d", &num1);
    rem1 = num1 % 2;
    if (rem1 == 0)
        printf("%d is an even integer", num1);
    else
        printf("%d is an odd integer", num1);
}`;

const CodeEditor = forwardRef((props, ref: any | null) => {
  const editorDidMount: OnMount = useCallback((editor) => {
    ref.current = editor;
  }, []);

  return (
    <Editor
      height="100%"
      language="c"
      onMount={editorDidMount}
      defaultValue={defaultCode}
    />
  );
});

export default CodeEditor;
