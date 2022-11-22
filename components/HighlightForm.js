import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import highlightFormStyles from "./HighlightForm.module.css"
import {useEffect, useState} from "react";
import {getAllProducts} from "@lib/api";

export default function HighlightForm(session) {

    const eventTypeOptions = [
        {text: "Release", value: 0},
        {text: "Announcement", value: 1},
        {text: "Discount", value: 2},
        {text: "Range", value: 3},
        {text: "Bestseller", value: 4}
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
        {text: "Top left to bottom right", value: 2},
        {text: "Top right to bottom left", value: 3},
        {text: "Rgb left to right", value: 4},
        {text: "Transparent to right", value: 5},
        {text: "Radial circle", value: 6},
    ]



    const defaultModel = {
        eventType: "",
        productId: null,
        dateFrom: "",
        dateUntil: "",
        title: "",
        titleColor: "",
        showTitleShadow: false,
        titleShadowColor: "",
        titleShadowStyle: "",
        text: "",
        textColor: "",
        saleDiscount: null,
        backgroundStyle: "",
        primaryBackgroundColor: "",
        secondaryBackgroundColor: "",
        gradientStyle: "",
        backgroundImgUrl: "",
        buttonToProductText: "",
        highlightContentShadow: false,
        highlightShadowColor: "",
        hideButtonToProduct: false,
        hideUntilDate: false,
        hideProductPrice: false,
        rgbTitleAnimation: false,
        rgbBackground: false,
        runningCountdown: false
    }

    const [model, setModel] = useState(defaultModel)
    const [errors, setErrors] = useState({})
    const [loadHighlight, setLoadHighlight] = useState(false)
    const [markdownReview, setMarkdownReview] = useState("")
    const [products, setProducts] = useState([])

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

    const onModelChange = (e) => {
        const target = e.target
        const name = target.name
        let value = target.value
        if (typeof value == 'boolean') {
            value = !value
        }
        setModel({
            ...model,
            [name]: value
        })
    }

    const onChecksChanges = (e) => {

    }

    const onTextChange = (e) => {
        setMarkdownReview(e.target.value)
        setModel({
            ...model,
            text: e.target.value
        })
    }

    return (
        <div>
            <Form>
                <h2 className={defaultStyles.formTitle}>Plan a new Highlight</h2>
                <div className={`${defaultStyles.formSeparatorLine}`}/>

                {/*eventType*/}
                <Form.Group className={`${defaultStyles.formGroup}`}>
                    <Form.Label className={defaultStyles.formLabel}>Choose Event Type</Form.Label>
                    <Form.Select
                        className={defaultStyles.formInputField}
                        name="eventType"
                        onChange={onModelChange}>
                        <option>Choose Type</option>
                        {eventTypeOptions.map(option => {
                            return (
                                <option key={option.value} value={option.value}>{option.text}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                {/*productID*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Choose Product</Form.Label>
                    <Form.Select
                        className={defaultStyles.formInputField}
                        name="product"
                        onChange={onModelChange}>
                        <option>Select Product</option>
                        {
                            products.map((product, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={product.id}>
                                        {product.name}
                                    </option>
                                )
                            })
                        }
                    </Form.Select>
                </Form.Group>

                {/*dateFrom*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Start Date</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        onChange={onModelChange}
                        placeholder={"Start date to show highlight"}
                        name="dateFrom"
                        className={defaultStyles.formInputField}
                    />
                </Form.Group>

                {/*dateUntil*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>End Time</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        type="datetime-local"
                        name="dateUntil"
                        onChange={onModelChange}
                        placeholder="End date for highlight end"
                    />
                </Form.Group>

                {/*title*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Title</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        name="title"
                        onChange={onModelChange}
                        placeholder="Give your Highlight a title"
                    />
                </Form.Group>

                {/*titleColor*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Title Color</Form.Label>
                    <Form.Control
                        type="color"
                        onChange={onModelChange}
                        name="titleColor"
                        className={`${defaultStyles.formInputField} ${defaultStyles.formColorPicker}`}
                    />
                </Form.Group>

                {/*showTitleShadow*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Title Shadow</Form.Label>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        name="showTitleShadow"
                        onChange={onModelChange}
                        type="checkbox"
                    />
                </Form.Group>

                {/*titleShadowColor*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Text shadow color</Form.Label>
                    <Form.Control
                        className={`${defaultStyles.formInputField} ${defaultStyles.formColorPicker}`}
                        type="color"
                        name="titleShadowColor"
                        onChange={onModelChange}/>
                </Form.Group>

                {/*titleShadowStyle*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Text shadow style</Form.Label>
                    <Form.Select
                        className={defaultStyles.formInputField}
                        name="titleShadowStyle"
                        onChange={onModelChange}>
                        {titleShadowStyleOptions.map((opt, index) => {
                            return (
                                <option key={index} value={opt.value}>{opt.text}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                {/*text*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Text</Form.Label>
                    <textarea
                        className={`${defaultStyles.formInputField} ${highlightFormStyles.textAreaField}`}
                        onChange={onTextChange}
                        value={markdownReview}
                        placeholder={"Tell something about this Highlight"}
                    />
                </Form.Group>

                {/*textColor*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Text Color</Form.Label>
                    <Form.Control
                        name="textColor"
                        type="color"
                        onChange={onModelChange}
                        className={`${defaultStyles.formInputField} ${defaultStyles.formColorPicker}`}
                    />
                </Form.Group>

                {/*Background Style*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Backgrund Style</Form.Label>
                    <Form.Select
                        className={defaultStyles.formInputField}
                        name="backgroundStyle"
                        onChange={onModelChange}>
                        {backgroundStyleOptions.map((opt, index) => {
                            return (
                                <option key={index} value={opt.value}>{opt.text}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                {/*primaryBackgroundColor*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Primary Background</Form.Label>
                    <Form.Control
                        className={`${defaultStyles.formInputField} ${defaultStyles.formColorPicker}`}
                        name="primaryBackgroundColor"
                        onChange={onModelChange}
                        type="color"
                    />
                </Form.Group>

                {/*secondaryBackgroundColor*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Secondary Background</Form.Label>
                    <Form.Control
                        className={`${defaultStyles.formInputField} ${defaultStyles.formColorPicker}`}
                        name="secondaryBackgroundColor"
                        type="color"
                        onChange={onModelChange}
                    />
                </Form.Group>

                {/*gradientStyle*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Gradient Style</Form.Label>
                    <Form.Select
                        name="gradientStyle"
                        onChange={onModelChange}
                        className={defaultStyles.formInputField}>
                        <option>Choose</option>
                        {gradientBgOptions.map((opt, index) => {
                            return (
                                <option key={index} value={opt.value}>{opt.text}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                {/*gradientStyle*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label>Hide Navigate Button before Release</Form.Label>
                    <Form.Control
                        type="checkbox"
                        className={defaultStyles.formCheckbox}
                        name="showButtonToProduct"
                        onChange={onModelChange}
                    />
                </Form.Group>

                {/*backgroundImgURL*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Background Image by URL</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        name="backgroundImgUrl"
                        onChange={onModelChange}
                    />
                </Form.Group>
            </Form>
            <div style={{width: 50, height: 50, background: "radial-gradient(farthest-corner at 25px 25px, red 0%, yellow 100%)"}}></div>
        </div>
    )

    /**/
}