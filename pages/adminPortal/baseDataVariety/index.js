import defaultStyles from "../../stylesheet/global.module.css"
import baseDataVarietyStyles from "../../stylesheet/baseDataVariety.module.css"
import AdminPortalHeader from "@components/pageUtils/AdminPortalNav";
import {useState} from "react";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {deleteBaseDataVariety, getAllBaseDataVariety} from "@lib/api";
import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faMagnifyingGlass, faPen, faPlus, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import {checkVarietyToProductBeforeDelete} from "@lib/dataCascader";

export default function BaseDataVarietyPage({session, host}) {

    const filterActiveOptions = ["all", "active", "inactive"]

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const [varieties, setVarieties] = useState([])
    const [filterVariety, setFilterVariety] = useState("")
    const [filterActive, setFilterActive] = useState("")

    const router = useRouter()

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const varieties = await getAllBaseDataVariety(host)
                setVarieties(varieties)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [host])

    const handleDeleteVariety = async (id, variety) => {
        if (variety.numbersIncludedProducts === 0) {
            await deleteBaseDataVariety(host, id, session.accessToken)
            setVarieties(prevState => prevState.filter(p => p.id !== id))
        } else {
            alert("err")
        }
    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <AdminPortalHeader session={session} currentPage={3}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={defaultStyles.filterActionBar}>
                            <div className={defaultStyles.filterGroup}>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} color={"white"}/>
                                    <Form.Control className={defaultStyles.filterInputField} placeholder={"Filter varietiy"} onChange={(e) => setFilterVariety(e.target.value)}/>
                                </div>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                    <Form.Select onChange={(e) => setFilterActive(e.target.value)} className={defaultStyles.dropDownFilter}>
                                        {
                                            filterActiveOptions.map((opt, index) => {
                                                return (
                                                    <option key={index} value={opt}>{opt}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </div>
                            </div>
                            <button className={defaultStyles.createBtn} onClick={() => router.push("./baseDataVariety/addVariety")}>
                                <FontAwesomeIcon icon={faPlus} size={"1x"} color={"white"} title={"Add a new variety"} /> Add variety</button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table className={defaultStyles.tableContainer}>
                            <thead className={defaultStyles.tableHeader}>
                            <tr>
                                <th>#</th>
                                <th>Designation</th>
                                <th>Description</th>
                                <th>Active</th>
                                <th colSpan={2}>Products in Use</th>
                            </tr>
                            </thead>
                            <tbody className={defaultStyles.tableBody}>
                            {
                                varieties.filter(
                                    variety =>
                                        variety.id.toString().includes(filterVariety) ||
                                        variety.name.toString().toUpperCase().toLowerCase().includes(filterVariety) ||
                                        variety.description.toString().toUpperCase().toLowerCase().includes(filterVariety))
                                    .map((variety) => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <tr key={variety.id}>
                                                <td title={"Id: " + variety.id}>{variety.id}</td>
                                                <td>{variety.name}</td>
                                                <td>{variety.description}</td>
                                                <td> {
                                                    variety.active ?
                                                        <FontAwesomeIcon icon={faCheck} color={"white"}/>
                                                        : <FontAwesomeIcon icon={faXmark} color={"white"}/>}
                                                </td>
                                                <td>{variety.numbersIncludedProducts}</td>
                                                <td>
                                                    <div className={defaultStyles.tableRowActions}>
                                                        <button className={defaultStyles.tblRowBtn} onClick={() => router.push(`./baseDataVariety/${variety.id}/edit`)} title={`Edit ${variety.name}`}>
                                                            <FontAwesomeIcon icon={faPen} size={"1x"} color={"white"}/>
                                                            &nbsp;&nbsp;&nbsp;Edit
                                                        </button>
                                                        <button className={defaultStyles.tblRowBtn} style={{marginLeft: 15}} onClick={() => handleDeleteVariety(variety.id, variety.name)}>
                                                            <FontAwesomeIcon icon={faTrash}/>
                                                            &nbsp;&nbsp;&nbsp;Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                            }
                            </tbody>

                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}