const http = require("http");
const { existsSync } = require("fs");
const { spawn } = require("child_process");

const ports = [3000, 3001, 3002, 3003, 3010];
const startedAt = Date.now();
const timeoutMs = 60000;

function canReach(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1200, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function chromeCommand() {
  if (process.platform !== "win32") return null;
  const candidates = [
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
  ].filter(Boolean);
  return candidates.find((path) => existsSync(path)) ?? "chrome";
}

function openChrome(url) {
  const chrome = chromeCommand();
  if (chrome) {
    spawn(chrome, [url], { detached: true, stdio: "ignore" }).unref();
    return;
  }

  const opener = process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "darwin" ? ["-a", "Google Chrome", url] : [url];
  spawn(opener, args, { detached: true, stdio: "ignore" }).unref();
}

async function waitAndOpen() {
  while (Date.now() - startedAt < timeoutMs) {
    for (const port of ports) {
      const url = `http://localhost:${port}`;
      if (await canReach(url)) {
        openChrome(url);
        console.log(`[web] opened ${url} in Chrome`);
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  console.log("[web] Chrome opener timed out waiting for the Next.js dev server");
}

waitAndOpen();
