import {useEffect, useState} from "react";
import discountSettingsFormStyles from "./DiscountSettingsForm.module.css"
import {updateProduct} from "@lib/api";
import discountSettingsStyles from "@components/DiscountSettingsForm.module.css";
import {Form, FormGroup} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css";
import {useRouter} from "next/router";
import {getDiscountPrice} from "@components/Utils";

export default function DiscountSettingsForm({session, productToEdit}) {

    function validateDiscountSettings(model) {
        const errors = {
            discountPercent: "",
            discountUntilText: ""
        }
        let isValid = true
        if (model.discountPercent < 0 || model.discountPercent > 100) {
            errors.discountPercent = "Percentage must be between 0 to 100"
            isValid = false
        }
        if (model.discountUntilText.length > 30) {
            errors.discountUntilText = "Max. 30 Characters enabled"
            isValid = false
        }
        return {errors, isValid}
    }

    const [product, setProduct] = useState({})
    const [loadProduct, setLoadProduct] = useState(false)
    const [errors, setErrors] = useState({})

    const router = useRouter()

    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit)
        }
    }, [productToEdit])

    const onProductChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setProduct({
            ...product,
            [name]: value
        })
    }

    const saveDiscountSettings = async (e) => {
        console.log(product)
        e.preventDefault()
        setLoadProduct(true)
        const result = validateDiscountSettings(product)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadProduct(false)
            return
        }
        try {
            await updateProduct(product, session.accessToken)
        } catch (e) {
            console.log(e)
        }
        navigateBack()
    }

    const navigateBack = () => {
        router.push("../../productManagement")
    }

    return (
        <Form onSubmit={saveDiscountSettings} className={discountSettingsStyles.formWrapper}>
            <FormGroup
                id={discountSettingsFormStyles["discountActive"]}
                className={defaultStyles.formGroup}>
                <Form.Control
                    className={defaultStyles.formCheckbox}
                    type={"checkbox"}
                    onChange={(e) => setProduct({...product, discountActive: e.target.checked})}
                    defaultChecked={product.discountActive}
                />
                <Form.Label className={defaultStyles.formLabel}>Enable Price Discount</Form.Label>
            </FormGroup>
            {
                !product.discountPercent < 1 || !product.discountPercent > 100 || product.discountPercent !== "" ?
                    <p id={discountSettingsFormStyles["discountInformation"]}>{`Current Price: ${product.price} Discount Price: ${getDiscountPrice(product.price, product.discountPercent)}`}</p>
                    : null
            }



            <Form.Group
                id={discountSettingsFormStyles["discountPercent"]}
                className={defaultStyles.formGroup}>
                <Form.Label className={defaultStyles.formLabel}>Discount percent</Form.Label>
                <Form.Control
                    defaultValue={product.discountPercent}
                    type={"number"}
                    className={defaultStyles.formInputField}
                    name={"discountPercent"}
                    onChange={onProductChange}
                />
                {errors.discountPercent && <p>{errors.discountPercent}</p>}
            </Form.Group>

            <Form.Group
                id={discountSettingsFormStyles["dateFrom"]}
                className={defaultStyles.formGroup}>
                <Form.Label className={defaultStyles.formLabel}>Discount From</Form.Label>
                <Form.Control
                    defaultValue={product.discountFrom}
                    type={"datetime-local"}
                    className={defaultStyles.formInputField}
                    name={"discountFrom"}
                    onChange={onProductChange}
                />
            </Form.Group>

            <Form.Group
                id={discountSettingsFormStyles["dateUntil"]}
                className={defaultStyles.formGroup}>
                <Form.Label className={defaultStyles.formLabel}>Discount until</Form.Label>
                <Form.Control
                    defaultValue={product.discountUntil}
                    type={"datetime-local"}
                    className={defaultStyles.formInputField}
                    name={"discountUntil"}
                    onChange={onProductChange}
                />
            </Form.Group>

            <FormGroup
                id={discountSettingsFormStyles["showDiscountUntilDate"]}
                className={defaultStyles.formGroup}>
                <Form.Control
                    className={defaultStyles.formCheckbox}
                    type={"checkbox"}
                    onChange={(e) =>
                        setProduct({...product, showDiscountUntilDate: e.target.checked})
                    }
                    defaultChecked={product.showDiscountUntilDate}
                />
                <Form.Label className={defaultStyles.formLabel}>Show the Until Date of this discount</Form.Label>
            </FormGroup>

            {
                product.showDiscountUntilDate ?
                    <>
                        <Form.Group
                            id={discountSettingsFormStyles["discountUntilText"]}
                            className={defaultStyles.formGroup}>
                            <Form.Label className={defaultStyles.formLabel}>Discount Until Text</Form.Label>
                            <Form.Control
                                style={{width: "100%"}}
                                className={defaultStyles.formInputField}
                                name={"discountUntilText"}
                                onChange={onProductChange}
                                defaultValue={product.discountUntilText}
                            />
                            { errors.discountUntilText && <p>{errors.discountUntilText}</p> }
                        </Form.Group>

                        <Form.Group
                            id={discountSettingsFormStyles["enableCountdown"]}
                            className={defaultStyles.formGroup}>
                            <Form.Control
                                className={defaultStyles.formCheckbox}
                                type={"checkbox"}
                                onChange={(e) =>
                                    setProduct({...product, enableCountdown: e.target.checked})
                                }
                                defaultChecked={product.enableCountdown}
                            />
                            <Form.Label className={defaultStyles.formLabel}>Enable countdown</Form.Label>
                        </Form.Group>
                    </>
                    : null
            }
            <div className={discountSettingsStyles.buttonGroup}>
                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} type={"submit"}>Save</button>
                <button className={`${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent}`} type={"button"} onClick={() => navigateBack()}>Cancel</button>
            </div>
        </Form>
    )
}