const INJECTION_TARGET = {
  css: ["assets/editor.css"],
  js: ["assets/runtime.js"]
};
const POPUP_PATH = "popup/popup.html";
const RUNTIME_SENTINEL = "__SELECTOR_RUNTIME_BOOTSTRAPPED__";
const STATUS_ALREADY_ACTIVE = "already-active";
const STATUS_UNSUPPORTED_PAGE = "unsupported-page";
const STATUS_STARTED = "started";
const STATUS_ERROR = "error";
const UNSUPPORTED_PAGE_MESSAGE = "This page does not allow extension injection.";
const inFlightStartsByTabId = new Map();

chrome.action.onClicked.addListener((tab) => {
  activateSelectorForTab(tab).catch(() => {
    // Popup flow receives structured results; toolbar flow is fire-and-forget.
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-selector-popup") {
    return;
  }

  openSelectorPopup().catch(() => {
    // Command-triggered popup open is best-effort.
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "selector.activate") {
    return false;
  }

  activateSelector()
    .then((result) => sendResponse(result))
    .catch((error) => sendResponse(createErrorResult(error)));

  return true;
});

async function activateSelector() {
  const tab = await resolveActiveTab();
  return activateSelectorForTab(tab);
}

async function activateSelectorForTab(tab) {
  if (!tab || !Number.isInteger(tab.id)) {
    throw new Error("No active tab available.");
  }

  if (!isSupportedPage(tab.url)) {
    return createUnsupportedPageResult();
  }

  const existingStart = inFlightStartsByTabId.get(tab.id);

  if (existingStart) {
    return existingStart;
  }

  const startPromise = runActivation(tab.id).catch((error) => {
    return createErrorResult(error);
  }).finally(() => {
    if (inFlightStartsByTabId.get(tab.id) === startPromise) {
      inFlightStartsByTabId.delete(tab.id);
    }
  });

  inFlightStartsByTabId.set(tab.id, startPromise);

  return startPromise;
}

async function runActivation(tabId) {
  const alreadyActive = await isSelectorAlreadyActive(tabId);

  if (alreadyActive) {
    return createAlreadyActiveResult();
  }

  await chrome.scripting.insertCSS({
    target: { tabId },
    files: INJECTION_TARGET.css
  });

  await chrome.scripting.executeScript({
    target: { tabId },
    files: INJECTION_TARGET.js
  });

  return createStartedResult();
}

async function resolveActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  return tab;
}

function isSupportedPage(url) {
  if (typeof url !== "string" || !url) {
    return false;
  }

  return !/^(about:|brave:|chrome:|chrome-extension:|devtools:|edge:|moz-extension:|opera:|vivaldi:)/.test(
    url
  );
}

async function isSelectorAlreadyActive(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (sentinel) => {
      return Boolean(
        window[sentinel] || document.querySelector(".ai-editor-root")
      );
    },
    args: [RUNTIME_SENTINEL]
  });

  return Boolean(result?.result);
}

function createErrorResult(error) {
  const message = error instanceof Error ? error.message : String(error);

  if (isUnsupportedPageError(message)) {
    return createUnsupportedPageResult();
  }

  return {
    ok: false,
    status: STATUS_ERROR,
    error: message
  };
}

function createAlreadyActiveResult() {
  return {
    ok: true,
    status: STATUS_ALREADY_ACTIVE
  };
}

function createStartedResult() {
  return {
    ok: true,
    status: STATUS_STARTED
  };
}

function createUnsupportedPageResult() {
  return {
    ok: false,
    status: STATUS_UNSUPPORTED_PAGE,
    error: UNSUPPORTED_PAGE_MESSAGE
  };
}

function isUnsupportedPageError(error) {
  if (error instanceof Error) {
    return isUnsupportedPageError(error.message);
  }

  if (typeof error !== "string") {
    return false;
  }

  return [
    "Cannot access contents of url",
    "The extensions gallery cannot be scripted",
    "Cannot access a chrome:// URL",
    "Missing host permission",
    "Cannot access this page"
  ].some((pattern) => error.includes(pattern));
}

async function openSelectorPopup() {
  await chrome.action.setPopup({ popup: POPUP_PATH });

  try {
    await chrome.action.openPopup();
  } finally {
    await chrome.action.setPopup({ popup: "" });
  }
}
