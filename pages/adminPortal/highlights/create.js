import defaultStyles from "../../stylesheet/global.module.css"
import HighlightForm from "@components/forms/HighlightForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";

export default function createHighlight({session}) {

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
            <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push("../highlights")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>Plan a new Highlight</h1>
            <div>
                <HighlightForm session={session}/>
            </div>

        </div>
    )
}