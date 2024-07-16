// Import necessary hooks and modules
import { useState, useEffect } from "react";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { base_host, base_url } from "../utils/constants";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";

// Creating a WebSocket client
const client = new W3CWebSocket(`${base_host}`);

// Defining the interface for a dish object
interface IDish {
	_id: string;
	dishId: string;
	dishName: string;
	imageUrl: string;
	isPublished: boolean;
}

// Define the DishDashboard component
function DishDashboard() {
	// Initialize state to hold dishes
	const [dishes, setDishes] = useState<IDish[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [btnLoading, setBtnLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Fetch dishes and set up WebSocket on component mount
	useEffect(() => {
		fetchDishes();

		// Handle incoming WebSocket messages
		client.onmessage = (message) => {
			const data = JSON.parse(message.data.toString());
			if (data.type === "UPDATE_DISH") {
				updateDishInState(data.dish);
			}
		};
	}, []);

	// Function to fetch dishes from the API
	const fetchDishes = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${base_url}/api/dishes`);
			setDishes(response.data);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Success 🎉🎉</div>
					<div className="">
						The dishes have been fetched successfully
					</div>
				</div>
			);
		} catch (err) {
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">
						Failed to load the dishes ! please try again{" "}
					</div>
				</div>
			);
		} finally {
			setLoading(false);
		}
	};

	// Function to update the state with the updated dish
	const updateDishInState = (updatedDish: IDish) => {
		setDishes((prevDishes) =>
			prevDishes.map((dish) =>
				dish._id === updatedDish._id
					? { ...dish, isPublished: updatedDish.isPublished }
					: dish
			)
		);
	};

	// Function to toggle the published state of a dish
	const togglePublished = async (id: string) => {
		setBtnLoading(id);
		try {
			await axios.post(`${base_url}/api/dishes/${id}/toggle`);
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate">
					<div className="font-mono text-green-600">Success 🎉🎉</div>
				</div>
			);
		} catch (err) {
			setError("Failed to toggle dish publication status");
			toast(
				<div className="josefin-slab-bold lowercase py-4 px-4 rounded-sm space-y-1 border-bottom-animate-error">
					<div className="font-mono text-red-600">Error</div>
					<div className="">
						Failed to toggle dish publication status
					</div>
				</div>
			);
		} finally {
			setBtnLoading(null);
		}
	};

	if (loading) {
		return (
			<Loader>
				<p>Loading...</p>
			</Loader>
		);
	}

	if (error) {
		return (
			<Loader>
				<p className="text-red-500">{error}</p>
				<button
					onClick={fetchDishes}
					className="bg-blue-500 text-white border-none py-2 px-5 rounded cursor-pointer mt-4"
				>
					Retry
				</button>
			</Loader>
		);
	}

	return (
		// Main container div with padding and margin
		<div className="m-5 max-sm:m-2.5 p-5 max-sm:p-2.5">
			{/* Container for the list of dishes */}
			<div className="flex justify-center flex-wrap">
				{dishes.map((dish) => (
					// Individual dish card
					<div
						key={dish._id}
						className="m-2.5 p-5 bg-white rounded-lg shadow-lg w-60"
					>
						{/* Dish name */}
						<h2 className="text-center mb-2.5 text-xl font-semibold">
							{dish.dishName}
						</h2>
						{/* Dish image */}
						<div className="w-full h-48 overflow-hidden rounded-lg mb-2.5">
							<img
								src={dish.imageUrl}
								alt={dish.dishName}
								className="w-full h-full object-cover rounded-lg"
							/>
						</div>
						{/* Publication status */}
						<p
							className={`text-center mb-2.5 ${
								dish.isPublished
									? "text-green-500"
									: "text-red-500"
							}`}
						>
							{dish.isPublished ? "Published" : "Unpublished"}
						</p>
						{/* Toggle published button */}
						<button
							onClick={() => togglePublished(dish._id)}
							className="bg-blue-500 text-white border-none py-2 px-5 rounded cursor-pointer w-full box-border disabled:bg-slate-500"
							disabled={btnLoading === dish._id}
						>
							{btnLoading === dish._id
								? "loading"
								: "Toggle Published"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

// Export the DishDashboard component as the default export
export default DishDashboard;
