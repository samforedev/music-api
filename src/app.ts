/**
 * Initial app config
 */
import express from "express";
import cors from "cors";
import routes from "./routes";
import { BASE_URL } from "./models/constants";

const app = express();

/** Global middlewares */
app.use(express.json());
app.use(cors());

/** Routes */
app.use(BASE_URL, routes);

export default app;