import productArticleStyles from "./ProductCollectionItem.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {checkIfProductIsNowDiscount, getDiscountPrice} from "@components/Utils";

export default function ProductArticle({session, product, routeToDetail}) {

    return (
        <div className={productArticleStyles.container} onClick={() => routeToDetail()}>
            <div className={productArticleStyles.productImage} style={{backgroundImage: `url(${product.images[0]})`}}>

            </div>
            <p className={productArticleStyles.productName}>{product.name}</p>
            <div>
            </div>
            {
                product.discountActive && (new Date(product.discountFrom) > Date.now() && new Date(product.discountUntil) > Date.now()) ?
                    <p className={productArticleStyles.productPrice}>{getDiscountPrice(product.price, product.discountPercent)}$<sub>instead {product.price}$</sub></p>
                    : <p className={productArticleStyles.productPrice}>{product.price}$</p>
            }
            <button className={defaultStyles.buttonFilled}>Add to Cart</button>
        </div>
    )

    //<img className={productArticleStyles.productImage} src={product.images ? product.images[0] : "https://via.placeholder.com/150"} alt={product.name}/>
}