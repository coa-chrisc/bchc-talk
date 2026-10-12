import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // CI sets VITEST_TIMEOUT_SCALE=3 on the self-hosted r730-* runners, whose
    // cores are two to three times slower than a laptop.
    testTimeout: 5_000 * (Number(process.env.VITEST_TIMEOUT_SCALE) || 1),
    include: ["src/**/*.test.ts"],
  },
});
