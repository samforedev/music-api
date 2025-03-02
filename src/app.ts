/**
 * Initial app config
 */
import express from "express";
import cors from "cors";

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());

export default app;