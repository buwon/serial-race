import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";
import { serialRace } from "../src/serialRace.ts";

function getNumberValue() {
  return 1000;
}

function getPromiseValue() {
  return Promise.resolve(2000);
}

function throwError() {
  throw new Error("Error");

  // deno-lint-ignore no-unreachable
  return 3000;
}

function getDelayValue(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(4000);
    }, 100);
  });
}

Deno.test("get first functoon", async () => {
  const value = await serialRace(100)
    .task(getNumberValue)
    .task(throwError)
    .task(getPromiseValue)
    .run();

  assertEquals(value, 1000);
});

Deno.test("get second function", async () => {
  const value = await serialRace(100)
    .task(throwError)
    .task(getNumberValue)
    .task(getPromiseValue)
    .run();

  assertEquals(value, 1000);
});

Deno.test("get default value", async () => {
  const value = await serialRace(100)
    .task(throwError)
    .run();

  assertEquals(value, 100);
});

Deno.test("get Promise value", async () => {
  const value = await serialRace(100)
    .task(throwError)
    .task(getPromiseValue)
    .run();

  assertEquals(value, 2000);
});

Deno.test("get Delay value", async () => {
  const value = await serialRace(100)
    .task(throwError)
    .task(getDelayValue)
    .task(getPromiseValue)
    .run();

  assertEquals(value, 4000);
});
