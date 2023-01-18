import defaultStyles from "../stylesheet/global.module.css"
import shoppingCartPageStyles from "../stylesheet/shoppingCart.module.css"
import {Col, Container, Row, Stack} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {getDiscountPrice, isEventNow} from "@components/Utils";
import navigationStyles from "@components/pageUtils/Navbar.module.css";

export default function ShoppingCartPage({session, host, shoppingCart}) {

    return (
        <div className={shoppingCartPageStyles.page}>
            <Container fluid={true}>
                <Row>
                    <Col>
                        <h1 className={defaultStyles.pageTitle}>Your Shopping Cart</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={12} lg={9} xl={9}>
                        <Container fluid={true}>
                            <Row className={shoppingCartPageStyles.cartListHeader}>
                                <Col md={{span: 5}}>
                                    <b>Article</b>
                                </Col>
                                <Col md={2}>
                                    <b>Price</b>
                                </Col>
                                <Col md={2}>
                                    <b>Quantity</b>
                                </Col>
                                <Col md={3}>
                                    <b>Total</b>
                                </Col>
                            </Row>
                            {shoppingCart.products.length > 0 ?
                                <Row style={{marginBottom: 10}}>
                                    <Col className={defaultStyles.disableColumnPaddings}>
                                        <Stack className={shoppingCartPageStyles.listStack}>
                                            {shoppingCart.products.map((p, index) => {
                                                return (
                                                    <div key={index} className={shoppingCartPageStyles.cartListElement}>
                                                        <Container fluid={true} className={shoppingCartPageStyles.rowSpace}>
                                                            <Row>
                                                                <Col xs={12} md={5} lg={5} className={shoppingCartPageStyles.articleCol}>
                                                                    <img src={p.product.images[0]} className={shoppingCartPageStyles.productImage}/>
                                                                    <div className={shoppingCartPageStyles.productName}>
                                                                        <b>{p.product.name}</b>
                                                                        <p>Size: {p.product.servings} Portions</p>
                                                                    </div>

                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentCenter} xs={{span: 12}} sm={{span: 12}} md={{span: 2, offset: 0}} lg={2}>
                                                                    <div style={{display: "flex"}}><p className={shoppingCartPageStyles.productPrice} style={{marginBottom: 0}}>Price:&nbsp;</p>
                                                                        {
                                                                            p.product.discountActive && isEventNow(p.product.discountFrom, p.product.discountUntil) ?
                                                                                <>
                                                                                    <b style={{marginBottom: 0, color: "#EB3E7A"}}>{getDiscountPrice(p.product.price, p.product.discountPercent) + " $"}&nbsp;</b>
                                                                                    <p style={{marginBottom: 0, textDecoration: "line-through"}}> {p.product.price + " $"}</p>
                                                                                </>
                                                                                : <b style={{marginBottom: 0}}>{p.product.price + " $"}</b>
                                                                        }</div>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentCenter} md={2}>
                                                                    <Stack direction={"horizontal"} className={shoppingCartPageStyles.quantityGroup}>
                                                                        <p className={shoppingCartPageStyles.productQuantity}>Quantity</p>
                                                                        <button className={shoppingCartPageStyles.amountButton}>
                                                                            <FontAwesomeIcon icon={faMinus} color={"#FFFFFF"}/>
                                                                        </button>
                                                                        <p>{p.amount}</p>
                                                                        <button className={shoppingCartPageStyles.amountButton}>
                                                                            <FontAwesomeIcon icon={faPlus} color={"#FFFFFF"}/>
                                                                        </button>
                                                                    </Stack>
                                                                </Col>
                                                                <Col className={`${shoppingCartPageStyles.alignmentCenter} ${shoppingCartPageStyles.productPriceTotal}`} md={1}>
                                                                    <p style={{marginBottom: 0}}>{p.amount * (p.product.discountActive && isEventNow(p.product.discountFrom, p.product.discountUntil) ? getDiscountPrice(p.product.price, p.product.discountPercent) : p.product.price) + " $"}</p>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentCenter} xs={{span: 4, offset: 8}} md={{span: 2, offset: 0}}>
                                                                    <button className={shoppingCartPageStyles.removeButton} onClick={() => shoppingCart.remove(p.product.id)}>
                                                                        <FontAwesomeIcon icon={faTrash}/>Remove
                                                                    </button>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </div>
                                                )
                                            })}
                                        </Stack>
                                    </Col>
                                </Row>
                                 :
                                <Row>
                                    <Col>
                                        <p>Cart is Empty</p>
                                    </Col>
                                </Row>
                            }
                        </Container>
                    </Col>
                    <Col md={12} lg={3} xl={3} sm={12}>
                        <Container fluid={true} className={shoppingCartPageStyles.informationCheckoutContainer}>
                            <Row>
                                <Col>
                                    <b>Overview</b>
                                </Col>
                                <Col>
                                    <p>{shoppingCart.products.length} Articles</p>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col>
                                    <b>Subtotal</b>
                                </Col>
                                <Col>
                                    <p>{shoppingCart.getSum()}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Shipment</b>
                                </Col>
                                <Col>
                                    <p>free</p>
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col>
                                    <b>Total of Order</b>
                                </Col>
                                <Col>
                                    <p>Total here</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <button className={defaultStyles.buttonFilled}>Proceed to checkout</button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>

            </Container>
        </div>
    )
}