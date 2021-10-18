---
title: Neutralino.window
---

<!-- NO DESCRIPTION -->

## setTitle

Sets the title of the native window.

```js
Neutralino.window.setTitle ('My window')
```

### Parameters

**required**

* `title: string` Title of the window as a string.

### Return

**required**

* `success: boolean` Always true

## setSize

Resize the native window.

This feature is suitable to make custom window bars along with the [borderless mode](https://neutralino.js.org/docs/configuration/neutralino.config.json#modeswindowborderless-boolean).

This method always expects width and height couples.
For example, if you are setting `minWidth`, you should set `minHeight` too.

```js
Neutralino.window.setSize({
    width: 500,
    height: 200,
    maxWidth: 600,
    maxHeight: 400
});
```

```js
Neutralino.window.setSize({
    resizable: false
});
```

### Parameters

**Optional**

* `width: number` Window width in pixels.

* `height: number` Window height in pixels.

* `minWidth: number` Minimum width of the window in pixels.

* `minHeight: number` Minimum height of the window in pixels.

* `maxWidth: number` Maximum width of the window in pixels.

* `maxHeight: number` Maximum height of the window in pixels.

* `resizable: boolean` A boolean value to make the window resizable or fixed.

### Return

**required**

* `success: boolean` Always true

## setIcon

Sets an icon for the native window or Dock.

```js
Neutralino.window.setIcon ('/resources/icons/appIcon.png');
```

### Parameters

**required**

* `icon: string` Path of the icon. A `200x200` PNG image file works fine on all supported operating systems.

### Return

**required**

* `success: boolean` Always true

## focus

Focuses the native window.

### Return

**required**

* `success: boolean` Always true

## hide

Hides the native window.

```js
Neutralino.window.hide ().then (() => {
  window.setTimeout (() => Neutralino.window.show (), 1000)
})
```

### Return

**required**

* `success: boolean` Always true

## isVisible

Returns true if the native window is visible.

```js
Neutralino.window.isVisible ();
```

### Return

**required**

* `sucess: boolean` <!-- NO DESCRIPTION -->

* `returnValue: boolean` <!-- NO DESCRIPTION -->

## show

Shows the native window.

```js
Neutralino.window.hide ().then (() => {
  window.setTimeout (() => Neutralino.window.show (), 1000)
})
```

### Return

**required**

* `success: boolean` Always true

## minimize

Minimizes the native window.

```js
Neutralino.window.minimize ()
```

### Return

**required**

* `success: boolean` Always true

## maximize

Maximizes the native window.

```js
Neutralino.window.maximize ();
```

### Return

**required**

* `success: boolean` Always true

## isMaximized

Returns true if the native window is maximized.

```js
Neutralino.window.isMaximized ();
```

### Return

**required**

* `sucess: boolean` <!-- NO DESCRIPTION -->

* `returnValue: boolean` <!-- NO DESCRIPTION -->

## unmaximize

Restores the native window.

```js
Neutralino.window.unmaximize ();
```

### Return

**required**

* `success: boolean` Always true

## setFullScreen

Enables the full screen mode.

```js
Neutralino.window.setFullScreen ();
```

### Return

**required**

* `success: boolean` Always true

## isFullScreen

Returns true if the native window is in the full screen mode.

```js
Neutralino.window.isFullScreen ();
```

### Return

**Optional**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: boolean` <!-- NO DESCRIPTION -->

## exitFullScreen

Exits from the full screen mode.

```js
Neutralino.window.exitFullScreen ();
```

### Return

**required**

* `success: boolean` Always true

## move

Moves the native window into given coordinates.

Neutralinojs's cross-platform coordinate system starts from top-left corner of the screen.
In other words, `x=0,y=0` point refers to the top-left corner of the device's main screen.

### Parameters

**required**

* `x: number` A integer value for the horizontal position.

* `y: number` A integer value for the vertical position.

### Return

**required**

* `success: boolean` Always true

## setDraggableRegion

Converts a given DOM element to a draggable region. The user will be able to drag the native window by dragging the given DOM element. This feature is suitable to make custom window bars along with the [borderless mode](../configuration/neutralino.config.json#modeswindowborderless-boolean).

<div>DRAG ME</div>

```js
await Neutralino.window.setDraggableRegion('myCustomTitleBar');
```

### Parameters

**required**

* `domId: string` A DOM element identifier as a string.

## create

Creates a native window. You can use this method to create new window for your multi-window Neutralinojs app.
Neutralinojs spawns a new process for each native window. Therefore, the new window works as an isolated app once the window is created.

However, you can build communication streams between windows with the [storage API](./storage.md).

```js
Neutralino.window.create('/resources/aboutWindow.html', {
    icon: '/resources/icons/aboutIcon.png',
    enableInspector: false,
    width: 500,
    height: 300,
    maximizable: false,
    processArgs: '--window-id=W_ABOUT'
});
```

### Parameters

**required**

* `url: string` URL to be loaded. Eg: `/resources/aboutWindow.html`.

**Optional**

* `title: string` Window title.

* `icon: string` Window icon path.

* `fullScreen: string` Sets full screen mode.

* `alwaysOnTop: string` Activates the top-most mode.

* `enableInspector: string` Activates developer tools and opens the web inspector window.

* `borderless: string` Makes the window borderless.

* `maximize: string` Launches the window maximized.

* `hidden: string` Hides the window.

* `maximizable: string` Makes the window maximizable or not.

* `processArgs: string` Additional command-line arguments for the new window process.
