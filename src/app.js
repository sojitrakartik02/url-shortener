import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";
import swaggerConfig from "../swaggerConfig.js";
const { swaggerUi, swaggerSpec } = swaggerConfig;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(helmet());
// app.use(morgan("dev", { stream: process.stdout }));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.json({ status: "OK" }));
app.use(errorHandler);
app.use(notFound);

export default app;
