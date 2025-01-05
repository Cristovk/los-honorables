import { register } from "tsconfig-paths";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

register({
  baseUrl: resolve(__dirname, "./src"),
  paths: {
    "@/*": ["./*"],
  },
});
