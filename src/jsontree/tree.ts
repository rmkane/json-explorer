import type { TreeNode, NodeMatcher, NodeHandler, JSONValue } from "./types";

import { createNode, isValidRoot } from "./node";

class Tree {
  wrapper: HTMLElement;
  rootNode: TreeNode;
  sourceJSONObj: JSONValue;

  constructor(jsonObj: JSONValue, domEl: HTMLElement) {
    this.wrapper = document.createElement("ul");
    this.wrapper.className = "jsontree_tree clearfix";

    this.rootNode = null;
    this.sourceJSONObj = jsonObj;

    this.loadData(jsonObj);
    this.appendTo(domEl);
  }

  loadData(jsonObj: JSONValue) {
    if (!isValidRoot(jsonObj)) {
      alert("The root should be an object or an array");
      return;
    }

    this.sourceJSONObj = jsonObj;
    this.rootNode = createNode(null, jsonObj, true);
    this.wrapper.innerHTML = "";
    this.wrapper.appendChild(this.rootNode.el);
  }

  appendTo(domEl: HTMLElement) {
    domEl.appendChild(this.wrapper);
  }

  expand(filterFunc?: (node: TreeNode) => boolean) {
    if (this.rootNode.isComplex) {
      if (typeof filterFunc === "function") {
        this.rootNode.childNodes.forEach(function (item: TreeNode) {
          if (item.isComplex && filterFunc(item)) {
            item.expand(false);
          }
        });
      } else {
        this.rootNode.expand(true);
      }
    }
  }

  collapse() {
    if (typeof this.rootNode.collapse === "function") {
      this.rootNode.collapse(true);
    }
  }

  toSourceJSON(isPrettyPrinted: boolean) {
    if (!isPrettyPrinted) {
      return JSON.stringify(this.sourceJSONObj);
    }

    const DELIMETER = "[%^$#$%^%]";
    let jsonStr = JSON.stringify(this.sourceJSONObj, null, DELIMETER);

    jsonStr = jsonStr.split("\n").join("<br />");
    jsonStr = jsonStr.split(DELIMETER).join("&nbsp;&nbsp;&nbsp;&nbsp;");

    return jsonStr;
  }

  findAndHandle(matcher: NodeMatcher, handler: NodeHandler) {
    this.rootNode.findChildren(matcher, handler, true);
  }

  unmarkAll() {
    this.rootNode.findChildren(
      function () {
        return true;
      },
      function (node: TreeNode) {
        node.unmark();
      },
      true
    );
  }
}

function createTree(jsonObj: JSONValue, domEl: HTMLElement) {
  return new Tree(jsonObj, domEl);
}

export { Tree, createTree };
