import {useState} from "react";
import {Form} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import productFormStyles from "./ProductForm.module.css"
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ReactMarkdown from "react-markdown";
import {faFilePen, faFileLines} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function ProductForm({session, onProductCreated}) {

    const usages = ["Gaming", "Office", "Students & Pupils"]

    function validateProductModel() {
        const errors = {
            name: "",
            price: null,
            servings: null,
            description: "",
            stockAmount: null,
            releaseDate: "",
        }

        let isValid = true

        // TODO Validating Inputs

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
        active: false
    }

    const [productModel, setProductModel] = useState(defaultProductModel)
    const [errors, setErrors] = useState(null)
    const [loadProduct, setLoadProduct] = useState(false)
    const [markdownReview, setMarkdownReview] = useState("")

    const handleChange = (e) => {
        const target = e.target
        const name = e.name
        const value = target.value
        setProductModel({
            ...productModel,
            [name]: value
        })
    }

    return (
        <div className={productFormStyles.wrapper}>
            <Form>
                <h2 className={defaultStyles.formTitle}>Create new product</h2>
                <div className={defaultStyles.formSeparatorLine}/>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Name</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type="text" name="name" onChange={handleChange} placeholder={"What's the name of this Product"}/>
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Price</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type="number" name="price" onChange={handleChange} placeholder={"How much costs this product"}/>
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Servings</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type="number" name="servings" onChange={handleChange} placeholder={"How many portions are here"}/>
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Usage</Form.Label>
                    <Form.Select className={defaultStyles.formInputField} onChange={handleChange} name="usage">
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
                <Form.Group className={defaultStyles.formGroup}>
                    <Tabs>
                        <div className={productFormStyles.labelSwitchFlex}>
                            <Form.Label className={`${defaultStyles.formLabel} ${productFormStyles.labelDescription}`}>Description</Form.Label>
                            <TabList className={productFormStyles.markdownSwitcher}>
                                <Tab className={productFormStyles.markdownSwitchButton}><FontAwesomeIcon icon={faFilePen} size={"1x"} color={"white"}/></Tab>
                                <Tab className={productFormStyles.markdownSwitchButton}><FontAwesomeIcon icon={faFileLines} size={"1x"} color={"#8DF3E8"}/></Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <textarea className={`${defaultStyles.formInputField} ${productFormStyles.textareaMarkdown}`} value={markdownReview} onChange={(e) => setMarkdownReview(e.target.value)} placeholder="Enter your description, Markdown is supported"/>
                        </TabPanel>
                        <TabPanel>
                            {/* eslint-disable-next-line react/no-children-prop */}
                            <ReactMarkdown className={`${productFormStyles.markdownReview}`} children={markdownReview}/>
                        </TabPanel>
                    </Tabs>
                </Form.Group>
                <Form.Group>
                    <Form.Label className={defaultStyles.formLabel}>Product Image</Form.Label>
                    <Form.Control></Form.Control>
                </Form.Group>
                
            </Form>
        </div>
    )


}