import defaultStyles from "../../stylesheet/global.module.css"
import ProductForm from "@components/forms/ProductForm";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default function createProductPage({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push("../productManagement")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>Create new Product</h1>
            <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
            <div>
                <ProductForm session={session}/>
            </div>

        </div>
    )
}