import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {

  if(request.method === "POST"){
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra","migrations"),
      dryRun: false,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations"
    });
  
    return response.status(200).json(migrations);
  }
  return response.status(405).end();
}
