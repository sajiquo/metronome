const fs = require("fs/promises");
const { resolve, basename } = require("path");

export default function CopyPlugin({ from }) {
  const _from = Array.isArray(from) ? from : [from];
  let _config;
  return {
    name: "copy-plugin",
    configResolved(config) {
      _config = config;
    },
    async closeBundle() {
      await Promise.allSettled(
        _from.map((f) => fs.cp(f, resolve(_config.build.outDir, basename(f))))
      );
    },
  };
}
