import Profile, {ProfileTask} from '../../models/Profile';
import Size from '../../models/Size';
import BoundingRect from './models/BoundingRect';
import Orientation from './models/Orientation';
import TreeMapData, {TreeMapNode} from './models/TreeMapData';

const LABEL_HEIGHT = 16;
const NODE_PADDING = 5;

const NORMAL_COLOR = 'green';
const ATTENTION_COLOR = 'red';

// implements "squarified" treemap algorithm as described in [ref]
// [ref]: http://www.cs.umd.edu/hcil/treemap-history/index.shtml
export default function buildTreeMap(
  profile: Profile,
  viewSize: Size
): TreeMapData {
  const rootNode = mapRecursively(profile);

  rootNode.bounds = {
    x: 0,
    y: 0,
    width: viewSize.width,
    height: viewSize.height,
  };

  colorChildNodes(rootNode, true);
  layoutAndColorRecursively(rootNode, true);

  return rootNode;
}

function mapRecursively(task: ProfileTask): TreeMapNode {
  return {
    label: `${task.name} [${task.duration_ns}ns]`,
    weight: task.duration_ns,
    bounds: emptyBounds(),
    labelBounds: emptyBounds(),
    contentBounds: emptyBounds(),
    children: task.children?.map(mapRecursively),
  };
}

function layoutAndColorRecursively(node: TreeMapNode, isRoot = false) {
  if (isRoot) {
    // omit label area in root node
    node.contentBounds = {
      x: node.bounds.x + NODE_PADDING,
      y: node.bounds.y + NODE_PADDING,
      width: node.bounds.width - 2 * NODE_PADDING,
      height: node.bounds.height - 2 * NODE_PADDING,
    };
  } else {
    node.labelBounds = {
      x: node.bounds.x + NODE_PADDING,
      y: node.bounds.y + NODE_PADDING,
      width: node.bounds.width - 2 * NODE_PADDING,
      height: LABEL_HEIGHT,
    };

    node.contentBounds = {
      x: node.bounds.x + NODE_PADDING,
      y: node.bounds.y + 2 * NODE_PADDING + LABEL_HEIGHT,
      width: node.bounds.width - 2 * NODE_PADDING,
      height: node.bounds.height - 3 * NODE_PADDING - LABEL_HEIGHT,
    };
  }

  if (node.children) {
    layoutNodes(node.children, 0, node.children.length - 1, node.contentBounds);
    node.children.forEach((n) => layoutAndColorRecursively(n));
  }

  colorChildNodes(node);
}

function layoutNodes(
  nodes: TreeMapNode[],
  start: number,
  end: number,
  bounds: BoundingRect
) {
  if (start > end) {
    return;
  }

  if (end - start < 2) {
    layoutBest(nodes, start, end, bounds);
    return;
  }

  // TODO(artin): get total weight as weight of parent node instead of sum of
  // child nodes. otherwise "self time" (ie. node weight - sum(child weights))
  // is not refrected on the map
  const total = weightNodes(nodes, start, end);
  let mid = start;
  const a = nodes[start].weight / total;
  let b = a;

  if (bounds.height > bounds.width) {
    while (mid <= end) {
      const aspect = normAspect(bounds.height, bounds.width, a, b);
      const q = nodes[mid].weight / total;
      if (normAspect(bounds.height, bounds.width, a, b + q) > aspect) {
        break;
      }
      mid++;
      b += q;
    }

    layoutBest(nodes, start, mid, {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height * b,
    });

    layoutNodes(nodes, mid + 1, end, {
      x: bounds.x,
      y: bounds.y + bounds.height * b,
      width: bounds.width,
      height: bounds.height * (1 - b),
    });
  } else {
    while (mid <= end) {
      const aspect = normAspect(bounds.width, bounds.height, a, b);
      const q = nodes[mid].weight / total;
      if (normAspect(bounds.width, bounds.height, a, b + q) > aspect) {
        break;
      }
      mid++;
      b += q;
    }

    layoutBest(nodes, start, mid, {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width * b,
      height: bounds.height,
    });

    layoutNodes(nodes, mid + 1, end, {
      x: bounds.x + bounds.width * b,
      y: bounds.y,
      width: bounds.width * (1 - b),
      height: bounds.height,
    });
  }
}

function layoutBest(
  nodes: TreeMapNode[],
  start: number,
  end: number,
  bounds: BoundingRect
) {
  sliceLayout(
    nodes,
    start,
    end,
    bounds,
    bounds.width > bounds.height ? Orientation.HORIZONTAL : Orientation.VERTICAL
  );
}

function sliceLayout(
  nodes: TreeMapNode[],
  start: number,
  end: number,
  bounds: BoundingRect,
  orientation: Orientation
) {
  const total = weightNodes(nodes, 0, nodes.length - 1);
  let a = 0;

  for (let i = start; i <= end; ++i) {
    const r: BoundingRect = emptyBounds();
    const b = nodes[i].weight / total;

    if (orientation == Orientation.VERTICAL) {
      r.x = bounds.x;
      r.width = bounds.width;
      r.y = bounds.y + bounds.height * a;
      r.height = bounds.height * b;
    } else {
      r.x = bounds.x + bounds.width * a;
      r.width = bounds.width * b;
      r.y = bounds.y;
      r.height = bounds.height;
    }

    nodes[i].bounds = r;
    a += b;
  }
}

function weightNodes(nodes: TreeMapNode[], start: number, end: number): number {
  let w = 0;
  for (let i = start; i <= end; ++i) {
    w += nodes[i].weight;
  }
  return w;
}

function aspect(big: number, small: number, a: number, b: number): number {
  return (big * b) / ((small * a) / b);
}

function normAspect(big: number, small: number, a: number, b: number): number {
  const x = aspect(big, small, a, b);
  if (x < 1) return 1 / x;
  return x;
}

function emptyBounds(): BoundingRect {
  return {x: 0, y: 0, width: 0, height: 0};
}

function colorChildNodes(node: TreeMapNode, isRoot = false) {
  if (node.children) {
    if (isRoot) {
      node.children?.forEach((n) => (n.color = 'green'));
    } else {
      const total = weightNodes(node.children, 0, node.children.length - 1);

      node.children.forEach((n) => {
        if (n.weight > total * 0.5) {
          n.color = ATTENTION_COLOR;
        } else if (node.color != NORMAL_COLOR) {
          n.color = NORMAL_COLOR;
        }
      });
    }
  }
}
