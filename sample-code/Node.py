import ast


class Node:
    def __init__(self, ast_node):
        self.ast_node = ast_node
        self.depends_on = []
        self.index = None

    def id(self):
        return str(self.index)

    def __eq__(self, other):
        return self.ast_node == other.ast_node

    def __hash__(self):
        return hash(self.ast_node)

    def __repr__(self):
        return str(self)

    def __str__(self):
        node = self.ast_node
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            return f'Store: {node.id}'
        else:
            return f'{node.__class__.__name__}'


class CallNode(Node):
    def __init__(self, ast_node, function):
        super(CallNode, self).__init__(ast_node)
        self.function = function

    def __str__(self):
        return f'Call: {self.function.ast_node.id}'


class TerminalNode(Node):
    def __init__(self, ast_node):
        super(TerminalNode, self).__init__(ast_node)
        self.depends_on = None


class ArgumentNode(TerminalNode):
    def __init__(self, ast_node):
        super(ArgumentNode, self).__init__(ast_node)

    def __str__(self):
        return f'Arg: {self.ast_node.arg}'


class ReferenceNode(TerminalNode):
    def __init__(self, ast_node):
        super(ReferenceNode, self).__init__(ast_node)
        self.referenced_node = None

    def __str__(self):
        return f'Load: {self.ast_node.id}'


class ConstantNode(TerminalNode):
    def __init__(self, ast_node, value):
        super(ConstantNode, self).__init__(ast_node)
        self.value = value

    def __str__(self):
        return f'Const: {self.value}'
