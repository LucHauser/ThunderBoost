import defaultStyles from "../../stylesheet/global.module.css"
import baseDataVarietyStyles from "../../stylesheet/baseDataVariety.module.css"
import AdminPortalHeader from "@components/pageUtils/AdminPortalNav";
import {useState} from "react";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {deleteBaseDataVariety, getAllBaseDataVariety} from "@lib/api";
import {Form, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faMagnifyingGlass, faPen, faPlus, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import {checkVarietyToProductBeforeDelete} from "@lib/dataCascader";

export default function BaseDataVarietyPage({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const [varieties, setVarieties] = useState([])
    const [filterVariety, setFilterVariety] = useState("")

    const router = useRouter()

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const varieties = await getAllBaseDataVariety()
                setVarieties(varieties)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [])

    const handleChange = (e) => {
        setFilterVariety(e.target.value)
    }

    const handleDeleteVariety = async (id, variety) => {
        console.log(variety)
        const res = await checkVarietyToProductBeforeDelete(variety)
        if (!res) {
            await deleteBaseDataVariety(id, session.accessToken)
            setVarieties(prevState => prevState.filter(p => p.id !== id))
        } else {
            alert("err")
        }
    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <AdminPortalHeader session={session} currentPage={3}/>
            <Table responsive className={defaultStyles.tableContainer}>
                <thead className={defaultStyles.tableHeader}>
                <tr>
                    <th colSpan={4}>
                        <Form.Control className={baseDataVarietyStyles.filterInput} placeholder={"Filter varietiy"} onChange={handleChange}/>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size={"1x"} color={"white"}/>
                    </th>
                    <th className={baseDataVarietyStyles.tableAction}>
                        <button className={baseDataVarietyStyles.addBtn} onClick={() => router.push("./baseDataVariety/addVariety")}>
                        <FontAwesomeIcon icon={faPlus} size={"1x"} color={"white"} title={"Add a new variety"} /> Add variety</button>
                    </th>
                </tr>
                <tr>
                    <th>#</th>
                    <th>Designation</th>
                    <th>Description</th>
                    <th colSpan={2}>Active</th>
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
                                    <td>{
                                        variety.active ?
                                            <FontAwesomeIcon icon={faCheck} color={"white"}/>
                                            : <FontAwesomeIcon icon={faXmark} color={"white"}/>}</td>
                                    <td className={baseDataVarietyStyles.tableAction}>
                                        <button className={baseDataVarietyStyles.tblRowBtn} onClick={() => router.push(`./baseDataVariety/${variety.id}/edit`)} title={`Edit ${variety.name}`}>
                                            <FontAwesomeIcon icon={faPen} size={"1x"} color={"white"}/>
                                            &nbsp;&nbsp;&nbsp;Edit
                                        </button>
                                        <button className={baseDataVarietyStyles.tblRowBtn} style={{marginLeft: 15}} onClick={() => handleDeleteVariety(variety.id, variety.name)}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                            &nbsp;&nbsp;&nbsp;Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                }
                </tbody>

            </Table>
        </div>
    )
}