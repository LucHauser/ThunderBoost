import headerStyles from "./Header.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import Image from "next/image";
import logo from "resources/assets/Thunderboost_Logo_Nav.jpg"
import {Form, NavLink, Offcanvas} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faCartShopping, faUser, faCaretDown, faBars, faHome, faClose} from "@fortawesome/free-solid-svg-icons"
import {useEffect, useState} from "react";
import {useRouter} from "next/router";



export default function Header({session, shoppingCart}) {

    const [showShopBy, setShowShopBy] = useState(false)
    const [showNavOffcanvas, setShowNavOffcanvas] = useState(false)
    const [showUserDialog, setShowUserDialog] = useState(false)
    const [showNavSearch, setShowNavSearch] = useState(false)
    const [user, setUser] = useState({})
    const router = useRouter()

    useEffect(() => {
        if (session.user) {
            setUser(session.user)
        }
    }, [session.user])

    const handleShowSubNavShopBy = () => {
        if (showShopBy) {
            setShowShopBy(false)
        } else {
            setShowShopBy(true)
        }
    }

    const handleShowUserDialog = () => {
        if (showUserDialog) {
            setShowUserDialog(false)
        } else {
            setShowUserDialog(true)
        }
    }

    const handleLogout = () => {
        session.logout()
        handleShowUserDialog()
        router.push("/")
    }

    const handleShowNavOffcanvas = () => setShowNavOffcanvas(true)
    const handleCloseNavOffcanvas = () => setShowNavOffcanvas(false)

    const handleOpenNavSearch = () => setShowNavSearch(true)
    const handleCloseNavSearch = () => setShowNavSearch(false)

    const navigateToLogin = () => {
        router.push("/login")
    }

    const navigateToProfile = () => {
        if (session.user) {
            handleShowUserDialog()
            router.push("/profile")
        } else {
            navigateToLogin()
        }
    }

    const navigateToHome = () => {
        router.push("/")
    }

    return (
        <>
            <div className={headerStyles.navBarWrapper}>
                <div className={headerStyles.navbar}>
                    <button className={headerStyles.hamBtn} onClick={handleShowNavOffcanvas}><FontAwesomeIcon icon={faBars} size={"2x"} color={"white"}/></button>

                    <div className={headerStyles.logo}>
                        <Image className={headerStyles.logoImage} src={logo} alt="Thunderboost-Logo"  height="60px" width="127px" onClick={navigateToHome}/>
                    </div>

                    <div className={headerStyles.logoMobile}>
                        <Image src={logo} alt={"Thunderboost-Logo"} height={"45px"} width={"100px"} onClick={navigateToHome}/>
                    </div>

                    <div className={headerStyles.navbarLinks}>
                        <NavLink href="/boosters" className={headerStyles.navLink}>Boosters</NavLink>
                        <NavLink onClick={handleShowSubNavShopBy} className={headerStyles.navLink}>Shop
                            <FontAwesomeIcon icon={faCaretDown} size={"1x"} color={"white"} className={headerStyles.caretDown}/>
                        </NavLink>
                        <NavLink href="#" className={headerStyles.navLink}>What is Thunderboost</NavLink>
                        <NavLink href="/adminPortal" className={headerStyles.navLink}>About</NavLink>
                    </div>

                    <div className={`${headerStyles.iconBtnGroup} ${showNavOffcanvas ? headerStyles.iconBtnGroupInOffcanvas: null}`}>
                        <button className={headerStyles.iconBtn} onClick={handleOpenNavSearch}>
                            <FontAwesomeIcon className={headerStyles.faIcon} icon={faMagnifyingGlass} color={"white"} size={"2x"}/>
                        </button>

                        <button className={headerStyles.iconBtn}>
                            <FontAwesomeIcon className={headerStyles.faIcon} icon={faCartShopping} color={"white"} size={"2x"}/>
                        </button>

                        <button className={headerStyles.iconBtn} onClick={session.user ? handleShowUserDialog : navigateToLogin}>
                            <FontAwesomeIcon icon={faUser} className={headerStyles.faIcon} color={"white"} size={"2x"}/>
                        </button>
                    </div>
                </div>

                <div className={showShopBy ? headerStyles.subNavShopBy : headerStyles.hideSubNavShopBy}>
                    <NavLink href={"#"} className={headerStyles.shopByOptions}>Booster for Gamers</NavLink>
                    <NavLink href={"#"} className={headerStyles.shopByOptions}>Booster for Office</NavLink>
                    <NavLink href={"#"} className={headerStyles.shopByOptions}>Booster for Pupils / Students</NavLink>
                </div>

                <Form className={showNavSearch ? headerStyles.navSearchBar: headerStyles.hideNavSearchBar}>
                    <p>Search: </p>
                    <Form.Control className={headerStyles.navSearchField} />
                    <button type={"submit"} className={headerStyles.offcanvasBtn}><FontAwesomeIcon icon={faMagnifyingGlass} size={"2x"} color={"white"}/></button>
                    <button className={headerStyles.offcanvasBtn} onClick={handleCloseNavSearch}><FontAwesomeIcon icon={faClose} size={"2x"} color={"white"}/></button>
                </Form>
            </div>

            <Offcanvas show={showNavOffcanvas} onHide={handleCloseNavOffcanvas} className={headerStyles.navOffcanvas}>
                <Offcanvas.Header className={headerStyles.navOffcanvasHeader}>
                    <button onClick={navigateToHome} className={headerStyles.offcanvasBtn}><FontAwesomeIcon icon={faHome} size={"2x"} color={"white"}/></button>
                    <button onClick={handleCloseNavOffcanvas} className={headerStyles.offcanvasBtn}><FontAwesomeIcon icon={faClose} size={"2x"} color={"white"}/></button>
                </Offcanvas.Header>
                <div className={headerStyles.navOffcanvasSeparator}/>
                <NavLink href="/boosters" className={headerStyles.navLink}>Boosters</NavLink>
                <NavLink onClick={handleShowSubNavShopBy} className={headerStyles.navLink}>Shop
                    <FontAwesomeIcon icon={faCaretDown} size={"1x"} color={"white"} className={headerStyles.caretDown}/>
                </NavLink>
                <div className={showShopBy ? headerStyles.subNavOffcanvas : headerStyles.hideSubNavOffcanvas}>
                    <NavLink href={"#"} className={headerStyles.offcanvasShopByOptions}>Booster for Gamers</NavLink>
                    <NavLink href={"#"} className={headerStyles.offcanvasShopByOptions}>Booster for Office</NavLink>
                    <NavLink href={"#"} className={headerStyles.offcanvasShopByOptions}>Booster for Pupils / Students</NavLink>
                </div>
                <NavLink href="#" className={headerStyles.navLink}>What is Thunderboost</NavLink>
                <NavLink href="#" className={headerStyles.navLink}>About</NavLink>
            </Offcanvas>
            <div className={showUserDialog ? headerStyles.profileDialog : headerStyles.hideProfileDialog}>
                <p>Logged in as: <b>{user.username}</b></p>
                <div className={headerStyles.btnGroupUserDialog}>
                    <button className={defaultStyles.buttonFilled} onClick={navigateToProfile}>Your Profile</button>
                    <button className={defaultStyles.buttonFilled} onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </>
    )
}