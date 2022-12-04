import defaultStyles from "../../stylesheet/global.module.css"
import ImageUploadForm from "@components/ImageUploadForm";

export default function UploadImage({session}) {

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <h1>Upload new Image</h1>
            <div className={defaultStyles.formSeparatorLine}/>
            <div style={{display: "flex", justifyContent: "center"}}>
                <ImageUploadForm session={session}/>
            </div>
        </div>
    )
}