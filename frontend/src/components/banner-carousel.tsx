import { LeftRightButton } from "@components";
import { Grid, Box } from "@mui/material";
import { IMovieItem } from "@types";
import { FC, useState } from "react";

type ICarouselProps = {
	items: IMovieItem[];
};

const BannerCarousel: FC<ICarouselProps> = ({ items }) => {
	const [currentIdx, setCurrentIdx] = useState<number>(0);

	return (
		<Grid
			container
			display='flex'
			flexDirection='row'
			columnSpacing={2}
			rowSpacing={2}
			height='100%'
		>
			<Grid
				item
				xs={12}
				overflow='hidden'
				display='flex'
				flex={3}
				style={{
					paddingLeft: 0,
				}}
			>
				<Box whiteSpace='nowrap' width='100%' height='100%'>
					{items?.map((m, i) => (
						<Box
							key={i}
							display='inline-flex'
							alignItems='center'
							justifyContent='center'
							// width={currentIdx + 1 === i ? "45%" : "55%"}
							// height='100%'
							width='50%'
						>
							{/* <Box
								display='flex'
								flex={1}
								width='100%'
								height='100%'
							></Box> */}
							<Box
								height='100%'
								width='100%'
								style={{
									transition: "all 1s",
									transform: `translateX(-${
										currentIdx * 100
									}%) ${
										currentIdx + 1 === i
											? "translateY(0%)"
											: ""
									}`,
									transformOrigin: "center",
								}}
							>
								<img
									src={m?.image}
									alt={m?.title}
									width='100%'
									style={{
										transition: "all 0.3s",
										objectFit: "cover",
										// transform: `${
										// 	currentIdx + 1 === i
										// 		? "scale(0.8)"
										// 		: ""
										// }`,
									}}
								/>
							</Box>
						</Box>
					))}
				</Box>
			</Grid>
			<Grid item xs={9} display='flex' flex={1}>
				<Grid container justifyContent='space-between'>
					<Grid item>
						<LeftRightButton
							onLeftClick={() => {
								if (currentIdx === 0) {
									setCurrentIdx(items?.length - 1);
								} else {
									setCurrentIdx((v) => v - 1);
								}
							}}
							onRightClick={() => {
								if (currentIdx === items?.length - 1) {
									setCurrentIdx(0);
								} else {
									setCurrentIdx((v) => v + 1);
								}
							}}
						/>
					</Grid>
					<Grid item className='banner-position'>
						<Grid container columnSpacing={2}>
							<Grid item>
								<span className='current'>
									{currentIdx + 1}
								</span>
							</Grid>
							<Grid item className='divider'></Grid>
							<Grid item>
								<span className='total'>{items?.length}</span>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default BannerCarousel;
