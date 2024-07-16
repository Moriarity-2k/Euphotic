// Import the DishDashboard component from the DishDashboard directory
import { Toaster } from "react-hot-toast";
import DishDashboard from "./DishDashboard/DishDashboard";

function App() {
	return (
		<>
			<div className="font-mono">
				{/* Main heading for the application */}
				<h1 className="text-center p-8 max-sm:p-4 text-4xl font-bold uppercase tracking-widest">
					Dish Dashboard
				</h1>
				{/* Render the DishDashboard component */}
				<DishDashboard />
			</div>
			<Toaster
				toastOptions={{
					duration: 1000,
				}}
			/>
		</>
	);
}

// Export the App component as the default export
export default App;
