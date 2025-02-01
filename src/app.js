import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev", { stream: process.stdout }));

app.use("/api", routes);

app.get("/", (req, res) => res.json({ status: "OK" }));
app.use(errorHandler);
app.use(notFound);

export default app;
