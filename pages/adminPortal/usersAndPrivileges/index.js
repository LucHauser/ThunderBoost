import {useEffect, useState} from "react";
import {getAllUsers} from "@lib/api";
import defaultStyles from "../../stylesheet/global.module.css"
import userAndPrivilegesStyles from "../../stylesheet/usersAndPrivileges.module.css"
import AdminPortalHeader from "@components/pageUtils/AdminPortalNav";
import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faInfo, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import formatTimestamp from "@components/Utils";

export default function UserAndPrivilegesPage({session, host}) {

    const [users, setUsers] = useState([])
    const [filteredUser, setFilteredUser] = useState([])
    const [roles, setRoles] = useState([])
    const [filterUser, setFilterUser] = useState("")

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response =  await getAllUsers(host)
                console.log(response)
                setUsers(response)
                setFilteredUser(response)
            } catch (e) {
                console.log(e)
            }
        }
        loadUser()
    }, [host])

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await fetch(`${host}/role`)
                if (!response.ok) {
                    throw Error()
                }
                setRoles(await response.json())
            } catch (e) {
                console.log(e)
            }
        }
        loadRoles()
    }, [host])

    useEffect(() => {
        setFilteredUser(users.filter(u => u.username.includes(filterUser)))
    }, [filterUser])

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <AdminPortalHeader session={session} currentPage={6}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={defaultStyles.filterActionBar}>
                            <div className={defaultStyles.formGroupHorizontal}>
                                <Form.Control className={defaultStyles.filterInputField} onChange={(e) => setFilterUser(e.target.value)}/>
                                <FontAwesomeIcon icon={faMagnifyingGlass} size={"lg"}/>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
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
                                        <td>
                                            <div className={defaultStyles.tableRowActions}>
                                                <button className={defaultStyles.tblRowBtn}>
                                                    <FontAwesomeIcon icon={faInfo} style={{marginRight: 5}}/>
                                                </button>
                                                <button className={defaultStyles.tblRowBtn}>
                                                    <FontAwesomeIcon icon={faGear} style={{marginRight: 5}}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                            <p>{filteredUser.length === 0 ? "No Result" : null}</p>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <div>

            </div>
        </div>
    )
}