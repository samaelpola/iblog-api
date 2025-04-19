import "dotenv/config";
import { createApp } from "./src/server.js";
import { loadModels } from "./src/models/index.js";

(async () => {
  const app = createApp();
  await loadModels();
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}/`);
  });
})();
