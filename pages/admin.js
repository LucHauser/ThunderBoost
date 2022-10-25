import {handleShowHeader} from "./_app";
import defaultStyles from "./stylesheet/global.module.css"
import adminStyles from "./stylesheet/admin.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";

export default function AdminPage () {

    handleShowHeader()

    return (
        <div className={adminStyles.adminWrapper}>
            <div>
                <button className={`${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonFilled}`}><FontAwesomeIcon icon={faRightToBracket} size={"1x"} className={adminStyles.faRightToBracket}/>Leave Admin-Portal to Shop</button>
                <h1 className={adminStyles.adminPageTitle}>Administration-Portal</h1>
            </div>
            
        </div>
    )
}