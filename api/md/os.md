---
title: Neutralino.os
---

<!-- NO DESCRIPTION -->

## execCommand

Executes a command and returns the output.

```js
Neutralino.os.execCommand ('python --version')
```

### Parameters

**required**

* `command: string` The command that is to be executed.

**Optional**

* `shouldRunInBackground: boolean` <!-- NO DESCRIPTION -->

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `output: string` String data taken from the both standard output (STDOUT) and standard error (STDERR) streams of the command's process.

## getEnv

Provides the value of a given environment variable.

```js
Neutralino.os.getEnv('USER')
  .then (response => `USER = ${response.value}`);
```

### Parameters

**required**

* `key: string` The name of the environment variable.

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: string` Value of the given environment variable.

## showOpenDialog

Shows the file open dialog.

```js
let response = await Neutralino.os.showDialogOpen({
  title: 'Select a folder',
  isDirectoryMode: true
});
console.log(`You've selected: ${response.selectedEntry}`);
```

### Parameters

**required**

* `title: string` Title of the dialog.

**Optional**

* `isDirectoryMode: boolean` A boolean value to allow directories to be selected. The default value is `false`.

* `filter: string[]` An array of file extensions to filter the file list.  Eg: `filter: ['js', 'ts', '*']`.

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: string` The selected value (a folder or directory).

## showSaveDialog

Shows the file save dialog.

```js
let response = await Neutralino.os.showSaveDialog({
  title: 'Save to a file'
});
console.log(`You've selected: ${response.selectedEntry}`);
```

### Parameters

**required**

* `title: string` Title of the dialog.

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: string` The selected value (a folder or directory).

## showNotification

Displays a notification message.

```js
await Neutralino.os.showNotification({
  summary: 'Hello world',
  body: 'It works!. Have a nice day'
});
```

### Parameters

**required**

* `title: string` Title of the dialog.

* `content: string` Content of the notification.

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

## showMessageBox

Displays a message box.

### Parameters

**Optional**

* `title: string` Title of the message box.

* `content: string` Content of the message box.

* `type: string` Message box type. Accepted values are `WARN`, `ERROR`, `INFO`, and `QUESTION`.

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

## setTray

Creates/updates the tray icon and menu.

```js
let tray = {
  icon: '/resources/icons/trayIcon.png',
  menuItems: [
    {id: "about", text: "About"},
    {text: "-"},
    {id: "quit", text: "Quit"}
  ]
};
await Neutralino.os.setTray(tray);
```

### Parameters

**Optional**

* `icon: string` <!-- NO DESCRIPTION -->

* `menu: TrayItem[]` <!-- NO DESCRIPTION -->

#### TrayItem

<!-- NO DESCRIPTION -->

**required**

* `text: string` Label of the menu item. This field is a mandatory field. Use `-` (hyphen) character for a menu separator.

**Optional**

* `id: string` A unique identifier for each menu item.

* `isDisabled: boolean` A boolean flag to disable/enable a specific menu item.

* `isChecked: boolean` A boolean flag to mark a specific menu item as selected.

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

## open

Opens a URL with the default web browser.

:::tip
If your application is running in the default web browser, this method will open a new tab.
:::

### Parameters

**required**

* `url: string` URL to be opened (required).

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

## getPath

<!-- NO DESCRIPTION -->

### Parameters

**required**

* `name: string` <!-- NO DESCRIPTION -->

### Return

One of **`GetPathSuccess`** or **`GetPathError`**

### GetPathSuccess

<!-- NO DESCRIPTION -->

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: string` <!-- NO DESCRIPTION -->

### GetPathError

<!-- NO DESCRIPTION -->

**required**

* `error: string` <!-- NO DESCRIPTION -->
