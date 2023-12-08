#Dynamic Data Flow Testing
Welcome to the Dynamic Data Flow Testing repository! This web-based application is designed to facilitate dynamic data flow testing for C source code. The tool performs various tasks, including the creation of a Data Flow Graph (DFG) for each variable, extracting all paths from the DFG (such as AU, APU, ACU, etc.), and generating tables for the identified paths for each variable.

#Features
Task-1: Data Flow Graph Generation
Generate a Data Flow Graph for each variable in the provided C source code. Visualize the flow of data within the program.

Task-2: All Paths Extraction
Extract all possible paths from the Data Flow Graph, including AU, APU, ACU, and more, for each variable. This helps in comprehensive dynamic data flow testing.

Task-3: Path Tables
Create tables summarizing the paths identified in Task-2 for each variable. This provides a structured overview of the dynamic data flow within the code.

#How to use
Here 2 applications namely forntend and graph_path
1. run the frontend application where you will get a canvas at right and dfd's at left.
2. you will also see the graph strings for each of the dfd's.
3. now run the graph_path application, where you will see a text box and a button.
4. copy the grph strings from frontend application one by one and input at the text box. You will get the test case paths for each variables.
