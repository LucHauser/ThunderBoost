import {useRedirectToLogin} from "@lib/hooks/session";
import defaultStyle from "./stylesheet/global.module.css"
import profileStyle from "./stylesheet/profile.module.css"
import {Col, Container, Row, Stack, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function ProfilePage( {session} ) {

    useRedirectToLogin(session)

    const [user, setUser] = useState({})

    const router = useRouter()

    useEffect(() => {
        if (session.user) {
            setUser(session.user)
        }
    }, [session.user])

    useEffect(() => {
        document.title = "Thunderboost - Profil"
    }, [])

    const handleLogout = () => {
        session.logout()
        router.push("/")
    }

    return (
        <div className={defaultStyle.page}>
            <Container fluid={true}>
                <Row>
                    <Col>
                        <h1 className={defaultStyle.pageTitle}>Your Profile Information</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <Stack>
                            <h2 className={defaultStyle.pageSubtitle} style={{textAlign: "start"}}>Logged in as</h2>
                            <Table className={`${defaultStyle.tableContainer} ${profileStyle.tableUserInformation}`}>
                                <tr>
                                    <td>Name:</td>
                                    <td>{user.title} {user.firstName} {user.lastName}</td>
                                </tr>
                                <tr>
                                    <td>Username:</td>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <td>Registered at:</td>
                                    <td>{user.since}</td>
                                </tr>
                            </Table>
                        </Stack>
                    </Col>
                    <Col xs={12} md={6}>
                        <Stack direction={"horizontal"} gap={3} style={{height: "100%", alignItems: "end"}}>
                            <button className={`${defaultStyle.buttonFilled} ${defaultStyle.buttonFilledAutoWidth} ms-auto`}>Change Password</button>
                            <button onClick={handleLogout} className={`${defaultStyle.buttonFilled} ${defaultStyle.buttonFilledAutoWidth}`}>Logout</button>
                        </Stack>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}