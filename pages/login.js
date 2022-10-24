import {useEffect, useState} from "react";
import loginStyle from "./stylesheet/login.module.css"
import defaultStyle from "./stylesheet/global.module.css"
import {useRedirectToHome} from "@lib/session";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import LoginForm from "@components/LoginForm";
import RegisterForm from "@components/RegisterForm";

export default function LoginPage({session}) {

    useRedirectToHome(session)

    const [activeTab, setActiveTab] = useState(true)

    useEffect(() => {
        document.title = "Thunderboost - Login"
    }, [])

    return(
        <div className={loginStyle.loginPage}>
            <h1 className={defaultStyle.pageTitle}>Login or create an account</h1>
            <Tabs className={loginStyle.responsiveForms}>
                <TabList className={loginStyle.tabList}>
                    <Tab className={`${!activeTab ? loginStyle.tabListElementActive : loginStyle.tabListNotActiveLeft} ${loginStyle.tabListElement}`} onClick={() => setActiveTab(false)}>Login</Tab>
                    <Tab className={`${activeTab ? loginStyle.tabListElementActive : loginStyle.tabListNotActiveRight} ${loginStyle.tabListElement}`} onClick={() => setActiveTab(true)}>Register</Tab>
                </TabList>
                <TabPanel className={loginStyle.formTabPage}>
                    <LoginForm session={session}/>
                </TabPanel>
                <TabPanel>
                    <RegisterForm session={session}/>
                </TabPanel>
            </Tabs>
            <div className={loginStyle.formsContainer}>
                <LoginForm session={session}/>
                <RegisterForm session={session}/>
            </div>
        </div>
    )
}