export default interface TreeMapData {
  nodes: Array<TreeMapNode>;
}

interface TreeMapNode {
  label: string;
  children: Array<TreeMapNode>;
}
