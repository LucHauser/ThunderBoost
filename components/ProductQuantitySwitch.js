import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";

export default function QuantityCountSwitch(productForEdit, toggleModal, onEditedProduct) {

    const [product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        if (productForEdit) {
            setProduct(productForEdit)
        }
    }, [productForEdit])

    useEffect(() => {
        if (product.stockAmount) {
            setQuantity(parseInt(product.stockAmount))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parseInt(productForEdit.stockAmount)])

    function increment() {
        setQuantity(function (prevCount) {
            return (prevCount += 1)
        })
    }

    function decrement() {
        setQuantity(function (prevCount) {
            if (prevCount > 0) {
                return (prevCount -= 0)
            } else {
                return (prevCount = 0)
            }
        })
    }

    const handleUpdateQuantity = async (quantity) => {

    }

    return (
        <div>
            <div>
                <button onClick={decrement}>-</button>
                <Form.Group>
                    <Form.Label>Product Quantity</Form.Label>
                    <Form.Control type={"number"} onChange={e => setQuantity(e.target.valueAsNumber)} value={quantity}/>
                </Form.Group>
                <button onClick={increment}>+</button>
            </div>
            <div>
                <button onClick={handleUpdateQuantity}>Change</button>
                <button onClick={() => toggleModal()}>Cancel</button>
            </div>
        </div>
    )
}