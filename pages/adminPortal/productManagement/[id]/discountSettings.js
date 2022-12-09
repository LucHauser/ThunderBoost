import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getProductById, updateProduct} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import DiscountSettingsForm from "@components/DiscountForm";

export default function ProductDiscountManager({session}) {

    const router = useRouter()
    const {id} = router.query

    const [productToEdit, setProductToEdit] = useState({})

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const productForEdit = await getProductById(id)
                setProductToEdit(productForEdit)
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
    }, [id])

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <button
                style={{width: 100}}
                className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}
                onClick={() =>router.push("../../productManagement")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>Edit Discount for {productToEdit.name}</h1>
            <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
            <DiscountSettingsForm session={session} productToEdit={productToEdit}/>
        </div>
    )
}