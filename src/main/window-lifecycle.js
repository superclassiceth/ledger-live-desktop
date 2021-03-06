// @flow
import "./setup";
import { BrowserWindow, screen, shell } from "electron";
import path from "path";
import icon from "../../build/icons/icon.png";
import { URL } from "url";

const intFromEnv = (key: string, def: number): number => {
  const v = process.env[key];
  if (!isNaN(v)) return parseInt(v, 10);
  return def;
};

export const DEFAULT_WINDOW_WIDTH = intFromEnv("LEDGER_DEFAULT_WINDOW_WIDTH", 1024);
export const DEFAULT_WINDOW_HEIGHT = intFromEnv("LEDGER_DEFAULT_WINDOW_HEIGHT", 768);
export const MIN_WIDTH = intFromEnv("LEDGER_MIN_WIDTH", 1024);
export const MIN_HEIGHT = intFromEnv("LEDGER_MIN_HEIGHT", 700);

const { DEV_TOOLS } = process.env;

let mainWindow = null;
let theme;

export const getMainWindow = () => mainWindow;

const getWindowPosition = (width, height, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display;

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  };
};

const defaultWindowOptions = {
  icon,
  backgroundColor: "#fff",
  webPreferences: {
    blinkFeatures: "OverlayScrollbars",
    devTools: DEV_TOOLS,
    experimentalFeatures: true,
    nodeIntegration: true,
  },
};

export const loadWindow = async () => {
  const url = __DEV__ ? INDEX_URL : `file://${__dirname}/index.html`;
  if (mainWindow) {
    await mainWindow.loadURL(`${url}?theme=${theme}`);
  }
};

export async function createMainWindow({ dimensions, positions }: any, settings: any) {
  theme = settings && settings.theme ? settings.theme : "null";

  // TODO renderer should provide the saved window rectangle
  const width = dimensions ? dimensions.width : DEFAULT_WINDOW_WIDTH;
  const height = dimensions ? dimensions.height : DEFAULT_WINDOW_HEIGHT;
  const windowPosition = positions || getWindowPosition(width, height);

  const windowOptions = {
    ...defaultWindowOptions,
    x: windowPosition.x,
    y: windowPosition.y,
    /* eslint-disable indent */
    ...(process.platform === "darwin"
      ? {
          frame: false,
          titleBarStyle: "hiddenInset",
        }
      : process.platform === "linux"
      ? { icon: path.join(__dirname, "/build/icons/icon.png") } // specific for linux icon
      : {}),
    /* eslint-enable indent */
    width,
    height,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preloader.bundle.js"),
      ...defaultWindowOptions.webPreferences,
    },
  };

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.name = "MainWindow";

  loadWindow();

  if (DEV_TOOLS) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", (event, url) => {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  return mainWindow;
}
