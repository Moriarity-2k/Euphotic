import { Schema, model } from "mongoose";
import { broadcastUpdate } from "../router/dishRouter";

const dishSchema = new Schema({
	dishId: String,
	dishName: String,
	imageUrl: String,
	isPublished: Boolean,
});

const Dish = model("Dish", dishSchema);

const startChangeStream = () => {
	const changeStream = Dish.watch();
	changeStream.on("change", (change) => {
		if (change.operationType === "update") {
			const updatedDish = {
				_id: change.documentKey._id,
				isPublished: change.updateDescription.updatedFields.isPublished,
			};

			broadcastUpdate({ type: "UPDATE_DISH", dish: updatedDish });
		}
	});
};

export { startChangeStream };

export default Dish;
