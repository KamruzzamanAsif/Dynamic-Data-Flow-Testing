class Node {
  id: string;
  label: string;
  children: Node[]| null;
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

  idFinder(str: string): string{
    // Use a regular expression to match the numeric part at the beginning
    const match = str.match(/^(\d+)/);
    // Extract the matched substring
    const result = match ? match[1] : '';
    return result;
  }

  createRootNode(line: string):void{
    let [source, target] = line.split('-->');
    let targetNode = target.trim();
    let id = this.idFinder(targetNode);
    let targetLabel = targetNode.split('(')[1].split(')')[0];
    
    this.rootNode.addID(id);
    this.rootNode.addLabel(targetLabel);

    this.nodes.push(this.rootNode);
    this.nodeIDs.push(id);
  }

  createAllOtherNodes(trimmedLines: string[]): void{
    trimmedLines.forEach(line => {
      const [source, target] = line.split('-->');
      const sourceNode = source.trim();
      const targetNode = target.trim();

      const sourceid = this.idFinder(sourceNode);
      const targetid = this.idFinder(targetNode);
      const sourceLabel = sourceNode.split('(')[1].split(')')[0];
      const targetLabel = targetNode.split('(')[1].split(')')[0];

      if(!this.nodeIDs.includes(sourceid)){
        let node = new Node();
        node.id = sourceid;
        node.label = sourceLabel;

        this.nodeIDs.push(sourceid);
        this.nodes.push(node);
      }

      if(!this.nodeIDs.includes(targetid)){
        let node = new Node();
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
    const trimmedLines = lines.filter(line => !line.includes("E(End)"));;
    console.log(trimmedLines)
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
  findAndSoteAllTypesofNodes(){
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
        console.log("No numbers found in the text.");
        return "";
    }
  }

  /************ path arrays **************/
  allDefinitionPaths: string[] = [];
  /***************************************/


  //***********GET ALL DEFINITION PATH(AD paths) Starts**************/
  getAllDefinitionPaths(): string[] {
    // Find paths from each "Define" node to at least one "c-use" node
    this.definition_nodes.forEach(definitionNode => {
      let c_paths = this.findAllPathsToCuse(definitionNode);
      let p_paths = this.findAllPathsToPuse(definitionNode);

      // [note: as per the definition of AD paths we need to at least one "c-use" node
      // of one "p-use" node.]
      let paths: string[][] = [];
      if(c_paths)
        paths[0] = c_paths[0];
      else(p_paths)
        paths[0] = p_paths[0];

      // make paths as a stirng of list of paths
      // send path as a list of stings
      for (let path of paths) {
        let concatenatedPath = path.join(', '); // Concatenate strings in the row
        this.allDefinitionPaths.push(concatenatedPath);
      }
    });

    return this.allDefinitionPaths;
  }

  // this function finds all c-paths for a definition node
  findAllPathsToCuse(node: Node): string[][] {
    const paths: string[][] = [];

    // Helper function to recursively find paths
    const findPaths = (currentNode: Node, currentPath: string[]): void => {
      // Add the current node to the path
      let pathString = this.path_extractor(currentNode.label);
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
      // Add the current node to the path
      let pathString = this.path_extractor(currentNode.label);
      currentPath.push(pathString);

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
  //***********GET ALL DEFINITIONS PATH ENDS**************/
}

export default Graph;
