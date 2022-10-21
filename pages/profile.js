import {useRedirectToLogin} from "@lib/session";
import defaultStyle from "./stylesheet/global.module.css"
import profileStyle from "./stylesheet/profile.module.css"
import {Table} from "react-bootstrap";
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
        <div className={profileStyle.profilePage}>
            <h1 className={defaultStyle.pageTitle}>Your Profile Information</h1>
            <div className={profileStyle.userInformationContainer}>
                <h2 className={defaultStyle.pageSubtitle}>Logged in as</h2>
                <div className={profileStyle}>
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
                    <div className={profileStyle.buttonGroup}>
                        <button className={`${defaultStyle.buttonFilled} ${defaultStyle.buttonFilledAutoWidth}`}>Change Password</button>
                        <button onClick={handleLogout} className={`${defaultStyle.buttonFilled} ${defaultStyle.buttonFilledAutoWidth}`}>Logout</button>
                    </div>
                </div>

            </div>
        </div>
    )
}