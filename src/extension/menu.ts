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
    class: "jsontree_menu",
    children: [
      createEl("button", {
        class: "jsontree_menu_btn",
        data: { action: "expand" },
        text: "Expand All",
        handlers: { click: expandAll },
      }),
      createEl("button", {
        class: "jsontree_menu_btn",
        data: { action: "collapse" },
        text: "Collapse All",
        handlers: { click: collapseAll },
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

export { createMenu };

export type { MenuOptions };
