---
title: Neutralino.storage
---

<!-- NO DESCRIPTION -->

## setData

Writes data into Neutralinojs shared storage.

```js
await Neutralino.storage.putData({
  bucket: 'userDetails',
  data: JSON.stringify({
    username: 'TestValue'
  })
});
```

### Parameters

**Optional**

* `key: string` A key to indentify data.

* `data: string` Data as a string. If this value is `null` or `undefined`, the specific data record will be erased from the disk.

### Return

One of **`SetDataSuccess`** or **`SetDataError`**

### SetDataSuccess

<!-- NO DESCRIPTION -->

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

### SetDataError

<!-- NO DESCRIPTION -->

**required**

* `error: string` <!-- NO DESCRIPTION -->

## getData

Reads and returns data for a given Neutralinojs shared storage key.

```js
let response = await Neutralino.storage.getData({
  bucket: 'userDetails'
});
console.log(`Data: ${response.data}`);
```

### Parameters

**Optional**

* `key: string` The key of the storage data record.

### Return

One of **`GetDataSuccess`** or **`GetDataError`**

### GetDataSuccess

<!-- NO DESCRIPTION -->

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: object` <!-- NO DESCRIPTION -->

### GetDataError

<!-- NO DESCRIPTION -->

**required**

* `error: string` <!-- NO DESCRIPTION -->
