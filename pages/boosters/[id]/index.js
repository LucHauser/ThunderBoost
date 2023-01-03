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
import {Carousel, Col, Container, Row, Stack} from "react-bootstrap";
import ProductArticle from "@components/views/ProductCollectionItem";
import ProductReviewItem from "@components/views/ProductReviewItem";
import ReactStars from "react-stars/dist/react-stars";

export default function ArticleDetail({session, host}) {

    const [product, setProduct] = useState({})
    const [reviews, setReviews] = useState([])
    const [averageStarRate, setAverageStarRate] = useState(0.0)
    const [productSuggestions, setProductSuggestions] = useState([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
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
                setSelectedImageIndex(0)
            } catch (e) {
                console.log(e)
            }
        }
        const loadReviews = async () => {
            try {
                const response = await getProductReviewsByParam(host, `productId=${id}&_expand=user`)
                setReviews(response)
                let avgStars = 0
                response.forEach(function(arr) {
                    avgStars += arr.starRate
                })
                setAverageStarRate(Math.round(avgStars / response.length))
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
                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm} ${defaultStyles.buttonFilledAutoWidth}`} style={{marginBottom: 15}} onClick={() => router.push("../boosters")}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: 10}}/>Back
                        </button>
                    </Col>
                </Row>
                <Row className={defaultStyles.margin24Bottom}>
                    <Col xs={3} sm={3} md={2} lg={2} xl={1}>
                        <div className={productDetailStyles.imagesList}>
                            {
                                product.images?.map((img, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={productDetailStyles.imageItem}
                                            style={{backgroundImage: `url(${img})`, border: index === selectedImageIndex ? "solid 1px #FFFFFF" : "none"}}
                                            onClick={() => setSelectedImageIndex(index)}
                                        />
                                    )
                                })
                            }
                        </div>
                    </Col>
                    <Col xs={9} sm={9} md={{span: 6, offset: 2}} lg={{span: 4, offset: 0}} xl={4}>
                        <Carousel interval={null} activeIndex={selectedImageIndex} onSelect={(selectedIndex, e) => setSelectedImageIndex(selectedIndex)}>
                            {
                                product.images?.map((img, index) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            <div
                                                className={productDetailStyles.actualImage}
                                                style={{backgroundImage: `url(${img})`}}
                                            />
                                        </Carousel.Item>
                                    )
                                })
                            }
                        </Carousel>

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
                                            <FontAwesomeIcon icon={faMinus} size={"1x"} color={"white"}/>
                                        </button>
                                        <p>{amountToCart}</p>
                                        <button onClick={() => setAmountToCart(prev => prev + 1)} disabled={amountToCart === parseInt(product.stockAmount) }>
                                            <FontAwesomeIcon icon={faPlus} size={"1x"} color={"white"}/>
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
                <div className={productDetailStyles.reviewSubline}/>
                <Row>
                    <Col md={8} lg={10}>
                        <Stack direction={"horizontal"} style={{marginBottom: 10}}>
                            <h3>Client Reviews</h3>
                            <button
                                className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ms-auto`}
                                onClick={() => session.user ? setShowReviewForm(!showReviewForm) : router.push("../login")}
                                disabled={session.user && session.user.id === reviews.filter(r => r.userId === session.user.id)[0]?.userId}
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
                            {
                                reviews.length > 0 ?
                                    <>
                                        <Row className={defaultStyles.margin30Bottom}>
                                            <Col className={defaultStyles.disableColumnPaddings}>
                                                <ReactStars edit={false} count={5} size={36} color2={"#FFB800"} value={averageStarRate} half={true}/>
                                                <i style={{color: "#FFFFFF", fontFamily: "Nunito, sans-serif"}}>({reviews.length} {`Review${reviews.length > 1 ? "s" : ""}`})</i>
                                                <hr style={{borderColor: "#FFFFFF"}}/>
                                            </Col>
                                        </Row>
                                        {
                                            reviews.map((review, index) => {
                                                return (
                                                    <Row key={index} className={`${productDetailStyles.reviewList}`}>
                                                        <Col className={defaultStyles.disableColumnPaddings}>
                                                            <ProductReviewItem session={session} review={review}/>
                                                            <hr className={productDetailStyles.reviewSubline}/>
                                                        </Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </>
                                    : <p className={productDetailStyles.emptyReviewText}>No Reviews</p>
                            }

                        </Container>

                    </Col>
                    <Col sm={12} md={4} lg={2}>
                        <Container fluid={true} className={`${defaultStyles.pageContentGap15} ${productDetailStyles.productSuggestionList}`}>
                            <Row>
                                <Col md={12}>
                                    <h3>This might interest you</h3>
                                </Col>
                                {
                                    productSuggestions.map((product, index) => {
                                        return (
                                            <Col key={index} md={12} className={defaultStyles.margin10Bottom}>
                                                <ProductArticle product={product} session={session} showAll={false} routeToDetail={() => router.push(`../boosters/${product.id}`)}/>
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