import {useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import imageUploadFormStyles from "./ImageUploadForm.module.css"
import defaultStyles from "../pages/stylesheet/global.module.css"
import {uploadImageData} from "@lib/api";
import {useRouter} from "next/router";

export default function ImageUploadForm({session}) {

    const usageOptions = ["Product Image", "Highlights Background", "Diverse"]

    const defaultModel = {
        img: "",
        fileType: "",
        designation: "",
        description: "",
        usage: "",
        uploaded: "",
        active: true
    }

    const [model, setModel] = useState(defaultModel)
    const [errors, setErrors] = useState({})
    const [loadModel, setLoadModel] = useState(false)
    const [imagePath, setImagePath] = useState("")
    const [selectedFile, setSelectedFile] = useState()
    const [imagePreview, setImagePreview] = useState("")
    const [base64Image, setBase64Image] = useState("")

    const router = useRouter()

    function validateModel(model, selectedFile) {
        const errors = {
            selectedFile: "",
            designation: "",
            description: "",
            usage: ""
        }
        let isValid = true

        if (model.designation.trim().length === 0) {
            errors.designation = "Designation is required"
            isValid = false
        }
        if (model.designation.length > 30) {
            errors.designation = "Designation is too long (max 30 character enabled)"
            isValid = false
        }
        if (model.description.length > 100) {
            errors.description = "Description is too long (max. 100 character enabled)"
            isValid = false
        }
        if (model.usage === "") {
            errors.usage = "Choose a usage from the options"
            isValid = false
        }
        return {errors, isValid}
    }

    useEffect(() => {
        if (!selectedFile) {
            setImagePreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setImagePreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    useEffect(() => {
        if (imagePath) {
            setModel({
                ...model,
                img: imagePath
            })
        }
    }, [imagePath])

    /*
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
    */

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })

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

    const onChoosingImage = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
        console.log(e.target.files)
        setModel({
            ...model,
            fileType: e.target.files[0].type.split("/")[1]
        })
        // console.log(selectedFile)
    }

    const uploadImageToPublic = async (base64Image) => {
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
        const path = data.filePath
        return path

    }

    const submitUploadImage = async (e) => {
        // debugger
        e.preventDefault()
        setLoadModel(true)
        const result = validateModel(model)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadModel(false)
            return
        }
        const base64 = await toBase64(selectedFile)
        setBase64Image(base64)
        if (!base64Image) return
        model.img = await uploadImageToPublic(base64Image)
        model.uploaded = "unknown"
        try {
            await uploadImageData(model, session.accessToken)
        } catch (e) {
            console.log(e)
        }
        router.push("../imagesManagement")

    }

    return (
        <div className={imageUploadFormStyles.component}>
            <Form className={imageUploadFormStyles.form} onSubmit={submitUploadImage}>

                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Image</Form.Label>
                    <Form.Control type={"file"} accept={".jpg, .png, .jpeg"} onChange={onChoosingImage} name={"img"} className={defaultStyles.formInputField}/>
                    {errors.selectedFile && <p>{errors.selectedFile}</p>}
                </Form.Group>

                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Designation</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} name={"designation"} onChange={onModelChange}/>
                    {errors.designation && <p>{errors.designation}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Description</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} name={"description"} onChange={onModelChange}/>
                    {errors.description && <p>{errors.description}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Usage</Form.Label>
                    <Form.Select className={defaultStyles.formInputField} name={"usage"} onChange={onModelChange}>
                        <option>Choose</option>
                        {
                            usageOptions.map((opt, index) => {
                                return (
                                    <option key={index} value={opt}>{opt}</option>
                                )
                            })
                        }
                    </Form.Select>
                    {errors.usage && <p>{errors.usage}</p>}
                </Form.Group>
                <div className={imageUploadFormStyles.buttonGroup}>
                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} type={"submit"}>Upload</button>
                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent} ${defaultStyles.buttonFilledAutoWidth}`}>Cancel</button>
                </div>
            </Form>
            <div>
                {selectedFile && <>
                    <img className={imageUploadFormStyles.imagePreview} src={imagePreview}/>
                    <p>{}</p>
                    </>
                }
            </div>
        </div>
    )
}