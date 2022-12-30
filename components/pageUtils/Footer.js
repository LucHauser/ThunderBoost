import footerStyle from "./Footer.module.css"
import {useRouter} from "next/router";
import {NavLink} from "react-bootstrap";

export default function Footer() {

    return (
        <div className={footerStyle.footer}>
            <p>{new Date().getFullYear()} Thunderboost</p>
            <NavLink className={footerStyle.footerLink} href="#">About Thunderboost</NavLink>
            <NavLink className={footerStyle.footerLink} href={"#"}>Payment and Shipment</NavLink>
            <NavLink className={footerStyle.footerLink} href={"#"}>Impressum</NavLink>
            <NavLink className={footerStyle.footerLink} href={"#"}>Privacy Policy</NavLink>
        </div>
    )
}