import ast
import collections
import itertools
import os

from graphviz import Digraph

from Node import Node, ReferenceNode, ConstantNode, CallNode, ArgumentNode, TerminalNode

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
EXAMPLE_DIR = os.path.join(BASE_PATH, 'examples')


class ExpressionVisitor(ast.NodeVisitor):

    def __init__(self):
        self.nodes = collections.defaultdict(list)
        self._fn_decl_visited = False

    def mk_node(self, ast_node):
        node = Node(ast_node)
        self.nodes[ast_node].append(node)
        return node

    def assign_value(self, target, value):
        if isinstance(target, ast.Tuple):  # x,y = [1,2]
            raise NotImplemented('Tuple assigment')
        graph_node = self.mk_node(target)
        graph_node.depends_on.append(value)
        return graph_node

    def visit_Assign(self, node):
        graph_node = self.mk_node(node)
        value = self.visit(node.value)
        graph_node.depends_on.append(value)
        for target in node.targets:
            self.assign_value(target, value)
        return graph_node

    def visit_AugAssign(self, node):
        graph_node = self.mk_node(node)
        value = self.visit(node.value)
        graph_node.depends_on.append(value)
        self.assign_value(node.target, value)
        target = self.visit(node.target)
        graph_node.depends_on.append(target)
        target.depends_on.append(target)
        return graph_node

    def visit_BinOp(self, node):
        graph_node = self.mk_node(node)
        lhs = self.visit(node.left)
        rhs = self.visit(node.right)
        graph_node.depends_on += [lhs, rhs]
        return graph_node

    def visit_BoolOp(self, node):
        graph_node = self.mk_node(node)
        values = [self.visit(it) for it in node.values]
        graph_node.depends_on += values
        return graph_node

    def visit_Compare(self, node):
        graph_node = self.mk_node(node)
        values = [self.visit(it) for it in node.ops]
        graph_node.depends_on += values
        return graph_node

    def visit_arguments(self, node):
        for arg in node.args:
            self.visit(arg)
        return None

    def visit_arg(self, node):
        graph_node = ArgumentNode(node)
        self.nodes[node].append(graph_node)
        return graph_node

    def visit_Call(self, node):
        func = ReferenceNode(node.func)
        graph_node = CallNode(node, func)
        self.nodes[node.func].append(func)
        self.nodes[node].append(graph_node)

        arguments = [self.visit(arg) for arg in itertools.chain(node.args, node.keywords)]
        graph_node.depends_on += arguments

        return graph_node

    def visit_Return(self, node):
        graph_node = self.mk_node(node)
        value = self.visit(node.value)
        graph_node.depends_on.append(value)
        return graph_node

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load):
            ref_node = ReferenceNode(node)
            self.nodes[node].append(ref_node)
        elif isinstance(node.ctx, ast.Store):
            ref_node = self.mk_node(node)
        else:
            raise Exception('Unexpected name ctx: ', node.id, node.ctx)
        return ref_node

    def visit_Constant(self, node):
        const_node = ConstantNode(node, node.value)
        self.nodes[node].append(const_node)
        return const_node

    def visit_Num(self, node):
        const_node = ConstantNode(node, node.n)
        self.nodes[node].append(const_node)
        return const_node

    def visit_While(self, node):
        graph_node = self.mk_node(node)
        test = self.visit(node.test)
        graph_node.depends_on.append(test)
        self.generic_visit(node)
        return graph_node

    def visit_If(self, node):
        graph_node = self.mk_node(node)
        test = self.visit(node.test)
        graph_node.depends_on.append(test)
        self.generic_visit(node)
        return graph_node

    def visit_For(self, node):
        graph_node = self.mk_node(node)
        iterable = self.visit(node.iter)
        target = self.visit(node.target)
        graph_node.depends_on.append(iterable)
        target.depends_on.append(graph_node)
        self.generic_visit(node)
        return graph_node

    def visit_FunctionDef(self, node):
        if self._fn_decl_visited:  # don't go to nested functions
            return
        self._fn_decl_visited = True
        self.generic_visit(node)

    def generic_visit(self, node):
        method = 'visit_' + node.__class__.__name__
        visitor = getattr(self, method, None)
        if visitor is None:
            print('Not implemented for node: ', node)
        super(ExpressionVisitor, self).generic_visit(node)


def iter_fields_ordered(node, *order):
    for field in order:
        try:
            yield field, getattr(node, field)
        except AttributeError:
            pass


class ReferenceResolver(ast.NodeVisitor):
    def __init__(self, target_node):
        self.target_node = target_node
        self.resolved_node = None
        self.continue_resolution = True
        self.names = {}

    def visit_arg(self, node):
        self.names[node.arg] = node

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Store):
            self.names[node.id] = node
        elif isinstance(node.ctx, ast.Load) and self.target_node == node:
            if node.id not in self.names:
                print('Name is not resolved: ', node.id)
            self.resolved_node = self.names.get(node.id, None)
            self.continue_resolution = False

    def visit(self, node):
        if not self.continue_resolution:
            return
        super(ReferenceResolver, self).visit(node)

    def generic_visit(self, node):
        fields = ast.iter_fields(node)
        if isinstance(node, ast.Assign):
            fields = iter_fields_ordered(node, 'value', 'targets')
        elif isinstance(node, ast.AugAssign):
            fields = iter_fields_ordered(node, 'value', 'target')
        for field, value in fields:
            if isinstance(value, list):
                for item in value:
                    if isinstance(item, ast.AST):
                        self.visit(item)
            elif isinstance(value, ast.AST):
                self.visit(value)


def visualize_graph(nodes, name):
    graph = Digraph(name)
    for node in nodes:
        graph.node(node.id(), str(node))
        if isinstance(node, ReferenceNode) and node.referenced_node is not None:
            graph.edge(node.id(), node.referenced_node.id())
        if node.depends_on is None:
            continue
        for dependency in node.depends_on:
            graph.edge(node.id(), dependency.id())
    graph.render(format='png', view=True, cleanup=True)


class FunctionLevelAnalyzer(ast.NodeVisitor):

    def __init__(self, file_name):
        self.file_name = file_name

    def merge_nodes(self, nodes):
        merged_nodes = {}
        all_nodes = [it for group in nodes.values() for it in group]
        for ast_node, graph_nodes in nodes.items():
            if not graph_nodes:
                merged_nodes[ast_node] = []
            elif len(graph_nodes) == 1:
                merged_nodes[ast_node] = graph_nodes[0]
            else:
                first, other = graph_nodes[0], graph_nodes[1:]
                if any(it.ast_node != first.ast_node for it in other):
                    raise NotImplementedError('Merge is not implemented')
                if any(type(it) != type(first) for it in other):
                    raise NotImplementedError('Merge is not implemented')
                to_be_replaced = set(other)
                for candidate in all_nodes:
                    if candidate.depends_on is None:
                        continue
                    candidate.depends_on = [
                        it if it not in to_be_replaced else first
                        for it in candidate.depends_on
                    ]
                if first.depends_on is not None:
                    all_deps = [it for node in graph_nodes for it in node.depends_on]
                    first.depends_on = all_deps

                merged_nodes[ast_node] = first

        result = {
            ast_node: self.simplify_dependencies(graph_node)
            for ast_node, graph_node in merged_nodes.items()
        }

        return result

    @staticmethod
    def simplify_dependencies(node):
        if node.depends_on is None:
            return node
        current_deps = node.depends_on
        node.depends_on = list(set(current_deps))
        return node

    @staticmethod
    def is_interesting_node(node):
        if node.ast_node and isinstance(node.ast_node, ast.Name) and isinstance(node.ast_node.ctx, ast.Store):
            return True
        if isinstance(node, (CallNode, ConstantNode, ArgumentNode)):
            return True
        if isinstance(node.ast_node, ast.Return):
            return True
        return False

    def _new_collapse_nodes(self, root):

        def visit(node):
            if node is None:
                return []
            if isinstance(node, list):
                return [it for element in node for it in visit(element)]
            if self.is_interesting_node(node):
                return [node]
            result = visit(node.depends_on)
            if isinstance(node, ReferenceNode):
                result += visit(node.referenced_node)
            return result

        depends = visit(root.depends_on)
        root.depends_on = depends
        return root

    def new_collapse_nodes(self, nodes):
        collapsed = [self._new_collapse_nodes(node) for node in nodes if self.is_interesting_node(node)]
        return collapsed

    def visit_FunctionDef(self, node):
        analyzer = ExpressionVisitor()
        analyzer.visit(node)
        nodes = self.merge_nodes(analyzer.nodes)
        references = [it for it in nodes.values() if isinstance(it, ReferenceNode)]
        for ref in references:
            self.resolve_reference(ref, node, nodes)
        result_nodes = list(nodes.values())
        for i, node in enumerate(result_nodes):
            node.index = i
        result_nodes = self.new_collapse_nodes(result_nodes)
        visualize_graph(result_nodes, self.file_name)

    def resolve_reference(self, reference, scope, nodes):
        if not isinstance(reference.ast_node, ast.Name):
            raise NotImplementedError("Non name reference: ", reference)
        resolver = ReferenceResolver(reference.ast_node)
        resolver.visit(scope)
        if resolver.resolved_node is None:
            print('Node is not resolved: ', reference.ast_node.id)
        resolved_graph_node = resolver.resolved_node and nodes[resolver.resolved_node]
        reference.referenced_node = resolved_graph_node


def main():
    files = [f for f in os.listdir(EXAMPLE_DIR)]
    paths = [os.path.join(EXAMPLE_DIR, f) for f in files]
    sources = [open(f).read() for f in paths]
    asts = [ast.parse(f) for f in sources]
    for file_name, _ast in zip(files, asts):
        FunctionLevelAnalyzer(file_name).visit(_ast)


if __name__ == '__main__':
    main()