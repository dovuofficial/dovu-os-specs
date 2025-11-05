import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

// This should be configurable (.test.env)
const envPath = path.resolve(process.cwd(), "../.env");

export function ensureEnvKey(key: string, value: string, { force = false } = {}) {

    const currentValue = process.env[key];

    // 1. If it already exists in memory and not forcing, do nothing.
    if (currentValue && !force) {
        console.log(`✅ ${key} already set in process.env (${currentValue}), skipping update.`);
        return currentValue;
    }

    // 2. Load .env file
    let content = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";

    // 3. Update or append the key
    const pattern = new RegExp(`^${key}=.*$`, "m");

    if (pattern.test(content)) {
        content = content.replace(pattern, `${key}=${value}`);
    } else {
        content += `\n${key}=${value}`;
    }

    // 4. Write back
    writeFileSync(envPath, content.trim() + "\n");

    // 5. Update process.env live
    process.env[key] = value;

    console.log(`📝 Updated ${key}=${value} in ${envPath}`);
    return value;
}
