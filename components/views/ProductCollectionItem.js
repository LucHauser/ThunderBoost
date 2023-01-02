import productArticleStyles from "./ProductCollectionItem.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {getDiscountPrice} from "@components/Utils";
import {Stack} from "react-bootstrap";

export default function ProductArticle({session, product, routeToDetail}) {

    return (
        <div className={productArticleStyles.container} onClick={() => routeToDetail()}>
            <Stack gap={1}>
                <div className={productArticleStyles.productImage} style={{backgroundImage: `url(${product.images[0]})`}}/>
                <p className={productArticleStyles.productName}>{product.name}</p>
                {
                    product.discountActive && (new Date(product.discountFrom) > Date.now() && new Date(product.discountUntil) > Date.now()) ?
                        <p className={productArticleStyles.productPrice}>{getDiscountPrice(product.price, product.discountPercent)}$<sub>instead {product.price}$</sub></p>
                        : <p className={productArticleStyles.productPrice}>{product.price}$</p>
                }
                <button className={defaultStyles.buttonFilled}>Add to Cart</button>
            </Stack>
        </div>
    )
}