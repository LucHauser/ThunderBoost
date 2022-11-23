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
        {text: "RGB", value: 7}
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
        const value = target.value
        setModel({
            ...model,
            [name]: value
        })
        // console.log(model)
    }

    const onModelCheckboxChange = (e) => {
        const target = e.target
        const name = target.name
        const checked = target.checked
        setModel({
            ...model,
            [name]: checked
        })
        console.log(model)
    }

    const onTextChange = (e) => {
        setMarkdownReview(e.target.value)
        setModel({
            ...model,
            text: e.target.value
        })
    }

    const handleSubmit = async () => {

    }

    return (
        <div>
            <div>

            </div>
            <Form onSubmit={handleSubmit}>
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
                        name="productId"
                        onChange={onModelChange}>
                        <option>Select Product</option>
                        {
                            products.map((product, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={parseInt(product.id)}>
                                        {product.name}{product.id}
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
                        onChange={onModelCheckboxChange}
                        type="checkbox"
                    />
                </Form.Group>

                {/*titleShadowColor*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Title shadow color</Form.Label>
                    <Form.Control
                        className={`${defaultStyles.formInputField} ${defaultStyles.formColorPicker}`}
                        type="color"
                        name="titleShadowColor"
                        onChange={onModelChange}/>
                </Form.Group>

                {/*titleShadowStyle*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Title shadow style</Form.Label>
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
                        name="text"
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

                {/*backgroundImgURL*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Background Image by URL</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        name="backgroundImgUrl"
                        onChange={onModelChange}
                    />
                </Form.Group>

                {/*ButtonToProductText*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Button Text</Form.Label>
                    <Form.Control
                    className={defaultStyles.formInputField}
                    name="buttonToProductText"
                    onChange={onModelChange}/>
                </Form.Group>

                {/*hideButtonToProduct*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Hide button to product</Form.Label>
                    <Form.Control
                    className={defaultStyles.formCheckbox}
                    type="checkbox"
                    name="hideButtonToProduct"
                    onChange={onModelCheckboxChange}/>
                </Form.Group>

                {/*hideUntilDate*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Hide date Until</Form.Label>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        type="checkbox"
                        name="hideUntilDate"
                        onChange={onModelCheckboxChange}/>
                </Form.Group>

                {/*hideProductPrice*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Hide product Price</Form.Label>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        type="checkbox"
                        name="hideProductPrice"
                        onChange={onModelCheckboxChange}/>
                </Form.Group>

                {/*rgbTitleAnimation*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Animate RGB at title</Form.Label>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        type="checkbox"
                        name="rgbTitleAnimation"
                        onChange={onModelCheckboxChange}/>
                </Form.Group>

                {/*runningCountdown*/}
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Countdown To End</Form.Label>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        type="checkbox"
                        name="runningCountdown"
                        onChange={onModelCheckboxChange}/>
                </Form.Group>

            </Form>
            <div style={{width: 50, height: 50, background: "radial-gradient(farthest-corner at 25px 25px, red 0%, yellow 100%)"}}></div>
        </div>
    )

    /**/
}