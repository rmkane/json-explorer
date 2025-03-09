document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
  const btn = document.querySelector<HTMLButtonElement>("#options-btn");
  if (!btn) {
    throw new Error("Could not find the options button");
  }
  btn.addEventListener("click", onOptionsClick);
}

function onOptionsClick() {
  // Close the popup
  globalThis.close();

  alert("Hello from Deno!");
}
