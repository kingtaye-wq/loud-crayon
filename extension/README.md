# Loud Crayon OS Screenshot & Feedback Extension (Manifest V3)

This Manifest V3 Chrome/Edge extension enables the Loud Crayon team and admins to capture pixel-perfect screenshots of client preview pages or live client sites, select target DOM elements, and immediately dispatch structured bug reports directly to the **Loud Crayon OS Feedback Inbox**.

---

## Features

1. **One-Click Tab Capture:** Uses `chrome.tabs.captureVisibleTab` to take high-fidelity viewport screenshots without third-party dependencies.
2. **DOM Element Selector:** Crosshair picker to target specific buttons, hero banners, or misaligned containers and auto-populate CSS selectors.
3. **Environment & Viewport Context:** Auto-captures viewport dimensions, active URL, and browser User-Agent.
4. **Direct OS Integration:** Dispatches payloads directly to the Loud Crayon OS API (`/api/feedback`), which persists records in Supabase table `lc_agency_feedback` with strict Row-Level Security (RLS).
5. **Configurable Endpoint:** Works seamlessly across local development (`http://localhost:3000`) and Vercel staging (`https://loud-crayon-staging.vercel.app`).

---

## Installation (Unpacked Extension)

1. Open **Google Chrome** or **Microsoft Edge**.
2. Navigate to `chrome://extensions/` (or `edge://extensions/`).
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select the `extension/` directory inside this repository:
   `c:\Users\Administrator\loud-crayon\extension`
6. The **Loud Crayon OS** extension icon (orange badge) will appear in your browser toolbar. Pin it for easy access!

---

## How to Report an Issue

1. Navigate to any Loud Crayon preview site (e.g., `http://localhost:3000/preview/cleveland-pizza-co`).
2. Click the Loud Crayon extension icon in the toolbar.
3. Review the auto-captured screenshot in the preview box.
4. Enter a summary of the issue (e.g., *"Header phone number overlaps with navigation"*).
5. Enter additional notes, set Priority (`Low`, `Medium`, `High`), and verify the target OS endpoint.
6. Click **Dispatch to Loud Crayon OS Inbox**.
7. Open `/os` on Loud Crayon to see the new feedback item immediately in the Feedback Inbox tab.
