import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.development" });
const databaseUrl = process.env.DATABASE_CONNECTION_STRING;

if (!databaseUrl) {
    throw new Error("❌ DATABASE_CONNECTION_STRING is not set in .env");
}


export default defineConfig({
    dialect: "postgresql", // ✅ Correct dialect for PostgreSQL
    schema: "./src/db/schema/*.ts", // ✅ Update this path if your schema files are elsewhere
    out: "./src/db/migrations",

    dbCredentials: {
        url: "postgres://tint:tint@localhost:5432/tint", // ✅ Ensure .env has DATABASE_URL
    },

    extensionsFilters: ["postgis"], // ✅ Ignore PostGIS tables if using it
    schemaFilter: ["public"], // ✅ Filter only the "public" schema
    tablesFilter: "*", // ✅ Apply changes to all tables

    introspect: {
        casing: "camel", // ✅ Convert column names to camelCase
    },

    migrations: {
        prefix: "timestamp", // ✅ Use timestamps for migration file naming
        table: "__drizzle_migrations__", // ✅ Keep default migration tracking table
        schema: "public", // ✅ PostgreSQL schema for migrations
    },

    entities: {
        roles: {
            provider: "supabase", // ✅ If using Supabase, adjust this
            exclude: ["admin"], // ✅ Exclude certain roles if needed
        },
    },

    breakpoints: true, // ✅ Useful for MySQL/SQLite but safe to leave enabled
    strict: true, // ✅ Enable strict mode to prevent accidental changes
    verbose: true, // ✅ Show all SQL statements for debugging
});
