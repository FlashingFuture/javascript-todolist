import "module-alias/register";
import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();
const app = express();

app.use(express.json());
app.use(errorHandler);

export default app;
