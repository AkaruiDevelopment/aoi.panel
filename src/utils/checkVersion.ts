import { fetch } from "undici";
import { printWarn } from "./printers";

export default async function checkVersion() {
    const response = await fetch(
        "https://registry.npmjs.com/@akarui/aoi.panel",
    );
    if (!response.ok) return console.log("Failed to check for updates.");

    const data = (await response.json()) as {
        "dist-tags": {
            latest: string;
        };
    };

    const { default: packageJson } =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await import("../../../package.json", {
            assert: {
                type: "json",
            },
        });

    const latestVersion = data["dist-tags"].latest;
    const currentVersion = packageJson.version;

    if (currentVersion !== latestVersion) {
        printWarn(
            `Current Version: ${currentVersion} | Latest Version: ${latestVersion}`,
        );
    }
}
