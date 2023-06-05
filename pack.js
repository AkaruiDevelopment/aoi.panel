// eslint-disable-next-line @typescript-eslint/no-var-requires
const { writeFileSync } = require("fs");

writeFileSync(
    "./dist/cjs/package.json",
    `{
    "type" : "commonjs"
}`,
);
writeFileSync(
    "./dist/esm/package.json",
    `{
    "type" : "module"
}`,
);
