import { join } from "node:path";
import { platform } from "node:process";
import { app, BrowserWindow, shell, systemPreferences, Menu } from "electron";
import { Session } from "./session.js";
import { Settings } from "./settings.js";
import { registerIpc } from "./ipc.js";
import { buildMenu } from "./menu.js";

// Echo the renderer's console to this terminal and log every API request, with
// credentials redacted. Off by default. Either:
//   npm start -- --verbose
//   CLUBHOUSE_VERBOSE=1 npm run dev
const VERBOSE = process.argv.includes("--verbose") || Boolean(process.env.CLUBHOUSE_VERBOSE);

if (VERBOSE) {
	console.log("[verbose] on - logging renderer console and API calls, tokens redacted");
}

/**
 * Keeps Chromium's MediaSession integration off on Linux, where it registers
 * an MPRIS player over DBus - so a room's audio would grab the desktop's
 * media keys and show up as a "Now playing" widget, and pausing it from there
 * confuses Agora. Nothing to do with seccomp; an older comment here described
 * a clone3() workaround this switch never was.
 */
if (platform === "linux") {
	app.commandLine.appendSwitch("disable-features", "MediaSessionService");
}

app.setAppUserModelId("com.jodle001.clubhouse-desktop");

let mainWindow = null;

function createWindow(settings) {
	const state = settings.get("windowState");

	// The settings file is renderer-writable and hand-editable, so nothing in
	// it can be allowed to stop the window from opening - a persisted
	// { width: "900" } would otherwise throw inside whenReady and brick the
	// app until the JSON is deleted by hand.
	const width = Number.isFinite(state?.width) ? state.width : 1100;
	const height = Number.isFinite(state?.height) ? state.height : 800;

	const win = new BrowserWindow({
		width,
		height,
		minWidth: 900,
		minHeight: 560,
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: platform === "darwin" ? "hiddenInset" : "default",
		backgroundColor: "#e9e7e3",
		icon: join(import.meta.dirname, "../../resources/icon.png"),
		webPreferences: {
			preload: join(import.meta.dirname, "../preload/index.cjs"),
			// The renderer is pure UI. No Node, no direct network, no tokens.
			// The preload is built as CommonJS precisely so the sandbox can be
			// on: Electron only loads ESM preloads in unsandboxed renderers.
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		}
	});

	if (state?.maximized) {
		win.maximize();
	}

	win.on("ready-to-show", () => win.show());

	win.on("close", () => {
		// getNormalBounds, not getBounds: closing while maximized must save
		// the size to restore *to*, not the size of the screen.
		const bounds = win.getNormalBounds();
		settings.update({
			windowState: {
				width: bounds.width,
				height: bounds.height,
				maximized: win.isMaximized()
			}
		});
	});

	win.on("closed", () => {
		mainWindow = null;
	});

	// Web links open in the user's browser, never inside the app - and only
	// web links. openExternal on other schemes (file:, smb:, ms-*) hands the
	// URL to the OS as an action, which on some platforms means execution.
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (/^https?:/i.test(url)) {
			shell.openExternal(url);
		}

		return { action: "deny" };
	});

	// The window shows this app and nothing else. Without this, dropping a
	// link onto the window navigates in place to a remote page - which keeps
	// the preload bridge, and with it every clubhouse.* channel.
	win.webContents.on("will-navigate", (event, url) => {
		const allowed = process.env.ELECTRON_RENDERER_URL;
		if (!url.startsWith("file:") && !(allowed && url.startsWith(allowed))) {
			event.preventDefault();
		}
	});

	if (VERBOSE) {
		win.webContents.on("console-message", ({ level, message, lineNumber, sourceId }) => {
			console.log(`[renderer:${level}] ${message}  (${sourceId}:${lineNumber})`);
		});
		win.webContents.on("render-process-gone", (_event, details) =>
			console.log("[renderer gone]", JSON.stringify(details))
		);
	}

	if (process.env.ELECTRON_RENDERER_URL) {
		win.loadURL(process.env.ELECTRON_RENDERER_URL);
	} else {
		win.loadFile(join(import.meta.dirname, "../renderer/index.html"));
	}

	return win;
}

if (!app.requestSingleInstanceLock()) {
	app.quit();
} else {
	app.on("second-instance", () => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}

			mainWindow.focus();
		}
	});

	app.whenReady().then(async () => {
		const session = new Session();
		const settings = new Settings();

		registerIpc({ session, settings, verbose: VERBOSE });
		Menu.setApplicationMenu(buildMenu({ app, shell }));

		if (platform === "darwin") {
			systemPreferences.askForMediaAccess("microphone").catch(() => {});
		}

		mainWindow = createWindow(settings);

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				mainWindow = createWindow(settings);
			}
		});
	});

	app.on("window-all-closed", () => {
		if (platform !== "darwin") {
			app.quit();
		}
	});
}
