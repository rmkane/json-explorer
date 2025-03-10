import type { View } from "./json_explorer/types";
import type { TreeNode } from "./json_tree/types";

import { allViews, initialView } from "./json_explorer/constants";
import { createMenu } from "./json_explorer/menu";
import { createEl, emptyChildren, getNextItem } from "./json_explorer/utils";
import { createViewport } from "./json_explorer/viewport";
import { createTree, Tree } from "./json_tree/tree";

const activeTheme = "dracula";

const viewStates: Record<View, string> = {
  preview: "Show Source",
  source: "Hide Source",
};

let rawData: string;
let tree: Tree;

init();

function getPreviewElement(): HTMLElement | null {
  return document.querySelector(".json-explorer_view[data-view='preview']");
}

function init(): void {
  const data = parseJSON();
  if (!data) {
    return;
  }

  render(data);

  tree.findAndHandle(
    (node: TreeNode) => node.type === "string",
    (node: TreeNode) => {
      node.mark();
      node.expandParent(true);
    }
  );
}

function render(data: any, target: HTMLElement = document.body): void {
  emptyChildren(target);
  target.classList.add("json-tree_bg");
  target.setAttribute("data-theme", activeTheme);

  createEl("div", {
    class: "json-explorer_wrapper",
    children: [
      createMenu({ collapseAll, expandAll, toggleView }),
      createViewport(),
    ],
    parent: target,
  });

  tree = createTree(data, getPreviewElement());
}

function expandAll(): void {
  tree.expand();
}

function collapseAll(): void {
  tree.collapse();
}

function toggleView(e: MouseEvent): void {
  const activeView = document.querySelector(
    ".json-explorer_view-active"
  ) as HTMLElement;
  const views = document.querySelectorAll<HTMLElement>(".json-explorer_view");
  const toggleViewBtn = e.target as HTMLButtonElement;

  const currentView = activeView?.dataset.view ?? initialView;
  const nextView = getNextItem(currentView, allViews);

  if (nextView === "source") {
    lazyLoadSource();
  }

  toggleViewBtn.textContent = viewStates[nextView];

  views.forEach((view) => {
    view.classList.remove("json-explorer_view-active");

    if (view.dataset.view === nextView) {
      view.classList.add("json-explorer_view-active");
    }
  });
}

function lazyLoadSource(): void {
  const source = document.querySelector(
    ".json-explorer_view[data-view='source']"
  ) as HTMLElement;
  if (source.dataset.loaded === "true") {
    return;
  }

  createEl("pre", { text: rawData, parent: source });

  source.dataset.loaded = "true";
}

function parseJSON(): any {
  rawData = document.querySelector("body > pre")?.textContent || "";
  try {
    return JSON.parse(rawData);
  } catch (e) {
    console.log("Content is not JSON");
  }
  return null;
}
