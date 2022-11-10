import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import baseDataVarietyStyles from "./BaseDataVarietyForm.module.css"
import {createBaseDataVariety, updateBaseDataVariety} from "@lib/api"

export default function BaseDataVarietyForm({session, varietyToEdit, onVarietyCreated, onVarietyEdited, toggleModal, toggleSubform}) {

    function validateVarietyModel(variety) {

        const errors = {
            name: "",
            description: ""
        }

        let isValid = true

        if (variety.name.trim().length === 0) {
            errors.name = "Designation is required"
            isValid = false
        }
        if (variety.name.length > 30) {
            errors.name = "Max. 30 Character enabled"
            isValid = false
        }
        if (variety.description.length > 100) {
            errors.description = "Max. 100 Character enabled"
            isValid = false
        }
        return {errors, isValid}
    }

    const defaultVarietyModel = {
        name: "",
        description: ""
    }

    const [variety, setVariety] = useState(defaultVarietyModel)
    const [errors, setErrors] = useState(defaultVarietyModel)
    const [loadVariety, setLoadVariety] = useState(false)

    useEffect(() => {
        if (varietyToEdit) {
            setVariety(varietyToEdit)
        }
    }, [varietyToEdit])

    const handleChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setVariety({
            ...variety,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoadVariety(true)
        setErrors(defaultVarietyModel)
        const result = validateVarietyModel(variety)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadVariety(false)
            return
        }
        if (variety.id) {
            try {
                const response = await updateBaseDataVariety(variety, session.accessToken)
                setVariety(response)
                onVarietyEdited(response)
            } catch (e) {
                console.log(e)
            }
            toggleModal()
        } else {
            try {
                const newVariety = await createBaseDataVariety(variety, session.accessToken)
                setVariety(newVariety)
                onVarietyCreated(newVariety)
            } catch (e) {
                console.log(e)
            }
            toggleModal()
        }
    }

    return (
        <div>
            <Form className={baseDataVarietyStyles.baseDataVarietyForm} onSubmit={handleSubmit}>
                <h2 className={defaultStyles.formTitle}>{variety.id ? "Edit " + variety.name : "Create new Variety"}</h2>
                <div className={defaultStyles.formSeparatorLine}/>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Designation</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type={"text"} name="name" onChange={handleChange} value={variety.name} placeholder={"Designation of Variety"}/>
                    { errors.name && <p>{errors.name}</p> }
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Description</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type={"text"} name="description" onChange={handleChange} value={variety.description} placeholder={"Description of Variety"}/>
                    { errors.description && <p>{errors.description}</p> }
                </Form.Group>
                <div className={baseDataVarietyStyles.buttonGroup}>
                    {variety.id ?
                        <button className={`${defaultStyles.buttonFilled}`} type={"submit"}>Save changes</button>
                        : <button className={`${defaultStyles.buttonFilled}`} type={"submit"}>Save variety</button>
                    }
                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent}`}
                            onClick={toggleModal}>
                        Cancel
                    </button>
                </div>

            </Form>
        </div>
    )




}