import "reflect-metadata";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import "./shared/container";
import cors from "cors";
import { config } from "dotenv";
import { router } from "./routes";
import { AppError } from "./shared/errors/AppError";
import { InitializeConnection } from "./database";

config();

const app = express();
InitializeConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export { app };
