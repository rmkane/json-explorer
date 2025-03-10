import { createEl } from "./utils";

type MenuOptions = {
  collapseAll: (evt: Event) => void;
  expandAll: (evt: Event) => void;
  toggleView: (evt: Event) => void;
};

function createMenu({
  collapseAll,
  expandAll,
  toggleView,
}: MenuOptions): HTMLElement {
  return createEl("div", {
    class: "json-explorer_menu",
    children: [
      createEl("button", {
        class: "json-explorer_menu-btn btn btn-primary",
        data: { action: "expand" },
        text: "Expand All",
        handlers: { click: expandAll },
      }),
      createEl("button", {
        class: "json-explorer_menu-btn btn btn-primary",
        data: { action: "collapse" },
        text: "Collapse All",
        handlers: { click: collapseAll },
      }),
      createEl("button", {
        class: "json-explorer_menu-btn btn btn-primary",
        data: { action: "toggle" },
        text: "Show Source",
        handlers: { click: toggleView },
      }),
    ],
  });
}

export { createMenu };

export type { MenuOptions };
