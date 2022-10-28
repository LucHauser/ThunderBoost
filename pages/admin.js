import defaultStyles from "./stylesheet/global.module.css"
import adminStyles from "./stylesheet/admin.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {useRedirectToLogin} from "@lib/session";
import {useRouter} from "next/router";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import BaseDataVariety from "@components/BaseDataVariety";
import {useState} from "react";
import {TabPane} from "react-bootstrap";

export default function AdminPage () {

    const tabContents = ["Product Management", "Highlights", "User and Privileges", "Statistics", "Base Data Variety"]

    const [activeTab, setActiveTab] = useState(tabContents[0])

    const router = useRouter()

    const leaveAdminPortal = () => {
        router.push("/profile")
    }

    return (
        <div className={adminStyles.adminWrapper}>
            <h1 className={adminStyles.adminPageTitle}>Administration-Portal</h1>
            <Tabs>
                <TabList className={adminStyles.tabBar}>
                    {
                        tabContents.map((tab, index) => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <Tab key={index} className={`${tab === activeTab ? adminStyles.selectedTab : null} ${adminStyles.tab}`} onClick={() => setActiveTab(tab)}>{tab}</Tab>
                            )
                    })
                }
                </TabList>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel>

                </TabPanel>
                <TabPanel className={adminStyles.tabPanel}>
                    <BaseDataVariety/>
                </TabPanel>
            </Tabs>
        </div>
    )
}