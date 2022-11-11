import {useState} from "react";

export default function QuantityCountSwitch(product, toggleCounter, onEditedProduct) {

    const [productToEdit, setProductToEdit] = useState(product)
    const [quantity, setQuantity] = useState(product.stockAmount)

    return (
        <div>
            <div>
                <button disabled={quantity < 1} onClick={setQuantity(quantity - 1)}>-</button>
                <p>{quantity}</p>
                <button onClick={setQuantity(quantity + 1)}>+</button>
            </div>
            <div>
                <button>Change</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}