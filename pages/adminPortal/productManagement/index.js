import AdminPortalHeader from "@components/AdminPortalNav";
import defaultStyles from "../../stylesheet/global.module.css"
import productManagementStyles from "../../stylesheet/productManagement.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck, faChevronDown,
    faChevronUp,
    faCircle, faDollar,
    faFilter, faFont, faHashtag, faLock, faLockOpen, faPencil, faPercent,
    faPlus, faRocket, faSpoon, faTags, faTrash, faUsers,
    faWarehouse,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAllProducts, updateProduct, deleteProduct} from "@lib/api";
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel
} from "react-accessible-accordion";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import markdownElements from "@components/MarkdownReview.module.css";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import formatTimestamp from "@components/stylesUtils";

export default function ProductManagementPage({session}) {

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
                const products = await getAllProducts()
                setAllProducts(products)
                setProducts(products)
                setNumberOfProducts(products.length)
            } catch (e) {
                console.log(e)
            }
        }
        loadProducts()
    }, [])

    const switchItem = (id) =>  {
        setOpenedItem(id)
    }

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
        console.log(product)
        try {
            const updatedProduct = await updateProduct(product, session.accessToken)
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

    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId, session.accessToken)
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
            <AdminPortalHeader session={session} currentPage={1}/>
            <div className={productManagementStyles.accordionTblActions}>
                <div className={productManagementStyles.filterGroup}>
                    <div>
                        <FontAwesomeIcon icon={faFilter} size={"xl"} color={"white"} style={{marginRight: 10}}/>
                        <Form.Control className={productManagementStyles.filterInput} placeholder={"Filter Product"} value={filterProduct} onChange={(e) => {
                            setFilterProduct(e.target.value)
                            handleChangeFilter()
                        }}/>
                        <FontAwesomeIcon icon={faXmark} size={"xl"} onClick={() => setFilterProduct("")} color={"white"} title={"Clear filter"}/>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faCheck} size={"1x"} color={"white"} style={{marginRight: 10}}/>
                        <Form.Select
                            className={productManagementStyles.dropDownFilter}
                            onChange={(e) => {
                                setFilterActivable(e.target.value)
                                handleChangeFilter()
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
                    <div>
                        <FontAwesomeIcon icon={faWarehouse} size={"1x"} color={"white"} style={{marginRight: 10}}/>
                        <Form.Select className={productManagementStyles.dropDownFilter} onChange={(e) => {
                            setFilterStockAmount(e.target.value)
                            handleChangeFilter()
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
                    className={productManagementStyles.addBtn}
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
            <p style={{fontSize: 20}}>Number of products: {numberOfProducts}</p>
            <Accordion className={productManagementStyles.accordionContainer}>
                {
                    products
                        .map((product, index) => {
                            return (
                                <AccordionItem key={index} className={productManagementStyles.accordionItem} eventKey={product.id} onClick={() => switchItem(product.id)}>
                                    <AccordionItemHeading style={{width: "100%"}}>
                                        <AccordionItemButton className={productManagementStyles.accordionHeader}>
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
                                                <div>
                                                    {product.id === openedItem ?
                                                        <FontAwesomeIcon
                                                            icon={faChevronUp}
                                                            color={"white"}
                                                        /> :
                                                        <FontAwesomeIcon
                                                            icon={faChevronDown}
                                                            color={"white"}
                                                        />
                                                    }
                                                </div>


                                            </div>
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className={productManagementStyles.accordionPanel}>
                                        <div>
                                            <div>
                                                <h4>Images</h4>
                                                <div className={productManagementStyles.productImagesCollection}>
                                                    {
                                                        product.images.sort().map((image, index) => {
                                                            return (
                                                                <img
                                                                    style={!index > 0 ? {border: "solid 2px #8DF3E8", width: 300, height: 300} : null}
                                                                    key={index}
                                                                    src={image}
                                                                    alt={`${product.name} ${index}`}
                                                                    title={`${product.name} Image ${index + 1} ${!index > 0 ? "\nFirst Image" : ""}`}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>


                                            <div className={productManagementStyles.productInformation}>
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
                                                        <td><FontAwesomeIcon icon={faWarehouse}/></td>
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
                                            </div>
                                            <div className={productManagementStyles.productCrudBtnGroup}>
                                                <h4>Edit & Delete</h4>
                                                <button
                                                    className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}
                                                    onClick={() => editProduct(product.id)}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPencil}
                                                        style={{marginRight: 10}}
                                                    />
                                                    Edit product
                                                </button>
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
                                                <button
                                                    className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}
                                                    onClick={() => editDiscount(product.id)}
                                                >
                                                    <FontAwesomeIcon icon={faPercent} style={{marginRight: 10}}/>
                                                    Manage Discount
                                                </button>
                                                <div>
                                                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${product.active ? defaultStyles.buttonGreen: defaultStyles.buttonRed}`}
                                                            onClick={() => handleProductActivation(product)}>
                                                        {
                                                            product.active ?
                                                                <><FontAwesomeIcon icon={faLockOpen}/></>
                                                                : <><FontAwesomeIcon icon={faLock}/></>
                                                        }
                                                    </button>
                                                    <button
                                                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${defaultStyles.buttonRed}`}
                                                        onClick={() => handleDeleteProduct(product.id)}>
                                                        <FontAwesomeIcon icon={faTrash}/>Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </AccordionItemPanel>
                                </AccordionItem>

                            )
                        })
                }
            </Accordion>
        </div>
    )
}