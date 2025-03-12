import { createEl } from "./utils";

type EventHandler = (evt: Event) => void;

type MenuOptions = {
  collapseAll: EventHandler;
  expandAll: EventHandler;
  toggleView: EventHandler;
  themeToggle: EventHandler;
};

function createMenu({
  collapseAll,
  expandAll,
  toggleView,
  themeToggle,
}: MenuOptions): HTMLElement {
  return createEl("nav", {
    class: "json-explorer-menu",
    children: [
      createEl("ul", {
        children: [
          createEl("li", {
            children: [
              createEl("button", {
                data: { action: "expand" },
                text: "Expand All",
                handlers: { click: expandAll },
              }),
            ],
          }),
          createEl("li", {
            children: [
              createEl("button", {
                data: { action: "collapse" },
                text: "Collapse All",
                handlers: { click: collapseAll },
              }),
            ],
          }),
          createEl("li", {
            children: [
              createEl("button", {
                data: { action: "toggleView" },
                text: "Toggle View",
                handlers: { click: toggleView },
              }),
            ],
          }),
        ],
      }),
      createThemeToggle(themeToggle),
    ],
  });
}

function createThemeToggle(themeToggle: EventHandler): HTMLElement {
  return createEl("label", {
    class: "json-explorer-switch",
    children: [
      createEl("input", {
        props: {
          type: "checkbox",
          role: "switch",
          "aria-checked": "false",
          "aria-label": "Toggle dark mode",
        },
        handlers: {
          change: themeToggle,
        },
      }),
      createEl("span", {
        class: "json-explorer-slider",
      }),
    ],
  });
}

export { createMenu };

export type { MenuOptions };
