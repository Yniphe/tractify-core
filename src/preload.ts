import { ipcRenderer } from "electron";

ipcRenderer.on("proxy->handle", (sender, message) => {
  window.document.dispatchEvent(
    new CustomEvent("proxy->handle", { detail: message })
  );
});
