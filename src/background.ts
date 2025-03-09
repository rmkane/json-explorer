chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Extension installed.");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("Extension action clicked on tab:", tab);
});
