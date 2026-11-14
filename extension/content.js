// Loud Crayon OS Feedback Extension — Content Script

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PAGE_INFO') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
    });
    return true;
  }

  if (request.action === 'START_PICKER') {
    startElementPicker((selector) => {
      sendResponse({ selector });
    });
    return true; // Keep channel open for async response
  }
});

function startElementPicker(callback) {
  let activeElement = null;

  const overlay = document.createElement('div');
  overlay.id = 'lc-picker-banner';
  overlay.style.position = 'fixed';
  overlay.style.top = '12px';
  overlay.style.left = '50%';
  overlay.style.transform = 'translateX(-50%)';
  overlay.style.backgroundColor = '#ea580c';
  overlay.style.color = '#ffffff';
  overlay.style.padding = '8px 16px';
  overlay.style.borderRadius = '9999px';
  overlay.style.fontSize = '12px';
  overlay.style.fontWeight = 'bold';
  overlay.style.zIndex = '99999999';
  overlay.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
  overlay.style.pointerEvents = 'none';
  overlay.innerText = '🎯 Click any element to target for Loud Crayon OS';
  document.body.appendChild(overlay);

  function onMouseOver(e) {
    if (activeElement && activeElement !== e.target) {
      activeElement.style.outline = '';
    }
    activeElement = e.target;
    activeElement.style.outline = '2px dashed #f97316';
    activeElement.style.cursor = 'crosshair';
  }

  function onMouseOut(e) {
    if (e.target) {
      e.target.style.outline = '';
      e.target.style.cursor = '';
    }
  }

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (activeElement) {
      activeElement.style.outline = '';
      activeElement.style.cursor = '';
    }

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('mouseout', onMouseOut, true);
    document.removeEventListener('click', onClick, true);

    const target = e.target;
    let sel = target.tagName.toLowerCase();
    if (target.id) {
      sel += `#${target.id}`;
    } else if (target.className && typeof target.className === 'string') {
      const cls = target.className.split(' ').filter(Boolean)[0];
      if (cls) sel += `.${cls}`;
    }

    callback(sel);
  }

  document.addEventListener('mouseover', onMouseOver, true);
  document.addEventListener('mouseout', onMouseOut, true);
  document.addEventListener('click', onClick, true);
}
