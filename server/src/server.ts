import { config as dotEnvConfig } from "dotenv";
dotEnvConfig({});

import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

process.on("uncaughtException", (err) => {
	console.log("Error uncaught exception : ", err);
	process.exit(1);
});

import dishRouter from "./router/dishRouter";
import mongoose from "mongoose";
import { startChangeStream } from "./models/dishModel";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/dishes", dishRouter);

const DB = process.env.DATABASE!;
mongoose
	.connect(DB)
	.then(() => {
		startChangeStream();
		console.log("DB Connected ...");
	})
	.catch((reason: any) => {
		console.log("DB ERROR : ", reason);
	});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
	console.log("New client connected");
	ws.on("close", () => console.log("Client disconnected"));
});

export { wss };
