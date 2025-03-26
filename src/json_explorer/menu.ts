import { create } from "domain";
import { createEl } from "./utils";

type EventHandler = (evt: Event) => void;

type HighlightSelectOptions = {
  options: string[];
  value: string;
};

type MenuOptions = {
  handlers: {
    clearMarks: EventHandler;
    collapseAll: EventHandler;
    expandAll: EventHandler;
    toggleView: EventHandler;
  };
  highlightSelect: HighlightSelectOptions;
  themeToggle: EventHandler;
};

type MenuItemOptions = {
  action: string;
  text: string;
  handler: EventHandler;
};

function createMenu({
  handlers,
  highlightSelect,
  themeToggle,
}: MenuOptions): HTMLElement {
  const { clearMarks, collapseAll, expandAll, toggleView } = handlers;

  return createEl("nav", {
    class: "json-explorer-menu",
    children: [
      createEl("ul", {
        children: [
          createMenuItem({
            action: "expand",
            text: "Expand All",
            handler: expandAll,
          }),
          createMenuItem({
            action: "collapse",
            text: "Collapse All",
            handler: collapseAll,
          }),
          createMenuItem({
            action: "clearMarks",
            text: "Clear Marks",
            handler: clearMarks,
          }),
          createMenuItem({
            action: "toggleView",
            text: "Toggle View",
            handler: toggleView,
          }),
          createMenuDropdown(highlightSelect),
        ],
      }),
      createThemeToggle(themeToggle),
    ],
  });
}

function createMenuItem({
  action,
  text,
  handler,
}: MenuItemOptions): HTMLLIElement {
  return createEl("li", {
    children: [
      createEl("button", {
        data: { action },
        text,
        handlers: { click: handler },
      }),
    ],
  }) as HTMLLIElement;
}

function createMenuDropdown(
  selectOptions: HighlightSelectOptions
): HTMLLIElement {
  const { options, value } = selectOptions;
  return createEl("li", {
    children: [
      createEl("select", {
        children: options.map((option) =>
          createEl("option", {
            props: {
              value: option,
              selected: option === value,
            },
            text: option,
          })
        ),
      }),
    ],
  }) as HTMLLIElement;
}

function createThemeToggle(themeToggle: EventHandler): HTMLLabelElement {
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
  }) as HTMLLabelElement;
}

export { createMenu };

export type { MenuOptions };
