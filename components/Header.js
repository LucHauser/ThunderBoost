import headerStyles from "./Header.module.css"
import defaultStyle from "../pages/stylesheet/global.module.css"
import Image from "next/image";
import logo from "resources/assets/Thunderboost_Logo_Nav.jpg"
import {NavLink} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faCartShopping, faUser, faCaretDown} from "@fortawesome/free-solid-svg-icons"
import {useState} from "react";
import {useRouter} from "next/router";



export default function Header({session}) {

    const [showShopBy, setShowShopBy] = useState(false)
    const router = useRouter()

    const handleShowSubNavShopBy = () => {
        if (showShopBy) {
            setShowShopBy(false)
        } else {
            setShowShopBy(true)
        }
    }

    const navigateToLogin = () => {
        router.push("/login")
    }

    const navigateToProfile = () => {
        if (session.user) {
            router.push("/profile")
        } else {
            navigateToLogin()
        }
    }

    const navigateToHome = () => {
        router.push("/")
    }

    return (
        <div className={headerStyles.navBarWrapper}>
            <div className={headerStyles.navbar}>
                <div className={headerStyles.logo}>
                    <Image className={headerStyles.logoImage} src={logo} alt="Thunderboost-Logo"  height="60px" width="127px" onClick={navigateToHome}/>
                </div>
                <div className={headerStyles.navbarLinks}>
                    <NavLink href="#" className={headerStyles.navLink}>Boosters</NavLink>
                    <NavLink onClick={handleShowSubNavShopBy} className={headerStyles.navLink}>Shop
                        <FontAwesomeIcon icon={faCaretDown} size={"1x"} color={"white"} className={headerStyles.caretDown}/>
                    </NavLink>
                    <NavLink href="#" className={headerStyles.navLink}>What is Thunderboost</NavLink>
                    <NavLink href="#" className={headerStyles.navLink}>About</NavLink>
                </div>
                <div className={headerStyles.iconBtnGroup}>
                    <button className={defaultStyle.iconBtn}>
                        <FontAwesomeIcon className={defaultStyle.faIcon} icon={faMagnifyingGlass} color={"white"} size={"2x"}/>
                    </button>
                    <button className={defaultStyle.iconBtn}>
                        <FontAwesomeIcon className={defaultStyle.faIcon} icon={faCartShopping} color={"white"} size={"2x"}/>
                    </button>
                    <button className={defaultStyle.iconBtn} onClick={navigateToProfile}>
                        <FontAwesomeIcon icon={faUser} className={defaultStyle.faIcon} color={"white"} size={"2x"}/>
                    </button>
                </div>
            </div>
            <div className={showShopBy ? headerStyles.subNavShopBy : headerStyles.hideSubNavShopBy}>
                <NavLink href={"#"} className={headerStyles.shopByOptions}>Booster for Gamers</NavLink>
                <NavLink href={"#"} className={headerStyles.shopByOptions}>Booster for Office</NavLink>
                <NavLink href={"#"} className={headerStyles.shopByOptions}>Booster for Pupils / Students</NavLink>
            </div>
        </div>

    )
}