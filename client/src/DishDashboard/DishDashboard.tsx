import { useState, useEffect } from "react";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { base_host, base_url } from "../utils/constants";

const client = new W3CWebSocket(`ws://${base_host}`);

interface IDish {
	_id: string;
	dishId: string;
	dishName: string;
	imageUrl: string;
	isPublished: boolean;
}

function DishDashboard() {
	const [dishes, setDishes] = useState<IDish[]>([]);

	useEffect(() => {
		fetchDishes();

		client.onmessage = (message) => {
			const data = JSON.parse(message.data.toString());
			if (data.type === "UPDATE_DISH") {
				updateDishInState(data.dish);
			}
		};

		// return () => {
		// 	client.close();
		// };
	}, []);

	const fetchDishes = async () => {
		const response = await axios.get(`${base_url}/api/dishes`);
		setDishes(response.data);
	};

	const updateDishInState = (updatedDish: IDish) => {
		setDishes((prevDishes) =>
			prevDishes.map((dish) =>
				dish._id === updatedDish._id
					? { ...dish, isPublished: updatedDish.isPublished }
					: dish
			)
		);
	};

	const togglePublished = async (id: string) => {
		await axios.post(`${base_url}/api/dishes/${id}/toggle`);
	};

	return (
		<div className="m-5 max-sm:m-2.5 p-5 max-sm:p-2.5">
			<div className="flex justify-center flex-wrap">
				{dishes.map((dish) => (
					<div
						key={dish._id}
						className="m-2.5 p-5 bg-white rounded-lg shadow-lg w-60"
					>
						<h2 className="text-center mb-2.5 text-xl font-semibold">
							{dish.dishName}
						</h2>
						<div className="w-full h-48 overflow-hidden rounded-lg mb-2.5">
							<img
								src={dish.imageUrl}
								alt={dish.dishName}
								className="w-full h-full object-cover rounded-lg"
							/>
						</div>
						<p
							className={`text-center mb-2.5 ${
								dish.isPublished
									? "text-green-500"
									: "text-red-500"
							}`}
						>
							{dish.isPublished ? "Published" : "Unpublished"}
						</p>
						<button
							onClick={() => togglePublished(dish._id)}
							className="bg-blue-500 text-white border-none py-2 px-5 rounded cursor-pointer w-full box-border"
						>
							Toggle Published
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default DishDashboard;
