import { readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { sql } from "drizzle-orm";

import { db } from "../drizzle/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Applies every .sql file in this directory, in lexicographic order.
 * Each file must be idempotent so the script can be re-run safely.
 */
async function applyScripts(): Promise<void> {
  const scriptsDir = __dirname;
  const files = readdirSync(scriptsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No SQL scripts found.");
    return;
  }

  for (const file of files) {
    const filePath = join(scriptsDir, file);
    const sqlContent = readFileSync(filePath, "utf8");
    console.log(`Applying script: ${file}`);
    try {
      await db.execute(sql.raw(sqlContent));
      console.log(`✓ ${file} applied successfully.`);
    } catch (error) {
      console.error(`✗ Failed to apply ${file}:`, error);
      process.exit(1);
    }
  }
}

applyScripts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });
