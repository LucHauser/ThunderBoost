import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getHighlightById} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import HighlightForm from "@components/forms/HighlightForm";

export default function editHighlight({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [highlightForEdit, setHighlightForEdit] = useState({})

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const {id} = router.query

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect( () => {
        if (!id) return
        getHighlight(id)
        console.log(highlightForEdit)
    }, [id])

    async function getHighlight(id) {
        const res = await getHighlightById(host, id)
        console.log(res)
        setHighlightForEdit(res)
    }

    return (
        <div className={defaultStyles.page}>
            <button
                style={{width: 100}}
                className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}
                onClick={() =>  router.push("../../highlights")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>Edit {highlightForEdit?.designation}</h1>
            <div className={defaultStyles.formSeparatorLine} style={{marginTop: 10}}/>
            <HighlightForm session={session} highlightToEdit={highlightForEdit} host={host}/>
        </div>
    )
}