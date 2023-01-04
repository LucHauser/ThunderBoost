import AdminPortalHeader from "@components/pageUtils/AdminPortalNav";
import defaultStyles from "../../stylesheet/global.module.css"
import productManagementStyles from "../../stylesheet/productManagement.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar, faCalendarCheck, faCalendarXmark,
    faCheck,
    faCircle, faDollar,
    faFilter, faFont, faHashtag, faLock, faLockOpen, faPencil, faPercent,
    faPlus, faRocket, faSpoon, faTags, faTrash, faUsers,
    faWarehouse,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {Col, Container, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAllProducts, updateProduct, deleteProduct, getAllBaseDataVariety} from "@lib/api";
import {
    Accordion
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import markdownElements from "@components/views/MarkdownReview.module.css";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import formatTimestamp, {
    checkIfProductIsNowDiscount, formatServerUrl, isEventNow, isEventNowWithBoolean
} from "@components/Utils";
import {actualizeVarietyListAfterDeleteProduct} from "@lib/utils/baseDataVarietyUtils";
import data from "bootstrap/js/src/dom/data";

export default function ProductManagementPage({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const selectFilterActivableOptions = ["all", "active", "inactive"]
    const selectFilterStockAmountOptions = ["all", "available", "empty"]

    const [products, setProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [allVarieties, setAllVarieties] = useState([])
    const [productToEdit, setProductToEdit] = useState({})
    const [numberOfProducts, setNumberOfProducts] = useState(0)
    const [filterProduct, setFilterProduct] = useState("")
    const [filterActivable, setFilterActivable] = useState(selectFilterActivableOptions[0])
    const [filterStockAmount, setFilterStockAmount] = useState(selectFilterStockAmountOptions[0])
    const [openedItem, setOpenedItem] = useState(0)

    const router = useRouter()

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProducts(host)
                setAllProducts(products)
                setProducts(products)
                setNumberOfProducts(products.length)
            } catch (e) {
                console.log(e)
            }
        }
        loadProducts()
    }, [host])

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const varieties = await getAllBaseDataVariety(host)
                setAllVarieties(varieties)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [host])

    useEffect(() => {
        handleChangeFilter()
        setNumberOfProducts(products.length)
    }, [filterProduct, filterActivable, filterStockAmount, products])

    const handleChangeFilter = () => {
        let filteredProduct
        if (filterActivable === selectFilterActivableOptions[1]) {
            filteredProduct = allProducts.filter(p => p.active)
            if (filterStockAmount === selectFilterStockAmountOptions[1]) {
                filteredProduct.filter(p => p.stockAmount > 0)
            } else if (filterStockAmount === selectFilterStockAmountOptions[2]) {
                filteredProduct.filter(p => p.stockAmount === 0)
            }
        } else if (filterActivable === selectFilterActivableOptions[2]) {
            filteredProduct = allProducts.filter(p => !p.active)
            if (filterStockAmount === selectFilterStockAmountOptions[1]) {
                filteredProduct.filter(p => p.stockAmount > 0)
            } else if (filterStockAmount === selectFilterStockAmountOptions[2]) {
                filteredProduct.filter(p => p.stockAmount === 0)
            }
        } else {
            if (filterStockAmount === selectFilterStockAmountOptions[1]) {
                filteredProduct = allProducts.filter(p => p.stockAmount > 0)
            } else if (filterStockAmount === selectFilterStockAmountOptions[2]) {
                filteredProduct = allProducts.filter(p => p.stockAmount === 0)
            } else {
                filteredProduct = allProducts
            }
        }
        setProducts(filteredProduct.filter(p => p.name.toString().toUpperCase().toLowerCase().includes(filterProduct)))
        setNumberOfProducts(products.length)
    }

    const handleProductActivation = async (product) => {
        //delete product.productHasVarieties
        product.active = !product.active;
        try {
            const updatedProduct = await updateProduct(formatServerUrl(document.location.hostname), product, session.accessToken)
            setProducts(products => {
                return products.map(p => {
                    if (p.id === updatedProduct.id) {
                        return {...p, ...updatedProduct}
                    } else {
                        return p
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    const handleDiscountActivation = async (product) => {
        product.discountActive = !product.discountActive
        try {
            const updatedProduct = await updateProduct(host, product, session.accessToken)
            setProducts(products => {
                return products.map(p => {
                    if (p.id === updatedProduct.id) {
                        return {...p, ...updatedProduct}
                    } else {
                        return p
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    const handleDeleteProduct = async (productId, varieties) => {
        await deleteProduct(host, productId, session.accessToken)
        actualizeVarietyListAfterDeleteProduct(session, host, varieties, allVarieties)
        setProducts((prevState) => prevState.filter(p => p.id !== productId))
    }

    const createNewProduct = () => {
        router.push("./productManagement/create")
    }

    const editProduct = (id) => {
        router.push(`./productManagement/${id}/edit`)
    }

    const editDiscount = (id) => {
        router.push(`./productManagement/${id}/discountSettings`)
    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} id={productManagementStyles["productManagementPageLayout"]}>
                <Row>
                    <Col>
                        <AdminPortalHeader session={session} currentPage={1}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={defaultStyles.filterActionBar}>
                            <div className={defaultStyles.filterGroup}>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <FontAwesomeIcon icon={faFilter} size={"xl"} color={"white"} style={{marginRight: 10}}/>
                                    <Form.Control className={defaultStyles.filterInputField} placeholder={"Filter Product"} value={filterProduct} onChange={(e) => {
                                        setFilterProduct(e.target.value)
                                    }}/>
                                    <FontAwesomeIcon icon={faXmark} size={"xl"} onClick={() => setFilterProduct("")} color={"white"} title={"Clear filter"}/>
                                </div>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <FontAwesomeIcon icon={faCheck} size={"1x"} color={"white"} style={{marginRight: 10}}/>
                                    <Form.Select
                                        className={defaultStyles.dropDownFilter}
                                        onChange={(e) => {
                                            setFilterActivable(e.target.value)
                                        }}
                                        defaultValue={filterActivable}>
                                        <option disabled>select</option>
                                        {selectFilterActivableOptions.map((selectOption, index) => {
                                            return (
                                                <option key={index} value={selectOption}>{selectOption}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </div>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <FontAwesomeIcon icon={faWarehouse} size={"1x"} color={"white"} style={{marginRight: 10}}/>
                                    <Form.Select className={defaultStyles.dropDownFilter} onChange={(e) => {
                                        setFilterStockAmount(e.target.value)
                                    }}>
                                        <option disabled>select</option>
                                        {selectFilterStockAmountOptions.map((selectOption, index) => {
                                            return (
                                                <option key={index} value={selectOption}>{selectOption}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </div>
                            </div>

                            <button
                                className={defaultStyles.createBtn}
                                onClick={createNewProduct}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    size={"1x"}
                                    color={"white"}
                                    title={"Create a new Product"}
                                    style={{marginRight: 5}}
                                />Create Product
                            </button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p
                            style={{fontSize: 20}}
                            className={productManagementStyles.numberOfProduct}
                        >
                            Number of products: {numberOfProducts}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Accordion className={defaultStyles.accordionContainer} flush alwaysOpen>
                            {
                                products
                                    .map((product, index) => {
                                        return (
                                            <Accordion.Item key={index} className={defaultStyles.accordionItem} eventKey={`${index}`}>
                                                <Accordion.Header className={defaultStyles.accordionHeader}>
                                                    <div className={productManagementStyles.headerContents}>
                                                        <p>{product.name}</p>
                                                        <div style={{display: "flex", gap: 15}}>
                                                            <p>Status:&nbsp;
                                                                <FontAwesomeIcon
                                                                    icon={faCircle}
                                                                    size={"1x"}
                                                                    color={product.active ? "#6aa84f" : "#cc0000"}
                                                                    title={product.active ? "Activ - Visible in shop" : "Not activ - Not visible in shop"}
                                                                    style={{cursor: "help"}}
                                                                />
                                                            </p>
                                                            <p>Stock Amount:&nbsp;
                                                                <FontAwesomeIcon
                                                                    icon={faCircle}
                                                                    size={"1x"}
                                                                    color={product.stockAmount === "0" ? "#cc0000" : (product.stockAmount > 5 ? "#6aa84f" : "#ccaa00")}
                                                                    title={`Stock Amount: ${product.stockAmount}`}
                                                                    style={{cursor: "help"}}
                                                                />
                                                            </p>
                                                            <p>Discount Status&nbsp;
                                                                <FontAwesomeIcon
                                                                    icon={faCircle}
                                                                    size={"1x"}
                                                                    color={isEventNowWithBoolean(product.discountFrom, product.discountUntil, product.discountActive) && product.discountActive ?
                                                                        "#6aa84f"
                                                                        : "#cc0000"
                                                                    }
                                                                />
                                                            </p>
                                                        </div>
                                                    </div>

                                                </Accordion.Header>
                                                <Accordion.Body className={defaultStyles.accordionBody}>
                                                    <Container fluid={true}>
                                                        <Row>
                                                            <Col md={2} className={productManagementStyles.imageCol}>
                                                                <h4>Images</h4>
                                                                <div className={productManagementStyles.productImagesCollection}>
                                                                    {
                                                                        product.images.sort().map((image, index) => {
                                                                            return (
                                                                                <img
                                                                                    key={index}
                                                                                    src={image}
                                                                                    alt={`${product.name} ${index}`}
                                                                                    title={`${product.name} Image ${index + 1} ${!index > 0 ? "\nFirst Image" : ""}`}
                                                                                />
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col md={8}>
                                                                <h4>Information</h4>
                                                                <table className={productManagementStyles.productSpecs}>
                                                                    <tr>
                                                                        <td><FontAwesomeIcon icon={faHashtag}/></td>
                                                                        <td>Id</td>
                                                                        <td>{product.id}</td>
                                                                    </tr>
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
                                                                        <td><FontAwesomeIcon icon={faWarehouse} size={"sm"}/></td>
                                                                        <td>Stock amount</td>
                                                                        <td>{product.stockAmount} pieces</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><FontAwesomeIcon icon={faRocket}/></td>
                                                                        <td>Release Date</td>
                                                                        <td>{formatTimestamp(product.releaseDate, "dd.MMMM.yyyy HH:mm")}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><FontAwesomeIcon icon={faTags}/></td>
                                                                        <td>Varieties</td>
                                                                        <td>
                                                                            <div className={productManagementStyles.varietyList}>
                                                                                {product.varieties.map(v => {
                                                                                    return (
                                                                                        // eslint-disable-next-line react/jsx-key
                                                                                        <p className={productManagementStyles.varietyName}>{v}</p>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={2}>
                                                                            <h4>Discount Information</h4>
                                                                        </td>
                                                                    </tr>
                                                                    {
                                                                        product.discountActive ?
                                                                            <>
                                                                                <tr>
                                                                                    <td><FontAwesomeIcon icon={faCheck}/></td>
                                                                                    <td>Discount Active</td>
                                                                                    <td>{isEventNowWithBoolean(product.discountFrom, product.discountUntil, product.discountActive) ? "active": "inactive"}</td>
                                                                                </tr>
                                                                                {
                                                                                    product.discountFrom !== "" || product.discountUntil !== "" ?
                                                                                        <>
                                                                                            <tr>
                                                                                                <td><FontAwesomeIcon icon={faCalendarCheck}/></td>
                                                                                                <td>Discount Start</td>
                                                                                                <td>{product.discountFrom !== "" ? formatTimestamp(product.discountFrom, "dd.MMMM.yyyy HH:mm") : "Not setted, ends until end date"}</td>
                                                                                            </tr>

                                                                                            <tr>
                                                                                                <td><FontAwesomeIcon icon={faCalendarXmark}/></td>
                                                                                                <td>Discount End</td>
                                                                                                <td>{product.discountUntil !== "" ? formatTimestamp(product.discountUntil, "dd.MMMM.yyyy HH:mm") : "Not setted, active after start"}</td>
                                                                                            </tr>
                                                                                        </> :
                                                                                        <tr>
                                                                                            <td><FontAwesomeIcon icon={faCalendar}/></td>
                                                                                            <td colSpan={1}>No dates, discount always active</td>
                                                                                        </tr>

                                                                                }

                                                                            </> :
                                                                            <tr>
                                                                                <td colSpan={2}><i>Not Activated</i></td>
                                                                            </tr>
                                                                    }
                                                                </table>

                                                                <h4 style={{
                                                                    margin: "15px 0",
                                                                    width: "100%",
                                                                    borderBottom: "solid 2px #FFFFFF",
                                                                    paddingBottom: 5}}>
                                                                    Description
                                                                </h4>
                                                                <ReactMarkdown
                                                                    /* eslint-disable-next-line react/no-children-prop */
                                                                    children={product.description}
                                                                    rehypePlugins={[rehypeRaw, remarkGfm]}
                                                                    className={markdownElements.elements}
                                                                />
                                                            </Col>
                                                            <Col md={2} className={productManagementStyles.btnGroupCol}>
                                                                <div className={productManagementStyles.productCrudBtnGroup}>
                                                                    <h4>Edit & Delete</h4>
                                                                    <div>
                                                                        <button
                                                                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}
                                                                            onClick={() => editProduct(product.id)}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPencil}
                                                                                style={{marginRight: 10}}
                                                                            />
                                                                            Edit product
                                                                        </button>
                                                                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${product.active ? defaultStyles.buttonGreen: defaultStyles.buttonRed}`}
                                                                                onClick={() => handleProductActivation(product)}>
                                                                            <FontAwesomeIcon icon={product.active ? faLockOpen : faLock}/>
                                                                        </button>
                                                                    </div>

                                                                    <button
                                                                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}
                                                                        /*onClick={}*/
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faWarehouse}
                                                                            style={{marginRight: 10}}
                                                                        />
                                                                        Edit stock quantity
                                                                    </button>
                                                                    <div>
                                                                        <button
                                                                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}
                                                                            onClick={() => editDiscount(product.id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faPercent} style={{marginRight: 10}}/>
                                                                            Manage Discount
                                                                        </button>
                                                                        <button
                                                                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${product.discountActive ? defaultStyles.buttonGreen: defaultStyles.buttonRed}`}
                                                                            onClick={() => handleDiscountActivation(product)}
                                                                        >
                                                                            {
                                                                                product.discountActive ?
                                                                                    <><FontAwesomeIcon icon={faLockOpen}/></>
                                                                                    : <><FontAwesomeIcon icon={faLock}/></>
                                                                            }
                                                                        </button>
                                                                    </div>

                                                                    <div>
                                                                        <button
                                                                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm} ${defaultStyles.buttonRed}`}
                                                                            onClick={() => handleDeleteProduct(product.id, product.varieties)}>
                                                                            <FontAwesomeIcon icon={faTrash}/>&nbsp;Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </Accordion.Body>
                                            </Accordion.Item>

                                        )
                                    })
                            }
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}