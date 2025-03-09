import { createEl } from "./utils";

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

export { createViewport };
