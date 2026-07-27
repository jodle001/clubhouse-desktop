import { platform } from "node:process";
import { Menu } from "electron";

const REPO = "https://github.com/jodle001/clubhouse-desktop";

export function buildMenu({ app, shell }) {
	const isMac = platform === "darwin";

	const template = [
		...(isMac
			? [
				{
					label: app.name,
					submenu: [
						{ role: "about" },
						{ type: "separator" },
						{ role: "services" },
						{ type: "separator" },
						{ role: "hide" },
						{ role: "hideOthers" },
						{ type: "separator" },
						{ role: "quit" }
					]
				}
			]
			: []),
		{
			label: "File",
			submenu: [isMac ? { role: "close" } : { role: "quit" }]
		},
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				{ role: "selectAll" }
			]
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ role: "toggleDevTools" },
				{ type: "separator" },
				{ role: "resetZoom" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ type: "separator" },
				{ role: "togglefullscreen" }
			]
		},
		{
			role: "help",
			submenu: [
				{
					label: "Project on GitHub",
					click: () => shell.openExternal(REPO)
				}
			]
		}
	];

	return Menu.buildFromTemplate(template);
}
