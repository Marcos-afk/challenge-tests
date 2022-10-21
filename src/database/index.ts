import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
config();

export const AppSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  migrations: ["./src/database/migrations/*.ts"],
  entities: ["./src/modules/**/entities/*.ts"],
});

export const InitializeConnection = () => {
  const host =
    process.env.NODE_ENV === "test" ? "localhost" : process.env.POSTGRES_HOST;
  const database =
    process.env.NODE_ENV === "test" ? "fin_api_test" : process.env.POSTGRES_DB;
  return AppSource.setOptions({ host, database }).initialize();
};
