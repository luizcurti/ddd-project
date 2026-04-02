import "reflect-metadata";
import app from "./app";
import DatabaseConfig from "../infrastructure/database/database-config";

const PORT = parseInt(process.env.PORT || "3000");

async function bootstrap() {
  const db = DatabaseConfig.getInstance();
  await db.connect();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
