import {Card, CloseButton, Col, Collapse, Container, Form, Modal, Nav, Navbar, Offcanvas, Row} from "react-bootstrap";
import navigationStyles from "./Navbar.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faCartShopping, faMagnifyingGlass, faUser, faX} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {getDiscountPrice, isEventNow, isEventNowWithBoolean} from "@components/Utils";

export default function Navigation({session, shoppingCart}) {

    const [showCart, setShowCart] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showUserStatus, setShowUserStatus] = useState(false)
    const [searchText, setSearchText] = useState("")
    const router = useRouter()

    return (
        <>
            <Navbar expand={"xl"} className={navigationStyles.navbarElement} variant={"dark"}>
                <Container fluid={true}>
                    <Navbar.Brand href={"./"} className={navigationStyles.thunderboostBrand}>Thunder<br/>boost</Navbar.Brand>


                    <Navbar.Offcanvas placement={"start"} className={navigationStyles.menu}>
                        <Offcanvas.Header closeButton={true}>
                            <Offcanvas.Title className={navigationStyles.menuTitle}>Thunderboost Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className={`justify-content-center flex-grow-1 ${navigationStyles.navLinks}`}>
                                <Nav.Link href={"../"}>Home</Nav.Link>
                                <Nav.Link href={"../boosters"}>Boosters</Nav.Link>
                                <Nav.Link href={"../faq"}>What is Thunderboost</Nav.Link>
                                <Nav.Link href={"../about"}>About</Nav.Link>
                                {
                                    session.user?.roleId === 1 ? <Nav.Link href={"../adminPortal"}>Admin Portal</Nav.Link> : null
                                }
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                    <div>
                        <button className={navigationStyles.iconButton} onClick={() => setShowSearch(true)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} color={"rgba(255, 255, 255, 0.55)"} size={"lg"}/>
                        </button>
                        <button className={navigationStyles.iconButton} onClick={() => setShowCart(true)}>
                            <FontAwesomeIcon icon={faCartShopping} color={"rgba(255, 255, 255, 0.55)"} size={"lg"}/>
                        </button>
                        <button className={navigationStyles.iconButton} onClick={() => session.user ? setShowUserStatus(true) : router.push("../login")}>
                            <FontAwesomeIcon icon={faUser} color={"rgba(255, 255, 255, 0.55)"} size={"lg"}/>
                        </button>
                        <Navbar.Toggle className={navigationStyles.toggler}/>
                    </div>
                </Container>
            </Navbar>

            <Modal show={showSearch} onHide={() => {
                setShowSearch(false)
                setSearchText("")
            }} size={"lg"} contentClassName={navigationStyles.searchModal}>
                <Container fluid={true}>
                    <Row>
                        <Col xs={12} sm={9} md={9} className={`align-items-center`}>
                            <Form.Control style={{width: "100%"}} className={defaultStyles.formInputField} placeholder={"search something"} onChange={(e) => setSearchText(e.target.value)}/>
                        </Col>
                        <Col xs={12} sm={3} md={3} className={navigationStyles.submitSearch}>
                            <button className={defaultStyles.buttonFilled} onClick={() => router.push(`../search/${searchText}`)}>Search</button>
                        </Col>
                    </Row>
                </Container>
            </Modal>

            <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement={"end"} className={navigationStyles.productCartOffcanvas}>
                <Offcanvas.Header>
                    <Offcanvas.Title><FontAwesomeIcon icon={faCartShopping} style={{marginRight: 10}}/>Shopping Cart</Offcanvas.Title>
                    <CloseButton variant={"white"} onClick={() => setShowCart(false)}/>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {
                        shoppingCart.loggedIn ?
                            <>
                                <Container className={defaultStyles.pageContentGap15}>
                                    <Row className={navigationStyles.cartButtonGroup}>
                                        <Col>
                                            <button className={`${navigationStyles.transparentButton}`} onClick={() => {
                                                router.push("../boosters")
                                                setShowCart(false)
                                            }}>Continue Shopping</button>
                                        </Col>
                                        <Col>
                                            <button className={defaultStyles.buttonFilled} onClick={() => {
                                                router.push("../cart")
                                                setShowCart(false)
                                            }}>View Shopping Cart</button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={5}>
                                            <b className={navigationStyles.cartTitle}>Your order</b>
                                        </Col>
                                        <Col xs={7}>
                                            <p style={{marginBottom: 0}}>Articles: {shoppingCart.numbersOfArticles} / Total: {shoppingCart.getSum()} $</p>
                                        </Col>
                                    </Row>
                                    {shoppingCart.products.length > 0 ?
                                        <>
                                            {
                                                shoppingCart.products.map((p, index) => {
                                                    return (
                                                        <>
                                                            <Row>
                                                                <Col>
                                                                    <img src={p.product.images[0]} className={navigationStyles.cartProductImage}/>
                                                                </Col>
                                                                <Col xs={9} className={navigationStyles.productList}>
                                                                    <b>{p.product.name}</b>
                                                                    <p>{p.product.servings} Servings</p>
                                                                    <b>{p.product.discountActive && isEventNow(p.product.discountFrom, p.product.discountUntil) ?
                                                                        <>
                                                                        {getDiscountPrice(p.product.price, p.product.discountPercent) + " $"} <sub className={navigationStyles.productDiscount}>instead {p.product.price + " $"}</sub>
                                                                        </>

                                                                        : p.product.price + " $"}
                                                                    </b>
                                                                    <p>Amount: {p.amount}</p>
                                                                </Col>
                                                            </Row>
                                                        </>

                                                    )
                                                })
                                            }
                                        </>
                                        :
                                        <Row>
                                            <Col>
                                                <p>Cart is empty</p>
                                            </Col>
                                        </Row>
                                    }
                                </Container>

                            </>
                            :
                            <>
                                <p>You are not logged in, please Login or Register</p>
                                <button className={defaultStyles.buttonFilled} onClick={() => {
                                    router.push("../login")
                                    setShowCart(false)
                                }}>Login</button>
                            </>
                    }
                </Offcanvas.Body>
            </Offcanvas>

            <Modal
                entered={false}
                show={showUserStatus}
                size={"sm"}
                onBackdropClick={() => setShowUserStatus(false)}
                onHide={() => setShowUserStatus(false)}
                backdropClassName={navigationStyles.userModal}
                dialogClassName={navigationStyles.userModalPosition}
                animation={false}>
                <Modal.Header>
                    Logged in as {session.user?.firstName} {session.user?.lastName}
                </Modal.Header>
                <Modal.Body>
                    <div className={"d-flex gap-2"}>
                        <button
                            className={defaultStyles.buttonFilled}
                            onClick={() => {
                                setShowUserStatus(false)
                                router.push("../profile")
                            }}>To Profile
                        </button>
                        <button
                            className={defaultStyles.buttonFilled}
                            onClick={() => {
                                session.logout()
                                setShowUserStatus(false)
                            }}>Log out
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    )
}