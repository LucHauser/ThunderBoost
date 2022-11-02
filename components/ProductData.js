import ProductForm from "@components/ProductForm";
import {Modal} from "react-bootstrap";
import {useState} from "react";

export default function ProductData(session) {

    const [showProductFormDialog, setShowProductFormDialog] = useState(false)

    return (
        <div>
            <button onClick={() => setShowProductFormDialog(true)}>Create Product</button>
            <Modal show={showProductFormDialog}>
                <ProductForm session={session} toggleModal={() => setShowProductFormDialog(false)}/>
            </Modal>

        </div>
    )
}