import {useEffect, useState} from "react";
import {getAllUsers} from "@lib/api";
import defaultStyles from "../../stylesheet/global.module.css"
import userAndPrivilegesStyles from "../../stylesheet/usersAndPrivileges.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {Form, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faInfo, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import formatTimestamp from "@components/Utils";

export default function UserAndPrivilegesPage({session}) {

    const [users, setUsers] = useState([])
    const [filteredUser, setFilteredUser] = useState([])
    const [roles, setRoles] = useState([])
    const [filterUser, setFilterUser] = useState("")

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response =  await getAllUsers()
                console.log(response)
                setUsers(response)
                setFilteredUser(response)
            } catch (e) {
                console.log(e)
            }
        }
        loadUser()
    }, [])

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await fetch(`http://localhost:3001/role`)
                if (!response.ok) {
                    throw Error()
                }
                setRoles(await response.json())
            } catch (e) {
                console.log(e)
            }
        }
        loadRoles()
    }, [])

    useEffect(() => {
        setFilteredUser(users.filter(u => u.username.includes(filterUser)))
    }, [filterUser])

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <AdminPortalHeader session={session} currentPage={6}/>
            <div>
                <div className={defaultStyles.tableHeader} style={{padding: "0 15px", display: "flex", gap: 10, alignItems: "center"}}>
                    <Form.Control className={userAndPrivilegesStyles.tableFilterInput} onChange={(e) => setFilterUser(e.target.value)}/>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size={"lg"}/>
                </div>
                <Table className={defaultStyles.tableContainer} responsive>
                    <thead className={defaultStyles.tableHeader}>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Registered</th>
                        <th>Role</th>
                        <th style={{textAlign: "right"}}>View & Settings</th>
                    </tr>
                    </thead>
                    <tbody className={defaultStyles.tableBody}>
                    {filteredUser.map((user, index) => {
                        return (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{formatTimestamp(user.since, "dd.MMMM.yyyy")}</td>
                                <td>{roles[user.roleId - 1]?.name}</td>
                                <td className={userAndPrivilegesStyles.tableAction}>
                                    <button className={userAndPrivilegesStyles.tblRowBtn}>
                                        <FontAwesomeIcon icon={faInfo} style={{marginRight: 5}}/>About
                                    </button>
                                    <button className={userAndPrivilegesStyles.tblRowBtn}>
                                        <FontAwesomeIcon icon={faGear} style={{marginRight: 5}}/>Privileges Settings
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                    <p>{filteredUser.length === 0 ? "No Result" : null}</p>
                </Table>
            </div>
        </div>
    )
}