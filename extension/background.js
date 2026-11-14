// Loud Crayon OS Feedback Extension — Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Loud Crayon Feedback Extension installed successfully.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CAPTURE_VISIBLE_TAB') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ dataUrl });
      }
    });
    return true; // Keep channel open for async response
  }
});
