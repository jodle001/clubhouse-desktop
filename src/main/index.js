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
 * Chromium's seccomp policy in older builds predates clone3(), which glibc
 * 2.34+ uses for threads. Modern Electron no longer needs this, but the switch
 * is harmless and keeps parity for anyone running an older runtime.
 */
if (platform === "linux") {
	app.commandLine.appendSwitch("disable-features", "MediaSessionService");
}

app.setAppUserModelId("com.jodle001.clubhouse-desktop");

let mainWindow = null;

function createWindow(settings) {
	const state = settings.get("windowState");

	const win = new BrowserWindow({
		width: state.width,
		height: state.height,
		minWidth: 900,
		minHeight: 560,
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: platform === "darwin" ? "hiddenInset" : "default",
		backgroundColor: "#e9e7e3",
		icon: join(import.meta.dirname, "../../resources/icon.png"),
		webPreferences: {
			preload: join(import.meta.dirname, "../preload/index.mjs"),
			// The renderer is pure UI. No Node, no direct network, no tokens.
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false
		}
	});

	if (state.maximized) {
		win.maximize();
	}

	win.on("ready-to-show", () => win.show());

	win.on("close", () => {
		const bounds = win.getBounds();
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

	// Links open in the user's browser, never inside the app.
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
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
