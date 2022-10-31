import adminStyles from "./stylesheet/admin.module.css"
import {useRouter} from "next/router";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import BaseDataVariety from "@components/BaseDataVariety";
import ProductForm from "@components/ProductForm";
import {useState} from "react";

export default function AdminPage ({session}) {

    const router = useRouter()

    const tabContents = ["Product Management", "Highlights", "User and Privileges", "Statistics", "Base Data Variety"]

    const [activeTab, setActiveTab] = useState(tabContents[0])

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
                <TabPanel className={adminStyles.tabPanel}>
                    <ProductForm/>
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