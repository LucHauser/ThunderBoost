import {handleShowHeader} from "./_app";
import defaultStyles from "./stylesheet/global.module.css"
import adminStyles from "./stylesheet/admin.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useRedirectToLogin} from "@lib/session";
import {useRouter} from "next/router";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {TabPane} from "react-bootstrap";
import BaseDataVarietyForm from "@components/BaseDataVarietyForm";

export default function AdminPage ({session}) {

    useRedirectToLogin(session)
    handleShowHeader()

    const router = useRouter()


    const leaveAdminPortal = () => {
        router.push("/profile")
        handleShowHeader()
    }

    return (
        <div className={adminStyles.adminWrapper}>
            <button className={`${defaultStyles.buttonFilled} ${adminStyles.leaveBtn}`} onClick={leaveAdminPortal}>
                <FontAwesomeIcon icon={faRightToBracket} size={"1x"} className={adminStyles.faRightToBracket}/>Leave Admin-Portal to Shop</button>
            <h1 className={adminStyles.adminPageTitle}>Administration-Portal</h1>
            <Tabs>
                <TabList>
                    <Tab>Product-Management</Tab>
                    <Tab>Special Offers-Management</Tab>
                    <Tab>User & Privileges</Tab>
                    <Tab>Statistics and </Tab>
                </TabList>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
            </Tabs>
        </div>
    )
}