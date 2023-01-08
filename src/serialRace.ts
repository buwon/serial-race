interface SyncHandlerType<output> {
  (): output;
}

interface AsyncHandlerType<output> {
  (): Promise<output>;
}

type HandlerType<output> = SyncHandlerType<output> | AsyncHandlerType<output>;

class TaskRace<output> {
  #tasks: HandlerType<output>[] = [];
  #defaultValue: output | null = null;

  constructor(defaultValue?: output) {
    if (defaultValue) {
      this.#defaultValue = defaultValue;
    }
  }

  task(handle: HandlerType<output>) {
    this.#tasks.push(handle);

    return this;
  }

  async run(): Promise<output | null> {
    for await (const task of this.#tasks) {
      const value: output | null = await Promise.resolve().then(task).catch(
        (): null => null,
      );
      if (value) {
        return value;
      }
    }

    return this.#defaultValue;
  }
}

// deno-lint-ignore no-explicit-any
export function serialRace<output = any>(
  defaultValue?: output,
): TaskRace<output> {
  return new TaskRace<output>(defaultValue);
}
