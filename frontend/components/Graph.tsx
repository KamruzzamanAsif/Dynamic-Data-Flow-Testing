import ReactFlow, { Background, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";

export default function Graph(props: any) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);

  console.log("NODE: ", nodes);
  console.log("EDGE: ", edges);

  // Change the shape of nodes to rounded
  const nodesWithRoundedShape = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      shape: "rounded",
      background: "#FF5733", // Change the background color of nodes
      color: "#FFFFFF", // Change the text color of nodes
      borderRadius: "50px",
    },
  }));

  const edgesWithStyle = edges.map((edge) => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: "black", // Change the color of edges
    },
  }));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ReactFlow
        nodes={nodesWithRoundedShape}
        edges={edgesWithStyle} // Use the updated edges
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
