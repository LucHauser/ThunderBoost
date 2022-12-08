import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getProductById} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
import discountSettingsStyles from "../../../stylesheet/discountSettings.module.css"
import {Form, FormGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";

export default function ProductDiscountManager({session}) {

    const router = useRouter()
    const {id} = router.query

    const [product, setProduct] = useState()

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const product = await getProductById(id)
                setProduct(product)
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
    }, [id])

    const onProductChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setProduct({
            ...product,
            [name]: value
        })
    }

    const saveDiscountSettings = (e) => {
        e.preventDefault()
    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <button
                style={{width: 100}}
                className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}
                onClick={() =>router.push("../../productManagement")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>Edit Discount for {product?.name}</h1>
            <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
            <Form onSubmit={saveDiscountSettings} className={discountSettingsStyles.formWrapper}>
                <FormGroup id={discountSettingsStyles["discountActive"]} className={defaultStyles.formGroup}>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        type={"checkbox"}
                        name={"discountActive"}
                        onChange={onProductChange}
                        defaultChecked={product?.discountActive}
                    />
                    <Form.Label className={defaultStyles.formLabel}>Enable Price Discount</Form.Label>
                </FormGroup>
                <Form.Group id={discountSettingsStyles["discountPercent"]} className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Discount percent</Form.Label>
                    <Form.Control
                        type={"number"}
                        className={defaultStyles.formInputField}
                        name={"discountPercent"}
                        onChange={onProductChange}
                    />
                </Form.Group>
                <Form.Group id={discountSettingsStyles["dateFrom"]} className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Discount From</Form.Label>
                    <Form.Control
                        type={"datetime-local"}
                        className={defaultStyles.formInputField}
                        name={"discountFrom"}
                        onChange={onProductChange}
                    />
                </Form.Group>
                <Form.Group id={discountSettingsStyles["dateUntil"]} className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Discount until</Form.Label>
                    <Form.Control
                        type={"datetime-local"}
                        className={defaultStyles.formInputField}
                        name={"discountUntil"}
                        onChange={onProductChange}
                    />
                </Form.Group>
                <FormGroup id={discountSettingsStyles["showDiscountUntilDate"]} className={defaultStyles.formGroup}>
                    <Form.Control
                        className={defaultStyles.formCheckbox}
                        type={"checkbox"}
                        onChange={(e) => setProduct({...product, showDiscountUntilDate: e.target.checked})}
                        defaultChecked={product?.showDiscountUntilDate}
                    />
                    <Form.Label className={defaultStyles.formLabel}>Show the Until Date of this discount</Form.Label>
                </FormGroup>
                {
                    product?.showDiscountUntilDate ?
                        <>
                            <Form.Group id={discountSettingsStyles["discountUntilText"]} className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Discount Until Text</Form.Label>
                                <Form.Control style={{width: "100%"}} className={defaultStyles.formInputField} name={"discountUntilText"} onChange={onProductChange} defaultValue={product.discountUntilText}/>
                            </Form.Group>
                            <Form.Group id={discountSettingsStyles["enableCountdown"]} className={defaultStyles.formGroup}>
                                <Form.Control className={defaultStyles.formCheckbox} type={"checkbox"} onChange={(e) => setProduct({...product, enableCountdown: e.target.checked})} defaultChecked={product.enableCountdown}/>
                                <Form.Label className={defaultStyles.formLabel}>Enable countdown</Form.Label>
                            </Form.Group>
                        </>

                         :
                        null
                }
                <div className={discountSettingsStyles.buttonGroup}>
                    <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>Save</button>
                    <button className={`${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent}`}>Cancel</button>
                </div>
            </Form>
        </div>
    )
}