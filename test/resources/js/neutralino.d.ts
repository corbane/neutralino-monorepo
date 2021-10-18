// Type definitions for Neutralino 1.5.0
// Project: https://github.com/neutralinojs
// Definitions project: https://github.com/neutralinojs/neutralino.js

declare namespace Neutralino {

import { GetOptions } from "../http/neutralino.api";
declare namespace filesystem {
    function createDirectory(path: string): Promise<{
        success: boolean;
        message: string;
    } | {
        error: string;
    }>;
    function removeDirectory(path: string): Promise<never>;
    function writeFile(path: string, data: string): Promise<never>;
    function writeBinaryFile(path: string, data: ArrayBuffer): Promise<never>;
    function readFile(path: string): Promise<never>;
    // !!!!!!!!!
    // Don't match
    // !!!!!!!!!
    function readBinaryFile(path: string): Promise<any>;
    function removeFile(path: string): Promise<never>;
    function readDirectory(path: string): Promise<never>;
    function copyFile(source: string, destination: string): Promise<never>;
    function moveFile(source: string, destination: string): Promise<never>;
    function getStats(path: string): Promise<never>;
}
declare namespace os {
    interface ExecCommandOptions {
        shouldRunInBackground: boolean;
    }
    interface OpenDialogOptions {
        isDirectoryMode: boolean;
        filter: string[];
    }
    interface TrayOptions {
        icon?: string;
        menu?: TrayMenuItem[];
    }
    interface TrayMenuItem {
        id?: string;
        text: string;
        isDisabled?: boolean;
        isChecked?: boolean;
    }
    enum MessageBoxType {
        WARN = "WARN",
        ERROR = "ERROR",
        INFO = "INFO",
        QUESTION = "QUESTION"
    }
    function execCommand(command: string, options: ExecCommandOptions): Promise<{
        success: boolean;
        output: string;
    }>;
    function getEnv(key: string): Promise<{
        success: boolean;
        returnValue: string;
    }>;
    function showOpenDialog(title: string, options: OpenDialogOptions): Promise<{
        success: boolean;
        returnValue: string;
    }>;
    function showSaveDialog(title: string): Promise<{
        success: boolean;
        returnValue: string;
    }>;
    function showNotification(title: string, content: string): Promise<{
        success: boolean;
    }>;
    function showMessageBox(title: string, content: string, type: MessageBoxType): Promise<{
        success: boolean;
    }>;
    function setTray(options: TrayOptions): Promise<{
        success: boolean;
    }>;
    function open(url: string): Promise<{
        success: boolean;
    }>;
}
declare namespace computer {
    function getMemoryInfo(): Promise<{
        success: string;
        returnValue: {
            total: number;
            available: number;
        };
    }>;
}
declare namespace storage {
    function setData(key: string, data: string): Promise<{
        success: boolean;
    } | {
        error: string;
    }>;
    function getData(key: string): Promise<{
        success: boolean;
        returnValue: {
            data?: string;
        };
    } | {
        error: string;
    }>;
}
declare namespace debug {
    enum LoggerType {
        WARNING = "WARNING",
        ERROR = "ERROR",
        INFO = "INFO"
    }
    function log(message: string, type: LoggerType): Promise<{
        success: string;
        message: string;
    }>;
}
declare namespace app {
    interface OpenActionOptions {
        url: string;
    }
    interface RestartOptions {
        args: string;
    }
    function exit(code?: number): Promise<{
        success: boolean;
    }>;
    function killProcess(): Promise<{
        success: boolean;
    }>;
    function restartProcess(options: RestartOptions): Promise<any>;
    function keepAlive(): Promise<{
        success?: boolean;
        message?: string;
    }>;
    function getConfig(): Promise<{
        applicationId: string;
        defaultMode: "browser" | "window" | "cloud";
        port: number;
        url: string;
        enableHTTPServer: boolean;
        enableNativeAPI: boolean;
        nativeBlockList: string[];
        globalVariables: {
            [key: string]: unknown;
        };
        modes: {
            window: {
                title: string;
                width?: number;
                height?: number;
                maxWidth?: number;
                maxHeight?: number;
                minWidth?: number;
                minHeight?: number;
                fullScreen?: boolean;
                alwaysOnTop?: boolean;
                icon?: string;
                enableInspector?: boolean;
                borderless?: boolean;
                maximize?: boolean;
                hidden?: boolean;
                resizable?: boolean;
            };
            browser: {
                [key: string]: unknown;
            };
            cloud: {
                [key: string]: unknown;
            };
        };
        cli: {
            binaryName: string;
            resourcesPath: string;
            clientLibrary: string;
            binaryVersion?: string;
            clientVersion?: string;
        };
    }>;
}
declare namespace window {
    interface WindowOptions extends GetOptions<"window.setSize", "post"> {
        title?: string;
        icon?: string;
        fullScreen?: boolean;
        alwaysOnTop?: boolean;
        enableInspector?: boolean;
        borderless?: boolean;
        maximize?: boolean;
        hidden?: boolean;
        maximizable?: boolean;
        processArgs?: string;
    }
    function setTitle(title: string): Promise<{
        success: boolean;
    }>;
    function maximize(): Promise<{
        success: boolean;
    }>;
    function unmaximize(): Promise<{
        success: boolean;
    }>;
    function isMaximized(): Promise<boolean>;
    function minimize(): Promise<{
        success: boolean;
    }>;
    function setFullScreen(): Promise<{
        success: boolean;
    }>;
    function exitFullScreen(): Promise<{
        success: boolean;
    }>;
    function isFullScreen(): Promise<{
        success?: boolean;
        returnValue?: boolean;
    }>;
    function show(): Promise<{
        success: boolean;
    }>;
    function hide(): Promise<{
        success: boolean;
    }>;
    function isVisible(): Promise<boolean>;
    function focus(): Promise<{
        success: boolean;
    }>;
    function setIcon(icon: string): Promise<{
        success: boolean;
    }>;
    function move(x: number, y: number): Promise<{
        success: boolean;
    }>;
    function setDraggableRegion(domId: string): Promise<unknown>;
    function setSize(options: GetOptions<"window.setSize", "post">): Promise<{
        success: boolean;
    }>;
    function create(url: string, options: WindowOptions): Promise<unknown>;
}
declare namespace events {
    function on(event: string, handler: any): Promise<void>;
    function off(event: string, handler: any): Promise<void>;
    function dispatch(event: string, data: any): Promise<void>;
}
declare function init(): void;

}

/** Basic authentication token */
declare const NL_TOKEN: string;

/** Operating system name: Linux, Windows, or Darwin */
declare const NL_OS: "Linux"|"Windows"|"Darwin";

/** Application identifier */
declare const NL_APPID: string;

/** Application port */
declare const NL_PORT: number;

/** Mode of the application: window, browser, or cloud */
declare const NL_MODE: "window"|"browser"|"cloud";

/** Neutralinojs server version */
declare const NL_VERSION: string;

/** Neutralinojs client version */
declare const NL_CVERSION: "1.5.0";

/** Current working directory */
declare const NL_CWD: string;

/** Application path */
declare const NL_PATH: string;

/** Command-line arguments */
declare const NL_ARGS: string[];

/** Current process's identifier */
declare const NL_PID: number

