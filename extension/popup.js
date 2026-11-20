// Loud Crayon OS Feedback Extension — Popup Script (Restricted to Loud Crayon Sites Only)

let currentScreenshot = null;
let currentTab = null;
let pageInfo = null;

const DEFAULT_ALLOWED_HOST_PATTERNS = [
  'loudcrayon.com',
  'loudcrayon.co',
  'loud-crayon.vercel.app',
  'localhost',
  '127.0.0.1',
];

function isUrlAllowed(url, remoteAllowlist = []) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // Check defaults
    for (const pat of DEFAULT_ALLOWED_HOST_PATTERNS) {
      if (host === pat || host.endsWith('.' + pat)) {
        return true;
      }
    }

    // Check Vercel staging preview subdomains
    if (host.endsWith('.vercel.app')) {
      return true;
    }

    // Check remote client allowlist
    for (const domain of remoteAllowlist) {
      const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (clean && (host === clean || host.endsWith('.' + clean))) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const statusBox = document.getElementById('statusBox');
  const disabledContainer = document.getElementById('disabledContainer');
  const feedbackForm = document.getElementById('feedbackForm');
  const screenshotPreview = document.getElementById('screenshotPreview');
  const previewPlaceholder = document.getElementById('previewPlaceholder');
  const recaptureBtn = document.getElementById('recaptureBtn');
  const osEndpointInput = document.getElementById('osEndpoint');
  const submitBtn = document.getElementById('submitBtn');

  // Load saved endpoint from storage if exists
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['lc_os_endpoint'], (res) => {
      if (res && res.lc_os_endpoint) {
        osEndpointInput.value = res.lc_os_endpoint;
      }
    });
  }

  // Get active tab
  let tab = null;
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = activeTab;
  }
  currentTab = tab;

  const currentUrl = tab ? tab.url : '';
  const osEndpoint = osEndpointInput.value.trim().replace(/\/$/, '');

  // Fetch client registry allowlist from OS endpoint (cached / graceful fallback)
  let remoteAllowlist = [];
  try {
    const resp = await fetch(`${osEndpoint}/api/feedback/allowlist`, { signal: AbortSignal.timeout(1500) });
    if (resp.ok) {
      const data = await resp.json();
      remoteAllowlist = data.domains || [];
    }
  } catch {
    // If offline or unreachable, fall back to default patterns
  }

  // Verify URL against allowlist
  const isAllowed = isUrlAllowed(currentUrl, remoteAllowlist);

  if (!isAllowed) {
    // Show disabled "Not a Loud Crayon website" state and capture nothing
    feedbackForm.style.display = 'none';
    disabledContainer.style.display = 'block';
    return;
  }

  // Allowed site: request page info from content script
  if (tab && tab.id) {
    try {
      chrome.tabs.sendMessage(tab.id, { action: 'GET_PAGE_INFO' }, (res) => {
        if (res) {
          pageInfo = res;
        }
      });
    } catch {
      // Content script may not be loaded on internal pages
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
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.captureVisibleTab) {
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
      } else {
        previewPlaceholder.innerText = 'Tab capture unavailable';
      }
    } catch {
      previewPlaceholder.innerText = 'Screenshot error';
    }
  }

  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    const elementSelector = document.getElementById('elementSelector').value.trim();
    const endpoint = osEndpointInput.value.trim().replace(/\/$/, '');

    if (!title) {
      showStatus('Please provide an issue summary', 'error');
      return;
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ lc_os_endpoint: endpoint });
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Dispatching to OS...';

    const payload = {
      client_username: 'loudcrayon_extension',
      title,
      description,
      priority,
      page_url: pageInfo?.url || currentTab?.url || 'unknown',
      element_selector: elementSelector || pageInfo?.selector || 'body',
      viewport: pageInfo?.viewport || `${window.innerWidth}x${window.innerHeight}`,
      browser_os: navigator.userAgent,
      console_logs: pageInfo?.errors || [],
      screenshot_data: currentScreenshot || null,
      source: 'chrome_extension_allowlisted',
    };

    try {
      const res = await fetch(`${endpoint}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Origin': currentUrl,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showStatus('✓ Report dispatched to Loud Crayon OS Inbox!', 'success');
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        setTimeout(() => window.close(), 1800);
      } else {
        showStatus(`Failed: ${data.error || 'Server rejected submission'}`, 'error');
      }
    } catch (err) {
      showStatus(`Network Error: ${err.message}`, 'error');
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
