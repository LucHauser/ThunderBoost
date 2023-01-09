import defaultStyles from "../stylesheet/global.module.css"
import shoppingCartPageStyles from "../stylesheet/shoppingCart.module.css"
import {Col, Container, Row, Stack} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

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
                    <Col md={8} sm={9}>
                        <Container fluid={true}>
                            <Row className={shoppingCartPageStyles.cartListHeader}>
                                <Col>
                                    <b>Article</b>
                                </Col>
                                <Col>
                                    <b>Price</b>
                                </Col>
                                <Col>
                                    <b>Quantity</b>
                                </Col>
                                <Col>
                                    <b>Total</b>
                                </Col>
                            </Row>
                            {shoppingCart.products.length > 0 ?
                                <Row>
                                    <Col className={defaultStyles.disableColumnPaddings}>
                                        <Stack className={shoppingCartPageStyles.listStack}>
                                            {shoppingCart.products.map((p, index) => {
                                                return (
                                                    <div key={index} className={shoppingCartPageStyles.cartListElement}>
                                                        <Container fluid={true}>
                                                            <Row>
                                                                <Col className={defaultStyles.disableColumnPaddingLeft}>
                                                                    <img src={p.product.images[0]} className={shoppingCartPageStyles.productImage}/>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentSpaceBetween}>
                                                                    <b>{p.product.name}</b>
                                                                    <p>Size: {p.product.servings} Portions</p>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentBottom}>
                                                                    <p>{p.product.price}$</p>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentCenter}>
                                                                    <Stack direction={"horizontal"} className={shoppingCartPageStyles.quantityGroup}>
                                                                        <button className={shoppingCartPageStyles.amountButton}>
                                                                            <FontAwesomeIcon icon={faMinus} color={"#FFFFFF"}/>
                                                                        </button>
                                                                        <p>{p.amount}</p>
                                                                        <button className={shoppingCartPageStyles.amountButton}>
                                                                            <FontAwesomeIcon icon={faPlus} color={"#FFFFFF"}/>
                                                                        </button>
                                                                    </Stack>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentBottom}>
                                                                    <p>Total here</p>
                                                                </Col>
                                                                <Col className={shoppingCartPageStyles.alignmentCenter}>
                                                                    <button className={shoppingCartPageStyles.removeButton}>
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
                    <Col md={4} sm={3}>
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