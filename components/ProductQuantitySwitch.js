import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";

export default function QuantityCountSwitch(product, toggleModal, onEditedProduct) {

    const [productToEdit, setProductToEdit] = useState(product)
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        if (product) {
            setProductToEdit(product)
        }
    }, [productToEdit])

    useEffect(() => {
        if (productToEdit?.stockAmount) {
            setQuantity(productToEdit.stockAmount)
        }
    }, [quantity])

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Product Quantity</Form.Label>
                    <Form.Control type={"number"} onChange={(e) => setQuantity(e.target.value)} value={quantity}/>
                </Form.Group>
            </Form>
            <div>
                <button>Change</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}