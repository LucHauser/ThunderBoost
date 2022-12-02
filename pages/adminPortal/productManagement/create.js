import defaultStyles from "../../stylesheet/global.module.css"
import ProductForm from "@components/ProductForm";
import productFormStyles from "@components/ProductForm.module.css";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";

export default function createProductPage({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <h1>Create new Product</h1>
            <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
            <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
                <ProductForm session={session}/>
            </div>

        </div>
    )
}