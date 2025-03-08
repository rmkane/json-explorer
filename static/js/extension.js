const activeTheme = "monokai";

let rawData, tree;

document.addEventListener("DOMContentLoaded", init);

function init() {
  const data = parseJSON();
  if (!data) {
    return;
  }
  render(data);
}

function createEl(tag, { class: className, text, handlers, parent }) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
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
    text: "Expand All",
    handlers: { click: () => tree.expand() },
    parent: menu,
  });

  const collapseAllBtn = createEl("button", {
    text: "Collapse All",
    handlers: { click: () => tree.collapse() },
    parent: menu,
  });

  const showSourceBtn = createEl("button", {
    text: "Show Source",
    handlers: { click: () => tree.showSource() },
    parent: menu,
  });

  const preview = createEl("div", {
    class: "jsontree_preview",
    parent: wrapper,
  });

  tree = jsonTree.create(data, preview);
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
