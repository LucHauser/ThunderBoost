import ProductForm from "@components/ProductForm";
import {Form, Modal, SplitButton, Dropdown} from "react-bootstrap";
import {useEffect, useState} from "react";
import productDataStyles from "./ProductData.module.css"
import defaultStyles from "../pages/stylesheet/global.module.css"
import {getAllBaseDataVariety, getAllProducts, getAllProductsInclusiveConnectVariety, login} from "@lib/api";
import {
    faChevronDown,
    faChevronUp,
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
    faRocket,
    faTags, faPencil, faTrash, faLock, faLockOpen,
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
            <p style={{fontSize: 20}}>Number of products: {numberOfProducts}</p>
            <Accordion className={productDataStyles.accordionContainer}>
                {
                    products.map(product => {
                        return (
                            <>
                                <AccordionItem className={productDataStyles.accordionItem} eventKey={product.id}>
                                    <AccordionItemHeading style={{width: "100%"}}>
                                        <AccordionItemButton className={productDataStyles.accordionHeader}>
                                            <p>{product.name}</p>
                                            <div style={{display: "flex", gap: 15}}>
                                                <p>Stock Amount:&nbsp;
                                                    <FontAwesomeIcon
                                                        icon={faCircle}
                                                        size={"1x"}
                                                        color={product.stockAmount === 0 ? "#cc0000" : (product.stockAmount > 5 ? "#6aa84f" : "#ccaa00")}
                                                        title={`Stock Amount: ${product.stockAmount}`}
                                                        style={{cursor: "help"}}
                                                    />
                                                </p>
                                                <p>Status:&nbsp;
                                                    <FontAwesomeIcon
                                                        icon={faCircle}
                                                        size={"1x"}
                                                        color={product.active ? "#6aa84f" : "#cc0000"}
                                                        title={product.active ? "Activ - Visible in shop" : "Not activ - Not visible in shop"}
                                                        style={{cursor: "help"}}
                                                    />
                                                </p>

                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className={productDataStyles.accordionPanel}>
                                        <div>
                                            <img src={"https://via.placeholder.com/300"}/>
                                            <div className={productDataStyles.productInformation}>
                                                <h4>Information</h4>
                                                <table className={productDataStyles.productSpecs}>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faFont}/></td>
                                                        <td>Name</td>
                                                        <td>{product.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faUsers}/></td>
                                                        <td>Usage</td>
                                                        <td>{product.usage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faSpoon}/></td>
                                                        <td>Servings</td>
                                                        <td>{product.servings} portions</td>
                                                    </tr>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faDollar}/></td>
                                                        <td>Price</td>
                                                        <td>{parseFloat(product.price).toFixed(2)} $</td>
                                                    </tr>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faWarehouse}/></td>
                                                        <td>Stock amount</td>
                                                        <td>{product.stockAmount} pieces</td>
                                                    </tr>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faRocket}/></td>
                                                        <td>Release Date</td>
                                                        <td>{product.releaseDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><FontAwesomeIcon icon={faTags}/></td>
                                                        <td>Varieties</td>
                                                        <td><div className={productDataStyles.varietyList}>
                                                            {product.productHasVarieties.map(connect => {
                                                                return (
                                                                    <p
                                                                        className={productDataStyles.varietyName}
                                                                        key={connect.id}
                                                                        title={getDescriptionByVarietyId(connect.baseDataVarietyId) === "" ?
                                                                            getNameByVarietyId(connect.baseDataVarietyId) :
                                                                            getDescriptionByVarietyId(connect.baseDataVarietyId)}
                                                                    >
                                                                        {getNameByVarietyId(connect.baseDataVarietyId)}
                                                                    </p>
                                                                )
                                                            })}
                                                        </div></td>
                                                    </tr>
                                                </table>

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
                                            <div className={productDataStyles.productCrudBtnGroup}>
                                                <h4>Edit & Delete</h4>
                                                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}><FontAwesomeIcon icon={faPencil}/> Edit product</button>
                                                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}><FontAwesomeIcon icon={faWarehouse}/> Edit stock quantity</button>
                                                <div>
                                                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${product.active ? defaultStyles.buttonRed: defaultStyles.buttonGreen}`}>{product.active ? <><FontAwesomeIcon icon={faLock}/></> : <><FontAwesomeIcon icon={faLockOpen}/></> }</button>
                                                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${defaultStyles.buttonRed}`}><FontAwesomeIcon icon={faTrash}/>Delete</button>
                                                </div>
                                            </div>
                                        </div>

                                    </AccordionItemPanel>
                                </AccordionItem>
                            </>

                        )
                    })
                }
            </Accordion>
            <Modal show={showProductFormDialog} className={productDataStyles.dialogProductForm} onHide={() => setShowProductFormDialog(false)}>
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