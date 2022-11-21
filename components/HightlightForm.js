import {Form} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
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

    const defaultModel = {
        eventType: "",
        productId: null,
        title: "",
        titlePos: "",
        titleColor: "",
        text: "",
        textPos: "",
        textColor: "",
        dateFrom: "",
        dateUntil: "",
        saleDiscount: null,
        PrimaryBackgroundColor: "",
        SecondaryBackgroundColor: "",
        backgroundImgUrl: "",
        gradientStyle: "",
        showButtonToProduct: false,
        rgbTitleAnimation: false,
        rgbBackground: false,
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
                <Form.Group className={defaultStyles.formGroup}>
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
                                    <option key={index} value={product.id}>{product.name}</option>
                                )
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Title</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} name="title" onChange={onModelChange} placeholder="Give your Highlight a title"/>
                </Form.Group>
            </Form>
        </div>
    )
}