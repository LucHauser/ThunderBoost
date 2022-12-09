import {useEffect, useState} from "react";
import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import productFormStyles from "./ProductForm.module.css"
import markdownElements from "./MarkdownReview.module.css"
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ReactMarkdown from "react-markdown";
import {faFilePen, faFileLines, faCircleInfo, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAllBaseDataVariety} from "@lib/api";
import {createProduct, updateProduct} from "@lib/api";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import ImageSelectionList from "@components/ImageSelectionList";
import VarietySelectionList from "@components/VarietySelectionList";



export default function ProductForm({session, productToEdit}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const usages = ["Gaming", "Office", "Students & Pupils"]

    function validateProductModel(product, selectedVarieties) {
        const errors = {
            name: "",
            price: null,
            servings: null,
            description: "",
            stockAmount: null,
            usage: "",
            releaseDate: "",
            varieties: null,
            images: ""
        }

        let isValid = true

        if (product.name.trim().length === 0) {
            errors.name = "Name is required"
            isValid = false
        }
        if (product.name.length > 50) {
            errors.name = "Max. 50 Character enabled"
            isValid = false
        }
        if (product.price === null) {
            errors.price = "Price is required"
            isValid = false
        }
        if (!product.price > 0) {
            errors.price = "Price must be greater than 0"
            isValid = false
        }
        if (product.servings === null) {
            errors.servings = "Servings is required"
            isValid = false
        }
        if (!product.servings > 0) {
            errors.servings = "Servings must be greater than 0"
            isValid = false
        }
        if (product.description.trim().length === 0) {
            errors.description = "Description is required"
            isValid = false
        }
        if (product.description.length > 255) {
            errors.description = "Max. 255 Characters enabled"
            isValid = false
        }
        if (product.stockAmount === null) {
            errors.stockAmount = "Stock amount is required"
            isValid = false
        }
        if (!product.stockAmount > 0) {
            errors.stockAmount = "Stock amount bust be greater than 0"
            isValid = false
        }
        if (product.usage === "") {
            errors.usage = "Please select Usage"
            isValid = false
        }
        if (product.releaseDate === "") {
            errors.releaseDate = "Release Date must be set"
            isValid = false
        }
        /* if (product.img === "") {
            errors.img = "Image is required"
            isValid = false
        } */
        if (!product.varieties > 0) {
            errors.varieties = "Please choose one Variety or more"
            isValid = false
        }
        return {errors, isValid}
    }

    const defaultProductModel = {
        name: "",
        price: null,
        servings: null,
        usage: "",
        description: "",
        stockAmount: null,
        images: [],
        releaseDate: "",
        showProductBeforeRelease: false,
        varieties: [],
        active: true,
        // Discount properties when update Product
        discountActive: false,
        discountPercent: null,
        discountFrom: "",
        discountUntil: "",
        showDiscountUntilDate: false,
        discountUntilText: "",
        enableCountdown: false
    }

    const [productModel, setProductModel] = useState(defaultProductModel)
    const [errors, setErrors] = useState({})
    const [loadProduct, setLoadProduct] = useState(false)
    const [varieties, setVarieties] = useState([])
    const [images, setImages] = useState([])
    const [markdownReview, setMarkdownReview] = useState("")
    const [markdownMode, setMarkdownMode] = useState(false)
    const [showImageSelectionDialog, setShowImageSelectionDialog] = useState(false)
    const [showVarietySelectionDialog, setShowVarietySelectDialog] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const fetchedVarieties = await getAllBaseDataVariety()
                let varietyListString = []
                for (let i = 0; i < fetchedVarieties.length; i++) {
                    if (fetchedVarieties[i].active) {
                        varietyListString.push({label: fetchedVarieties[i].name, value: fetchedVarieties[i].name})
                    }
                }
                setVarieties(varietyListString)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [])

    useEffect(() => {
        if (productToEdit) {
            setProductModel(productToEdit)
            setMarkdownReview(productModel.description)
            const imagesOfProductToEdit = productToEdit.images
            setImages(imagesOfProductToEdit)
        }
        console.log(images)
    }, [productToEdit])

    const onProductChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setProductModel({
            ...productModel,
            [name]: value
        })
    }

    const onDescriptionChange = (e) => {
        const value = e.target.value
        setMarkdownReview(value)
        setProductModel({
            ...productModel,
            description: value
        })
    }

    const addImageToList = (name) => {
        if (!productModel.images.includes(name)) {
            setProductModel({
                ...productModel,
                images: [...productModel.images, name]
            })
        }

    }

    const removeImage = (name) => {
        setProductModel({
            ...productModel,
            images: productModel.images.filter(i => i !== name)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoadProduct(true)
        const result = validateProductModel(productModel)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadProduct(false)
            return
        }
        if (productModel.id) {
            try {
                await updateProduct(productModel, session.accessToken)
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                await createProduct(productModel, session.accessToken)
            } catch (e) {
                console.log(e)
            }
        }
        navigateBack()
    }

    const navigateBack = () => {
        router.push("../")
    }

    return (
        <div className={productFormStyles.component}>
            <Form className={productFormStyles.formWrapper}
                onSubmit={handleSubmit}>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.inputName}`}>
                    <Form.Label className={defaultStyles.formLabel}>Name</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type={"text"}
                        name={"name"}
                        onChange={onProductChange}
                        placeholder={"What's the name of this Product"}
                        defaultValue={productModel.name}
                    />
                    {errors.name && <p>{errors.name}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Price</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="number"
                        step="0.01"
                        name="price"
                        onChange={onProductChange}
                        placeholder={"How much does this product cost"}
                        defaultValue={productModel.price}
                    />
                    {errors.price && <p>{errors.price}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Servings</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="number"
                        name="servings"
                        onChange={onProductChange}
                        placeholder={"How many portions are here"}
                        defaultValue={productModel.servings}
                    />
                    {errors.servings && <p>{errors.servings}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Stock Amount</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="number"
                        name="stockAmount"
                        onChange={onProductChange}
                        placeholder={"Amount of Products in Stock"}
                        defaultValue={productModel.stockAmount}
                    />
                    {errors.stockAmount && <p>{errors.stockAmount}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Usage</Form.Label>
                    <Form.Select
                        className={defaultStyles.formInputField}
                        onChange={onProductChange}
                        name="usage"
                        defaultValue={productModel.usage}>
                        <option value={""}>Choose</option>
                        {
                            usages.map(usage => {
                                return (
                                    <option key={usage} value={usage}>{usage}</option>
                                )
                            })
                        }
                    </Form.Select>
                    {errors.usage && <p>{errors.usage}</p>}
                </Form.Group>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.inputDescription}`}>
                    <Tabs>
                        <div className={productFormStyles.labelSwitchFlex}>
                            <Form.Label className={`${defaultStyles.formLabel} ${productFormStyles.labelDescription}`}>Description
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    size={"1x"}
                                    color={"white"}
                                    title={"Info: Use optional Markdown Syntax to write a clear description, you can switch to Markdown to see the review"}/>
                            </Form.Label>
                            <TabList className={productFormStyles.markdownSwitcher}>
                                <Tab
                                    className={productFormStyles.markdownSwitchButton}
                                    onClick={() => setMarkdownMode(false)}
                                    title={"View in Editor-Mode"}>
                                    <FontAwesomeIcon
                                        icon={faFilePen}
                                        size={"1x"}
                                        color={!markdownMode ? "#8DF3E8" : "#FFFFFF"}
                                    />
                                </Tab>
                                <Tab
                                    className={productFormStyles.markdownSwitchButton}
                                    onClick={() => setMarkdownMode(true)}
                                    title={"View in View-Mode"}>
                                    <FontAwesomeIcon
                                        icon={faFileLines}
                                        size={"1x"}
                                        color={markdownMode ? "#8DF3E8" : "#FFFFFF"}
                                    />
                                </Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <textarea
                                className={`${defaultStyles.formInputField} ${productFormStyles.textareaMarkdown}`}
                                defaultValue={productModel.description}
                                onChange={onDescriptionChange}
                                placeholder="Enter your description, Markdown is supported"
                            />
                        </TabPanel>
                        <TabPanel>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <ReactMarkdown
                                className={`${productFormStyles.markdownReview} ${markdownElements.elements}`}
                                /* eslint-disable-next-line react/no-children-prop */
                                children={markdownReview}
                                rehypePlugins={[rehypeRaw, remarkGfm]}
                            />
                        </TabPanel>
                    </Tabs>
                    {errors.description && <p>{errors.description}</p>}
                </Form.Group>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.imageSelectionForm}`}>
                    <Form.Label className={defaultStyles.formLabel}>Product Image</Form.Label>
                    <div className={productFormStyles.selectedProductImages}>
                        {
                            productModel.images.map((img, index) => {
                                return (
                                    <div key={index} className={productFormStyles.selectedImage} style={{backgroundImage: `url(${img})`, backgroundSize: "cover"}}>
                                        <button onClick={() => removeImage(img)} className={productFormStyles.deleteSelectedImageBtn}><FontAwesomeIcon className={productFormStyles.trash} icon={faTrash} size={"2x"} color={"white"}/></button>
                                    </div>
                                )
                            })
                        }
                        <div className={productFormStyles.addImageSelect} onClick={() => setShowImageSelectionDialog(true)}>
                            <p>+</p>
                        </div>
                    </div>


                    {errors.images && <p>{errors.images}</p>}
                </Form.Group>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.inputReleaseDate}`}>
                    <Form.Label className={defaultStyles.formLabel}>Release Date</Form.Label>
                    <div className={productFormStyles.inputReleaseDateGroup}>
                        <Form.Control
                            className={`${defaultStyles.formInputField}`}
                            type="datetime-local"
                            name="releaseDate"
                            onChange={onProductChange}
                            placeholder="Product sale date"
                            defaultValue={productModel.releaseDate}
                        />
                        <Form.Control type={"checkbox"} name={"showProductBeforeRelease"} className={defaultStyles.formCheckbox} onChange={e => setProductModel({...productModel, showProductBeforeRelease: e.target.checked})}/>
                        <Form.Label className={defaultStyles.formLabel}>Show Product in the shop before release</Form.Label>
                    </div>
                    {errors.releaseDate && <p>{errors.releaseDate}</p>}
                </Form.Group>
                <FormGroup className={`${defaultStyles.formGroup} ${productFormStyles.multiSelectVariety}`}>
                    <Form.Label className={defaultStyles.formLabel}>Varieties</Form.Label>
                    <div className={`${productFormStyles.varietyList}`}>
                        <div>
                            {
                                productModel.varieties.map(v => {
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <p>{v}</p>
                                    )
                                })
                            }
                        </div>
                        <button className={`${productFormStyles.addVarietyBtn}`} onClick={() => setShowVarietySelectDialog(true)} type={"button"}>{productModel.varieties.length > 0 ? "Edit varieties" : "Add variety"}</button>
                    </div>
                </FormGroup>
                <i className={productFormStyles.formNotice}>* Required field</i>
                <div className={productFormStyles.btnGroup}>
                    <button
                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} type={"submit"}>Submit</button>
                    <button className={`${defaultStyles.buttonTransparent} ${defaultStyles.defaultTransparentButton}`} onClick={navigateBack}>Cancel</button>
                </div>

            </Form>
            <button onClick={() => console.log(productModel)}>Print</button>
            {
                showImageSelectionDialog ?
                    <div className={productFormStyles.selectionDialog}>
                        <ImageSelectionList usage={"Product Image"} toggleDialog={() => setShowImageSelectionDialog(false)} selectedImage={(image) => addImageToList(image)}/>
                    </div>
                    : null
            }
            {
                showVarietySelectionDialog ?
                    <div className={productFormStyles.selectionDialog}>
                        <VarietySelectionList session={session} onSelectedVarieties={(selectedVarieties) => setProductModel({...productModel, varieties: selectedVarieties})} toggleDialog={() => setShowVarietySelectDialog(false)} onEditVarieties={productModel.varieties}/>
                    </div> :
                    null

            }
        </div>
    )
}