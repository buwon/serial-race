import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

const npm = "./.npm";

await emptyDir(`${npm}`);

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: `${npm}`,
  shims: {
    deno: true,
  },
  package: {
    name: "serial-race",
    version: "1.0.0",
    description: "serial run task and return first result",
    author: "buwon",
    license: "MIT",
    main: "mod.js",
    repository: {
      type: "git",
      url: "git+https://github.com/buwon/serial-race.git",
    },
    homepage: "https://github.com/buwon/serial-race",
    bugs: {
      url: "https://github.com/buwon/serial-race/issues",
    },
  },
});

Deno.copyFileSync("LICENSE", `${npm}/LICENSE`);
Deno.copyFileSync("README.md", `${npm}/README.md`);
