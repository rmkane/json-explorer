import {
  TypeArray,
  TypeBoolean,
  TypeNull,
  TypeNumber,
  TypeObject,
  TypeString,
} from "./constants";

import type {
  JSONArray,
  JSONObject,
  JSONValue,
  NodeHandler,
  NodeMatcher,
  NodeType,
  TreeNode,
} from "./types";

// Abstract class for simple nodes
class NodeSimple implements TreeNode {
  type: NodeType;
  label: string;
  isComplex: boolean;
  el: HTMLElement;
  isRoot: boolean;
  parent: TreeNode;

  constructor(type: NodeType, label: string, val: JSONValue, isLast: boolean) {
    if (new.target === NodeSimple) {
      throw new Error("This is an abstract class");
    }

    this.type = type;
    this.label = label;
    this.isComplex = false;

    const el = document.createElement("li");
    el.classList.add("jsontree_node");
    el.innerHTML = this.template(label, val, isLast);
    this.el = el;

    const labelEl = el.querySelector(".jsontree_label");
    labelEl?.addEventListener(
      "click",
      (e: MouseEvent) => {
        if (e.altKey) {
          this.toggleMarked();
          return;
        }

        if (e.shiftKey) {
          document.getSelection()?.removeAllRanges();
          alert(this.getJSONPath());
          return;
        }
      },
      false
    );
  }

  template(label: string, val: JSONValue, isLast: boolean) {
    const comma = !isLast ? `<span class="jsontree_symbol">,</span>` : "";
    return `
      <span class="jsontree_label-wrapper">
        <span class="jsontree_label">"${label}"</span>
        <span class="jsontree_symbol">:</span>
      </span>
      <span class="jsontree_value-wrapper">
        <span class="jsontree_value jsontree_value_${this.type}">
        ${val}</span>${comma}
      </span>`;
  }

  mark() {
    this.el.classList.add("jsontree_node_marked");
  }

  unmark() {
    this.el.classList.remove("jsontree_node_marked");
  }

  toggleMarked() {
    this.el.classList.toggle("jsontree_node_marked");
  }

  expandParent(isRecursive: boolean) {
    if (!this.parent) {
      return;
    }

    this.parent.expand(false);
    this.parent.expandParent(isRecursive);
  }

  getJSONPath(isInDotNotation: boolean = false) {
    if (this.isRoot) {
      return "$";
    }

    let currentPath = "";

    if (this.parent.type === TypeArray) {
      currentPath = "[" + this.label + "]";
    } else {
      currentPath = isInDotNotation
        ? "." + this.label
        : "['" + this.label + "']";
    }

    return this.parent.getJSONPath(isInDotNotation) + currentPath;
  }
}

// Subclasses for different node types
class NodeBoolean extends NodeSimple {
  constructor(label: string, val: boolean, isLast: boolean) {
    super(TypeBoolean, label, val, isLast);
  }
}

class NodeNumber extends NodeSimple {
  constructor(label: string, val: number, isLast: boolean) {
    super(TypeNumber, label, val, isLast);
  }
}

class NodeString extends NodeSimple {
  constructor(label: string, val: string, isLast: boolean) {
    super(TypeString, label, '"' + val + '"', isLast);
  }
}

class NodeNull extends NodeSimple {
  constructor(label: string, val: null, isLast: boolean) {
    super(TypeNull, label, val, isLast);
  }
}

// Class for complex nodes (objects and arrays)
class NodeComplex extends NodeSimple {
  sym: [string, string];
  childNodes: TreeNode[];
  childNodesUl: HTMLElement;
  isEmpty: boolean;

  constructor(
    type: NodeType,
    label: string,
    val: JSONValue,
    isLast: boolean,
    sym: [string, string]
  ) {
    super(type, label, val, isLast);
    this.isComplex = true;
    this.sym = sym;

    const li = document.createElement("li");
    li.classList.add("jsontree_node", "jsontree_node_complex");
    li.innerHTML = this.template(label, this.sym, isLast);
    this.el = li;

    const childNodesUl = li.querySelector(
      ".jsontree_child-nodes"
    ) as HTMLElement;
    this.childNodesUl = childNodesUl;

    if (label !== null) {
      const labelEl = li.querySelector(".jsontree_label");
      const moreContentEl = li.querySelector(".jsontree_show-more");

      labelEl?.addEventListener(
        "click",
        (e: MouseEvent) => {
          if (e.altKey) {
            this.toggleMarked();
            return;
          }

          if (e.shiftKey) {
            document.getSelection()?.removeAllRanges();
            alert(this.getJSONPath());
            return;
          }

          this.toggle(e.ctrlKey || e.metaKey);
        },
        false
      );

      moreContentEl?.addEventListener(
        "click",
        (e: MouseEvent) => {
          this.toggle(e.ctrlKey || e.metaKey);
        },
        false
      );

      this.isRoot = false;
    } else {
      this.isRoot = true;
      this.parent = null;
      li.classList.add("jsontree_node_expanded");
    }

    this.childNodes = [];
    forEachNode(val, (label: string, node: JSONValue, isLast: boolean) => {
      this.addChild(createNode(label, node, isLast));
    });

    this.isEmpty = !Boolean(this.childNodes.length);
    if (this.isEmpty) {
      li.classList.add("jsontree_node_empty");
    }
  }

  template(label: string | null, sym: [string, string], isLast: boolean) {
    const comma = !isLast ? `<span class="jsontree_symbol">,</span>` : "";
    let str = `
      <div class="jsontree_value-wrapper">
        <div class="jsontree_value jsontree_value_${this.type}">
          <span class="jsontree_symbol">${sym[0]}</span>
          <span class="jsontree_show-more">&hellip;</span>
          <ul class="jsontree_child-nodes"></ul>
          <span class="jsontree_symbol">${sym[1]}</span>${comma}
        </div>
      </div>`;
    if (label !== null) {
      str = `
        <span class="jsontree_label-wrapper">
          <span class="jsontree_label">
            <span class="jsontree_expand-button"></span>
            "${label}"
          </span>
          <span class="jsontree_symbol">:</span>
        </span>${str}`;
    }
    return str;
  }

  addChild(child: TreeNode) {
    this.childNodes.push(child);
    this.childNodesUl.appendChild(child.el);
    child.parent = this;
  }

  expand(isRecursive: boolean) {
    if (this.isEmpty) {
      return;
    }

    if (!this.isRoot) {
      this.el.classList.add("jsontree_node_expanded");
    }

    if (isRecursive) {
      this.childNodes.forEach((item: TreeNode) => {
        if (item.isComplex) {
          item.expand(isRecursive);
        }
      });
    }
  }

  collapse(isRecursive: boolean) {
    if (this.isEmpty) {
      return;
    }

    if (!this.isRoot) {
      this.el.classList.remove("jsontree_node_expanded");
    }

    if (isRecursive) {
      this.childNodes.forEach((item: TreeNode) => {
        if (item.isComplex) {
          item.collapse(isRecursive);
        }
      });
    }
  }

  toggle(isRecursive: boolean) {
    if (this.isEmpty) {
      return;
    }

    this.el.classList.toggle("jsontree_node_expanded");

    if (isRecursive) {
      const isExpanded = this.el.classList.contains("jsontree_node_expanded");

      this.childNodes.forEach((item: TreeNode) => {
        if (item.isComplex) {
          item[isExpanded ? "expand" : "collapse"](isRecursive);
        }
      });
    }
  }

  findChildren(
    matcher: NodeMatcher,
    handler: NodeHandler,
    isRecursive: boolean
  ) {
    if (this.isEmpty) {
      return;
    }

    this.childNodes.forEach((item: TreeNode) => {
      if (matcher(item)) {
        handler(item);
      }

      if (item.isComplex && isRecursive) {
        item.findChildren(matcher, handler, isRecursive);
      }
    });
  }
}

// Subclasses for complex nodes (objects and arrays)
class NodeObject extends NodeComplex {
  constructor(label: string, val: JSONObject, isLast: boolean) {
    super(TypeObject, label, val, isLast, ["{", "}"]);
  }
}

class NodeArray extends NodeComplex {
  constructor(label: string, val: JSONArray, isLast: boolean) {
    super(TypeArray, label, val, isLast, ["[", "]"]);
  }
}

// Utility functions
function getClass(val: JSONValue): string {
  return Object.prototype.toString.call(val);
}

function getType(val: JSONValue): NodeType {
  if (val === null) {
    return TypeNull;
  }

  switch (typeof val) {
    case "number":
      return TypeNumber;
    case "string":
      return TypeString;
    case "boolean":
      return TypeBoolean;
  }

  const classStr = getClass(val);

  switch (classStr) {
    case "[object Array]":
      return TypeArray;
    case "[object Object]":
      return TypeObject;
  }

  throw new Error(`Bad type: ${classStr}`);
}

function isValidRoot(jsonObj: JSONValue): boolean {
  switch (getType(jsonObj)) {
    case TypeObject:
    case TypeArray:
      return true;
    default:
      return false;
  }
}

function forEachNode(
  obj: JSONValue,
  func: (key: string | number, value: JSONValue, isLast: boolean) => void
): void {
  const nodeType = getType(obj);
  let lastIndex: number;

  switch (nodeType) {
    case TypeArray:
      const jsonArr = obj as JSONArray;
      lastIndex = jsonArr.length - 1;
      jsonArr.forEach((item, i) => {
        func(i, item, i === lastIndex);
      });
      break;

    case TypeObject:
      let jsonObj = obj as JSONObject;
      const keys = Object.keys(jsonObj).sort();
      lastIndex = keys.length - 1;
      keys.forEach((item, i) => {
        func(item, jsonObj[item], i === lastIndex);
      });
      break;
  }
}

function createNode(label: string | null, val: JSONValue, isLast: boolean) {
  const nodeType = getType(val);

  switch (nodeType) {
    case TypeBoolean:
      return new NodeBoolean(label, val as boolean, isLast);
    case TypeNumber:
      return new NodeNumber(label, val as number, isLast);
    case TypeString:
      return new NodeString(label, val as string, isLast);
    case TypeNull:
      return new NodeNull(label, val as null, isLast);
    case TypeObject:
      return new NodeObject(label, val as JSONObject, isLast);
    case TypeArray:
      return new NodeArray(label, val as JSONArray, isLast);
    default:
      throw new Error("Bad type: " + getClass(val));
  }
}

export type { TreeNode };

export {
  NodeArray,
  NodeObject,
  NodeBoolean,
  NodeNumber,
  NodeString,
  NodeNull,
  isValidRoot,
  createNode,
};
