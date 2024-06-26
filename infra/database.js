import { Client } from "pg";

const config = {
  database: {
    max_connections: "",
    opened_connections: "",
    version: "",
  },
};

function pgclient() {
  return new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    connectionTimeoutMillis: 18000,
  });
}

async function query(queryString) {
  const client = pgclient();

  try {
    await client.connect();
    const result = await client.query(queryString);
    return result;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function version() {
  const client = pgclient();

  try {
    await client.connect();
    const select = await client.query(`SHOW server_version;`);
    const version = parseFloat(select.rows[0].server_version);
    config.database.version = version;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function max_connections() {
  const client = pgclient();

  try {
    await client.connect();
    const select = await client.query(`SHOW max_connections;`);
    const max_connections = parseInt(select.rows[0].max_connections);

    config.database.max_connections = max_connections;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function opened_connections() {
  const client = pgclient();
  const databasename = process.env.POSTGRES_DB;

  try {
    await client.connect();
    const select = await client.query({
      text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
      values: [databasename],
    });
    const opened_connections = select["rows"][0]["count"];
    config.database.opened_connections = opened_connections;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

async function status() {
  await version();
  await max_connections();
  await opened_connections();
  return config;
}

export default {
  query: query,
  status: status,
};
