import {useEffect, useState} from "react";
import loginStyle from "./stylesheet/login.module.css"
import defaultStyle from "./stylesheet/global.module.css"
import {useRedirectToHome} from "@lib/hooks/session";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import LoginForm from "@components/forms/LoginForm";
import RegisterForm from "@components/forms/RegisterForm";
import {formatServerUrl} from "@components/Utils";

export default function LoginPage({session, host}) {

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
                    <LoginForm session={session} host={host}/>
                </TabPanel>
                <TabPanel>
                    <RegisterForm session={session} host={host}/>
                </TabPanel>
            </Tabs>
            <div className={loginStyle.formsContainer}>
                <LoginForm session={session} host={host}/>
                <RegisterForm session={session} host={host}/>
            </div>
        </div>
    )
}