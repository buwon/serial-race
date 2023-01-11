# serial-race

- Perform tasks in order. Returns the first successful result.

```ts
// as-is
function doProcess(key: string) {
  // ...

  let value = null;

  value = await getFromMemory(key);

  if (!value) {
    value = await getFromStore(key).catch(() => null);
  }

  if (!value) {
    value = await getFromDatabase(key);
  }

  const result = {
    key,
    value,
  };

  // ...
}

// to-be
function doProcess(key: string) {
  // ...

  const value = await serialRace(null)
    .task(() => getFromMemory(key))
    .task(() => getFromStore(key))
    .task(() => getFromDatabase(key))
    .run();

  const result = {
    key,
    value,
  };

  // ...
}
```

## Features

- It will break as soon as there are results. No unnecessary processing.

## Installation

Via npm

```shell
npm install serial-race
```

Via deno

```ts
import { serialRace } from 'https://deno.land/x/serial_race/mod.ts';
```
