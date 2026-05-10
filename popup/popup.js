const startButton = document.getElementById("start-selector");
const statusText = document.getElementById("status");
const STATUS_ALREADY_ACTIVE = "already-active";
const STATUS_UNSUPPORTED_PAGE = "unsupported-page";
const STATUS_STARTED = "started";
const STATUS_ERROR = "error";

startButton.addEventListener("click", async () => {
  setStatus("Starting selector...", "pending");
  startButton.disabled = true;

  try {
    const response = normalizeActivationResponse(await chrome.runtime.sendMessage({
      type: "selector.activate"
    }));

    setStatus(formatStatus(response), getStatusState(response));
  } catch (error) {
    setStatus(
      error instanceof Error ? error.message : "Failed to start selector.",
      "error"
    );
  } finally {
    startButton.disabled = false;
  }
});

function formatStatus(response) {
  if (response.status === STATUS_ALREADY_ACTIVE) {
    return "Selector is already active on this tab.";
  }

  if (response.status === STATUS_UNSUPPORTED_PAGE) {
    return "This page does not allow extension injection.";
  }

  if (response.ok && response.status === STATUS_STARTED) {
    return "Selector started on this tab.";
  }

  return response.error || "Failed to start selector.";
}

function getStatusState(response) {
  if (response.status === STATUS_ALREADY_ACTIVE) {
    return "success";
  }

  if (response.ok && response.status === STATUS_STARTED) {
    return "success";
  }

  return "error";
}

function normalizeActivationResponse(response) {
  if (!response || typeof response !== "object") {
    return {
      ok: false,
      status: STATUS_ERROR,
      error: "Failed to start selector."
    };
  }

  return response;
}

function setStatus(message, state) {
  statusText.textContent = message;
  if (state) {
    statusText.dataset.state = state;
  } else {
    delete statusText.dataset.state;
  }
}
