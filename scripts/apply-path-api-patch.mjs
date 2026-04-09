import { readFileSync, writeFileSync } from "node:fs";

const target = "web/src/lib/api/api-url.ts";
const source = readFileSync(target, "utf8");

const replacement = `import env from "$lib/env";
import { get } from "svelte/store";
import settings from "$lib/state/settings";

const normalizeApiURL = (value: string) => {
    const url = new URL(value);
    const pathname = url.pathname.replace(/\\/+$/, "");
    return \`\${url.origin}\${pathname}\`;
}

export const currentApiURL = () => {
    const processingSettings = get(settings).processing;
    const customInstanceURL = processingSettings.customInstanceURL;

    if (processingSettings.enableCustomInstances && customInstanceURL.length > 0) {
        return normalizeApiURL(customInstanceURL);
    }

    return normalizeApiURL(env.DEFAULT_API!);
}
`;

if (source === replacement) {
    process.exit(0);
}

writeFileSync(target, replacement);
