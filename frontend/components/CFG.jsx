const CFG = () => {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">CFG:</h2>

      {nodes.map((node, i) => (
        <div key={i}>{node.data.label}</div>
      ))}
      {edges.map((edge, i) => (
        <div key={i}>
          {edge.source} -- {edge.target}
        </div>
      ))}
    </div>
  );
};

export default CFG;
