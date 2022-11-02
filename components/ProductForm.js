import {useEffect, useRef, useState} from "react";
import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import productFormStyles from "./ProductForm.module.css"
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import {faFilePen, faFileLines} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addConnectProductWithVariety, getAllBaseDataVariety} from "@lib/api";
import {selectStyles} from "@components/stylesUtils";
import {createProduct, updateProduct} from "@lib/api";

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

export default function ProductForm({session, onProductCreated, toggleModal}) {

    const usages = ["Gaming", "Office", "Students & Pupils"]

    function validateProductModel(product) {
        const errors = {
            name: "",
            price: null,
            servings: null,
            description: "",
            stockAmount: null,
            releaseDate: "",
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
        if (product.releaseDate === "") {
            errors.releaseDate = "Release Date must be set"
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
        img: "",
        releaseDate: "",
        active: true
    }

    const [productModel, setProductModel] = useState(defaultProductModel)
    const [product, setProduct] = useState({})
    const [errors, setErrors] = useState(null)
    const [loadProduct, setLoadProduct] = useState(false)
    const [varieties, setVarieties] = useState([])
    const [markdownReview, setMarkdownReview] = useState("")
    const [markdownMode, setMarkdownMode] = useState(false)

    const [selectedVarieties, setSelectedVarieties] = useState([])
    const [addConnectProductToVariety, setAddConnectProductToVariety] = useState({})

    const [imagePath, setImagePath] = useState("")
    const [base64Image, setBase64Image] = useState("")

    const fileInput = useRef(null)

    useEffect(() => {
        if (!base64Image) return

        const uploadImage = async () => {
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    base64Image
                })
            })
            const data = await response.json()
            setImagePath(data.filePath)
        }
        uploadImage()
    }, [base64Image])

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

    const onFileInputChange = async (e) => {
        const file = fileInput.current.file[0]
        if (!file) return
        const base64 = await toBase64(file)
        setBase64Image(base64)
        setProductModel({
            ...productModel,
            img: base64Image
        })
    }

    const onProductChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setProductModel({
            ...productModel,
            [name]: value
        })
        console.log(productModel)
    }

    const onDescriptionChange = (e) => {
        setMarkdownReview(e.target.value)
        setProductModel({
            ...productModel,
            description: e.target.value
        })
    }

    const handleSelectVarieties = (item) => {
        let selectedValuesOnly = []
        if (item.length > 0) {
            // console.log("List is not empty")
            for (let i = 0; i < item.length; i++) {
                selectedValuesOnly.push(item[i].value)
            }
            selectedValuesOnly = selectedValuesOnly.sort()
            setSelectedVarieties(selectedValuesOnly)
            // console.log(selectedVarieties)
        }
        setSelectedVarieties(selectedValuesOnly)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoadProduct(true)
        setErrors(defaultStyles)
        const result = validateProductModel(productModel)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadProduct(false)
            return
        }
        try {
            const newProduct = await createProduct(productModel, session.accessToken)
            setProduct(newProduct)
            onProductCreated(newProduct)
        } catch (e) {
            console.log(e)
        }
        for (let i = 0; selectedVarieties.length; i++) {
            setAddConnectProductToVariety({productId: product.id, varietyId: selectedVarieties[i]})
            try {
                await addConnectProductWithVariety(addConnectProductToVariety)
            } catch (e) {
                console.log(e)
            }
        }
        toggleModal()
    }

    return (
        <div className={productFormStyles.component}>
            <Form className={productFormStyles.formWrapper}>
                <h2 className={defaultStyles.formTitle}>Create new product</h2>
                <div className={`${defaultStyles.formSeparatorLine} ${productFormStyles.formSeparatorLine}`}/>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.inputName}`}>
                    <Form.Label className={defaultStyles.formLabel}>Name</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="text"
                        name="name"
                        onChange={onProductChange}
                        placeholder={"What's the name of this Product"}
                    />
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Price</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="number"
                        step="0.01"
                        name="price"
                        onChange={onProductChange}
                        placeholder={"How much costs this product"}
                    />
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Servings</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="number"
                        name="servings"
                        onChange={onProductChange}
                        placeholder={"How many portions are here"}
                    />
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Stock Amount</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="number"
                        name="stockAmount"
                        onChange={onProductChange}
                        placeholder={"Amount of Products in Stock"}
                    />
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Usage</Form.Label>
                    <Form.Select
                        className={defaultStyles.formInputField}
                        onChange={onProductChange}
                        name="usage">
                        <option disabled>Choose</option>
                        {
                            usages.map(usage => {
                                return (
                                    <option key={usage} value={usage}>{usage}</option>
                                )
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.inputDescription}`}>
                    <Tabs>
                        <div className={productFormStyles.labelSwitchFlex}>
                            <Form.Label className={`${defaultStyles.formLabel} ${productFormStyles.labelDescription}`}>Description</Form.Label>
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
                                value={markdownReview}
                                onChange={onDescriptionChange}
                                placeholder="Enter your description, Markdown is supported"
                            />
                        </TabPanel>
                        <TabPanel>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <ReactMarkdown
                                className={`${productFormStyles.markdownReview}`}
                                /* eslint-disable-next-line react/no-children-prop */
                                children={markdownReview}
                                skipHtml={false}
                            />
                        </TabPanel>
                    </Tabs>
                </Form.Group>
                <Form.Group className={`${defaultStyles.formGroup}`}>
                    <Form.Label className={defaultStyles.formLabel}>Product Image</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="file"
                        accept=".jpg, .png"
                        name="img"
                        onChange={onFileInputChange}
                        ref={fileInput}
                    />
                </Form.Group>
                <Form.Group className={`${defaultStyles.formGroup} ${productFormStyles.inputReleaseDate}`}>
                    <Form.Label className={defaultStyles.formLabel}>Release Date</Form.Label>
                    <Form.Control
                        className={`${defaultStyles.formInputField}`}
                        type="date"
                        name="releaseDate"
                        onChange={onProductChange}
                        placeholder="Product sale date"
                    />
                </Form.Group>
                <FormGroup className={`${defaultStyles.formGroup} ${productFormStyles.multiSelectVariety}`}>
                    <Form.Label className={defaultStyles.formLabel}>Varieties
                        <i className={defaultStyles.formLabelNotice}>! Multiple selectable</i>
                    </Form.Label>
                    <Select
                        isMulti
                        options={varieties.map(variety => {
                            return {label: variety.name, value: variety.id}
                            })
                        }
                        onChange={handleSelectVarieties}
                        escapeClearsValue={handleSelectVarieties}
                        isSearchable={true}
                        menuPlacement={"top"}
                        className={productFormStyles.multiSelectDropdown}
                        placeholder={"Select Varieties in this Booster"}
                        styles={selectStyles}
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 6,
                            background: "#060525",
                            height: 50,
                            colors: {
                                primary: '#FFFFFF'
                            }
                        })}
                        noOptionsMessage={() =>
                            <div className={productFormStyles.multiSelectNotFound}>
                                <p>Missing Variety?</p>
                                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>Create new Variety</button>
                            </div>
                        }
                    />
                </FormGroup>
                <i className={productFormStyles.formNotice}>* Required field</i>
                <div className={productFormStyles.btnGroup}>
                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>Submit</button>
                    <button className={`${defaultStyles.buttonTransparent} ${defaultStyles.defaultTransparentButton}`}>Cancel</button>
                </div>

            </Form>
        </div>
    )
}