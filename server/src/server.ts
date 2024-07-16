// Import and configure dotenv to manage environment variables
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig({});

// Import necessary modules
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

// Handle uncaught exceptions to prevent application crash
process.on("uncaughtException", (err) => {
	console.error("Error uncaught exception:", err);
	process.exit(1);
});

// Import custom modules and functions
import dishRouter from "./router/dishRouter";
import mongoose from "mongoose";
import { startChangeStream } from "./models/dishModel";

// Initialize the Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Route for dish-related API requests
app.use("/api/dishes", dishRouter);

// Connect to the MongoDB database
const DB = process.env.DATABASE!;
mongoose
	.connect(DB)
	.then(() => {
		startChangeStream();
		console.log("DB Connected...");
	})
	.catch((reason: any) => {
		console.error("DB Connection Error:", reason);
	});

// Start the Express server on the specified port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Initialize the WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
	console.log("New client connected");

	// Log when a client disconnects
	ws.on("close", () => console.log("Client disconnected"));
});

// Export the WebSocket server for use in other modules
export { wss };
