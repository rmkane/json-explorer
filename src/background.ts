import type { View } from "./worker/types";

import { allViews, initialView } from "./worker/constants";
import { createEl, emptyChildren, getNextItem } from "./worker/utils";
import { createTree } from "./jsontree/tree";

const activeTheme = "unikitty-dark";

const viewStates: Record<View, string> = {
  preview: "Show Source",
  source: "Hide Source",
};

let rawData: string;
let tree: any;

document.addEventListener("DOMContentLoaded", init);

function getPreviewElement(): HTMLElement | null {
  return document.querySelector(".jsontree_view[data-view='preview']");
}

function init(): void {
  const data = parseJSON();
  if (!data) {
    return;
  }

  render(data);

  tree.findAndHandle(
    (node: any) => node.type === "string",
    (node: any) => {
      node.mark();
      node.expandParent("isRecursive");
    }
  );
}

function render(data: any, target: HTMLElement = document.body): void {
  emptyChildren(target);
  target.classList.add("jsontree_bg");
  target.setAttribute("data-theme", activeTheme);

  createEl("div", {
    class: "jsontree_wrapper",
    children: [createMenu(), createViewport()],
    parent: target,
  });

  tree = createTree(data, getPreviewElement());
}

function createMenu(): HTMLElement {
  return createEl("div", {
    class: "jsontree_menu",
    children: [
      createEl("button", {
        class: "jsontree_menu_btn",
        data: { action: "expand" },
        text: "Expand All",
        handlers: { click: () => tree.expand() },
      }),
      createEl("button", {
        class: "jsontree_menu_btn",
        data: { action: "collapse" },
        text: "Collapse All",
        handlers: { click: () => tree.collapse() },
      }),
      createEl("button", {
        class: "jsontree_menu_btn",
        data: { action: "toggle" },
        text: "Show Source",
        handlers: { click: toggleView },
      }),
    ],
  });
}

function createViewport(): HTMLElement {
  return createEl("div", {
    class: "jsontree_viewport",
    children: [
      createEl("div", {
        class: "jsontree_view jsontree_view-active",
        data: { view: "preview" },
      }),
      createEl("div", {
        class: "jsontree_view",
        data: { view: "source", loaded: false },
      }),
    ],
  });
}

function toggleView(e: MouseEvent): void {
  const activeView = document.querySelector(
    ".jsontree_view-active"
  ) as HTMLElement;
  const views = document.querySelectorAll<HTMLElement>(".jsontree_view");
  const toggleViewBtn = e.target as HTMLButtonElement;

  const currentView = activeView?.dataset.view ?? initialView;
  const nextView = getNextItem(currentView, allViews);

  if (nextView === "source") {
    lazyLoadSource();
  }

  toggleViewBtn.textContent = viewStates[nextView];

  views.forEach((view) => {
    view.classList.remove("jsontree_view-active");

    if (view.dataset.view === nextView) {
      view.classList.add("jsontree_view-active");
    }
  });
}

function lazyLoadSource(): void {
  const source = document.querySelector(
    ".jsontree_view[data-view='source']"
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
