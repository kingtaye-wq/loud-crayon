// Loud Crayon OS Feedback Extension — Popup Script

let currentScreenshot = null;
let currentTab = null;
let pageInfo = null;

document.addEventListener('DOMContentLoaded', async () => {
  const statusBox = document.getElementById('statusBox');
  const screenshotPreview = document.getElementById('screenshotPreview');
  const previewPlaceholder = document.getElementById('previewPlaceholder');
  const recaptureBtn = document.getElementById('recaptureBtn');
  const osEndpointInput = document.getElementById('osEndpoint');
  const feedbackForm = document.getElementById('feedbackForm');
  const submitBtn = document.getElementById('submitBtn');

  // Load saved endpoint from storage if exists
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['lc_os_endpoint'], (res) => {
      if (res && res.lc_os_endpoint) {
        osEndpointInput.value = res.lc_os_endpoint;
      }
    });
  }

  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  // Request page info from content script
  if (tab && tab.id) {
    try {
      chrome.tabs.sendMessage(tab.id, { action: 'GET_PAGE_INFO' }, (res) => {
        if (res) {
          pageInfo = res;
        }
      });
    } catch {
      // Content script may not be loaded on restricted pages (e.g. chrome://)
    }
  }

  // Capture screenshot on open
  captureCurrentTab();

  recaptureBtn.addEventListener('click', () => {
    captureCurrentTab();
  });

  async function captureCurrentTab() {
    previewPlaceholder.style.display = 'block';
    previewPlaceholder.innerText = 'Capturing tab...';
    screenshotPreview.style.display = 'none';

    try {
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError || !dataUrl) {
          previewPlaceholder.innerText = 'Unable to capture tab';
          return;
        }
        currentScreenshot = dataUrl;
        screenshotPreview.src = dataUrl;
        screenshotPreview.style.display = 'block';
        previewPlaceholder.style.display = 'none';
      });
    } catch (e) {
      previewPlaceholder.innerText = 'Screenshot error';
    }
  }

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    const elementSelector = document.getElementById('elementSelector').value.trim();
    const osEndpoint = osEndpointInput.value.trim().replace(/\/$/, '');

    if (!title) {
      showStatus('Please provide an issue summary', 'error');
      return;
    }

    // Save endpoint preference
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ lc_os_endpoint: osEndpoint });
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending to OS Inbox...';

    const payload = {
      client_username: 'loudcrayon',
      title,
      description,
      priority,
      screenshot_url: currentScreenshot,
      page_url: currentTab ? currentTab.url : (pageInfo ? pageInfo.url : ''),
      element_selector: elementSelector || undefined,
      viewport: pageInfo ? pageInfo.viewport : 'Extension Viewport',
      browser_os: pageInfo ? pageInfo.userAgent : navigator.userAgent,
      console_logs: [],
    };

    try {
      const response = await fetch(`${osEndpoint}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      const resData = await response.json();
      showStatus('✓ Issue logged to Loud Crayon OS Inbox!', 'success');

      feedbackForm.reset();
      currentScreenshot = null;
      screenshotPreview.style.display = 'none';
      previewPlaceholder.style.display = 'block';
      previewPlaceholder.innerText = 'Logged! Ready for next report.';
    } catch (err) {
      showStatus(`Failed to send: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Dispatch to Loud Crayon OS Inbox';
    }
  });

  function showStatus(msg, type) {
    statusBox.innerText = msg;
    statusBox.className = `status-msg status-${type}`;
    statusBox.style.display = 'block';
  }
});
