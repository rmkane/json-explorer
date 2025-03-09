const activeTheme = "unikitty-dark";

let rawData, tree;

document.addEventListener("DOMContentLoaded", init);

function init() {
  const data = parseJSON();
  if (!data) {
    return;
  }
  render(data);

  const isStringNode = (node) => node.type === "string";

  tree.findAndHandle(isStringNode, function (node) {
    node.mark();
    node.expandParent("isRecursive");
  });
}

function createEl(tag, { class: className, data, text, handlers, parent }) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(...className.split(/\s+/));
  }
  if (data) {
    for (let key in data) {
      element.dataset[key] = data[key];
      element.setAttribute("data-" + key, data[key]);
    }
  }
  if (text) {
    element.textContent = text;
  }
  if (handlers) {
    for (let eventName in handlers) {
      element.addEventListener(eventName, handlers[eventName]);
    }
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

function render(data, target = document.body) {
  target.innerHTML = "";
  target.classList.add("jsontree_bg");
  target.setAttribute("data-theme", activeTheme);

  const wrapper = createEl("div", {
    class: "jsontree_wrapper",
    parent: target,
  });

  const menu = createEl("div", { class: "jsontree_menu", parent: wrapper });

  const expandAllBtn = createEl("button", {
    class: "jsontree_menu_btn",
    data: { action: "expand" },
    text: "Expand All",
    handlers: { click: () => tree.expand() },
    parent: menu,
  });

  const collapseAllBtn = createEl("button", {
    class: "jsontree_menu_btn",
    data: { action: "collapse" },
    text: "Collapse All",
    handlers: { click: () => tree.collapse() },
    parent: menu,
  });

  const toggleViewBtn = createEl("button", {
    class: "jsontree_menu_btn",
    data: { action: "toggle" },
    text: "Show Source",
    handlers: { click: toggleView },
    parent: menu,
  });

  const viewport = createEl("div", {
    class: "jsontree_viewport",
    parent: wrapper,
  });

  const preview = createEl("div", {
    class: "jsontree_view jsontree_view-active",
    data: { view: "preview" },
    parent: viewport,
  });

  const source = createEl("div", {
    class: "jsontree_view",
    data: { view: "source", loaded: false },
    parent: viewport,
  });

  tree = jsonTree.create(data, preview);
}

// Constants
const initialView = "preview";
const allViews = ["preview", "source"];
const viewStates = {
  preview: "Show Source",
  source: "Hide Source",
};

function toggleView(e) {
  const activeView = document.querySelector(".jsontree_view-active");
  const views = document.querySelectorAll(".jsontree_view");
  const toggleViewBtn = e.target;

  const currentView = activeView?.dataset.view ?? initialView;
  const nextView = getNextItem(currentView, allViews);

  if (nextView === "source") {
    lazyLoadSource();
  }

  toggleViewBtn.textContent = viewStates[nextView];

  for (let view of views) {
    view.classList.remove("jsontree_view-active");

    if (view.dataset.view === nextView) {
      view.classList.add("jsontree_view-active");
    }
  }
}

function lazyLoadSource() {
  const source = document.querySelector(".jsontree_view[data-view='source']");
  if (source.dataset.loaded === "true") {
    return;
  }

  createEl("pre", { text: rawData, parent: source });

  source.dataset.loaded = true;
}

function parseJSON() {
  rawData = document.querySelector("body > pre").textContent;
  try {
    return JSON.parse(rawData);
  } catch (e) {
    console.log("Content is not JSON");
  }
  return null;
}

function getNextItem(item, items) {
  const index = items.indexOf(item);
  const nextIndex = (index + 1) % items.length;
  return items[nextIndex];
}
