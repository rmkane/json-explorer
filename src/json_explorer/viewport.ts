import { createEl } from "./utils";

function createViewport(): HTMLElement {
  return createEl("div", {
    class: "json-explorer_viewport",
    children: [
      createEl("div", {
        class: "json-explorer_view json-explorer_view-active",
        data: { view: "preview" },
      }),
      createEl("div", {
        class: "json-explorer_view",
        data: { view: "source", loaded: false },
      }),
    ],
  });
}

export { createViewport };
