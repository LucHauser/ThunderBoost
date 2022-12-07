import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getProductById} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
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
            <Form onSubmit={saveDiscountSettings} style={{display: "grid", gridTemplateColumns: "50% 50%", columnGap: 10}}>
                <FormGroup className={defaultStyles.formGroup} style={{display: "flex", gridRow: "1 / 1", gridColumn: "1 / span 2"}}>
                    <Form.Control className={defaultStyles.formCheckbox} type={"checkbox"} name={"discountActive"} onChange={onProductChange} defaultChecked={product.discountActive}/>
                    <Form.Label className={defaultStyles.formLabel}>Enable Price Discount</Form.Label>
                </FormGroup>
                <Form.Group className={defaultStyles.formGroup} style={{gridRow: "2 / 2", gridColumn: "1 / 1"}}>
                    <Form.Label className={defaultStyles.formLabel}>Discount percent</Form.Label>
                    <Form.Control type={"number"} className={defaultStyles.formInputField} name={"discountPercent"} onChange={onProductChange}/>
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup} style={{gridRow: "3 / 3", gridColumn: "1 / 1"}}>
                    <Form.Label className={defaultStyles.formLabel}>Discount From</Form.Label>
                    <Form.Control type={"datetime-local"} className={defaultStyles.formInputField} name={"discountFrom"} onChange={onProductChange}/>
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup} style={{gridRow: "3 / 3", gridColumn: "2 / 2"}}>
                    <Form.Label className={defaultStyles.formLabel}>Discount until</Form.Label>
                    <Form.Control type={"datetime-local"} className={defaultStyles.formInputField} name={"discountUntil"} onChange={onProductChange}/>
                </Form.Group>
                <FormGroup className={defaultStyles.formGroup} style={{display: "flex", gridRow: "4 / 4", gridColumn: "1 / 1"}}>
                    <Form.Control className={defaultStyles.formCheckbox} type={"checkbox"} onChange={(e) => setProduct({...product, showDiscountUntilDate: e.target.checked})} defaultChecked={product.showDiscountUntilDate}/>
                    <Form.Label className={defaultStyles.formLabel}>Show the Until Date of this discount</Form.Label>
                </FormGroup>
                {
                    product.showDiscountUntilDate ?
                        <>
                            <Form.Group className={defaultStyles.formGroup} style={{gridRow: "5 / 5", gridColumn: "1 / 1"}}>
                                <Form.Label className={defaultStyles.formLabel}>Discount Until Text</Form.Label>
                                <Form.Control style={{width: "100%"}} className={defaultStyles.formInputField} name={"discountUntilText"} onChange={onProductChange} defaultValue={product.discountUntilText}/>
                            </Form.Group>
                            <Form.Group className={defaultStyles.formGroup} style={{gridRow: "6 / 6", gridColumn: "1 / 1", display: "flex"}}>
                                <Form.Control className={defaultStyles.formCheckbox} type={"checkbox"} onChange={(e) => setProduct({...product, enableCountdown: e.target.checked})} defaultChecked={product.enableCountdown}/>
                                <Form.Label className={defaultStyles.formLabel}>Enable countdown</Form.Label>
                            </Form.Group>
                        </>

                         :
                        null
                }
            </Form>
        </div>
    )
}