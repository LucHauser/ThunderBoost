import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import highlightFormStyles from "./HighlightForm.module.css"
import {useEffect, useState} from "react";
import {getAllProducts} from "@lib/api";
import HighlightView from "@components/HighlightView";

export default function HighlightForm(session) {

    const eventTypeOptions = [
        {text: "Release", value: 0},
        {text: "Announcement", value: 1},
        {text: "Discount", value: 2},
        {text: "Range", value: 3},
        {text: "Bestseller", value: 4}
    ]

    const fontFamilyOptions = [
        {text: "Default", value: "Arial, sans-serif"},
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
        eventType: "",
        productId: null,
        dateFrom: "",
        dateUntil: "",
        title: "",
        titleFontFamily: "Arial, sans-serif",
        titleColor: "#FFFFFF",
        showTitleShadow: false,
        titleShadowColor: "",
        titleShadowStyle: "",
        text: "",
        textColor: "#FFFFFF",
        backgroundStyle: "0",
        primaryBackgroundColor: "#3b3b3b",
        secondaryBackgroundColor: "#3b3b3b",
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
    const [products, setProducts] = useState([])
    const [productForPresentation, setProductForPresentation] = useState(null)
    const [editorBackground, setEditorBackground] = useState("#FFFFFF")
    const [disableEditorBackground, setDisableEditorBackground] = useState(false)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProducts()
                console.log(products)
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
    }

    const onChoosingProduct = (e) => {
        const name = e.target.name
        const value = e.target.value
        setModel({
            ...model,
            [name]: products[value].id
        })
        console.log(model.productId)
        setProductForPresentation(products[value])
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

    const handleSubmit = async () => {

    }

    return (
        <div className={highlightFormStyles.highlightEditor}>
            <div className={highlightFormStyles.highlightEditorTitle}>
                <h2 className={defaultStyles.formTitle}>Plan a new Highlight</h2>
                <div className={`${defaultStyles.formSeparatorLine}`}/>
            </div>
            <div className={highlightFormStyles.highlightPreview} style={{background: disableEditorBackground ? editorBackground : "transparent"}}>
                <HighlightView prop={model} presentingProduct={productForPresentation} editViewMode={true}/>
            </div>
            <Form onSubmit={handleSubmit} className={highlightFormStyles.highlightEditorForm}>
                <div className={highlightFormStyles.highlightEditorFormInputs}>
                    <h2 className={defaultStyles.formSubtitle}>Planning and product selection</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>
                    {/*eventType*/}
                    <Form.Group className={`${defaultStyles.formGroupSmall}`}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Choose Event Type</Form.Label>
                        <Form.Select
                            className={defaultStyles.formInputFieldSmall}
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
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Choose Product</Form.Label>
                        <Form.Select
                            className={defaultStyles.formInputFieldSmall}
                            name="productId"
                            onChange={onChoosingProduct}>
                            <option>Select Product</option>
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
                        {/*<p>{`product choosed: ${productForPresentation.id} ${model.productId}`}</p>*/}
                    </Form.Group>

                    {/*dateFrom*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Start Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            onChange={onModelChange}
                            placeholder={"Start date to show highlight"}
                            name="dateFrom"
                            className={defaultStyles.formInputFieldSmall}
                        />
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
                        />
                    </Form.Group>

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
                        />
                    </Form.Group>

                    {/*titleFontFamily*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Font-family title</Form.Label>
                        <Form.Select className={defaultStyles.formInputFieldSmall} name="titleFontFamily" onChange={onModelChange}>
                            {fontFamilyOptions.map((font, index) => {
                                return (
                                    <option key={index} value={font.value} style={{fontFamily: font.value}}>{font.text}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    {/*titleColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title Color</Form.Label>
                        <Form.Control
                            type="color"
                            onChange={onModelChange}
                            name="titleColor"
                            className={`${defaultStyles.formColorPicker}`}
                        />
                    </Form.Group>

                    {/*showTitleShadow*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title Shadow</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            name="showTitleShadow"
                            onChange={onModelCheckboxChange}
                            type="checkbox"
                        />
                    </Form.Group>

                    {/*titleShadowColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title shadow color</Form.Label>
                        <Form.Control
                            className={`${defaultStyles.formColorPicker}`}
                            type="color"
                            name="titleShadowColor"
                            onChange={onModelChange}/>
                    </Form.Group>

                    {/*titleShadowStyle*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title shadow style</Form.Label>
                        <Form.Select
                            className={defaultStyles.formInputFieldSmall}
                            name="titleShadowStyle"
                            onChange={onModelChange}>
                            {titleShadowStyleOptions.map((opt, index) => {
                                return (
                                    <option key={index} value={opt.value}>{opt.text}</option>
                                )
                            })}
                        </Form.Select>
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
                        />
                    </Form.Group>

                    {/*textColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Text Color</Form.Label>
                        <Form.Control
                            name="textColor"
                            type="color"
                            onChange={onModelChange}
                            className={`${defaultStyles.formColorPicker}`}
                        />
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Highlighting Backgrounding</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*Background Style*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Backgrund Style</Form.Label>
                        <Form.Select
                            className={defaultStyles.formInputFieldSmall}
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
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Primary Background</Form.Label>
                        <Form.Control
                            className={`${defaultStyles.formColorPicker}`}
                            name="primaryBackgroundColor"
                            onChange={onModelChange}
                            type="color"
                        />
                    </Form.Group>

                    {/*secondaryBackgroundColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Secondary Background</Form.Label>
                        <Form.Control
                            className={`${defaultStyles.formColorPicker}`}
                            name="secondaryBackgroundColor"
                            type="color"
                            onChange={onModelChange}
                        />
                    </Form.Group>

                    {/*gradientStyle*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Gradient Style</Form.Label>
                        <Form.Select
                            name="gradientStyle"
                            onChange={onModelChange}
                            className={defaultStyles.formInputFieldSmall}>
                            <option>Choose</option>
                            {gradientBgOptions.map((opt, index) => {
                                return (
                                    <option key={index} value={opt.value}>{opt.text}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    {/*backgroundImgURL*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Background Image by URL</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            name="backgroundImgUrl"
                            onChange={onModelChange}
                        />
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Buttons area</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*ButtonToProductText*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Button Text</Form.Label>
                        <Form.Control
                            className={defaultStyles.formInputFieldSmall}
                            name="buttonToProductText"
                            onChange={onModelChange}/>
                    </Form.Group>

                    <h2 className={defaultStyles.formSubtitle}>Preferences</h2>
                    <div className={defaultStyles.formSubtitleSeparatorLine}/>

                    {/*hideButtonToProduct*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Hide button to product</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="hideButtonToProduct"
                            onChange={onModelCheckboxChange}/>
                    </Form.Group>

                    {/*hideUntilDate*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Hide date Until</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="hideUntilDate"
                            onChange={onModelCheckboxChange}/>
                    </Form.Group>

                    {/*hideProductPrice*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Hide product Price</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="hideProductPrice"
                            onChange={onModelCheckboxChange}/>
                    </Form.Group>

                    {/*rgbTitleAnimation*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Animate RGB at title</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="rgbTitleAnimation"
                            onChange={onModelCheckboxChange}/>
                    </Form.Group>

                    {/*runningCountdown*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Countdown To End</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="runningCountdown"
                            onChange={onModelCheckboxChange}/>
                    </Form.Group>
                </div>
            </Form>
            <div className={highlightFormStyles.preferencePanel}>
                <p>Editor Preview Background: </p>
                <input
                    value={editorBackground}
                    type="color"
                    onChange={e => setEditorBackground(e.target.value)}
                    className={defaultStyles.formColorPicker}/>
                { editorBackground !== "#FFFFFF" ?
                    <i onClick={e => setEditorBackground("#FFFFFF")}>Reset color</i>
                    : null
                }
                <p>Disable Editor Preview Background</p>
                <input type="checkbox" className={defaultStyles.formCheckbox} onChange={e => setDisableEditorBackground(!e.target.checked)}/>
                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>Save Highlight</button>
                <p className={defaultStyles.test}>Helllo World</p>
            </div>
            {/*<div style={{width: 50, height: 50, background: "radial-gradient(farthest-corner at 25px 25px, red 0%, yellow 100%)"}}></div>*/}
        </div>
    )

    /**/
}