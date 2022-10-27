import defaultStyles from "./stylesheet/global.module.css"
import adminStyles from "./stylesheet/admin.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useRedirectToLogin} from "@lib/session";
import {useRouter} from "next/router";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import BaseDataVariety from "@components/BaseDataVariety";

export default function AdminPage () {

    const tabContents = ["Product Management", "Special Offers-Management", "User and Privileges", "Statistics"]

    const router = useRouter()

    const leaveAdminPortal = () => {
        router.push("/profile")
    }

    const handleSwitchTab = () => {

    }

    return (
        <div className={adminStyles.adminWrapper}>
            <button className={`${defaultStyles.buttonFilled} ${adminStyles.leaveBtn}`} onClick={leaveAdminPortal}>
                <FontAwesomeIcon icon={faRightToBracket} size={"1x"} className={adminStyles.faRightToBracket}/>Leave Admin-Portal to Shop</button>
            <h1 className={adminStyles.adminPageTitle}>Administration-Portal</h1>
            <Tabs>
                <TabList className={adminStyles.tabBar}>
                    {
                        tabContents.map((tab, index) => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <Tab key={index} className={adminStyles.tab}>{tab}</Tab>
                            )
                    })
                }
                </TabList>
                <TabPanel>
                    <BaseDataVariety/>
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