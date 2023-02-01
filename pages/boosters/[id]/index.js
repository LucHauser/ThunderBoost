import productDetailStyles from "../../stylesheet/productDetail.module.css"
import defaultStyles from "../../stylesheet/global.module.css"
import markdown from "@components/views/MarkdownReview.module.css"

import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAllProductByFilterParameter, getProductById, getProductReviewsByParam} from "@lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faMinus, faPlus, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {getDiscountPrice, isEventNowWithBoolean} from "@components/Utils";
import ProductReviewForm from "@components/forms/ProductReviewForm";
import {Carousel, Col, Container, Row, Stack} from "react-bootstrap";
import ProductReviewItem from "@components/views/ProductReviewItem";
import ReactStars from "react-stars/dist/react-stars";

export default function ArticleDetail({session, host, shoppingCart}) {

    const [product, setProduct] = useState({})
    const [reviews, setReviews] = useState([])
    const [reviewToEdit, setReviewToEdit] = useState({})
    const [averageStarRate, setAverageStarRate] = useState(0.0)
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
                await router.push(`./${id}/oops`)
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
        loadProduct()
        loadReviews()
    }, [id])

    const editReview = async () => {
        const targetReview = await getProductReviewsByParam(host, `userId=${session.user.id}`)[0]
        setReviewToEdit(targetReview)
        setShowReviewForm(true)
    }

    return (
        <div className={defaultStyles.page}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm} ${defaultStyles.buttonFilledAutoWidth}`} style={{marginBottom: 15}} onClick={() => router.push("../boosters")}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: 10}}/>Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className={defaultStyles.pageTitle}>{product.name}</h1>
                    </Col>
                </Row>

                <Row className={defaultStyles.margin24Bottom}>

                    <Col xs={{span: 12, order: 1}} sm={{span: 2, order: "first"}} md={{span: 2}} lg={{span: 2, order: "first"}} xl={{span: 2}}>
                        <div className={productDetailStyles.imagesList}>
                            {
                                product.images?.length > 0 ?
                                    product.images?.map((img, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={productDetailStyles.imageItem}
                                                style={{backgroundImage: `url(${img})`, boxShadow: index === selectedImageIndex ? "0 0 2px 2px #8DF3E8" : "none"}}
                                                onClick={() => setSelectedImageIndex(index)}
                                            />
                                        )
                                    }) : <div className={productDetailStyles.imageItem} style={{backgroundImage: `url(https://via.placeholder.com/100x100)`, boxShadow: "0 0 2px 2px #8DF3E8"}}/>
                            }
                        </div>
                    </Col>

                    <Col xs={{order: "first"}} sm={{span: 7, offset: 1, order: 1}} md={{span: 7, offset: 1}} lg={{span: 5, offset: 0}} xl={{span: 5}} className={defaultStyles.disableColumnPaddings}>
                        <Carousel fade interval={null} activeIndex={selectedImageIndex} onSelect={(selectedIndex, e) => setSelectedImageIndex(selectedIndex)} className={productDetailStyles.actualImage}>
                            {
                                product.images?.length > 0 ?
                                    product.images?.map((img, index) => {
                                        return (
                                            <Carousel.Item key={index}>
                                                <div
                                                    className={productDetailStyles.productImage}
                                                    style={{backgroundImage: `url(${img})`}}
                                                />
                                            </Carousel.Item>
                                        )
                                    })
                                    : <Carousel.Item>
                                        <div className={productDetailStyles.productImage} style={{backgroundImage: `url(https://via.placeholder.com/300x300)`}}>

                                        </div>
                                    </Carousel.Item>
                            }
                        </Carousel>
                    </Col>

                    <Col xs={{order: "last"}} sm={{span: 12}} lg={5} xl={5}>
                        <div className={productDetailStyles.productInfo}>
                            <Stack>
                                <p className={productDetailStyles.productServings}>{product.servings} Portions</p>
                                {
                                    isEventNowWithBoolean(product.discountFrom, product.discountUntil, product.discountActive) ?
                                        <div className={productDetailStyles.productPriceBox}>
                                            <h3 className={`${productDetailStyles.productPriceSign} ${defaultStyles.getHKModular}`}>{getDiscountPrice(product.price, product?.discountPercent)} CHF <p>instead {product.price} CHF</p></h3>

                                        </div>
                                        : <p className={`${productDetailStyles.productPriceSign} ${defaultStyles.getHKModular}`}>{product.price} CHF</p>
                                }
                                <i style={{fontFamily: `"Nunito", sans-serif`}}>including VAT</i>
                                <h2>Product Description</h2>
                                <div className={productDetailStyles.descriptionArea}>
                                    {/* eslint-disable-next-line react/no-children-prop */}
                                    <ReactMarkdown children={product.description}
                                                   rehypePlugins={[remarkGfm, rehypeRaw]}
                                                   className={markdown.elements}
                                    />
                                </div>

                            </Stack>
                            <div>
                                <h2>Quantity</h2>
                                <Stack direction={"horizontal"} gap={2} style={{marginTop: 10}}>
                                    <button onClick={() => setAmountToCart(prev => prev - 1)} disabled={amountToCart === 1} className={productDetailStyles.productQuantityButton}>
                                        <FontAwesomeIcon icon={faMinus} size={"xs"} color={"white"}/>
                                    </button>
                                    <p className={defaultStyles.margin0Bottom}>{amountToCart}</p>
                                    <button onClick={() => setAmountToCart(prev => prev + 1)} disabled={amountToCart === parseInt(product.stockAmount)} className={productDetailStyles.productQuantityButton}>
                                        <FontAwesomeIcon icon={faPlus} size={"xs"} color={"white"}/>
                                    </button>
                                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ms-auto`} onClick={() => session.user ? shoppingCart.addProduct(product.id, amountToCart) : router.push("./login")}>
                                        <FontAwesomeIcon icon={faShoppingCart} style={{marginRight: 10}}/>
                                        Add to Cart
                                    </button>
                                </Stack>
                            </div>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={productDetailStyles.reviewSubline}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Stack direction={"horizontal"} style={{marginBottom: 10}}>
                            <h3>Client Reviews</h3>
                            {
                                session.user ?
                                    <button
                                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ms-auto`}
                                        onClick={() =>
                                            (session.user.id === reviews.filter(r => r.userId === session.user.id)[0]?.userId) ?
                                                editReview(session.user.id)
                                                : setShowReviewForm(prevState => !prevState)}
                                    >{showReviewForm ?
                                        "Cancel"
                                        : session.user.id === reviews.filter(r => r.userId === session.user.id)[0]?.userId ?
                                            "Edit review" : "Write a review"
                                    }</button>
                                    : <button
                                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ms-auto`}
                                        onClick={() => router.push("../login")}>
                                        Login
                                    </button>
                            }

                        </Stack>
                    </Col>
                </Row>
                {
                    showReviewForm ?
                        <Row className={defaultStyles.margin10Bottom}>
                            <Col>
                                <ProductReviewForm
                                    session={session}
                                    productId={id}
                                    host={host}
                                    onReviewed={(newReview) => {
                                        setReviews([...reviews, newReview])
                                    }}
                                    reviewToEdit={reviewToEdit}
                                    onReviewEdited={(edited) => {
                                        setShowReviewForm(prevState => !prevState)
                                        setReviews(prevState =>
                                            prevState.map(r => {
                                                if (r.id === edited.id) {
                                                    return {...r, ...edited}
                                                } else {
                                                    return r
                                                }
                                            })
                                        )}
                                    }
                                />
                            </Col>
                        </Row>
                        : null
                }
                {
                    reviews.length > 0 ?
                        <>
                            <Row className={defaultStyles.margin30Bottom}>
                                <Col>
                                    <ReactStars edit={false} count={5} size={36} color2={"#FFB800"} value={averageStarRate} half={true}/>
                                    <i style={{color: "#FFFFFF", fontFamily: "Nunito, sans-serif"}}>({reviews.length} {`Review${reviews.length > 1 ? "s" : ""}`})</i>
                                    <hr style={{borderColor: "#FFFFFF"}}/>
                                </Col>
                            </Row>
                            {
                                reviews.map((review, index) => {
                                    return (
                                        <Row key={index} className={`${productDetailStyles.reviewList}`}>
                                            <Col>
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
        </div>
    )
}