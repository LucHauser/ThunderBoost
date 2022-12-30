import {useRouter} from "next/router";
import defaultStyles from "../../../stylesheet/global.module.css"
import {useEffect, useState} from "react";
import {getProductById} from "@lib/api";
import ProductForm from "@components/forms/ProductForm";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";

export default function editProductPage({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [productToEdit, setProductToEdit] = useState(null)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const {id} = router.query

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!id) return
        const loadProduct = async () => {
            try {
                const product = await getProductById(id)
                setProductToEdit(product)
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
            <h1>Edit {productToEdit?.name}</h1>
            <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
            <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
                <ProductForm session={session} productToEdit={productToEdit}/>
            </div>
        </div>
    )
}