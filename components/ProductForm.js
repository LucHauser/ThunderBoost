import {useEffect, useRef, useState} from "react";
import {Form, FormGroup, FormLabel} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import productFormStyles from "./ProductForm.module.css"
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import {faFilePen, faFileLines} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAllBaseDataVariety} from "@lib/api";

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

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
    const [varieties, setVarieties] = useState([])
    const [markdownReview, setMarkdownReview] = useState("")
    const [markdownMode, setMarkdownMode] = useState(false)

    const [selectedVarieties, setSelectedVarieties] = useState([])

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
                                <Tab className={productFormStyles.markdownSwitchButton} onClick={() => setMarkdownMode(false)} title={"View in Editor-Mode"}>
                                    <FontAwesomeIcon icon={faFilePen} size={"1x"} color={!markdownMode ? "#8DF3E8" : "#FFFFFF"}/>
                                </Tab>
                                <Tab className={productFormStyles.markdownSwitchButton} onClick={() => setMarkdownMode(true)} title={"View in View-Mode"}>
                                    <FontAwesomeIcon icon={faFileLines} size={"1x"} color={markdownMode ? "#8DF3E8" : "#FFFFFF"}/>
                                </Tab>
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
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Product Image</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type="file" accept=".jpg, .png" name="img" onChange={onFileInputChange} ref={fileInput}/>
                </Form.Group>
                <FormGroup className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Varieties</Form.Label>
                    <Select isMulti options={varieties.map(variety => {
                        return {label: variety.name, value: variety.id, title: variety.description}
                    })
                    } isSearchable={true} className={productFormStyles.multiSelectDropdown} theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        background: "#060525",
                        colors: {
                            primary: '#FFFFFF'
                        }
                    })}/>
                </FormGroup>
                
            </Form>
        </div>
    )


}