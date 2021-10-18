---
title: Neutralino.app
---

<!-- NO DESCRIPTION -->

## exit

Terminates the running application.

```js
await Neutralino.app.exit();
```

```js
await Neutralino.app.exit(130);
```

### Parameters

**Optional**

* `code: number` An integer value for the process's exit code. The default value is always `0` (success).

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

## getConfig

Returns the current application configuration as a JSON object.

```js
Neutralino.app.getConfig ()
```

### Return

**Optional**

* `returnValue: dels/neutralino.config.schema.yaml` <!-- NO DESCRIPTION -->

## keepAlive

The keepAlive method is responsible for saving the Neutralinojs server instance from the automatic termination.
This method is called automatically from the client library for the browser mode.

```js
Neutralino.app.keepAlive();
```

### Return

**Optional**

* `success: boolean` <!-- NO DESCRIPTION -->

* `message: string` <!-- NO DESCRIPTION -->

## killProcess

Kills the application process.
If the application becomes unresponsive,
you can use this to terminate the process instantly.
It is recommended to use the `exit()` method to close your application properly.

```js
await Neutralino.app.killProcess();
```

### Return

**required**

* `success: boolean` <!-- NO DESCRIPTION -->
