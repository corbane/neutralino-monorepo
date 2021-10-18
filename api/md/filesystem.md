---
title: Neutralino.filesystem
---

<!-- NO DESCRIPTION -->

## createDirectory

Creates a new directory.

```js
Neutralino.filesystem.createDirectory ({
  path: './newDirectory',
});
```

### Parameters

**Optional**

* `path: string` New directory path.

### Return

One of **`CreateDirectorySuccess`** or **`CreateDirectoryError`**

### CreateDirectorySuccess

<!-- NO DESCRIPTION -->

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `message: string` <!-- NO DESCRIPTION -->

### CreateDirectoryError

<!-- NO DESCRIPTION -->

**required**

* `error: string` <!-- NO DESCRIPTION -->

## removeDirectory

Removes given directories.

```js
await Neutralino.filesystem.removeDirectory({
  path: './tmpDirectory',
});
```

### Parameters

**required**

* `path: string` Directory path.

## writeFile

Writes new text files with data.

```js
await Neutralino.filesystem.writeFile({
  fileName: './myFile.txt',
  data: 'Sample content'
});
```

### Parameters

**required**

* `path: string` File name.

* `data: string` Content of the file in string format.

## writeBinaryFile

Writes new binary files with data.

```js
let rawBin = new ArrayBuffer(1);
let view = new Uint8Array(rawBin);
view[0] = 64; // Saves ASCII '@' to the binary file
await Neutralino.filesystem.writeBinaryFile({
  fileName: './myFile.bin',
  data: rawBin
});
```

### Parameters

**Optional**

* `path: string` File name.

* `data: string` Content of the binary file as an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/ArrayBuffer).

## readFile

Reads text files.

```js
Neutralino.filesystem.readFile({
  fileName: './myFile.txt'
}).then (response => console.log(`Content: ${response.data}`))

```

### Parameters

**Optional**

* `path: string` File name.

## readBinaryFile

Reads binary files.

```js
let response = await Neutralino.filesystem.readBinaryFile({
  fileName: './myFile.bin'
});
let view = new Uint8Array(response.data);
console.log('Binary content: ', view);
```

### Parameters

**Optional**

* `path: string` File name.

## removeFile

Removes given file.

```js
await Neutralino.filesystem.removeFile({
  fileName: './myFile.txt'
});
```

### Parameters

**Optional**

* `path: string` File name.

## readDirectory

Reads a whole directory.

```js
let response = await Neutralino.filesystem.readDirectory({
  path: NL_PATH
});
console.log('Content: ', response.entries);
```

### Parameters

**Optional**

* `path: string` Directory path

## copyFile

Copies a file to a new destination.

```js
await Neutralino.filesystem.copyFile({
  source: './source.txt',
  destination: './destination.txt'
});
```

### Parameters

**Optional**

* `source: string` Source file as a string.

* `destination: string` Destination file as a string.

## moveFile

Moves a file to a new destination.

```js
await Neutralino.filesystem.moveFile({
  source: './source.txt',
  destination: './destination.txt'
});
```

### Parameters

**Optional**

* `source: string` Source file as a string.

* `destination: string` Destination file as a string.

## getStats

Returns file statistics for the given path. If the given path doesn't exist or is inaccessible, an error is thrown. Therefore, you can use this method to check for the existance of a file or directory.

```js
let response = await Neutralino.filesystem.getStats({
  path: './sampleVideo.mp4'
});
console.log('Stats:', response);
```

### Parameters

**Optional**

* `path: string` File or directory path.
