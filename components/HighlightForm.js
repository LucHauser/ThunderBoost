import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import highlightFormStyles from "./HighlightForm.module.css"
import {useEffect, useState} from "react";
import {getAllProducts} from "@lib/api";
import HighlightView from "@components/HighlightView";
import {hexToRgba} from "@components/stylesUtils";

export default function HighlightForm(session) {

    const eventTypeOptions = [
        {text: "Release", value: "Release"},
        {text: "Announcement", value: "Announcement"},
        {text: "Discount", value: "Discount"},
        {text: "Range", value: "Range"},
        {text: "Bestseller", value: "Bestseller"}
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

    const textShadowOptions = []

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
        //Event Type
        eventType: "Choose type",
        enableCustomEventType: false,
        customEventTypeText: "",
        eventTypeBackground: "#000000",
        eventTypeBackgroundOpacity: "1",
        eventTypeTextColor: "#FFFFFF",
        eventTypeTextRgbAnimation: false,

        //Product Selection
        productId: null,
        showProductPrice: false,

        // Presentation Date
        dateFrom: "",
        dateUntil: "",
        showUntilDate: false,
        dateUntilBackground: "#000000",
        dateUntilBackgroundOpacity: "1",
        additionalUntilText: "",
        dateUntilColor: "#FFFFFF",
        runningCountdown: false,

        // Title area
        title: "",
        titleFontFamily: "Arial, sans-serif",
        titleColor: "#FFFFFF",
        showTitleShadow: false,
        titleShadowColor: "",
        titleShadowStyle: "",

        // Text area
        text: "",
        textFontFamily: "Arial, sans-serif",
        textColor: "#FFFFFF",
        showTextShadow: false,
        textShadowColor: "",
        textShadowStyle: "",

        // Backgrounding
        backgroundStyle: "0",
        primaryBackgroundColor: "#3b3b3b",
        primaryBackgroundColorOpacity: "1",
        secondaryBackgroundColor: "#3b3b3b",
        secondaryBackgroundColorOpacity: "1",
        gradientStyle: "",
        backgroundImgUrl: "",

        // Content Shadowing
        highlightContentShadow: false,
        highlightShadowColor: "",

        // Button area
        buttonToProductText: "",
        hideButtonToProduct: false,
        rgbTitleAnimation: false,
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
        if (value !== "Empty") {
            setModel({
                ...model,
                [name]: products[value].id
            })
            console.log(model.productId)
            setProductForPresentation(products[value])
        } else {
            setModel({
                ...model,
                [name]: value
            })
            setProductForPresentation(null)
        }
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
                <h2 className={defaultStyles.formTitle}>Create a new Highlight</h2>
                <div className={`${defaultStyles.formSeparatorLine}`}/>
            </div>
            <h3 style={{color: "white", fontFamily: "Arial, sans-serif"}}>Live Preview</h3>
            <h3 style={{color: "white", fontFamily: "Arial, sans-serif"}}>Editor</h3>
            <div className={highlightFormStyles.highlightPreview} style={{background: !disableEditorBackground ? editorBackground : "transparent"}}>
                <HighlightView prop={model} presentingProduct={productForPresentation} editViewMode={true}/>
            </div>
            <Form onSubmit={handleSubmit} className={highlightFormStyles.highlightEditorForm}>
                <div className={highlightFormStyles.highlightEditorFormInputs}>
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
                                disabled={model.enableCustomEventType}>
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
                            />
                        </div>
                    </Form.Group>

                    {/*customEventTypeText*/}
                    <Form.Group className={defaultStyles.formGroupSmall} style={{display: !model.enableCustomEventType ? "none": null}}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Custom Event Type Text</Form.Label>
                        <Form.Control className={defaultStyles.formInputFieldSmall} onChange={onModelChange} name="customEventTypeText" placeholder="Enter a custom text"/>
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
                            <input className={highlightFormStyles.colorOpacityRange} style={{background: `linear-gradient(to left, ${model.eventTypeBackground}, ${hexToRgba(model.eventTypeBackground, 0)})`}} name="eventTypeBackgroundOpacity" type="range" min="0" max="1" step="0.01" onChange={onModelChange}/>
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
                            onChange={onChoosingProduct}>
                            <option value={"Empty"}>Select Product</option>
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
                    </Form.Group>

                    {/*hideProductPrice*/}
                    <Form.Group className={highlightFormStyles.multiInputsLine}>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="showProductPrice"
                            onChange={onModelCheckboxChange}/>
                        <Form.Label className={defaultStyles.formLabelSmall}>Show Product Price</Form.Label>
                    </Form.Group>

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

                    {/*showDateUntil, additionalUntilText, dateUntilColor, dateUntilBackground, dateUntilBackgroundOpacity, runningCountdown*/}
                    {
                        model.dateFrom !== "" && model.dateUntil !== "" ?
                        <div>
                            {/*showUntilDate*/}
                            <Form.Group className={highlightFormStyles.multiInputsLine}>
                                <Form.Control
                                    className={defaultStyles.formCheckbox}
                                    type="checkbox"
                                    name="showUntilDate"
                                    onChange={onModelCheckboxChange}
                                />
                                <Form.Label className={defaultStyles.formLabelSmall}>Show date until</Form.Label>
                            </Form.Group>
                            {model.showUntilDate ?
                                <div>
                                    {/*additionalUntilText, dateUntilColor*/}
                                    <FormGroup className={defaultStyles.formGroupSmall}>
                                        <Form.Label className={defaultStyles.formLabelSmall}>Additional Text</Form.Label>
                                        <div className={highlightFormStyles.multiInputsLine}>
                                            <Form.Control name="additionalUntilText" className={defaultStyles.formInputFieldSmall} onChange={onModelChange}/>
                                            <p className={defaultStyles.formSubLabelSmall}>Color:</p>
                                            <Form.Control value={model.dateUntilColor} type="color" name="dateUntilColor" className={defaultStyles.formColorPicker} onChange={onModelChange}/>
                                        </div>
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
                                            />
                                        </div>
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
                                : <div/>
                            }
                        </div>
                        : <div/>
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
                        />
                    </Form.Group>

                    {/*titleFontFamily, titleColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Title Styling</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Font: </p>
                            <Form.Select className={defaultStyles.formInputFieldSmall} name="titleFontFamily" onChange={onModelChange}>
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
                            />
                        </div>
                    </Form.Group>

                    {/*showTitleShadow, titleShadowStyle, titleShadowColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="showTitleShadow"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                            />
                            <Form.Label className={defaultStyles.formLabelSmall}>Title Shadowing</Form.Label>
                        </div>
                        {model.showTitleShadow ?
                            <div className={highlightFormStyles.multiInputsLine}>
                                <p className={defaultStyles.formSubLabelSmall}>Shadow style: </p>
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
                                <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                                <Form.Control
                                    className={`${defaultStyles.formColorPicker}`}
                                    type="color"
                                    name="titleShadowColor"
                                    onChange={onModelChange}
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
                        />
                    </Form.Group>

                    {/*textFontFamily, textColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Text Styling</Form.Label>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <p className={defaultStyles.formSubLabelSmall}>Font: </p>
                            <Form.Select className={defaultStyles.formInputFieldSmall} name="textFontFamily" onChange={onModelChange}>
                                {fontFamilyOptions.map((font, index) => {
                                    return (
                                        <option key={index} value={font.value} style={{fontFamily: font.value}}>{font.text}</option>
                                    )
                                })}
                            </Form.Select>
                            <p className={defaultStyles.formSubLabelSmall}>Color: </p>
                            <Form.Control
                                name="textColor"
                                type="color"
                                onChange={onModelChange}
                                className={`${defaultStyles.formColorPicker}`}
                            />
                        </div>
                    </Form.Group>

                    {/*showTextShadow, textShadowStyle, textShadowColor*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <div className={highlightFormStyles.multiInputsLine}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                name="showTextShadow"
                                onChange={onModelCheckboxChange}
                                type="checkbox"
                            />
                            <Form.Label className={defaultStyles.formLabelSmall}>Text Shadowing</Form.Label>
                        </div>
                        {model.showTextShadow ?
                            <div className={highlightFormStyles.multiInputsLine}>
                                <p className={defaultStyles.formSubLabelSmall}>Shadow style: </p>
                                <Form.Select
                                    className={defaultStyles.formInputFieldSmall}
                                    name="textShadowStyle"
                                    onChange={onModelChange}>
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





                    {/*rgbTitleAnimation*/}
                    <Form.Group className={defaultStyles.formGroupSmall}>
                        <Form.Label className={defaultStyles.formLabelSmall}>Animate RGB at title</Form.Label>
                        <Form.Control
                            className={defaultStyles.formCheckbox}
                            type="checkbox"
                            name="rgbTitleAnimation"
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
                    className={defaultStyles.formColorPicker}
                    onDoubleClick={e => setEditorBackground("#14318C")}/>
                { editorBackground !== "#FFFFFF" ?
                    <i onClick={e => setEditorBackground("#FFFFFF")}>Reset color</i>
                    : null
                }
                <p>Disable Editor Preview Background</p>
                <input type="checkbox" className={defaultStyles.formCheckbox} onChange={e => setDisableEditorBackground(e.target.checked)}/>
                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>Save Highlight</button>
                <p className={defaultStyles.test}>Helllo World</p>
            </div>
            {/*<div style={{width: 50, height: 50, background: "radial-gradient(farthest-corner at 25px 25px, red 0%, yellow 100%)"}}></div>*/}
        </div>
    )

    /**/
}