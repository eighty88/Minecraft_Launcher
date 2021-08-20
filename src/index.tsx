import path from 'path';
import { BrowserWindow, app, session } from 'electron';
import { searchDevtools } from 'electron-search-devtools';

const isDev = process.env.NODE_ENV === 'development';

const execPath =
    process.platform === 'win32'
        ? '../node_modules/electron/dist/electron.exe'
        : '../node_modules/.bin/electron';

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.resolve(__dirname, execPath),
        forceHardReset: true,
        hardResetMethod: 'exit',
    });
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'),
        },
    });

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(async () => {
    if (isDev) {
        const devtools = await searchDevtools('REACT');
        if (devtools) {
            await session.defaultSession.loadExtension(devtools, {
                allowFileAccess: true,
            });
        }
    }

    createWindow();
});

app.once('window-all-closed', () => app.quit());