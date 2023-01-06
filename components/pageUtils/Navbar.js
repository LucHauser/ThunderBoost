import {Container, Form, Nav, Navbar, Offcanvas} from "react-bootstrap";
import navigationStyles from "./Navbar.module.css"
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faCartShopping, faMagnifyingGlass, faUser} from "@fortawesome/free-solid-svg-icons";

export default function Navigation({session, shoppingCart}) {

    const [showCart, setShowCart] = useState(false)

    return (
        <>
            <Navbar expand={"xl"} className={navigationStyles.navbarElement}>
                <Container fluid={true}>
                    <Navbar.Brand className={navigationStyles.thunderboostBrand}>Thunder<br/>boost</Navbar.Brand>
                    <Navbar.Toggle className={navigationStyles.toggler}>
                        <i><FontAwesomeIcon icon={faBars}/></i>
                    </Navbar.Toggle>
                    <Navbar.Offcanvas placement={"start"} className={navigationStyles.offCanvas}>
                        <Offcanvas.Header className={navigationStyles.menuTitle}>
                            <Offcanvas.Title>Thunderboost Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className={`justify-content-center flex-grow-1 ${navigationStyles.navLinks}`}>
                                <Nav.Link>Home</Nav.Link>
                                <Nav.Link>Boosters</Nav.Link>
                                <Nav.Link>What is Thunderboost</Nav.Link>
                                <Nav.Link>About</Nav.Link>
                            </Nav>
                            <div className={"d-flex"}>
                                <button className={navigationStyles.iconButton}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} color={"#FFFFFF"} size={"lg"}/>
                                </button>
                                <button className={navigationStyles.iconButton}>
                                    <FontAwesomeIcon icon={faCartShopping} color={"#FFFFFF"} size={"lg"}/>
                                </button>
                                <button className={navigationStyles.iconButton}>
                                    <FontAwesomeIcon icon={faUser} color={"#FFFFFF"} size={"lg"}/>
                                </button>
                            </div>

                        </Offcanvas.Body>

                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <Offcanvas show={showCart} onHide={() => setShowCart(false)}>
                <Offcanvas.Header>
                    <Offcanvas.Title>Your Cart</Offcanvas.Title>
                </Offcanvas.Header>
            </Offcanvas>
        </>

    )
}