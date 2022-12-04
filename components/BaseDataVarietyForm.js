import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import baseDataVarietyStyles from "./BaseDataVarietyForm.module.css"
import {createBaseDataVariety, updateBaseDataVariety} from "@lib/api"
import {useRouter} from "next/router";

export default function BaseDataVarietyForm({session, varietyToEdit}) {

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
        active: true,
        name: "",
        description: ""
    }

    const [variety, setVariety] = useState(defaultVarietyModel)
    const [errors, setErrors] = useState(defaultVarietyModel)
    const [loadVariety, setLoadVariety] = useState(false)

    const router = useRouter()

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
                await updateBaseDataVariety(variety, session.accessToken)
                navigateBack("../../baseDataVariety")
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                await createBaseDataVariety(variety, session.accessToken)
                navigateBack("../baseDataVariety")
            } catch (e) {
                console.log(e)
            }
        }
    }

    const navigateBack = (route) => {
        router.push(route)
    }

    return (
        <div>
            <Form className={baseDataVarietyStyles.baseDataVarietyForm} onSubmit={handleSubmit}>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Designation</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type={"text"} name="name" onChange={handleChange} value={variety.name} placeholder={"Designation of Variety"} disabled={false}/>
                    { errors.name && <p>{errors.name}</p> }
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Description</Form.Label>
                    <Form.Control className={defaultStyles.formInputField} type={"text"} name="description" onChange={handleChange} value={variety.description} placeholder={"Description of Variety"} disabled={false}/>
                    { errors.description && <p>{errors.description}</p> }
                </Form.Group>
                {
                    variety.id &&
                    <Form.Group style={{display: "flex", alignItems: "center", gap: 10}}>
                        <Form.Control className={defaultStyles.formCheckbox} onChange={(e) => setVariety({...variety, active: e.target.checked})} type={"checkbox"} defaultChecked={variety.active}/>
                        <Form.Label className={defaultStyles.formLabel}>Active</Form.Label>
                    </Form.Group>
                }
                <div className={baseDataVarietyStyles.buttonGroup}>
                    {variety.id ?
                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} type={"submit"}>Save changes</button>
                        : <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} type={"submit"}>Save variety</button>
                    }
                    <button type={"button"} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent} ${defaultStyles.buttonFilledAutoWidth}`}
                            onClick={() => variety.id ? navigateBack("../../baseDataVariety") : navigateBack("../baseDataVariety")}>
                        Cancel
                    </button>
                </div>

            </Form>
        </div>
    )




}