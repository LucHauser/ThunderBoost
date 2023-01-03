import productArticleStyles from "./ProductCollectionItem.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {getDiscountPrice} from "@components/Utils";
import {Stack} from "react-bootstrap";
import ReactStars from "react-stars/dist/react-stars";

export default function ProductArticle({session, product, routeToDetail, showAll}) {

    function getAvgStarRating(productRatings) {
        let avg = 0
        productRatings?.forEach(function(arr) {
            avg += arr.starRate
        })
        return Math.round(avg / productRatings?.length)
    }

    return (
        <div className={productArticleStyles.container} onClick={() => routeToDetail()}>
            <Stack>
                <div className={productArticleStyles.productImage} style={{backgroundImage: `url(${product.images[0]})`}}/>
                {
                    showAll ?
                        <ReactStars
                            className={productArticleStyles.starRating}
                            count={5}
                            edit={false}
                            half={true}
                            size={32}
                            value={getAvgStarRating(product?.productReviews)}
                        /> : null
                }
                <p className={productArticleStyles.productName}>{product.name}</p>
                {
                    showAll ?
                        <>
                            {
                                product.discountActive && (new Date(product.discountFrom) > Date.now() && new Date(product.discountUntil) > Date.now()) ?
                                    <p className={productArticleStyles.productPrice}>{getDiscountPrice(product.price, product.discountPercent)}$<sub>instead {product.price}$</sub></p>
                                    : <p className={productArticleStyles.productPrice}>{product.price}$</p>
                            }
                            <button className={defaultStyles.buttonFilled}>Add to Cart</button>
                        </> : null

                }

            </Stack>
        </div>
    )
}