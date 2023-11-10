class Node {
    constructor(label) {
        this.label = label;
        this.children = [];
    }

    addChild(childNode) {
        this.children.push(childNode);
    }
}

class Graph {
    constructor() {
        this.nodes = {};
    }

    addEdge(sourceLabel, destinationLabel) {
        const sourceNode = this.getNode(sourceLabel) || this.addNode(sourceLabel);
        const destinationNode = this.getNode(destinationLabel) || this.addNode(destinationLabel);

        sourceNode.addChild(destinationNode);
    }

    addNode(label) {
        const newNode = new Node(label);
        this.nodes[label] = newNode;
        return newNode;
    }

    getNode(label) {
        return this.nodes[label];
    }

    dfs(startLabel, callback) {
        const startNode = this.getNode(startLabel);
        const visited = {};

        const dfsHelper = (node, path) => {
            visited[node.label] = true;

            path.push(node.label);

            if (callback(node, path)) {
                return; // Stop the DFS if the callback returns true
            }

            for (const neighbor of node.children) {
                if (!visited[neighbor.label]) {
                    dfsHelper(neighbor, path.slice()); // Clone the path array
                }
            }
        };

        dfsHelper(startNode, []);
    }
}

function parseGraphString(graphString) {
    const lines = graphString.split(/\r?\n/);
    const graph = new Graph();

    lines.forEach((line) => {
        const match = line.match(/(\w+)\(([^)]+)\)-->(\w+)\(([^)]+)\)/);

        if (match) {
            const sourceLabel = match[1];
            const destinationLabels = match[2].split(',').map(label => label.trim());
            const destinationLabel = match[3];

            graph.addEdge(sourceLabel, destinationLabel);

            destinationLabels.forEach(childLabel => {
                graph.addEdge(sourceLabel, childLabel);
            });
        }
    });

    return graph;
}

// Example usage:
const graphString = `S(Start)-->1(1, 2, 3, 4, 5, 6, 7, 8 rem1 : Define, 9 rem1 : p-use, );
  1(1, 2, 3, 4, 5, 6, 7, 8 rem1 : Define, 9 rem1 : p-use, )-->9(9, );
  9(9, )-->10(10, 11, 12, );
  9(9, )-->13(13, );
  10(10, 11, 12, )-->13(13, );
  13(13, )-->E(End)`;

const parsedGraph = parseGraphString(graphString);

// Function to print paths from nodes containing 'Define' to nodes containing 'p-use' or 'c-use'
const printPaths = (node, path) => {
    if (node.label.toLowerCase().includes('define')) {
        console.log('Path:', path.join(' --> '));
    }

    // Check if the node contains 'p-use' or 'c-use'
    if (node.label.toLowerCase().includes('p-use') || node.label.toLowerCase().includes('c-use')) {
        console.log('Target Node:', node.label);
        return true; // Stop the DFS
    }

    return false;
};

// Start DFS from nodes containing 'Define'
parsedGraph.dfs('S', (node, path) => printPaths(node, path));
