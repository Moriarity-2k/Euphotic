import { Router } from "express";
import { wss } from "../server";
import WebSocket from "ws";

import Dish from "../models/dishModel";

const router = Router();

router.get("/", async (req, res) => {
	const dishes = await Dish.find();
	res.json(dishes);
});

router.post("/:id/toggle", async (req, res) => {
	const dish = await Dish.findById(req.params.id);
	if (dish) {
		dish.isPublished = !dish.isPublished;
		await dish.save();
		broadcastUpdate({ type: "UPDATE_DISH", dish });
		res.json(dish);
	} else {
		res.status(404).json({
			message: "Dish not found",
			status: "success",
		});
	}
});

const broadcastUpdate = (update: { type: string; dish: any }) => {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(update));
		}
	});
};

export { broadcastUpdate };

export default router;
