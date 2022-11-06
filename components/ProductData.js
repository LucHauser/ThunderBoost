import ProductForm from "@components/ProductForm";
import {Accordion, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import productDataStyles from "./ProductData.module.css"
import {getAllProducts} from "@lib/api";

export default function ProductData(session) {

    const selectActivableOptions = ["active", "inactive", "all"]

    const [showProductFormDialog, setShowProductFormDialog] = useState(false)
    const [products, setProducts] = useState([])
    const [filterProduct, setFilterProduct] = useState("")
    const [filterActiveProduct, setFilterActiveProduct] = useState(selectActivableOptions[0])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProducts()
                setProducts(products)
            } catch (e) {
                console.log(e)
            }
        }
        loadProducts()
    }, [])

    return (
        <div>
            <Accordion flush>

            </Accordion>
            <button onClick={() => setShowProductFormDialog(true)}>Create Product</button>
            <Modal show={showProductFormDialog} className={productDataStyles.dialogProductForm}>
                <ProductForm session={session} toggleModal={() => setShowProductFormDialog(false)}/>
            </Modal>

        </div>
    )
}