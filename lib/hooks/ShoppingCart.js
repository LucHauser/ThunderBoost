import Image from "next/image"
import styles from "./ShoppingCart.module.css"

export default function ShoppingCart({ shoppingCart }) {
    const sumOfPrices = shoppingCart.products.reduce((acc, curr) => {
        acc += curr.price * curr.amount
        return acc
    }, 0)
    return (
        <div className={ styles.shoppingcart }>
            <button onClick={ () => shoppingCart.hide() }>hide</button>
            <h1>Shopping Cart</h1>
            <h3>Total: { sumOfPrices } .-</h3>
            <ul>
                {
                    shoppingCart.products.map(product => {
                        return (
                            <article key={ product.id }>
                                <h2 className={ styles.title }>{ product.name })</h2>
                                <Image
                                    src={ product.image }
                                    width={ 396 / 4 }
                                    height={ 198 / 4 }
                                    alt="product image"
                                />
                                <p>Price: { product.price } .-</p>

                                <div className={ styles.actions }>
                                    <span onClick={ () => {
                                        shoppingCart.remove(product, true)
                                    } }>🗑
                                    </span>
                                    <button onClick={ () => {
                                        shoppingCart.remove(product)
                                    } }>-
                                    </button>
                                    <span> { product.amount } </span>
                                    <button onClick={ () => shoppingCart.add(product) }>+</button>
                                </div>
                            </article>
                        )
                    })
                }
            </ul>
        </div>
    )
}