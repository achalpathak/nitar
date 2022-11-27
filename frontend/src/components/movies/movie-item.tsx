import { BASE_URL } from "@api";
import { Paper } from "@mui/material";
import { IMovieItemProps } from "@types";
import { FC } from "react";

const MovieItem: FC<IMovieItemProps> = ({ item }) => {
	return (
		<div className='movie-item'>
			<a href='#'>
				<figure>
					<img
						key={item?.id}
						src={`${
							BASE_URL?.includes("localhost") ? BASE_URL : ""
						}${item.poster_small_vertical_image}`}
						alt={item?.name}
						loading='lazy'
					/>
					{/* <figcaption>
						<div>{item?.name}</div>
						<div>
							{item?.genres?.map((g) => (
								<span key={g?.id} className='genre'>
									{g?.name}
								</span>
							))}
						</div>
						<a href='#' className='view-details'>
							View Details
						</a>
					</figcaption> */}
				</figure>
			</a>
		</div>
	);
};

export default MovieItem;
