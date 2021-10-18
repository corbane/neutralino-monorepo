// !!! This file is generate by a script, do not modify it. !!!
//
// Message definition for Neutralino client API.
// Generated on Sun, 17 Oct 2021 10:08:02 GMT

export type Requests = App.Requests & Computer.Requests & Filesystem.Requests & Os.Requests & Storage.Requests & Window.Requests

declare module App {

export type Requests = {
   ['app.exit']: {
      /**
       * Terminates the running application.
       * 
       * ```js
       * await Neutralino.app.exit();
       * ```
       * 
       * ```js
       * await Neutralino.app.exit(130);
       * ```
       */
      method: 'post',
      params: ExitParams,
      result: ExitResult,
   }
   ['app.getConfig']: {
      /**
       * Returns the current application configuration as a JSON object.
       * 
       * ```js
       * Neutralino.app.getConfig ()
       * ```
       */
      method: 'get',
      params: void,
      result: GetConfigResult,
   }
   ['app.keepAlive']: {
      /**
       * The keepAlive method is responsible for saving the Neutralinojs server instance from the automatic termination.
       * This method is called automatically from the client library for the browser mode.
       * 
       * ```js
       * Neutralino.app.keepAlive();
       * ```   
       */
      method: 'get',
      params: void,
      result: KeepAliveResult,
   }
   ['app.killProcess']: {
      /**
       * Kills the application process.
       * If the application becomes unresponsive,
       * you can use this to terminate the process instantly.
       * It is recommended to use the `exit()` method to close your application properly.
       * 
       * ```js
       * await Neutralino.app.killProcess();
       * ```
       */
      method: 'get',
      params: void,
      result: KillProcessResult,
   }
}

export type ExitParams = {
    /**
     * An integer value for the process's exit code. The default value is always `0` (success).
     */
    code: number;
};

export type ExitResult = {

    success: boolean;
};

export type GetConfigResult = {

    returnValue: import ('models/neutralino.config.schema.yaml').default;
};

export type KeepAliveResult = {

    success: boolean;

    message: string;
};

export type KillProcessResult = {

    success: boolean;
};

};/*App*/

declare module Computer {

export type Requests = {
   ['computer.getMemoryInfo']: {
      /**
       * Provides physical memory details (in megabytes).
       * 
       * ```js
       * Neutralino.computer.getMemoryInfo()
       *   .then (ramInfo => `Your ram size: ${Math.round(ramInfo.total / 1000000)}GB`)
       * ```
       */
      method: 'get',
      params: GetMemoryInfoResponse,
      result: void,
   }
}

export type GetMemoryInfoResponse = {

    success: boolean;

    returnValue: GetMemoryInfoResult;
};

export type GetMemoryInfoResult = {
    /**
     * Total physical memory.
     */
    total: number;
    /**
     * Available physical memory.
     */
    available: number;
};

};/*Computer*/

declare module Filesystem {

export type Requests = {
   ['filesystem.createDirectory']: {
      /**
       * Creates a new directory.
       * 
       * ```js
       * Neutralino.filesystem.createDirectory ({
       *   path: './newDirectory',
       * });
       * ```
       */
      method: 'post',
      params: CreateDirectoryOptions,
      result: CreateDirectoryResponse,
   }
   ['filesystem.removeDirectory']: {
      /**
       * Removes given directories.
       * 
       * ```js
       * await Neutralino.filesystem.removeDirectory({
       *   path: './tmpDirectory',
       * });
       * ```
       */
      method: 'post',
      params: RemoveDirectoryOptions,
      result: void,
   }
   ['filesystem.writeFile']: {
      /**
       * Writes new text files with data.
       * 
       * ```js
       * await Neutralino.filesystem.writeFile({
       *   fileName: './myFile.txt',
       *   data: 'Sample content'
       * });
       * ```
       */
      method: 'post',
      params: WriteFileOptions,
      result: void,
   }
   ['filesystem.writeBinaryFile']: {
      /**
       * Writes new binary files with data.
       * 
       * ```js
       * let rawBin = new ArrayBuffer(1);
       * let view = new Uint8Array(rawBin);
       * view[0] = 64; // Saves ASCII '@' to the binary file
       * await Neutralino.filesystem.writeBinaryFile({
       *   fileName: './myFile.bin',
       *   data: rawBin
       * });
       * ```
       */
      method: 'post',
      params: WriteBinaryFileOptions,
      result: void,
   }
   ['filesystem.readFile']: {
      /**
       * Reads text files.
       * 
       * ```js
       * Neutralino.filesystem.readFile({
       *   fileName: './myFile.txt'
       * }).then (response => console.log(`Content: ${response.data}`))
       * 
       * ```
       */
      method: 'post',
      params: ReadFileOptions,
      result: void,
   }
   ['filesystem.readBinaryFile']: {
      /**
       * Reads binary files.
       * 
       * ```js
       * let response = await Neutralino.filesystem.readBinaryFile({
       *   fileName: './myFile.bin'
       * });
       * let view = new Uint8Array(response.data);
       * console.log('Binary content: ', view);
       * ```
       */
      method: 'post',
      params: ReadBinaryFileOptions,
      result: void,
   }
   ['filesystem.removeFile']: {
      /**
       * Removes given file.
       * 
       * ```js
       * await Neutralino.filesystem.removeFile({
       *   fileName: './myFile.txt'
       * });
       * ```
       */
      method: 'post',
      params: RemoveFileOptions,
      result: void,
   }
   ['filesystem.readDirectory']: {
      /**
       * Reads a whole directory.
       * 
       * ```js
       * let response = await Neutralino.filesystem.readDirectory({
       *   path: NL_PATH
       * });
       * console.log('Content: ', response.entries);
       * ```
       */
      method: 'post',
      params: ReadDirectoryOptions,
      result: void,
   }
   ['filesystem.copyFile']: {
      /**
       * Copies a file to a new destination.
       * 
       * ```js
       * await Neutralino.filesystem.copyFile({
       *   source: './source.txt',
       *   destination: './destination.txt'
       * });
       * ```
       */
      method: 'post',
      params: CopyFileOptions,
      result: void,
   }
   ['filesystem.moveFile']: {
      /**
       * Moves a file to a new destination.
       * 
       * ```js
       * await Neutralino.filesystem.moveFile({
       *   source: './source.txt',
       *   destination: './destination.txt'
       * });
       * ```
       */
      method: 'post',
      params: MoveFileOptions,
      result: void,
   }
   ['filesystem.getStats']: {
      /**
       * Returns file statistics for the given path. If the given path doesn't exist or is inaccessible, an error is thrown. Therefore, you can use this method to check for the existance of a file or directory.
       * 
       * ```js
       * let response = await Neutralino.filesystem.getStats({
       *   path: './sampleVideo.mp4'
       * });
       * console.log('Stats:', response);
       * ```
       */
      method: 'post',
      params: GetStatsOptions,
      result: void,
   }
}

export type CreateDirectoryOptions = {
    /**
     * New directory path.
     */
    path: string;
};

export type CreateDirectoryResponse = CreateDirectorySuccess | CreateDirectoryError;

export type CreateDirectorySuccess = {

    success: boolean;

    message: string;
};

export type CreateDirectoryError = {

    error: string;
};

export type RemoveDirectoryOptions = {
    /**
     * Directory path.
     */
    path: string;
};

export type WriteFileOptions = {
    /**
     * File name.
     */
    path: string;
    /**
     * Content of the file in string format.
     */
    data: string;
};

export type WriteBinaryFileOptions = {
    /**
     * File name.
     */
    path: string;
    /**
     * Content of the binary file as an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
     */
    data: string;
};

export type ReadFileOptions = {
    /**
     * File name.
     */
    path: string;
};

export type ReadBinaryFileOptions = {
    /**
     * File name.
     */
    path: string;
};

export type RemoveFileOptions = {
    /**
     * File name.
     */
    path: string;
};

export type ReadDirectoryOptions = {
    /**
     * Directory path
     */
    path: string;
};

export type CopyFileOptions = {
    /**
     * Source file as a string.
     */
    source: string;
    /**
     * Destination file as a string.
     */
    destination: string;
};

export type MoveFileOptions = {
    /**
     * Source file as a string.
     */
    source: string;
    /**
     * Destination file as a string.
     */
    destination: string;
};

export type GetStatsOptions = {
    /**
     * File or directory path.
     */
    path: string;
};

};/*Filesystem*/

declare module Os {

export type Requests = {
   ['os.execCommand']: {
      /**
       * Executes a command and returns the output.
       * 
       * ```js
       * Neutralino.os.execCommand ('python --version')
       * ```
       */
      method: 'post',
      params: ExecCommandParams,
      result: ExecCommandResult,
   }
   ['os.getEnv']: {
      /**
       * Provides the value of a given environment variable.
       * 
       * ```js
       * Neutralino.os.getEnv('USER')
       *   .then (response => `USER = ${response.value}`);
       * ```
       */
      method: 'post',
      params: GetEnvarParams,
      result: GetEnvarResult,
   }
   ['os.showOpenDialog']: {
      /**
       * Shows the file open dialog.
       * 
       * ```js
       * let response = await Neutralino.os.showDialogOpen({
       *   title: 'Select a folder',
       *   isDirectoryMode: true
       * });
       * console.log(`You've selected: ${response.selectedEntry}`);
       * ```
       */
      method: 'post',
      params: DialogOpenParams,
      result: DialogOpenResult,
   }
   ['os.showSaveDialog']: {
      /**
       * Shows the file save dialog.
       * 
       * ```js
       * let response = await Neutralino.os.showSaveDialog({
       *   title: 'Save to a file'
       * });
       * console.log(`You've selected: ${response.selectedEntry}`);
       * ```
       */
      method: 'post',
      params: ShowSaveDialogParams,
      result: ShowSaveDialogResult,
   }
   ['os.showNotification']: {
      /**
       * Displays a notification message.
       * ```js
       * await Neutralino.os.showNotification({
       *   summary: 'Hello world',
       *   body: 'It works!. Have a nice day'
       * });
       * ```
       */
      method: 'post',
      params: ShowNotificationParams,
      result: ShowNotificationResult,
   }
   ['os.showMessageBox']: {
      /**
       * Displays a message box.
       */
      method: 'post',
      params: ShowMessageBoxParams,
      result: ShowMessageBoxResult,
   }
   ['os.setTray']: {
      /**
       * Creates/updates the tray icon and menu.
       * ```js
       * let tray = {
       *   icon: '/resources/icons/trayIcon.png',
       *   menuItems: [
       *     {id: "about", text: "About"},
       *     {text: "-"},
       *     {id: "quit", text: "Quit"}
       *   ]
       * };
       * await Neutralino.os.setTray(tray);
       * ```
       */
      method: 'post',
      params: SetTrayParams,
      result: SetTrayResult,
   }
   ['os.open']: {
      /**
       * Opens a URL with the default web browser.
       * 
       * :::tip
       * If your application is running in the default web browser, this method will open a new tab.
       * :::
       */
      method: 'post',
      params: OpenParams,
      result: OpenResult,
   }
   ['os.getPath']: {
      method: 'post',
      params: GetPathParams,
      result: GetPathResult,
   }
}

export type ExecCommandParams = {
    /**
     * The command that is to be executed.
     */
    command: string;

    shouldRunInBackground?: boolean;
};

export type ExecCommandResult = {

    success: boolean;
    /**
     * String data taken from the both standard output (STDOUT) and standard error (STDERR) streams of the command's process.
     */
    output: string;
};

export type GetEnvarParams = {
    /**
     * The name of the environment variable.
     */
    key: string;
};

export type GetEnvarResult = {

    success: boolean;
    /**
     * Value of the given environment variable.
     */
    returnValue: string;
};

export type DialogOpenParams = {
    /**
     * Title of the dialog.
     */
    title: string;
    /**
     * A boolean value to allow directories to be selected. The default value is `false`.
     */
    isDirectoryMode?: boolean;
    /**
     * An array of file extensions to filter the file list.  Eg: `filter: ['js', 'ts', '*']`.
     */
    filter?: Array <string>;
};

export type DialogOpenResult = {

    success: boolean;
    /**
     * The selected value (a folder or directory).
     */
    returnValue: string;
};

export type ShowSaveDialogParams = {
    /**
     * Title of the dialog.
     */
    title: string;
};

export type ShowSaveDialogResult = {

    success: boolean;
    /**
     * The selected value (a folder or directory).
     */
    returnValue: string;
};

export type ShowNotificationParams = {
    /**
     * Title of the dialog.
     */
    title: string;
    /**
     * Content of the notification.
     */
    content: string;
};

export type ShowNotificationResult = {

    success: boolean;
};

export type ShowMessageBoxParams = {
    /**
     * Title of the message box.
     */
    title: string;
    /**
     * Content of the message box.
     */
    content: string;
    /**
     * Message box type. Accepted values are `WARN`, `ERROR`, `INFO`, and `QUESTION`.
     */
    type: string;
};

export type ShowMessageBoxResult = {

    success: boolean;
};

export type SetTrayParams = {

    icon: string;

    menu: Array <TrayItem>;
};

export type TrayItem = {
    /**
     * Label of the menu item. This field is a mandatory field. Use `-` (hyphen) character for a menu separator.
     */
    text: string;
    /**
     * A unique identifier for each menu item.
     */
    id?: string;
    /**
     * A boolean flag to disable/enable a specific menu item.
     */
    isDisabled?: boolean;
    /**
     * A boolean flag to mark a specific menu item as selected.
     */
    isChecked?: boolean;
};

export type SetTrayResult = {

    success: boolean;
};

export type OpenParams = {
    /**
     * URL to be opened (required).
     */
    url: string;
};

export type OpenResult = {

    success: boolean;
};

export type GetPathParams = {

    name: string;
};

export type GetPathResult = GetPathSuccess | GetPathError;

export type GetPathSuccess = {

    success: boolean;

    returnValue: string;
};

export type GetPathError = {

    error: string;
};

};/*Os*/

declare module Storage {

export type Requests = {
   ['storage.setData']: {
      /**
       * Writes data into Neutralinojs shared storage. 
       * 
       * ```js
       * await Neutralino.storage.putData({
       *   bucket: 'userDetails',
       *   data: JSON.stringify({
       *     username: 'TestValue'
       *   })
       * });
       * ```
       */
      method: 'post',
      params: SetDataOptions,
      result: SetDataResponse,
   }
   ['storage.getData']: {
      /**
       * Reads and returns data for a given Neutralinojs shared storage key. 
       * ```js
       * let response = await Neutralino.storage.getData({
       *   bucket: 'userDetails'
       * });
       * console.log(`Data: ${response.data}`);
       * ```
       * 
       */
      method: 'post',
      params: GetDataOptions,
      result: GetDataResult,
   }
}

export type SetDataOptions = {
    /**
     * A key to indentify data.
     */
    key: string;
    /**
     * Data as a string. If this value is `null` or `undefined`, the specific data record will be erased from the disk.
     */
    data: string;
};

export type SetDataResponse = SetDataSuccess | SetDataError;

export type SetDataSuccess = {

    success: boolean;
};

export type SetDataError = {

    error: string;
};

export type GetDataOptions = {
    /**
     * The key of the storage data record.
     */
    key: string;
};

export type GetDataResult = GetDataSuccess | GetDataError;

export type GetDataSuccess = {

    success: boolean;

    returnValue: {
        /**
         * Data string of the storage record.
         */
        data: string;
    };
};

export type GetDataError = {

    error: string;
};

};/*Storage*/

declare module Window {

export type Requests = {
   ['window.setTitle']: {
      /**
       * Sets the title of the native window.
       * 
       * ```js
       * Neutralino.window.setTitle ('My window')
       * ```
       * 
       */
      method: 'post',
      params: SetTitleParams,
      result: SuccessResult,
   }
   ['window.setSize']: {
      /**
       * Resize the native window.
       * 
       * This feature is suitable to make custom window bars along with the [borderless mode](https://neutralino.js.org/docs/configuration/neutralino.config.json#modeswindowborderless-boolean).
       * 
       * This method always expects width and height couples.
       * For example, if you are setting `minWidth`, you should set `minHeight` too.
       * 
       * ```js
       * Neutralino.window.setSize({
       *     width: 500,
       *     height: 200,
       *     maxWidth: 600,
       *     maxHeight: 400
       * });
       * ```
       * 
       * ```js
       * Neutralino.window.setSize({
       *     resizable: false
       * });
       * ```
       * 
       */
      method: 'post',
      params: SetSizeParams,
      result: SuccessResult,
   }
   ['window.setIcon']: {
      /**
       * Sets an icon for the native window or Dock.
       * 
       * ```js
       * Neutralino.window.setIcon ('/resources/icons/appIcon.png');
       * ````
       */
      method: 'post',
      params: SetIconParams,
      result: SuccessResult,
   }
   ['window.focus']: {
      /**
       * Focuses the native window.
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.hide']: {
      /**
       * Hides the native window.
       * ```js
       * Neutralino.window.hide ().then (() => {
       *   window.setTimeout (() => Neutralino.window.show (), 1000)
       * })
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.isVisible']: {
      /**
       * Returns true if the native window is visible.
       * ```js
       * Neutralino.window.isVisible ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: IsVisibleResult,
   }
   ['window.show']: {
      /**
       * Shows the native window.
       * ```js
       * Neutralino.window.hide ().then (() => {
       *   window.setTimeout (() => Neutralino.window.show (), 1000)
       * })
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.minimize']: {
      /**
       * Minimizes the native window.
       * ```js
       * Neutralino.window.minimize ()
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.maximize']: {
      /**
       * Maximizes the native window.
       * ```js
       * Neutralino.window.maximize ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.isMaximized']: {
      /**
       * Returns true if the native window is maximized.
       * ```js
       * Neutralino.window.isMaximized ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: IsMaximizedResult,
   }
   ['window.unmaximize']: {
      /**
       * Restores the native window.
       * ```js
       * Neutralino.window.unmaximize ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.setFullScreen']: {
      /**
       * Enables the full screen mode.
       * ```js
       * Neutralino.window.setFullScreen ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.isFullScreen']: {
      /**
       * Returns true if the native window is in the full screen mode.
       * ```js
       * Neutralino.window.isFullScreen ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: IsFullScreenResult,
   }
   ['window.exitFullScreen']: {
      /**
       * Exits from the full screen mode.
       * ```js
       * Neutralino.window.exitFullScreen ();
       * ```
       * 
       */
      method: 'get',
      params: void,
      result: SuccessResult,
   }
   ['window.move']: {
      /**
       * Moves the native window into given coordinates.
       * 
       * Neutralinojs's cross-platform coordinate system starts from top-left corner of the screen.
       * In other words, `x=0,y=0` point refers to the top-left corner of the device's main screen.
       * 
       */
      method: 'post',
      params: MoveParams,
      result: SuccessResult,
   }
}

export type SetTitleParams = {
    /**
     * Title of the window as a string.
     */
    title: string;
};

export type SetSizeParams = {
    /**
     * Window width in pixels.
     */
    width: number;
    /**
     * Window height in pixels.
     */
    height: number;
    /**
     * Minimum width of the window in pixels.
     */
    minWidth: number;
    /**
     * Minimum height of the window in pixels.
     */
    minHeight: number;
    /**
     * Maximum width of the window in pixels.
     */
    maxWidth: number;
    /**
     * Maximum height of the window in pixels.
     */
    maxHeight: number;
    /**
     * A boolean value to make the window resizable or fixed.
     */
    resizable: boolean;
};

export type SetIconParams = {
    /**
     * Path of the icon. A `200x200` PNG image file works fine on all supported operating systems.
     */
    icon: string;
};

export type IsVisibleResult = {

    sucess: boolean;

    returnValue: boolean;
};

export type IsMaximizedResult = {

    sucess: boolean;

    returnValue: boolean;
};

export type IsFullScreenResult = {

    success: boolean;

    returnValue: boolean;
};

export type MoveParams = {
    /**
     * A integer value for the horizontal position.
     */
    x: number;
    /**
     * A integer value for the vertical position.
     */
    y: number;
};

export type SetDraggableRegionParams = {
    /**
     * A DOM element identifier as a string.
     */
    domId: string;
};

export type WindowParams = {
    /**
     * URL to be loaded. Eg: `/resources/aboutWindow.html`.
     */
    url: string;
    /**
     * Window title.
     */
    title?: string;
    /**
     * Window icon path.
     */
    icon?: string;
    /**
     * Sets full screen mode.
     */
    fullScreen?: string;
    /**
     * Activates the top-most mode.
     */
    alwaysOnTop?: string;
    /**
     * Activates developer tools and opens the web inspector window.
     */
    enableInspector?: string;
    /**
     * Makes the window borderless.
     */
    borderless?: string;
    /**
     * Launches the window maximized.
     */
    maximize?: string;
    /**
     * Hides the window.
     */
    hidden?: string;
    /**
     * Makes the window maximizable or not.
     */
    maximizable?: string;
    /**
     * Additional command-line arguments for the new window process.
     */
    processArgs?: string;
};

export type SuccessResult = {
    /**
     * Always true
     */
    success: boolean;
};

};/*Window*/

declare module 'models/neutralino.config.schema.yaml' {

export type Requests = {
}

export type Config = {
    /**
     * Unique string to identify your application. Eg: `js.neutralino.sample`
     */
    applicationId: string;
    /**
     * Mode of the application. Accepted values are `window`, `browser`, and `cloud`.
     */
    defaultMode: string;
    /**
     * The port of your application. If the value is `0`, Neutralinojs will use a random available port.
     */
    port: number;
    /**
     * The entrRLy U of the application. Neutralinojs will initially load this URL.
     * This property accepts both relative and absolute URLs.
     */
    url: string;
    /**
     * Enables or disables the background server (The static file server and native API).
     */
    enableHTTPServer: boolean;
    /**
     * Enables or disables the native API. For better security, this setting should be `false` if you are using a
     * remote URL as your web frontend.
     */
    enableNativeAPI: boolean;
    /**
     * An array of native methods needs to be blocked from the frontend of the application.
     */
    nativeBlockList: Array <string>;

    globalVariables: ConfigGlobals;

    modes: ConfigModes;

    cli: ConfigCli;
};
/**
 * A key-value-based JavaScript object of custom [global variables](../developer-environment/global-variables#custom-global-variables).
 */
export type ConfigGlobals = {
};

export type ConfigModes = {

    window: ConfigModeWindow;

    browser: ConfigModeBrowser;

    cloud: ConfigModeCloud;
};

export type ConfigModeWindow = {
    /**
     * Title of the native window.
     */
    title: string;
    /**
     * Width of the native window.
     */
    width?: number;
    /**
     * Height of the native window.
     */
    height?: number;
    /**
     * Maximum width of the native window.
     */
    maxWidth?: number;
    /**
     * Maximum height of the native window.
     */
    maxHeight?: number;
    /**
     * Minimum width of the native window.
     */
    minWidth?: number;
    /**
     * Minimum height of the native window.
     */
    minHeight?: number;
    /**
     * Activates the full-screen mode.
     */
    fullScreen?: boolean;
    /**
     * Activates the top-most mode.
     */
    alwaysOnTop?: boolean;
    /**
     * Application icon's file name. You can directly point to an image file in the
     * resources directory. We recommend you to choose a transparent PNG file.
     */
    icon?: string;
    /**
     * Automatically opens the developer tools window.
     */
    enableInspector?: boolean;
    /**
     * Activates the borderless mode.
     */
    borderless?: boolean;
    /**
     * Launches the application maximized.
     */
    maximize?: boolean;
    /**
     * Make the window invisible. This setting can be used to develop background services.
     */
    hidden?: boolean;
    /**
     * Make the window resizable or not. The default value is `true`.
     */
    resizable?: boolean;
};

export type ConfigModeBrowser = {
};

export type ConfigModeCloud = {
};

export type ConfigCli = {
    /**
     * Binary file name of your application. If it is `myapp`, all binaries should use
     * `myapp-<platform>` format.
     */
    binaryName: string;
    /**
     * Path of your application resources.
     */
    resourcesPath: string;
    /**
     * Filename of the Neutralinojs JavaScript library.
     */
    clientLibrary: string;
    /**
     * Neutralinojs server version. neu CLI adds this property when the project is scaffolded.
     */
    binaryVersion?: string;
    /**
     * Neutralinojs client version. neu CLI adds this property when the project is scaffolded.
     */
    clientVersion?: string;
};

export default Config;
};/*'models/neutralino.config.schema.yaml'*/