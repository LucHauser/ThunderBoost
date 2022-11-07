import ProductForm from "@components/ProductForm";
import {Form, Modal, SplitButton, Dropdown} from "react-bootstrap";
import {useEffect, useState} from "react";
import productDataStyles from "./ProductData.module.css"
import {getAllBaseDataVariety, getAllProducts, getAllProductsInclusiveConnectVariety, login} from "@lib/api";
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
import ReactMarkdown from "react-markdown";

export default function ProductData(session) {

    const selectFilterActivableOptions = ["all", "active", "inactive"]
    const selectFilterStockAmountOptions = ["all", "available", "empty"]

    const [showProductFormDialog, setShowProductFormDialog] = useState(false)
    const [products, setProducts] = useState([])
    const [varieties, setVarieties] = useState([])
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

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const varieties = await getAllBaseDataVariety()
                setVarieties(varieties)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [])

    const getNameByVarietyId = (id) => {
        for (let i = 0; i < varieties.length; i++) {
            if (id === varieties[i].id) {
                return varieties[i].name
            }
        }
    }

    const getDescriptionByVarietyId = (id) => {
        for (let i = 0; i < varieties.length; i++) {
            if (id === varieties[i].id) {
                return varieties[i].description
            }
        }
    }

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
                                                <table className={productDataStyles.productSpecs}>
                                                    <tr>
                                                        <td>Name</td>
                                                        <td>{product.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Usage</td>
                                                        <td>{product.usage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Servings</td>
                                                        <td>{product.servings}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Price</td>
                                                        <td>{product.price}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Stock amount</td>
                                                        <td>{product.stockAmount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Release Date</td>
                                                        <td>{product.releaseDate}</td>
                                                    </tr>
                                                </table>
                                                <div className={productDataStyles.varietyList}>
                                                    <p>Varieties: </p>
                                                    {product.productHasVarieties.map(connect => {
                                                        return (
                                                            <p
                                                                className={productDataStyles.varietyName}
                                                                key={connect.id}
                                                                title={!getDescriptionByVarietyId(connect.baseDataVarietyId) === "" ?
                                                                    getNameByVarietyId(connect.baseDataVarietyId) :
                                                                    getDescriptionByVarietyId(connect.baseDataVarietyId)}
                                                            >
                                                                {getNameByVarietyId(connect.baseDataVarietyId)}
                                                            </p>
                                                        )
                                                    })}
                                                </div>
                                                <h4 style={{
                                                    margin: "15px 0",
                                                    width: "100%",
                                                    borderBottom: "solid 2px #FFFFFF",
                                                    paddingBottom: 5}}>
                                                    Description
                                                </h4>
                                                {/* eslint-disable-next-line react/no-children-prop */}
                                                <ReactMarkdown children={product.description}/>
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