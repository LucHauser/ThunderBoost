import productDetailStyles from "../../stylesheet/productDetail.module.css"
import defaultStyles from "../../stylesheet/global.module.css"
import markdown from "@components/views/MarkdownReview.module.css"

import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getProductById} from "@lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus, faShoppingCart, faWarehouse} from "@fortawesome/free-solid-svg-icons";
import formatTimestamp, {getDiscountPrice} from "@components/Utils";
import ProductReviewForm from "@components/forms/ProductReviewForm";

export default function ArticleDetail({session}) {

    const [product, setProduct] = useState({})
    const [selectedImage, setSelectedImage] = useState("")
    const [amountToCart, setAmountToCart] = useState(1)
    const [showReviewForm, setShowReviewForm] = useState(false)

    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        if (!id) return
        const loadProduct = async () => {
            try {
                const response = await getProductById(id)
                setProduct(response)
                setSelectedImage(product?.images[0])
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
    }, [id])

    return (
        <div className={productDetailStyles.page}>
            <div className={productDetailStyles.articleInformationContainer}>
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
                <div
                    className={productDetailStyles.actualImage}
                    style={{backgroundImage: `url(${selectedImage})`}}
                />
                <div className={productDetailStyles.productInformation}>
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
                    <h3>Description</h3>
                    <div className={productDetailStyles.descriptionArea}>
                        {/* eslint-disable-next-line react/no-children-prop */}
                        <ReactMarkdown children={product.description}
                            rehypePlugins={[remarkGfm, rehypeRaw]}
                            className={markdown.elements}/>
                    </div>

                    <div className={productDetailStyles.addToCartContainer}>
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
                </div>
            </div>
            <hr style={{borderColor: "#D707F1"}}/>
            <div className={productDetailStyles.reviewTitle}>
                <h1 className={defaultStyles.pageSubtitle}>Client Reviews</h1>
                <button
                    className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}
                    onClick={() => setShowReviewForm(true)}
                > {session.user ? "Write a review" : "Log In"} </button>
            </div>
            {
                showReviewForm ?
                    <div>
                        <ProductReviewForm session={session} productId={product.id}/>
                    </div> : null
            }


        </div>
    )
}