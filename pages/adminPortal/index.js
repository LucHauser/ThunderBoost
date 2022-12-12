import AdminPortalHeader from "@components/AdminPortalNav";
import adminPortalStyles from "../stylesheet/adminPortal.module.css"
import defaultStyles from "../stylesheet/global.module.css"

export default function AdminPortal({session}) {
    return (
        <div className={defaultStyles.adminPageWrapper}>
            <AdminPortalHeader session={session} currentPage={0}/>
        </div>
    )
}