import footerStyle from "./Footer.module.css"
import {useRouter} from "next/router";
import {NavLink} from "react-bootstrap";

export default function Footer() {

    return (
        <div className={footerStyle.footer}>
            <NavLink href="#">About Thunderboost</NavLink>
            <NavLink href={"#"}>Payment and Shipment</NavLink>
            <p>{new Date().getFullYear()} Thunderboost</p>
            <NavLink href={"#"}>Impressum</NavLink>
            <NavLink href={"#"}>Privacy Policy</NavLink>
        </div>
    )
}