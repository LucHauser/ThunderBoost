import defaultStyles from "../../stylesheet/global.module.css"
import imagesManagementStyles from "../../stylesheet/imageManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";

export default function ImagesManagementPage({session}) {

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <AdminPortalHeader session={session} currentPage={4}/>

        </div>
    )
}