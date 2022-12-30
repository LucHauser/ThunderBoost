import defaultStyles from "../../stylesheet/global.module.css"
import ImageUploadForm from "@components/forms/ImageUploadForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default function UploadImage({session}) {

    const router = useRouter()

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push("../imagesManagement")}>
                <FontAwesomeIcon icon={faLeftLong}/>
                &nbsp;&nbsp;&nbsp;Back
            </button>
            <h1>Upload new Image</h1>
            <div className={defaultStyles.formSeparatorLine}/>
            <div style={{display: "flex", justifyContent: "center"}}>
                <ImageUploadForm session={session}/>
            </div>
        </div>
    )
}