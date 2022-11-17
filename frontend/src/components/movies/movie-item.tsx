import { IMovieItemProps } from "@types";
import { FC } from "react";

const MovieItem: FC<IMovieItemProps> = ({ item }) => {
	return (
		<div key={item.title} className='movie-item'>
			<img
				src={item.image}
				alt={item.title}
				loading='lazy'
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					borderRadius: 10,
				}}
			/>
		</div>
	);
};

export default MovieItem;
