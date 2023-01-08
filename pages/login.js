import {useEffect, useState} from "react";
import loginStyle from "./stylesheet/login.module.css"
import defaultStyle from "./stylesheet/global.module.css"
import {useRedirectToHome} from "@lib/hooks/session";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import LoginForm from "@components/forms/LoginForm";
import RegisterForm from "@components/forms/RegisterForm";
import {formatServerUrl} from "@components/Utils";
import {Col, Container, Row} from "react-bootstrap";

export default function LoginPage({session, host}) {

    useRedirectToHome(session)

    const [activeTab, setActiveTab] = useState(true)

    useEffect(() => {
        document.title = "Thunderboost - Login"
    }, [])

    return (
        <div className={loginStyle.loginPage}>
            <Container>
                <Row>
                    <Col lg={12}>
                        <h1 className={defaultStyle.pageTitle}>Login or create an account</h1>
                    </Col>
                </Row>
                <Row className={loginStyle.tab}>
                    <Col>
                        <button className={`${loginStyle.tabButton} ${activeTab ? loginStyle.activeButton : null}`} onClick={() => setActiveTab(true)}>
                            Login
                        </button>
                    </Col>
                    <Col>
                        <button className={`${loginStyle.tabButton} ${!activeTab ? loginStyle.activeButton : null}`} onClick={() => setActiveTab(false)}>
                            Register
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col lg={6} className={`${!activeTab ? loginStyle.notCurrentForm : null} ${loginStyle.col}`}>
                        <LoginForm session={session} host={host}/>
                    </Col>
                    <Col lg={6} className={`${activeTab ? loginStyle.notCurrentForm : null}`}>
                        <RegisterForm session={session} host={host}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}