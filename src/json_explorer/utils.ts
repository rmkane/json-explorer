interface CreateElOptions {
  children?: HTMLElement[];
  class?: string;
  props?: Record<string, any>;
  data?: Record<string, any>;
  handlers?: Record<string, EventListener>;
  parent?: HTMLElement;
  text?: string;
}

function createEl(
  tagName: string,
  {
    children,
    class: className,
    props,
    data,
    handlers,
    parent,
    text,
  }: CreateElOptions
): HTMLElement {
  const element = document.createElement(tagName);
  if (className) {
    element.classList.add(...className.split(/\s+/));
  }
  if (props) {
    for (let key in props) {
      element[key] = props[key];
      element.setAttribute(key, props[key]);
    }
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
  if (children) {
    for (let child of children) {
      element.appendChild(child);
    }
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

function emptyChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function getNextItem<T>(item: T, items: readonly T[]): T {
  const index = items.indexOf(item);
  const nextIndex = (index + 1) % items.length;
  return items[nextIndex];
}

export type { CreateElOptions };
export { createEl, emptyChildren, getNextItem };
