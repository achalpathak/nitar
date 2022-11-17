import "./download-app.scss";
import downloadApp from "@assets/home/downloadApp.png";

const DownloadApp = () => {
	return (
		<div className='download-app-container'>
			<img
				alt='Download App'
				src={downloadApp}
				width='50%'
				// height='100%'
			></img>
		</div>
	);
};

export default DownloadApp;
