class Node {
  id: string;
  label: string;
  children: Node[] | null;
  parent: Node[] | null;

  constructor() {
    this.id = "0";
    this.label = "";
    this.children = [];
    this.parent = [];
  }

  addID(id: string): void {
    this.id = id;
  }

  addLabel(label: string): void {
    this.label = label;
  }

  addChild(child: Node): void {
    this.children?.push(child);
  }

  addParent(parent: Node): void {
    this.parent?.push(parent);
  }
}

class Graph {
  rootNode: Node;
  nodes: Node[];
  nodeIDs: string[];

  constructor() {
    this.rootNode = new Node();
    this.nodes = [];
    this.nodeIDs = [];
  }

  idFinder(str: string): string {
    // Use a regular expression to match the numeric part at the beginning
    const match = str.match(/^(\d+)/);
    // Extract the matched substring
    const result = match ? match[1] : '';
    return result;
  }

  createRootNode(line: string): void {
    const [source, target] = line.split('-->');
    const targetNode = target.trim();
    const id = this.idFinder(targetNode);
    const targetLabel = targetNode.split('(')[1].split(')')[0];

    this.rootNode.addID(id);
    this.rootNode.addLabel(targetLabel);

    this.nodes.push(this.rootNode);
    this.nodeIDs.push(id);
  }

  createAllOtherNodes(trimmedLines: string[]): void {
    trimmedLines.forEach(line => {
      const [source, target] = line.split('-->');
      const sourceNode = source.trim();
      const targetNode = target.trim();

      const sourceid = this.idFinder(sourceNode);
      const targetid = this.idFinder(targetNode);
      const sourceLabel = sourceNode.split('(')[1].split(')')[0];
      const targetLabel = targetNode.split('(')[1].split(')')[0];

      if (!this.nodeIDs.includes(sourceid)) {
        const node = new Node();
        node.id = sourceid;
        node.label = sourceLabel;

        this.nodeIDs.push(sourceid);
        this.nodes.push(node);
      }

      if (!this.nodeIDs.includes(targetid)) {
        const node = new Node();
        node.id = targetid;
        node.label = targetLabel;

        this.nodeIDs.push(targetid);
        this.nodes.push(node);
      }
    });
  }

  findNodeByID(id: string): Node | null {
    return this.nodes.find(node => node.id === id) || null;
  }

  // this should be called : first
  createGraph(graphString: string): Node {
    const lines = graphString.split('\n');
    // Create root node
    this.createRootNode(lines[0]);

    // Create other nodes
    // Remove the last lines as don't need it
    const trimmedLines = lines.filter(line => !line.includes("E(End)"));
    // console.log(trimmedLines)
    this.createAllOtherNodes(trimmedLines);

    // now link all nodes
    trimmedLines.forEach(line => {
      const [source, target] = line.split('-->');
      const sourceNode = source.trim();
      const targetNode = target.trim();

      const sourceid = this.idFinder(sourceNode);
      const targetid = this.idFinder(targetNode);

      const fromNode = this.findNodeByID(sourceid);
      const toNode = this.findNodeByID(targetid);

      if (fromNode && toNode) {
        fromNode.addChild(toNode);
        toNode.addParent(fromNode);
      }
    });
    return this.rootNode;
  }


  // ****************** Path Finding Section **************** //
  definition_nodes: Node[] = [];
  cuse_nodes: Node[] = [];
  puse_nodes: Node[] = [];

  // ththis should be called : second
  findAndSoteAllTypesofNodes() {
    this.findAllDefinitionNodes();
    this.findAllCuseNodes();
    this.findAllPuseNodes();

    // console.log("definition_nodes" , this.definition_nodes);
    // console.log("cuse_nodes" , this.cuse_nodes);
    // console.log("puse_nodes", this.puse_nodes);
  }

  findAllDefinitionNodes(): void {
    this.definition_nodes = this.nodes.filter(node => node.label.includes("Define"));
  }

  findAllCuseNodes(): void {
    this.cuse_nodes = this.nodes.filter(node => node.label.includes("c-use"));
  }

  findAllPuseNodes(): void {
    this.puse_nodes = this.nodes.filter(node => node.label.includes("p-use"));
  }

  //*********** helper functions for path finding************/ 
  path_extractor(text: string): string {
    // Use a regular expression to find all occurrences of numbers separated by commas and spaces
    const matches = text.match(/(?:^|,\s*)\d+/g);

    // Check if matches are found
    if (matches) {
      // Join the array of strings into a single string, separated by a comma and space
      const result = matches.join(', ');
      return result;
    } else {
      // console.log("No numbers found in the text.");
      return "";
    }
  }

  make_path(nodes: string): string {
    // Step 1: Remove null elements
    const filteredArray = nodes.split(', ').filter((item: string) => item.trim() !== '');

    // Step 2: Remove extra spaces and join the numbers
    const formattedString = filteredArray.map((item: string) => item.trim()).join(' -> ');

    return formattedString;
  }

  /************ path arrays **************/
  allDefinitionPaths: string[] = [];
  allCusePaths: Set<string> = new Set();
  allPusePaths: Set<string> = new Set();
  allDUPaths: Set<string> = new Set();
  allPsomeC: Set<string> = new Set();
  allCsomeP: Set<string> = new Set();
  allUPaths: string[] = [];
  /***************************************/


  //***********GET ALL C-use PATH(ACU paths) Starts**************/
  getAllCusePaths(): string[] {

    // Find paths from each "Define" node to at least one "c-use" node
    this.definition_nodes.forEach(cuseNode => {
      const paths = this.findAllPathsToCuse(cuseNode);

      // console.log(paths)

      // make paths as a stirng of list of paths
      // send path as a list of stings
      for (const path of paths) {

        if (path.length > 0) {
          const concatenatedPath = path.join(', '); // Concatenate strings in the row
          this.allCusePaths.add(this.make_path(concatenatedPath));
        }
      }
    });

    return Array.from(this.allCusePaths);
  }

  //***********GET ALL P-Use PATH(APU paths) Starts**************/
  getAllPusePaths(): string[] {


    // Find paths from each "Define" node to at least one "c-use" node
    this.definition_nodes.forEach(puseNode => {
      const paths = this.findAllPathsToPuse(puseNode);

      // make paths as a stirng of list of paths
      // send path as a list of stings
      for (const path of paths) {
        const concatenatedPath = path.join(', '); // Concatenate strings in the row
        this.allPusePaths.add(this.make_path(concatenatedPath));
      }
    });

    return Array.from(this.allPusePaths);
  }

  //***********GET ALL DU PATH(ADU paths) Starts**************/
  getAllDUPaths(): string[] {
    // Find paths from each "Define" node to at least one "c-use" node
    this.definition_nodes.forEach(definitionNode => {
      const paths = this.findAllDUPaths(definitionNode);

      // make paths as a stirng of list of paths
      // send path as a list of stings
      for (const path of paths) {
        const concatenatedPath = path.join(', '); // Concatenate strings in the row
        this.allDUPaths.add(this.make_path(concatenatedPath));
      }
    });

    return Array.from(this.allDUPaths);
  }

  //***********GET all-p/some-c PATH(APU+C paths) Starts**************/
  getAllPSomeC(): string[] {
    // Find paths from each "Define" node to at least one "c-use" node

    this.definition_nodes.forEach(definitionNode => {
      let paths = this.findAllDCPathsToPuse(definitionNode);

      console.log("All DC Paths to P use\n", paths);
      if (paths.length == 0) {
        paths = this.findAllDCPathsToCuse(definitionNode);
      }

      // make paths as a stirng of list of paths
      // send path as a list of stings
      for (const path of paths) {
        const concatenatedPath = path.join(', '); // Concatenate strings in the row
        //! Previously you used, allDuPaths array, I replaced this with allPsomeC
        //! Previously you had extra paths, but now when i replaced you had a missing path
        //! please check it
        this.allPsomeC.add(this.make_path(concatenatedPath));
      }
    });

    return Array.from(this.allPsomeC);
  }

  //***********GET all-c/some-p PATH(ACU+P paths) Starts**************/
  getallCsomeP(): string[] {

    // Find paths from each "Define" node to at least one "c-use" node
    this.definition_nodes.forEach(definitionNode => {

      let paths = this.findAllPathsToCuse(definitionNode);

      if (paths.length == 0) {
        paths = this.findAllPathsToPuse(definitionNode);
      }

      // make paths as a stirng of list of paths
      // send path as a list of stings
      for (const path of paths) {
        const concatenatedPath = path.join(', '); // Concatenate strings in the row
        //! Previously you used, allDuPaths array, I replaced this with allCsomeP
        //! Previously you had extra paths, but now when i replaced you had a missing path
        //! please check it
        this.allCsomeP.add(this.make_path(concatenatedPath));
      }
    });

    return Array.from(this.allCsomeP);
  }

  //***********GET all use PATH(AU paths) Starts**************/
  getAllUsesPaths(): string[] {
    const allUsesPaths: Set<string> = new Set();

    // Find paths from the definition of each variable to every use of that variable
    this.definition_nodes.forEach(definitionNode => {
      // Find backward paths to "use" nodes
      const usePaths = this.findAllPathsToUse(definitionNode);
      // console.log('USE: ', definitionNode);

      // Concatenate paths and add to the result
      usePaths.forEach(usePath => {
        const concatenatedPath = usePath.join(', ');
        allUsesPaths.add(this.make_path(concatenatedPath));
      });
    });

    return Array.from(allUsesPaths);
  }

  //***********Helper Function to calculate actual Paths get() func**************/


  // this function finds all DU for a definition node
  findAllDUPaths(node: Node): string[][] {
    const paths: string[][] = [];

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {
      // Add the current node to the path
      const pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);

      // If the current node is a "c-use" or "p-use" node, add the current path to the result
      if (currentNode.label.includes("c-use") || currentNode.label.includes("p-use")) {
        paths.push([...currentPath]);
      }

      // Recursively explore children
      if (currentNode.children) {
        for (const child of currentNode.children) {
          findPaths(child, currentPath);
        }
      }

      // Remove the current node from the path when backtracking
      currentPath.pop();
    };

    // Start the traversal from the given "Define" node
    findPaths(node, []);

    return paths;
  }

  // this function finds all c-paths for a definition node
  findAllPathsToCuse(node: Node): string[][] {
    const paths: string[][] = [];

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {
      // Add the current node to the path
      const pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);

      // If the current node is a "c-use" node, add the current path to the result
      if (currentNode.label.includes("c-use")) {
        paths.push([...currentPath]);
      }

      // Recursively explore children
      if (currentNode.children) {
        for (const child of currentNode.children) {
          findPaths(child, currentPath);
        }
      }

      // Remove the current node from the path when backtracking
      currentPath.pop();
    };

    // Start the traversal from the given "Define" node
    findPaths(node, []);

    return paths;
  }

  // this function finds all p-paths for a definition node
  findAllPathsToPuse(node: Node): string[][] {
    const paths: string[][] = [];

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {

      // console.log("CURRENT: ", currentNode);

      // Add the current node to the path
      const pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);
      // console.log('PATH: ', pathString);


      // If the current node is a "p-use" node, add the current path to the result
      if (currentNode.label.includes("p-use")) {
        paths.push([...currentPath]);
      }

      // Recursively explore children
      if (currentNode.children) {
        for (const child of currentNode.children) {
          findPaths(child, currentPath);
        }
      }

      // Remove the current node from the path when backtracking
      currentPath.pop();
    };

    // Start the traversal from the given "Define" node
    findPaths(node, []);

    return paths;
  }

  private allDuPaths: Set<string> = new Set();

  getAllDuPaths(): string[] {
    // Find paths from each "Define" node to at least one "c-use" node and one "p-use" node
    this.definition_nodes.forEach(definitionNode => {
      const cPaths = this.findAllPathsToCuse(definitionNode);
      const pPaths = this.findAllPathsToPuse(definitionNode);

      // Ensure there is at least one "c-use" path and one "p-use" path
      if (cPaths.length > 0 && pPaths.length > 0) {
        // Concatenate "c-use" paths with "p-use" paths
        for (const cPath of cPaths) {
          for (const pPath of pPaths) {
            const concatenatedPath = [...cPath, ...pPath].join(', ');
            this.allDuPaths.add(this.make_path(concatenatedPath));
          }
        }
      }
    });

    return Array.from(this.allDUPaths);
  }

  findAllPathsToUse(node: Node): string[][] {
    const paths: string[][] = [];

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {

      // console.log("CURRENT: ", currentNode);

      // Add the current node to the path
      const pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);


      // If the current node is a "p-use" node, add the current path to the result
      if (currentNode.label.includes("p-use") || currentNode.label.includes("c-use")) {
        paths.push([...currentPath]);
      }

      // Recursively explore children
      if (currentNode.children) {
        for (const child of currentNode.children) {
          findPaths(child, currentPath);
        }
      }

      // Remove the current node from the path when backtracking
      currentPath.pop();
    };

    // Start the traversal from the given "Define" node
    findPaths(node, []);

    return paths;
  }  

  // this function finds all c-paths for a definition node
  findAllDCPathsToCuse(node: Node): string[][] {
    const paths: string[][] = [];

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {
      // Add the current node to the path
      const pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);
      
      if (currentNode.label.includes("Define")) {
        return;
      }
      
      // If the current node is a "c-use" node, add the current path to the result
      if (currentNode.label.includes("c-use")) {
        paths.push([...currentPath]);
      }

      // Recursively explore children
      if (currentNode.children) {
        for (const child of currentNode.children) {
          findPaths(child, currentPath);
        }
      }

      // Remove the current node from the path when backtracking
      currentPath.pop();
    };

    // Start the traversal from the given "Define" node
    findPaths(node, []);

    return paths;
  }

  findAllDCPathsToPuse(node: Node): string[][] {
    const paths: string[][] = [];
    const selfNode = node;

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {
      // Add the current node to the path
      const pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);

      // console.log(currentNode.label)
      
      if (currentNode.label.includes("Define") && currentNode != selfNode) {
        return;
      }
      
      // If the current node is a "p-use" node, add the current path to the result
      if (currentNode.label.includes("p-use")) {
        paths.push([...currentPath]);
      }
      
      // Recursively explore children
      if (currentNode.children) {
        for (const child of currentNode.children) {
          findPaths(child, currentPath);
        }
      }

      // Remove the current node from the path when backtracking
      currentPath.pop();
    };

    // Start the traversal from the given "Define" node
    findPaths(node, []);

    return paths;
  }
  
}

export default Graph;
