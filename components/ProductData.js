import ProductForm from "@components/ProductForm";
import {Form, Modal, SplitButton, Dropdown} from "react-bootstrap";
import {useEffect, useState} from "react";
import productDataStyles from "./ProductData.module.css"
import {getAllProducts, getAllProductsInclusiveConnectVariety} from "@lib/api";
import {
    faPlus,
    faXmark,
    faFilter,
    faCheck,
    faCircle,
    faWarehouse,
    faFont,
    faDollar,
    faSpoon,
    faUsers,
    faTags,
    faMinus
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Accordion, AccordionItem, AccordionItemHeading,AccordionItemButton, AccordionItemPanel} from "react-accessible-accordion";
import DropdownItem from "react-bootstrap/DropdownItem";
import VarietyList from "@components/VarietyList";

export default function ProductData(session) {

    const selectFilterActivableOptions = ["all", "active", "inactive"]
    const selectFilterStockAmountOptions = ["all", "available", "empty"]

    const [showProductFormDialog, setShowProductFormDialog] = useState(false)
    const [products, setProducts] = useState([])
    const [numberOfProducts, setNumberOfProducts] = useState(0)
    const [filterProduct, setFilterProduct] = useState("")
    const [filterActiveProduct, setFilterActiveProduct] = useState(selectFilterActivableOptions[0])
    const [filterStockAmount, setFilterStockAmount] = useState(selectFilterStockAmountOptions[0])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProductsInclusiveConnectVariety()
                setProducts(products)
                setNumberOfProducts(products.length)
            } catch (e) {
                console.log(e)
            }
        }
        loadProducts()
    }, [])

    return (
        <div className={productDataStyles.wrapper}>
            <h3 className={productDataStyles.title}>Product Management</h3>
            <p className={productDataStyles.information}>Management of products in the Thunderboost-Shop. Create Product, edit products, activate or disable show product or edit stock-amount</p>
            <div className={productDataStyles.accordionTblActions}>
                <div className={productDataStyles.filterGroup}>
                    <div>
                        <FontAwesomeIcon icon={faFilter} size={"xl"} color={"white"} style={{marginRight: 10}}/>
                        <Form.Control className={productDataStyles.filterInput} placeholder={"Filter Product"} value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}/>
                        <FontAwesomeIcon icon={faXmark} size={"xl"} onClick={() => setFilterProduct("")} color={"white"} title={"Clear filter"}/>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faCheck} size={"1x"} color={"white"} style={{marginRight: 10}}/>
                        <Form.Select className={productDataStyles.dropDownFilter}>
                            <option disabled>select</option>
                            {selectFilterActivableOptions.map(selectOption => {
                                return (
                                    <option key={selectOption} value={selectOption}>{selectOption}</option>
                                )
                            })}
                        </Form.Select>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faWarehouse} size={"1x"} color={"white"} style={{marginRight: 10}}/>
                        <Form.Select className={productDataStyles.dropDownFilter}>
                            <option disabled>select</option>
                            {selectFilterStockAmountOptions.map(selectOption => {
                                return (
                                    <option key={selectOption} value={selectOption}>{selectOption}</option>
                                )
                            })}
                        </Form.Select>
                    </div>
                </div>

                <button className={productDataStyles.addBtn} onClick={() => setShowProductFormDialog(true)}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        size={"1x"}
                        color={"white"}
                        title={"Add a new variety"}
                        style={{marginRight: 5}}
                    />Create Product
                </button>
            </div>
            <p>Number of products: {numberOfProducts}</p>
            <Accordion className={productDataStyles.accordionContainer}>
                {
                    products.map(product => {
                        return (
                            <>
                                <AccordionItem className={productDataStyles.accordionItem} eventKey={product.id}>
                                    <AccordionItemHeading style={{width: "100%"}}>
                                        <AccordionItemButton className={productDataStyles.accordionHeader}>
                                            <p>{product.name}</p>
                                            <p>Status:&nbsp;
                                                <FontAwesomeIcon
                                                    icon={faCircle}
                                                    size={"1x"}
                                                    color={product.active ? "#6aa84f" : "#cc0000"}
                                                    title={product.active ? "Activ - Visible in shop" : "Not activ - Not visible in shop"} style={{cursor: "help"}}
                                                />
                                            </p>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className={productDataStyles.accordionPanel}>
                                        <div>
                                            <img src={"https://via.placeholder.com/300"}/>
                                            <div className={productDataStyles.productInformation}>
                                                <h4>Information</h4>
                                                <ul>
                                                    <p>Name: {product.name}</p>
                                                    <p>Usage: {product.usage}</p>
                                                    <p>Servings: {product.servings}</p>
                                                    <p>Price: {Number.parseFloat(product.price).toFixed(2)} $</p>
                                                    <p>Stock Amount: {product.stockAmount}</p>
                                                    <p>Release Date: {product.releaseDate}</p>
                                                </ul>
                                                <VarietyList productHasVarieties={product?.productHasVarieties}/>
                                            </div>
                                            <div>
                                                <h4>Action</h4>
                                                <button>Edit product</button>
                                                <button>Edit stock quantity</button>
                                                <button>{product.active ? "Deactivate product": "Activate product"}</button>
                                                <button>Delete</button>
                                            </div>
                                        </div>

                                    </AccordionItemPanel>
                                </AccordionItem>
                            </>

                        )
                    })
                }
            </Accordion>

            <Modal show={showProductFormDialog} className={productDataStyles.dialogProductForm}>
                <ProductForm session={session}
                     toggleModal={() => setShowProductFormDialog(false)}
                     onProductCreated={(product) => {
                         setProducts([...products, product])
                         setFilterProduct("")
                }}/>
            </Modal>

        </div>
    )
}