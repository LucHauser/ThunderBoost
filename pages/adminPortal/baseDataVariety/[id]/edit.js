import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getBaseDataVariertyById} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
import BaseDataVarietyForm from "@components/forms/BaseDataVarietyForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";

export default function editVariety({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [varietyToEdit, setVarietyToEdit] = useState(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()

    const {id} = router.query

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!id) return
        const loadVariety = async () => {
            try {
                const variety = await getBaseDataVariertyById(id)
                setVarietyToEdit(variety)
            } catch (e) {
                console.log(e)
            }
        }
        loadVariety()
    }, [id])

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() =>router.push("../../baseDataVariety")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>{varietyToEdit?.name}</h1>
            <div className={defaultStyles.formSeparatorLine}/>
            <BaseDataVarietyForm session={session} varietyToEdit={varietyToEdit}/>
        </div>
    )
}