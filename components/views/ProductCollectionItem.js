import productArticleStyles from "./ProductCollectionItem.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {getDiscountPrice, isEventNow, isEventNowWithBoolean} from "@components/Utils";
import {Stack} from "react-bootstrap";
import ReactStars from "react-stars/dist/react-stars";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";

export default function ProductArticle({product, routeToDetail, addThisToCart, showAll}) {

    function getAvgStarRating(productRatings) {
        let avg = 0
        productRatings?.forEach(function(arr) {
            avg += arr.starRate
        })
        return Math.round(avg / productRatings?.length)
    }

    return (
        <div className={productArticleStyles.container}>
            {
                showAll ?
                    <div className={productArticleStyles.discountOverlay}>
                        {
                            isEventNowWithBoolean(product.discountFrom, product.discountUntil, product.discountActive) ?
                                <p>{product.discountPercent}%</p>
                                : null
                        }
                    </div> : null
            }


            <Stack>
                <Stack onClick={() => routeToDetail()}>
                    <div className={productArticleStyles.productImage} style={{backgroundImage: `url(${product.images[0]})`}}/>
                    <p className={productArticleStyles.productName}>{product.name}</p>
                    {
                        showAll ?
                            <>
                                <Stack gap={1} direction={"horizontal"}>
                                    <ReactStars
                                        className={productArticleStyles.starRating}
                                        count={5}
                                        edit={false}
                                        half={true}
                                        size={24}
                                        value={getAvgStarRating(product?.productReviews)}
                                    />
                                    <p>({product?.productReviews?.length})</p>
                                </Stack>

                                {
                                    isEventNowWithBoolean(product.discountFrom, product.discountUntil, product.discountActive) ?
                                        <Stack direction={"horizontal"} gap={2}>
                                            <p className={productArticleStyles.productPrice}
                                               style={{textDecoration: "line-through"}}>{getDiscountPrice(product.price, product.discountPercent)}$</p>
                                            <p className={productArticleStyles.productPrice}
                                               style={{color: "#EB3E7A"}}>{product.price}$</p>
                                        </Stack>

                                        : <p className={productArticleStyles.productPrice}>{product.price}$</p>
                                }
                            </> : null
                    }

                </Stack>
                {
                    showAll ?
                        <Stack direction={"horizontal"}>
                            <p>{product.stockAmount} in Stock</p>
                            <button className={productArticleStyles.buttonCart} onClick={() => addThisToCart(product.id)}>
                                <FontAwesomeIcon icon={faShoppingCart}/>
                            </button>
                        </Stack> : null
                }
            </Stack>
        </div>
    )
}