//*All imports go here!
import "../miscellaneous/index.scss";
import logo from "@assets/common/logo.png";
import { Button, CustomInput } from "@components";
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useState,
} from "react";
import { AxiosError } from "axios";
import api from "@api";
import {
	Alert,
	AlertColor,
	AlertTitle,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IMessage, IResponse, IError } from "@types";
import data from "../../local-json/data.json"

const Footer = () => {
    return(
        <>
        <div className='main-container'>
				<div className='container'>
					<div className='logo-container'>
						<img
							alt='logo'
							src={logo}
							width='100%'
							height='100%'
						></img>
					</div>
                </div>
                <div>
                    <h2>ABOUT US</h2>
                </div>
            </div>
            </>

    )
}

export default Footer;