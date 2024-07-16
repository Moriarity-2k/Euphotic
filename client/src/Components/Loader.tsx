import { ReactNode } from "react";

export default function Loader({ children }: { children: ReactNode }) {
	return (
		<div className="flex justify-center items-center h-[50vh]">
			{children}
		</div>
	);
}
