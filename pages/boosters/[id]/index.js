import productDetailStyles from "../../stylesheet/productDetail.module.css"
import defaultStyles from "../../stylesheet/global.module.css"
import markdown from "@components/views/MarkdownReview.module.css"

import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAllProductByFilterParameter, getAllProducts, getProductById, getProductReviewsByParam} from "@lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faMinus, faPlus, faShoppingCart, faWarehouse} from "@fortawesome/free-solid-svg-icons";
import formatTimestamp, {getDiscountPrice} from "@components/Utils";
import ProductReviewForm from "@components/forms/ProductReviewForm";
import {Col, Container, Row, Stack} from "react-bootstrap";
import ProductArticle from "@components/views/ProductCollectionItem";

export default function ArticleDetail({session, host}) {

    const [product, setProduct] = useState({})
    const [reviews, setReviews] = useState([])
    const [productSuggestions, setProductSuggestions] = useState([])
    const [selectedImage, setSelectedImage] = useState("")
    const [amountToCart, setAmountToCart] = useState(1)
    const [showReviewForm, setShowReviewForm] = useState(false)

    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        if (!id) return
        const loadProduct = async () => {
            try {
                const response = await getProductById(host, id)
                setProduct(response)
                setSelectedImage(product?.images[0])
            } catch (e) {
                console.log(e)
            }
        }
        const loadReviews = async () => {
            try {
                const response = await getProductReviewsByParam(host, `productId=${id}`)
                setReviews(response)
            } catch (e) {
                console.log(e)
            }
        }
        const loadProductSuggestion = async () => {
            try {
                const response = await getAllProductByFilterParameter(host, `id_ne=${id}`)
                if (response.length >= 6) {
                    const shuffled = [...response].sort(() => 0.5 - Math.random())
                    setProductSuggestions(shuffled.slice(0, 6))
                } else {
                    setProductSuggestions(response)
                }
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
        loadReviews()
        loadProductSuggestion()
    }, [id])

    useEffect(() => {

    })

    return (
        <div className={productDetailStyles.page}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm} ${defaultStyles.buttonFilledAutoWidth}`} style={{marginBottom: 15}}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: 10}}/>Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3} sm={3} md={2} lg={2} xl={1}>
                        <div className={productDetailStyles.imagesList}>
                            {
                                product.images?.map((img, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={productDetailStyles.imageItem}
                                            style={{backgroundImage: `url(${img})`}}
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    )
                                })
                            }
                        </div>
                    </Col>
                    <Col xs={9} sm={9} md={{span: 6, offset: 2}} lg={{span: 4, offset: 0}} xl={4}>
                        <div
                            className={productDetailStyles.actualImage}
                            style={{backgroundImage: `url(${selectedImage})`}}
                        />
                    </Col>
                    <Col sm={12} md={12} lg={6} xl={7}>
                        <Stack className={productDetailStyles.productInformation}>
                            <h2 className={productDetailStyles.productName}>{product.name}</h2>
                            <p className={productDetailStyles.productServings}>{product.servings} Portions</p>
                            {
                                product?.discountActive && (new Date(product?.discountFrom) > Date.now() && new Date(product?.discountUntil) > Date.now()) ?
                                    <div className={productDetailStyles.productPriceBox}>
                                        <p className={productDetailStyles.productPriceSign}>{getDiscountPrice(product.price, product?.discountPercent)}$<p>instead {product.price}$</p></p>
                                        {
                                            product?.showDiscountUntilDate ?
                                                <p>{product?.discountUntilText ? product?.discountUntilText : "Until"} {formatTimestamp(product?.discountUntil, "dd.MMMM.yyyy HH:mm")}</p> : null
                                        }
                                    </div>
                                    : <p className={productDetailStyles.productPriceSign}>{product.price}</p>
                            }


                            <div className={`${productDetailStyles.addToCartContainer} `}>
                                <p
                                    className={productDetailStyles.stockAmountInformation}
                                    style={Object.assign(parseInt(product.stockAmount) === 0 ? {background: "#a84f4f"} : parseInt(product.stockAmount) < 5 ? {background: "#a87e4f"} : {background: "#6aa84f"})}>
                                    <FontAwesomeIcon icon={faWarehouse} style={{marginRight: 10}}/>
                                    {parseInt(product.stockAmount) > 0 ? `${product.stockAmount} in Stock` : `Sold out`}
                                </p>
                                <div className={productDetailStyles.addToCart}>
                                    <div className={productDetailStyles.quantityToCart}>
                                        <button onClick={() => setAmountToCart(prev => prev - 1)} disabled={amountToCart === 1}>
                                            <FontAwesomeIcon icon={faMinus} size={"2x"} color={"white"}/>
                                        </button>
                                        <p>{amountToCart}</p>
                                        <button onClick={() => setAmountToCart(prev => prev + 1)} disabled={amountToCart === parseInt(product.stockAmount) }>
                                            <FontAwesomeIcon icon={faPlus} size={"2x"} color={"white"}/>
                                        </button>
                                    </div>
                                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>
                                        <FontAwesomeIcon icon={faShoppingCart} style={{marginRight: 10}}/>
                                        Add to Cart
                                    </button>
                                </div>

                            </div>
                        </Stack>
                    </Col>
                </Row>
                <Row>
                    <Col>

                        <div className={productDetailStyles.descriptionArea}>
                            <h3>Description</h3>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <ReactMarkdown children={product.description}
                                           rehypePlugins={[remarkGfm, rehypeRaw]}
                                           className={markdown.elements}/>
                        </div>
                    </Col>
                </Row>
                <hr style={{borderColor: "#D707F1"}}/>
                <Row>
                    <Col md={8} lg={10}>
                        <Stack direction={"horizontal"}>
                            <h1 className={defaultStyles.pageSubtitle}>Client Reviews</h1>
                            <button
                                className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ms-auto`}
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >{session.user ? showReviewForm ? "Cancel": "Write a review" : "Log In"}</button>
                        </Stack>
                        <Container fluid={true}>
                            {
                                showReviewForm ?
                                    <Row className={defaultStyles.margin10Bottom}>
                                        <Col className={`${defaultStyles.disableColumnPaddings}`}>
                                            <ProductReviewForm session={session} productId={id ? id : null} host={host}/>
                                        </Col>
                                    </Row>
                                    : null
                            }
                        </Container>
                    </Col>
                    <Col sm={12} md={4} lg={2}>
                        <Container fluid={true} className={defaultStyles.pageContentGap15}>
                            <Row>
                                {
                                    productSuggestions.map((product, index) => {
                                        return (
                                            <Col key={index} md={12} className={defaultStyles.margin10Bottom}>
                                                <ProductArticle product={product} session={session}/>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>





        </div>
    )
}