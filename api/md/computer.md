---
title: Neutralino.computer
---

<!-- NO DESCRIPTION -->

## getMemoryInfo

Provides physical memory details (in megabytes).

```js
Neutralino.computer.getMemoryInfo()
  .then (ramInfo => `Your ram size: ${Math.round(ramInfo.total / 1000000)}GB`)
```

### Parameters

**required**

* `success: boolean` <!-- NO DESCRIPTION -->

* `returnValue: GetMemoryInfoResult` <!-- NO DESCRIPTION -->

#### GetMemoryInfoResult

<!-- NO DESCRIPTION -->

**required**

* `total: number` Total physical memory.

* `available: number` Available physical memory.
