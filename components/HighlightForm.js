import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import highlightFormStyles from "./HighlightForm.module.css"
import {useEffect, useState} from "react";
import {createHighlight, getAllImagesByUsage, getAllProducts, updateHighlight} from "@lib/api";
import HighlightView from "@components/HighlightView";
import formatTimestamp, {
    checkIfDate1IsGreaterThanDate2,
    checkIfEndDateIsGreaterThanStartDate,
    hexToRgba
} from "@components/Utils";
import ImageUploadForm from "@components/ImageUploadForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default function HighlightForm({session, highlightToEdit}) {

    const eventTypeOptions = [
        {text: "Release", value: "Release"},
        {text: "Announcement", value: "Announcement"},
        {text: "Discount", value: "Discount"},
        {text: "Range", value: "Range"},
        {text: "Bestseller", value: "Bestseller"}
    ]

    const alignmentOptions = [
        {text: "Top", value: "flex-start"},
        {text: "Center", value: "center"},
        {text: "Bottom", value: "flex-end"},
    ]

    const fontFamilyOptions = [
        {text: "Default", value: "\"Nunito\", sans-serif"},
        {text: "HK-Modular", value: "HK-Modular"},
        {text: "Consolas", value: "Consolas, sans-serif"},
        {text: "Chiller", value: "Chiller, sans-serif"},
        {text: "Blase Runner Movie Font", value: "\"Blade Runner Movie Font\", sans-serif"},
        {text: "Trendy", value: "TRENDY, sans-serif"},
        {text: "Broadway", value: "Broadway, sans-serif"},
    ]

    const titleShadowStyleOptions = [
        {text: "Bottom right", value: "2px 2px"},
        {text: "Bottom left", value: "-2px 2px"},
        {text: "Top left", value: "-2px -2px"},
        {text: "Top right", value: "2px -2px"},
        {text: "Blurred", value: "2px 2px 5px"},
    ]

    const backgroundStyleOptions = [
        {text: "Single Color (primary color)", value: 0},
        {text: "Gradient", value: 1},
        {text: "Image by URL", value: 2}
    ]

    const gradientBgOptions = [
        {text: "Top to bottom", value: 0},
        {text: "Left to right", value: 1},
        {text: "Right to left", value: 2},
        {text: "Top left to bottom right", value: 3},
        {text: "Top right to bottom left", value: 4},
        {text: "Rgb left to right", value: 5},
        {text: "Rgb right to left", value: 6},
    ]

    const defaultModel = {
        //Information About Highlight
        designation: "",
        description: "",
        identifier: "",
        isDraft: false,
        active: false,
        created: "",
        edited: "",

        //Event Type
        eventType: "Choose type",
        enableCustomEventType: false,
        customEventTypeText: "",
        eventTypeBackground: "#5e5e5e",
        eventTypeBackgroundOpacity: "1",
        eventTypeTextColor: "#FFFFFF",
        eventTypeTextRgbAnimation: false,

        //Product Selection
        productId: null,
        productImageIndex: 0,
        showProductPrice: false,
        showProductPriceInclusiveDiscount: false,
        productPriceColor: "#FFFFFF",
        productPriceFontFamily: "Nunito, sans-serif",
        enableProductPriceBackground: false,
        originalPriceColor: "#FFFFFF",
        originalPriceAlignment: "flex-start",
        productPriceBackground: "#5e5e5e",
        productPriceBackgroundOpacity: "1",


        // Presentation Date
        dateFrom: "",
        dateUntil: "",
        showUntilDate: false,
        dateUntilBackground: "#5e5e5e",
        dateUntilBackgroundOpacity: "1",
        additionalUntilText: "",
        dateUntilColor: "#FFFFFF",
        runningCountdown: false,

        // Title area
        title: "",
        titleFontFamily: "Nunito, sans-serif",
        titleColor: "#FFFFFF",
        showTitleBackground: false,
        titleBackgroundColor: "#5e5e5e",
        titleBackgroundOpacity: "1",
        showTitleShadow: false,
        titleShadowColor: "#ff00f7",
        titleShadowStyle: "2px 2px",

        // Text area
        text: "",
        textFontFamily: "Nunito, sans-serif",
        textColor: "#FFFFFF",
        showTextBackground: false,
        textBackgroundColor: "#5e5e5e",
        textBackgroundOpacity: "1",
        showTextShadow: false,
        textShadowColor: "#ff00f7",
        textShadowStyle: "2px 2px",

        // Backgrounding
        backgroundStyle: "0",
        primaryBackgroundColor: "#3b3b3b",
        primaryBackgroundColorOpacity: "1",
        secondaryBackgroundColor: "#000000",
        secondaryBackgroundColorOpacity: "1",
        gradientStyle: "0",
        backgroundImg: "",

        // Content Shadowing
        highlightContentShadow: false,
        highlightShadowColor: "#000000",
        highlightShadowColorOpacity: "1",

        // Button area
        buttonToProductText: "",
        buttonToProductTextColor: "#FFFFFF",
        buttonToProductBackground: "#5e5e5e",
        buttonToProductBackgroundOpacity: "1",
        disableButtonToProduct: false,
        buttonCartTextColor: "#FFFFFF",
        buttonCartIconColor: "#FFFFFF",
        buttonCartBackground: "#5e5e5e",
        buttonCartBackgroundOpacity: "1",
        disableButtonCart: false,
        buttonAreaBackground: "#5e5e5e",
        buttonAreaBackgroundOpacity: "1"
    }

    function validateModel(model) {
        const errors = {
            designation: "",
            description: "",
            identifier: "",
            eventType: "",
            customEventTypeText: "",
            productId: "",
            dateFrom: "",
            dateUntil: "",
            additionalUntilText: "",
            title: "",
            text: "",
            backgroundImg: "",
            buttonToProductText: "",
        }
        let isValid = true
        if (model.designation.trim().length === 0) {
            errors.designation = "Designation is required"
            isValid = false
        }
        if (model.designation.length > 30) {
            errors.designation = "Text too long (Max. 30 Character)"
            isValid = false
        }
        if (model.description.length > 100) {
            errors.description = "Description too long (Max. 100 Character)"
            isValid = false
        }
        if (model.identifier.trim().length === 0) {
            errors.identifier = "Identifier is required"
            isValid = false
        }
        if (!model.enableCustomEventType && model.eventType === "Choose type") {
            errors.eventType = "Please select an event type"
            isValid = false
        }
        if (model.enableCustomEventType) {
            if (model.customEventTypeText.trim().length === 0) {
                errors.customEventTypeText = "Event type is required"
                isValid = false
            }
            if (model.customEventTypeText.length > 20) {
                errors.customEventTypeText = "Text too long (max. 20 Character)"
                isValid = false
            }
        }
        if (model.productId === 0) {
            errors.productId = "Please select a product"
            isValid = false
        }
        if (model.dateFrom && model.dateUntil) {
            if (!checkIfDate1IsGreaterThanDate2(model.dateFrom, model.dateUntil)) {
                errors.dateUntil = "End Date cannot be greater than start date"
                isValid = false
            }
        } else {
            errors.dateFrom = "Start Date is Required"
            errors.dateUntil = "End Date is Required"
            isValid = false
        }
        if (model.additionalUntilText !== "") {
            if (model.additionalUntilText.trim().length === 1) {
                errors.additionalUntilText = "Please enter a additional text or keep empty"
                isValid = false
            }
            if (model.additionalUntilText > 20) {
                errors.additionalUntilText = "Text too long (Max. 20 characters)"
                isValid = false
            }
        }
        if (model.title.trim().length === 0) {
            errors.title = "Title is Required"
            isValid = false
        }
        if (model.title.length > 60) {
            errors.title = "Title too long (Max. 60 character"
            isValid = false
        }
        if (model.text.trim().length === 0) {
            errors.text = "Text is required"
            isValid = false
        }
        if (model.backgroundStyle === 2 && model.backgroundImg === "") {
            errors.backgroundImg = "Please select a background Image"
            isValid = false
        }
        return {errors, isValid}
    }

    const [model, setModel] = useState(defaultModel)
    const [errors, setErrors] = useState({})
    const [loadHighlight, setLoadHighlight] = useState(false)
    const [products, setProducts] = useState([])
    const [productImageIndexOptions, setProductImageIndexOptions] = useState([])
    const [backgroundImages, setBackgroundImages] = useState([])
    const [showImageUploaderDialog, setShowImageUploaderDialog] = useState(false)
    const [productForPresentation, setProductForPresentation] = useState(null)
    const [editorBackground, setEditorBackground] = useState("#FFFFFF")
    const [disableEditorBackground, setDisableEditorBackground] = useState(false)
    const [showCreateDraftDialog, setShowCreateDraftDialog] = useState(false)

    const router = useRouter()

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

    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await getAllImagesByUsage("Highlights Background")
                setBackgroundImages(images)
            } catch (e) {
                console.log(e)
            }
        }
        loadImages()
    }, [])

    useEffect(() => {
        if (highlightToEdit) {
            setModel(highlightToEdit)
            selectProductForPresentation(highlightToEdit.id)
        }
        // console.log(model)
    }, [highlightToEdit])

    function selectProductForPresentation(id) {
        setProductForPresentation(products.filter(p => p.id === id)[0])
    }

    const onModelChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setModel({
            ...model,
            [name]: value
        })
    }

    const onChoosingProduct = (e) => {
        const name = e.target.name
        const value = e.target.value
        if (value !== null) {
            setModel({
                ...model,
                [name]: products[value]?.id
            })
            console.log(model.productId)
            setProductForPresentation(products[value])
            createOptionList(products[value]?.images)
        } else {
            setModel({
                ...model,
                [name]: value
            })
            setProductForPresentation(null)
            setProductImageIndexOptions([])
        }
    }

    function createOptionList(imagesOfProduct) {
        let list = []
        for (let i = 0; i < imagesOfProduct.length; i++) {
            list.push(i)
        }
        setProductImageIndexOptions(list)
    }

    const onModelCheckboxChange = (e) => {
        const target = e.target
        const name = target.name
        const checked = target.checked
        setModel({
            ...model,
            [name]: checked
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoadHighlight(true)
        const result = validateModel(model)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadHighlight(false)
            setShowCreateDraftDialog(true)
            return
        } else {
            fetchHighlight(model)
        }
    }

    const handleSaveHighlightAsDraft = () => {
        let modelToFetch = model
        if (modelToFetch.designation.trim().length === 0) {
            modelToFetch.designation = "Draft --- New Highlight --- Draft"
        }
        if (modelToFetch.eventType === "Choose type") {
            modelToFetch.eventType = "unknown"
        }
        modelToFetch.productId = 0
        modelToFetch.isDraft = true
        fetchHighlight(modelToFetch)
    }

    const fetchHighlight = async (model) => {
        if (model.id) {
            model.edited = formatTimestamp(new Date(), "yyyy-MM-ddTHH:mm")
            try {
                await updateHighlight(model, session.accessToken)
                await router.push("../../highlights")
            } catch (e) {
                console.log(e)
            }
        } else {
            model.created = formatTimestamp(new Date(), "yyyy-MM-ddTHH:mm")
            try {
                await createHighlight(model, session.accessToken)
                navigateBack()
            } catch (e) {
                console.log(e)
            }
        }
    }

    const navigateBack = () => {
        router.push("../highlights")
    }

    return (
        <div className={highlightFormStyles.highlightEditor}>
            <h3 style={{color: "white", fontFamily: "Arial, sans-serif"}}>Live Preview</h3>
            <h3 style={{color: "white", fontFamily: "Arial, sans-serif"}}>Editor</h3>
            <div className={highlightFormStyles.highlightPreview} style={{background: !disableEditorBackground ? editorBackground : "transparent"}}>
                <HighlightView prop={model} presentingProduct={productForPresentation} editViewMode={true}/>
            </div>
            <Form id={"highlight-form"} onSubmit={handleSubmit} className={highlightFormStyles.highlightEditorForm}>
                <div className={highlightFormStyles.highlightEditorFormInputs}>
                    <h2 className={defaultStyles.formSubtitle}>Highlight Information</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*designation*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Designation</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            onChange={onModelChange}
                            name={"designation"}
                            defaultValue={model.designation}
                        />
                        {errors.designation && <p>{errors.designation}</p>}
                    </Form.Group>
                    {/*description*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Description</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            onChange={onModelChange}
                            name={"description"}
                            defaultValue={model.description}
                        />
                        {errors.description && <p>{errors.description}</p>}
                    </Form.Group>

                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Identifier</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            onChange={onModelChange}
                            name={"identifier"}
                            defaultValue={model.identifier}
                        />
                        {errors.identifier && <p>{errors.identifier}</p>}
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Event type</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*eventType, enableCustomEventType*/}
                    <Form.Group className={`${defaultStyles.formGroupSmall}`}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Choose Event Type</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Select
                                className={defaultStyles.formInputFieldSmall}
                                name="eventType"
                                onChange={onModelChange}
                                disabled={model.enableCustomEventType}
                                value={model.eventType}>
                                <option value="Choose type">Choose Type</option>
                                {eventTypeOptions.map(option => {
                                    return (
                                        <option key={option.value} value={option.value}>{option.text}</option>
                                    )
                                })}
                            </Form.Select>
                            <p className={defaultStyles.formSubLabelSmall}>Custom: </p>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                type="checkbox"
                                onChange={onModelCheckboxChange}
                                name="enableCustomEventType"
                                defaultChecked={model.enableCustomEventType}
                            />
                        </div>
                        {errors.eventType && <p>{errors.eventType}</p>}
                    </Form.Group>

                    {/*customEventTypeText*/}
                    <Form.Group className={defaultStyles.formGroupSmall} style={{display: !model.enableCustomEventType ? "none": null}}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Custom Event Type Text</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            onChange={onModelChange}
                            name="customEventTypeText"
                            placeholder="Enter a custom text"
                            defaultValue={model.customEventTypeText}
                        />
                        {errors.customEventTypeText && <p>{errors.customEventTypeText}</p>}
                    </Form.Group>

                    {/*eventTypeBackground, eventTypeBackgroundOpacity*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Event Type Background</Form.Label>
                        <div className={highlightFormStyles.colorPickerInput}>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                name="eventTypeBackground"
                                type="color"
                                value={model.eventTypeBackground}
                                onChange={onModelChange}
                            />
                            <p className={defaultStyles.formSubLabelSmall}>Opacity: </p>
                            <input
                                className={highlightFormStyles.colorOpacityRange}
                                style={{
                                    background: `linear-gradient(to left, ${model.eventTypeBackground}, ${hexToRgba(model.eventTypeBackground, 0)})`
                                }}
                                name="eventTypeBackgroundOpacity"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={onModelChange}
                                value={model.eventTypeBackgroundOpacity}
                            />
                        </div>
                    </Form.Group>

                    {/*eventTypeTextColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Event Type Text Color</Form.Label>
                        <div className={highlightFormStyles.colorPickerInput}>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                name="eventTypeTextColor"
                                type="color"
                                value={model.eventTypeTextColor}
                                onChange={onModelChange}/>
                            <p className={defaultStyles.formSubLabelSmall}>RGB-Animation: </p>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="eventTypeTextRgbAnimation"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                                defaultChecked={model.eventTypeTextRgbAnimation}
                            />
                        </div>

                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Selecting Product</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*productID*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Choose Product</Form.Label>
                        <Form.Select
                            className={defaultStyles.formInputFieldSmall}
                            name="productId"
                            onChange={onChoosingProduct}
                            value={model.productId}>
                            <option value={0}>Select Product</option>
                            {
                                products.map((product, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={index}>
                                            {product.name}
                                        </option>
                                    )
                                })
                            }
                        </Form.Select>
                        {errors.productId && <p>{errors.productId}</p>}
                    </Form.Group>

                    { model.productId ?
                        <>
                            {productForPresentation?.images && productImageIndexOptions.length > 1 ?
                                <>
                                    {/*productImageIndex*/}
                                    <Form.Group className={defaultStyles.formGroupSmall}>
                                        <Form.Label className={defaultStyles.formLabelSmall}>Image Variant</Form.Label>
                                        <Form.Select
                                            name={"productImageIndex"}
                                            className={defaultStyles.formInputFieldSmall}
                                            onChange={onModelChange}
                                            value={model.productImageIndex}>
                                            {productImageIndexOptions.map(index => {
                                                return <option key={index} value={index}>Image {index + 1}</option>
                                            })}
                                        </Form.Select>
                                    </Form.Group>
                                </> : null
                            }

                            {/*showProductPrice*/}
                            <Form.Group className={highlightFormStyles.multiInputsLine}>
                                <Form.Control
                                    className={defaultStyles.formCheckbox}
                                    type="checkbox"
                                    name="showProductPrice"
                                    onChange={onModelCheckboxChange}
                                    defaultChecked={model.showProductPrice}/>
                                <Form.Label className={defaultStyles.formLabelSmall}>Show Product Price</Form.Label>
                            </Form.Group>

                            {model.showProductPrice ?
                                <>
                                    {/*productPriceFontFamily, productPriceColor*/}
                                    <Form.Group className={defaultStyles.formGroupSmall}>
                                        <Form.Label className={defaultStyles.formLabelSmall}>Product Price Styling</Form.Label>
                                        <div className={highlightFormStyles.multiInputsLine}>
                                            <p className={defaultStyles.formSubLabelSmall}>Font: </p>
                                            <Form.Select
                                                className={defaultStyles.formInputFieldSmall}
                                                name="productPriceFontFamily"
                                                onChange={onModelChange}
                                                value={model.productPriceFontFamily}>
                                                {fontFamilyOptions.map((font, index) => {
                                                    return (
                                                        <option key={index} value={font.value} style={{fontFamily: font.value}}>{font.text}</option>
                                                    )
                                                })}
                                            </Form.Select>
                                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                            <Form.Control
                                                type="color"
                                                onChange={onModelChange}
                                                name="productPriceColor"
                                                className={`${defaultStyles.formColorPicker}`}
                                                value={model.productPriceColor}
                                            />
                                        </div>
                                    </Form.Group>

                                    {model.showProductPrice && productForPresentation?.discountActive ?
                                        <>
                                            {/*showProductPriceInclusiveDiscount*/}
                                            <Form.Group className={highlightFormStyles.multiInputsLine}>
                                                <Form.Control
                                                    className={defaultStyles.formCheckbox}
                                                    type={"checkbox"}
                                                    name={"showProductPriceInclusiveDiscount"}
                                                    onChange={onModelCheckboxChange}
                                                    defaultChecked={model.showProductPriceInclusiveDiscount}/>
                                                <Form.Label className={defaultStyles.formLabelSmall}>Show Discount of Product Price</Form.Label>
                                            </Form.Group>

                                            {model.showProductPriceInclusiveDiscount ?
                                                <>
                                                    {/*originalPriceColor, originalPriceAlignment*/}
                                                    <Form.Group className={defaultStyles.formGroupSmall}>
                                                        <Form.Label className={defaultStyles.formLabelSmall}>Original Price Text Styling</Form.Label>
                                                        <div className={highlightFormStyles.multiInputsLine}>
                                                            <p>Color: </p>
                                                            <Form.Control
                                                                type="color"
                                                                onChange={onModelChange}
                                                                name="originalPriceColor"
                                                                className={`${defaultStyles.formColorPicker}`}
                                                                value={model.originalPriceColor}
                                                            />
                                                            <p>Alignment: </p>
                                                            <Form.Select
                                                                className={defaultStyles.formInputFieldSmall}
                                                                name={"originalPriceAlignment"}
                                                                onChange={onModelChange} value={model.originalPriceAlignment}>
                                                                {alignmentOptions.map((opt, index) => {
                                                                    return (<option key={index} value={opt.value}>{opt.text}</option>)
                                                                })}
                                                            </Form.Select>
                                                        </div>
                                                    </Form.Group>
                                                </> : null
                                            }
                                        </> : null
                                    }
                                    {/*enableProductPriceBackground*/}
                                    <Form.Group className={highlightFormStyles.multiInputsLine}>
                                        <Form.Control
                                            className={defaultStyles.formCheckbox}
                                            name={"enableProductPriceBackground"}
                                            type={"checkbox"}
                                            onChange={onModelCheckboxChange}
                                            defaultChecked={model.enableProductPriceBackground}
                                        />
                                        <Form.Label className={defaultStyles.formLabelSmall}>Enable Backgrounding Product Price</Form.Label>
                                    </Form.Group>

                                    {model.enableProductPriceBackground ?
                                        <>
                                            {/*productPriceBackground, productPriceBackgroundOpacity*/}
                                            <Form.Group className={defaultStyles.formGroupSmall}>
                                                <Form.Label className={defaultStyles.formLabelSmall}>Product Price Background</Form.Label>
                                                <div className={highlightFormStyles.multiInputsLine}>
                                                    <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                                    <Form.Control
                                                        className={defaultStyles.formColorPicker}
                                                        name="productPriceBackground"
                                                        type="color"
                                                        onChange={onModelChange}
                                                        value={model.productPriceBackground}
                                                    />
                                                    <p className={defaultStyles.formSubLabelSmall}>Opacity:</p>
                                                    <input
                                                        className={highlightFormStyles.colorOpacityRange}
                                                        style={{
                                                            background: `linear-gradient(to left, ${model.productPriceBackground}, ${hexToRgba(model.productPriceBackground, 0)})`
                                                        }}
                                                        name="productPriceBackgroundOpacity"
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.01"
                                                        onChange={onModelChange}
                                                        defaultValue={model.productPriceBackgroundOpacity}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </> : null
                                    }
                                </> : null
                            }
                        </> : null
                    }



                    <h2 className={defaultStyles.formSubtitle}>Presentation date</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*dateFrom*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Start Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            onChange={onModelChange}
                            placeholder={"Start date to show highlight"}
                            name="dateFrom"
                            className={defaultStyles.formInputFieldSmall}
                            defaultValue={model.dateFrom}
                        />
                        {errors.dateFrom && <p>{errors.dateFrom}</p>}
                    </Form.Group>

                    {/*dateUntil*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>End Time</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            type="datetime-local"
                            name="dateUntil"
                            onChange={onModelChange}
                            placeholder="End date for highlight end"
                            defaultValue={model.dateUntil}
                        />
                        {errors.dateUntil && <p>{errors.dateUntil}</p>}
                    </Form.Group>

                    {/*showDateUntil, additionalUntilText, dateUntilColor, dateUntilBackground, dateUntilBackgroundOpacity, runningCountdown*/}
                    {
                        model.dateUntil !== "" ?
                        <div>
                            {/*showUntilDate*/}
                            <Form.Group className={highlightFormStyles.multiInputsLine}>
                                <Form.Control
                                    className={defaultStyles.formCheckbox}
                                    type="checkbox"
                                    name="showUntilDate"
                                    onChange={onModelCheckboxChange}
                                    defaultChecked={model.showUntilDate}
                                />
                                <Form.Label className={defaultStyles.formLabelSmall}>Show date until</Form.Label>
                            </Form.Group>
                            {model.showUntilDate ?
                                <div>
                                    {/*additionalUntilText, dateUntilColor*/}
                                    <FormGroup className={defaultStyles.formGroupSmall}>
                                        <Form.Label className={defaultStyles.formLabelSmall}>Additional Text</Form.Label>
                                        <div className={highlightFormStyles.multiInputsLine}>
                                            <Form.Control
                                                name="additionalUntilText"
                                                className={defaultStyles.formInputFieldSmall}
                                                onChange={onModelChange}
                                                defaultValue={model.additionalUntilText}
                                            />
                                            <p className={defaultStyles.formSubLabelSmall}>Color:</p>
                                            <Form.Control
                                                value={model.dateUntilColor}
                                                type="color"
                                                name="dateUntilColor"
                                                className={defaultStyles.formColorPicker}
                                                onChange={onModelChange}
                                            />
                                        </div>
                                        {errors.additionalUntilText && <p>{errors.additionalUntilText}</p>}
                                    </FormGroup>

                                    {/*dateUntilBackground, dateUntilBackgroundOpacity*/}
                                    <Form.Group className={defaultStyles.formGroupSmall}>
                                        <Form.Label className={defaultStyles.formLabelSmall}>Background</Form.Label>
                                        <div className={highlightFormStyles.multiInputsLine}>
                                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                            <Form.Control
                                                className={defaultStyles.formColorPicker}
                                                name="dateUntilBackground"
                                                type="color"
                                                onChange={onModelChange}
                                                value={model.dateUntilBackground}
                                            />
                                            <p className={defaultStyles.formSubLabelSmall}>Opacity:</p>
                                            <input
                                                className={highlightFormStyles.colorOpacityRange}
                                                style={{
                                                    background: `linear-gradient(to left, ${model.dateUntilBackground}, ${hexToRgba(model.dateUntilBackground, 0)})`
                                                }}
                                                name="dateUntilBackgroundOpacity"
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                onChange={onModelChange}
                                                defaultValue={model.dateUntilBackgroundOpacity}
                                            />
                                        </div>
                                    </Form.Group>

                                    {/*runningCountdown*/}
                                    <Form.Group className={highlightFormStyles.multiInputsLine}>
                                        <Form.Control
                                            className={defaultStyles.formCheckbox}
                                            type="checkbox"
                                            name="runningCountdown"
                                            onChange={onModelCheckboxChange}
                                            defaultChecked={model.runningCountdown}
                                        />
                                        <Form.Label className={defaultStyles.formLabelSmall}>Countdown To End</Form.Label>
                                    </Form.Group>
                                </div>
                                : null
                            }
                        </div>
                        : null
                    }

                    <h2 className={defaultStyles.formSubtitle}>Title area</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*title*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            name="title"
                            onChange={onModelChange}
                            placeholder="Give your Highlight a title"
                            defaultValue={model.title}
                        />
                        {errors.title && <p>{errors.title}</p>}
                    </Form.Group>

                    {/*titleFontFamily, titleColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title Styling</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Font: </p>
                            <Form.Select
                                className={defaultStyles.formInputFieldSmall}
                                name="titleFontFamily"
                                onChange={onModelChange}
                                value={model.titleFontFamily}>
                                {fontFamilyOptions.map((font, index) => {
                                    return (
                                        <option key={index} value={font.value} style={{fontFamily: font.value}}>{font.text}</option>
                                    )
                                })}
                            </Form.Select>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                type="color"
                                onChange={onModelChange}
                                name="titleColor"
                                className={`${defaultStyles.formColorPicker}`}
                                value={model.titleColor}
                            />
                        </div>
                    </Form.Group>

                    {/*showTitleBackground, titleBackgroundColor, titleBackgroundOpacity*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="showTitleBackground"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                                defaultChecked={model.showTitleBackground}
                            />
                            <Form.Label className={defaultStyles.formLabelSmall}>Title Background</Form.Label>
                        </div>
                        {model.showTitleBackground ?
                            <div className={highlightFormStyles.multiInputsLine}>
                                <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                <Form.Control
                                    className={defaultStyles.formColorPicker}
                                    name="titleBackgroundColor"
                                    type="color"
                                    onChange={onModelChange}
                                    value={model.titleBackgroundColor}
                                />
                                <p className={defaultStyles.formSubLabelSmall}>Opacity:</p>
                                <input
                                    className={highlightFormStyles.colorOpacityRange}
                                    style={{
                                        background: `linear-gradient(to left, ${model.titleBackgroundColor}, ${hexToRgba(model.titleBackgroundColor, 0)})`
                                    }}
                                    name="titleBackgroundOpacity"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    onChange={onModelChange}
                                    defaultValue={model.titleBackgroundOpacity}
                                />
                            </div> : null
                        }
                    </Form.Group>



                    {/*showTitleShadow, titleShadowStyle, titleShadowColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="showTitleShadow"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                                defaultChecked={model.showTitleShadow}
                            />
                            <Form.Label className={defaultStyles.formLabelSmall}>Title Shadowing</Form.Label>
                        </div>
                        {model.showTitleShadow ?
                            <div className={highlightFormStyles.multiInputsLine}>
                                <p className={defaultStyles.formSubLabelSmall}>Shadow style: </p>
                                <Form.Select
                                    className={defaultStyles.formInputFieldSmall}
                                    name="titleShadowStyle"
                                    onChange={onModelChange}
                                    value={model.titleShadowStyle}>
                                    {titleShadowStyleOptions.map((opt, index) => {
                                        return (
                                            <option key={index} value={opt.value}>{opt.text}</option>
                                        )
                                    })}
                                </Form.Select>
                                <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                <Form.Control
                                    className={`${defaultStyles.formColorPicker}`}
                                    type="color"
                                    name="titleShadowColor"
                                    onChange={onModelChange}
                                    value={model.titleShadowColor}
                                />
                            </div>
                            : <div/>}
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Text area</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*text*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Text</Form.Label>
                        <textarea
                            className={`${highlightFormStyles.textAreaField}`}
                            onChange={onModelChange}
                            placeholder={"Tell something about this Highlight"}
                            name="text"
                            defaultValue={model.text}
                        />
                        {errors.text && <p>{errors.text}</p>}
                    </Form.Group>

                    {/*textFontFamily, textColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Text Styling</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Font: </p>
                            <Form.Select
                                className={defaultStyles.formInputFieldSmall}
                                name="textFontFamily"
                                onChange={onModelChange}
                                value={model.textFontFamily}>
                                {fontFamilyOptions.map((font, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={font.value}
                                            style={{fontFamily: font.value}}>
                                            {font.text}
                                        </option>
                                    )
                                })}
                            </Form.Select>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                name="textColor"
                                type="color"
                                onChange={onModelChange}
                                className={`${defaultStyles.formColorPicker}`}
                                value={model.textColor}
                            />
                        </div>
                    </Form.Group>

                    {/*showTextBackground, textBackgroundColor, textBackgroundOpacity*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="showTextBackground"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                                defaultChecked={model.showTextBackground}
                            />
                            <Form.Label className={defaultStyles.formLabelSmall}>Text Background</Form.Label>
                        </div>
                        {model.showTextBackground ?
                            <div className={highlightFormStyles.multiInputsLine}>
                                <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                <Form.Control
                                    className={defaultStyles.formColorPicker}
                                    name="textBackgroundColor"
                                    type="color"
                                    onChange={onModelChange}
                                    value={model.textBackgroundColor}
                                />
                                <p className={defaultStyles.formSubLabelSmall}>Opacity:</p>
                                <input
                                    className={highlightFormStyles.colorOpacityRange}
                                    style={{
                                        background: `linear-gradient(to left, ${model.textBackgroundColor}, ${hexToRgba(model.textBackgroundColor, 0)})`
                                    }}
                                    name="textBackgroundOpacity"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    onChange={onModelChange}
                                    defaultValue={model.textBackgroundOpacity}
                                />
                            </div> : null
                        }
                    </Form.Group>

                    {/*showTextShadow, textShadowStyle, textShadowColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="showTextShadow"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                                defaultChecked={model.showTextShadow}
                            />
                            <Form.Label className={defaultStyles.formLabelSmall}>Text Shadowing</Form.Label>
                        </div>
                        {model.showTextShadow ?
                            <div className={highlightFormStyles.multiInputsLine}>
                                <p className={defaultStyles.formSubLabelSmall}>Shadow style: </p>
                                <Form.Select
                                    className={defaultStyles.formInputFieldSmall}
                                    name="textShadowStyle"
                                    onChange={onModelChange}
                                    value={model.textShadowStyle}>
                                    {titleShadowStyleOptions.map((opt, index) => {
                                        return (
                                            <option key={index} value={opt.value}>{opt.text}</option>
                                        )
                                    })}
                                </Form.Select>
                                <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                <Form.Control
                                    className={`${defaultStyles.formColorPicker}`}
                                    type="color"
                                    name="textShadowColor"
                                    onChange={onModelChange}
                                    value={model.textShadowColor}
                                />
                            </div>
                            : <div/>}
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Highlighting Backgrounding</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*Background Style*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Backgrund Style</Form.Label>
                        <Form.Select
                            className={defaultStyles.formInputFieldSmall}
                            name="backgroundStyle"
                            onChange={onModelChange}
                            value={model.backgroundStyle}>
                            {backgroundStyleOptions.map((opt, index) => {
                                return (
                                    <option key={index} value={opt.value}>{opt.text}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    {/*primaryBackgroundColor, primaryBackgroundColorOpacity, secondaryBackgroundColor, secondaryBackgroundColorOpacity*/}
                    {model.backgroundStyle === "0" || model.backgroundStyle === "1" ?
                        <>
                            <Form.Group className={defaultStyles.formGroupSmall}>
                                <Form.Label className={defaultStyles.formLabelSmall}>Background Colors</Form.Label>
                                <div className={highlightFormStyles.multiInputsLine}>
                                    <p className={defaultStyles.formSubLabelSmall}>Primary: </p>
                                    <Form.Control
                                        className={`${defaultStyles.formColorPicker}`}
                                        name="primaryBackgroundColor"
                                        onChange={onModelChange}
                                        type="color"
                                        value={model.primaryBackgroundColor}
                                    />
                                    <p className={defaultStyles.formSubLabelSmall}>Opacity:  </p>
                                    <input
                                        className={highlightFormStyles.colorOpacityRange}
                                        style={{
                                            background: `linear-gradient(to left, ${model.primaryBackgroundColor}, ${hexToRgba(model.primaryBackgroundColor, 0)})`
                                        }}
                                        name="primaryBackgroundColorOpacity"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        onChange={onModelChange}
                                        defaultValue={model.primaryBackgroundColorOpacity}
                                    />
                                </div>
                                {
                                    model.backgroundStyle === "1" ?
                                        <>
                                            <div className={highlightFormStyles.multiInputsLine}>
                                                <p className={defaultStyles.formSubLabelSmall}>Secondary: </p>
                                                <Form.Control
                                                    className={`${defaultStyles.formColorPicker}`}
                                                    name="secondaryBackgroundColor"
                                                    type="color"
                                                    onChange={onModelChange}
                                                    value={model.secondaryBackgroundColor}
                                                />
                                                <p className={defaultStyles.formSubLabelSmall}>Opacity: </p>
                                                <input
                                                    className={highlightFormStyles.colorOpacityRange}
                                                    style={{
                                                        background: `linear-gradient(to left, ${model.secondaryBackgroundColor}, ${hexToRgba(model.secondaryBackgroundColor, 0)})`
                                                    }}
                                                    name="secondaryBackgroundColorOpacity"
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    onChange={onModelChange}
                                                    defaultValue={model.secondaryBackgroundColorOpacity}
                                                />
                                            </div>
                                        </>
                                    : null
                                }
                            </Form.Group>
                        </> : null
                    }
                    {/*gradientStyle*/}
                    {
                        model.backgroundStyle === "1" ?

                        <Form.Group className={defaultStyles.formGroupSmall}>
                            <Form.Label className={defaultStyles.formLabelSmall}>Gradient Style</Form.Label>
                            <Form.Select
                            name="gradientStyle"
                            onChange={onModelChange}
                            className={defaultStyles.formInputFieldSmall}
                            value={model.gradientStyle}>
                            {gradientBgOptions.map((opt, index) => {
                                return (
                                    <option key={index} value={opt.value}>{opt.text}</option>
                                )
                            })}
                            </Form.Select>
                        </Form.Group>
                        : <div/>
                    }

                    {/*backgroundImg*/}
                    {
                        model.backgroundStyle === "2" ?
                            <Form.Group className={defaultStyles.formGroupSmall}>
                                <Form.Label className={defaultStyles.formLabelSmall}>Background Image</Form.Label>
                                <div className={highlightFormStyles.multiInputsLine}>
                                    <Form.Select
                                        className={defaultStyles.formInputFieldSmall}
                                        name="backgroundImg"
                                        onChange={onModelChange}
                                        value={model.backgroundImg}>
                                        <option>Select Background</option>
                                        {backgroundImages.map((opt, index) => {
                                            return (
                                                <option key={index} value={opt.img}>{opt.designation}</option>
                                            )
                                        })}
                                    </Form.Select>
                                    <button type={"button"} onClick={() => setShowImageUploaderDialog(true)} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}>
                                        <FontAwesomeIcon icon={faUpload}/>
                                    </button>
                                </div>
                                {errors.backgroundImg && <p>{errors.backgroundImg}</p>}
                            </Form.Group>
                            : <div/>
                    }

                    {/*highlightContentShadow, highlightShadowColor, highlightShadowColorOpacity*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                type={"checkbox"}
                                className={defaultStyles.formCheckbox}
                                name="highlightContentShadow"
                                onChange={onModelCheckboxChange}
                                defaultChecked={model.highlightContentShadow}/>
                            <Form.Label className={defaultStyles.formLabelSmall}>Content Shadowing</Form.Label>
                        </div>
                        {
                            model.highlightContentShadow ?
                                <div className={highlightFormStyles.multiInputsLine}>
                                    <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                    <Form.Control
                                        className={defaultStyles.formColorPicker}
                                        name="highlightShadowColor"
                                        type="color"
                                        onChange={onModelChange}
                                        value={model.highlightShadowColor}
                                    />
                                    <p className={defaultStyles.formSubLabelSmall}>Strength: </p>
                                    <input
                                        className={highlightFormStyles.colorOpacityRange}
                                        style={{
                                            background: `linear-gradient(to left, ${model.highlightShadowColor}, ${hexToRgba(model.highlightShadowColor, 0)})`
                                        }}
                                        name="highlightShadowColorOpacity"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        onChange={onModelChange}
                                        defaultValue={model.highlightShadowColorOpacity}
                                    />
                                </div>
                                : <div/>
                        }
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Buttons area</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*buttonAreaBackground, buttonAreaBackgroundOpacity*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Area Backgronding</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                type={"color"}
                                name={"buttonAreaBackground"}
                                onChange={onModelChange}
                                value={model.buttonAreaBackground}
                            />
                            <p className={defaultStyles.formSubLabelSmall}>Opacity: </p>
                            <input
                                className={highlightFormStyles.colorOpacityRange}
                                style={{
                                    background: `linear-gradient(to left, ${model.buttonAreaBackground}, ${hexToRgba(model.buttonAreaBackground, 0)})`
                                }}
                                name="buttonAreaBackgroundOpacity"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={onModelChange}
                                defaultValue={model.buttonAreaBackgroundOpacity}
                            />
                        </div>
                    </Form.Group>

                    {/*buttonToProductText, buttonToProductTextColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Button to Product Text</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p>Text: </p>
                            <Form.Control
                                className={defaultStyles.formInputFieldSmall}
                                name="buttonToProductText"
                                onChange={onModelChange}
                                defaultValue={model.buttonToProductText}/>
                            <p>Color: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                type={"color"}
                                name={"buttonToProductTextColor"}
                                onChange={onModelChange}
                                value={model.buttonToProductTextColor}
                            />
                        </div>
                        {errors.buttonToProductText && <p>{errors.buttonToProductText}</p>}
                    </Form.Group>

                    {/*buttonToProductBackground, buttonToProductBackgroundOpacity*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Button to Product Background</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                type={"color"}
                                name={"buttonToProductBackground"}
                                onChange={onModelChange}
                                value={model.buttonToProductBackground}
                            />
                            <p className={defaultStyles.formSubLabelSmall}>Opacity: </p>
                            <input
                                className={highlightFormStyles.colorOpacityRange}
                                style={{
                                    background: `linear-gradient(to left, ${model.buttonToProductBackground}, ${hexToRgba(model.buttonToProductBackground, 0)})`
                                }}
                                name="buttonToProductBackgroundOpacity"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={onModelChange}
                                defaultValue={model.buttonToProductBackgroundOpacity}
                            />
                        </div>
                    </Form.Group>

                    {/*buttonToCartTextColor, buttonToCartIconColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Button Cart Text</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Color Text: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                type={"color"}
                                name={"buttonCartTextColor"}
                                onChange={onModelChange}
                                value={model.buttonCartTextColor}
                            />
                            <p className={defaultStyles.formSubLabelSmall}>Color Icon: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                type={"color"}
                                name={"buttonCartIconColor"}
                                onChange={onModelChange}
                                value={model.buttonCartIconColor}
                            />
                        </div>
                    </Form.Group>

                    {/**/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Button Cart Background</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                className={defaultStyles.formColorPicker}
                                type={"color"}
                                name={"buttonCartBackground"}
                                onChange={onModelChange}
                                value={model.buttonCartBackground}
                            />
                            <p className={defaultStyles.formSubLabelSmall}>Opacity: </p>
                            <input
                                className={highlightFormStyles.colorOpacityRange}
                                style={{
                                    background: `linear-gradient(to left, ${model.buttonCartBackground}, ${hexToRgba(model.buttonCartBackground, 0)})`
                                }}
                                name="buttonCartBackgroundOpacity"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={onModelChange}
                                defaultValue={model.buttonCartBackgroundOpacity}
                            />
                        </div>
                    </Form.Group>

                    {/*disableButtonToProduct, disableButtonCart*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Visibility</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                type="checkbox"
                                name="disableButtonToProduct"
                                onChange={onModelCheckboxChange}
                                defaultChecked={model.disableButtonToProduct}
                            />
                            <Form.Label className={defaultStyles.formSubLabelSmall}>Hide button to product</Form.Label>
                        </div>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                type={"checkbox"}
                                name={"disableButtonCart"}
                                className={defaultStyles.formCheckbox}
                                onChange={onModelCheckboxChange}
                                defaultChecked={model.disableButtonCart}
                            />
                            <Form.Label className={defaultStyles.formSubLabelSmall}>Hide Add-to-Cart-button</Form.Label>
                        </div>
                    </Form.Group>
                </div>
            </Form>

            <div className={highlightFormStyles.preferencePanel}>
                <div className={highlightFormStyles.editorSettings}>
                    <p>Editor Preview Background: </p>
                    <input
                        value={editorBackground}
                        type="color"
                        onChange={e => setEditorBackground(e.target.value)}
                        className={defaultStyles.formColorPicker}
                        onDoubleClick={e => setEditorBackground("#14318C")}/>
                    { editorBackground !== "#FFFFFF" ?
                        <i onClick={e => setEditorBackground("#FFFFFF")}>Reset color</i>
                        : null
                    }
                    <p>Disable Editor Preview Background</p>
                    <input type="checkbox" className={defaultStyles.formCheckbox} onChange={e => setDisableEditorBackground(e.target.checked)}/>
                    <button className={`${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}>Reset draft</button>
                </div>
                <div className={highlightFormStyles.buttonGroup}>
                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} type={"submit"} form={"highlight-form"}>Save Highlight</button>
                    <button className={`${defaultStyles.defaultTransparentButton} ${defaultStyles.buttonTransparent} `} onClick={() => handleSaveHighlightAsDraft()}>Save as Draft</button>
                    <button className={`${defaultStyles.defaultTransparentButton} ${defaultStyles.buttonTransparent} `} onClick={() => navigateBack()}>Discard</button>
                </div>

            </div>
            {showImageUploaderDialog ?
                <div className={highlightFormStyles.dialog}>
                    <div>
                        <ImageUploadForm session={session} staticImageUsage={"Highlights Background"} onDialogMode={true} toggleDialog={() => setShowImageUploaderDialog(false)} onImageUploaded={(newImage) => setBackgroundImages(backgroundImages => [...backgroundImages, newImage])}/>
                    </div>

                </div> : null
            }

            {showCreateDraftDialog ?
                <div className={highlightFormStyles.dialog}>
                    <div className={highlightFormStyles.saveAsDraftDialog}>
                        <h3>Inputs are not valid!</h3>
                        <p>Do you want save the Highlight as Draft?</p>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} onClick={() => handleSaveHighlightAsDraft()}>Save as Draft</button>
                            <button className={`${defaultStyles.defaultTransparentButton} ${defaultStyles.buttonTransparent} `} onClick={() => setShowCreateDraftDialog(false)}>Cancel</button>
                        </div>
                    </div>
                </div> : null
            }

        </div>
    )

    /**/
}