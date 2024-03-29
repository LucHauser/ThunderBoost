import {useEffect, useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import defaultStyles from "../../pages/stylesheet/global.module.css"
import baseDataVarietyStyles from "./BaseDataVarietyForm.module.css"
import {createBaseDataVariety, updateBaseDataVariety} from "@lib/api"
import {useRouter} from "next/router";

export default function BaseDataVarietyForm({session, host, varietyToEdit, disableRouting, onVarietyCreated, toggleForm, smallInputs}) {

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
        description: "",
        numbersIncludedProducts: 0
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
                await updateBaseDataVariety(host, variety, session.accessToken)
                navigateBack("../../baseDataVariety")
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                const newVariety = await createBaseDataVariety(host, variety, session.accessToken)
                if (disableRouting) {
                    console.log("HERE")
                    onVarietyCreated(newVariety.name)
                    toggleForm()
                } else {
                    navigateBack("../baseDataVariety")
                }
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
                <Container fluid={true}>
                    <Row>
                        <Col>
                            <Form.Group
                                className={!smallInputs ?
                                    defaultStyles.formGroup :
                                    defaultStyles.formGroupSmall}>
                                <Form.Label
                                    className={!smallInputs ?
                                        defaultStyles.formLabel :
                                        defaultStyles.formLabelSmall}>Designation</Form.Label>
                                <Form.Control
                                    className={!smallInputs ?
                                        defaultStyles.formInputField :
                                        defaultStyles.formInputFieldSmall}
                                    type={"text"}
                                    name="name"
                                    onChange={handleChange}
                                    defaultValue={variety.name}
                                    placeholder={"Designation of Variety"}
                                />
                                { errors.name && <p>{errors.name}</p> }
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className={!smallInputs ?
                                defaultStyles.formGroup :
                                defaultStyles.formGroupSmall}>
                                <Form.Label className={!smallInputs ?
                                    defaultStyles.formLabel :
                                    defaultStyles.formLabelSmall}>Description</Form.Label>
                                <Form.Control
                                    className={!smallInputs ? defaultStyles.formInputField : defaultStyles.formInputFieldSmall}
                                    type={"text"}
                                    name="description"
                                    onChange={handleChange}
                                    defaultValue={variety.description}
                                    placeholder={"Description of Variety"}
                                />
                                { errors.description && <p>{errors.description}</p> }
                            </Form.Group>
                        </Col>
                    </Row>
                    {
                        variety.id &&
                        <Row>
                            <Col>
                                <Form.Group className={defaultStyles.formGroupHorizontal}>
                                    <Form.Check
                                        className={defaultStyles.formCheckbox}
                                        onChange={(e) => setVariety({...variety, active: e.target.checked})}
                                        defaultChecked={variety.active}
                                    />
                                    <Form.Label className={defaultStyles.formLabel}>Active</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <div className={defaultStyles.formBtnGroup}>
                                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${smallInputs ? defaultStyles.buttonSm : null}`} type={"submit"}>{variety.id ? "Save changes" : (disableRouting ? "Add Variety" : "Save variety")}</button>
                                <button
                                    type={"button"}
                                    className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent} ${defaultStyles.buttonFilledAutoWidth} ${smallInputs ? defaultStyles.buttonSm : null}`}
                                    onClick={() =>
                                        variety.id ?
                                            navigateBack("../../baseDataVariety")
                                            : (disableRouting ?
                                                    toggleForm()
                                                    : navigateBack("../baseDataVariety")
                                            )
                                    }>Cancel
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Container>


            </Form>
        </div>
    )




}