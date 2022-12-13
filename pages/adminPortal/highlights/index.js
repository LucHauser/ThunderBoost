import defaultStyles from "../../stylesheet/global.module.css"
import highlightManagementStyles from "../../stylesheet/highlightManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {useEffect, useState} from "react";
import {getAllHighlights} from "@lib/api";
import {Form, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlus, faX} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import HighlightView from "@components/HighlightView";
import formatTimestamp from "@components/Utils";

export default function HighlightManagementPage({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const viewModeOptions = ["All", "Pending", "Active running", "Expired", "Inactive Highlights", "Draft"]

    const [allHighlights, setAllHighlights] = useState([])
    const [filteredHighlights, setFilteredHighlights] = useState([])
    const [tableViewMode, setTableViewMode] = useState("")
    const [showHighlightView, setShowHighlightView] = useState(false)
    const [selectedHighlight, setSelectedHighlight] = useState({})
    const [productToSelectedHighlight, setProductToSelectedHighlight] = useState({})

    const router = useRouter()

    useEffect(() => {
        const loadHighlights = async () => {
            try {
                const highlights = await getAllHighlights()
                setAllHighlights(highlights)
            } catch (e) {
                console.log(e)
            }
        }
        loadHighlights()
    }, [])

    const changeViewMode = (e) => {
        setTableViewMode(e.target.value)
    }

    const createHighlight = () => {

    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <AdminPortalHeader session={session} currentPage={2}/>
            <Table responsive className={defaultStyles.tableContainer}>
                <thead className={defaultStyles.tableHeader}>
                    <tr>
                        <th colSpan={5} className={highlightManagementStyles.filterActions}>
                            View Mode:&nbsp;
                            <Form.Select className={highlightManagementStyles.dropdownFilter} onChange={changeViewMode}>
                                {viewModeOptions.map((opt, index) => {
                                    return (
                                        <option key={index} value={index}>{opt}</option>
                                    )
                                })}
                            </Form.Select>
                        </th>
                        <th className={highlightManagementStyles.addBtn}>
                            <button onClick={() => router.push("./highlights/create")}>
                                <FontAwesomeIcon
                                    style={{marginRight: 10}}
                                    icon={faPlus}
                                    color={"white"}
                                />
                                New
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th>Designation</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Edited</th>
                        <th>Active</th>
                        <th>View & Edit</th>
                    </tr>
                </thead>
                <tbody className={defaultStyles.tableBody}>
                {allHighlights.map((highlight, index) => {
                    return (
                        <tr key={index}>
                            <td>{highlight.designation}</td>
                            <td>{highlight.description}</td>
                            <td>{formatTimestamp(highlight.created, "dd.MM.yyyy HH:mm")}</td>
                            <td>{formatTimestamp(highlight.edited, "dd.MM.yyyy HH:mm")}</td>
                            <td><FontAwesomeIcon icon={highlight.active ? faCheck : faX}/></td>
                            <td></td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    )
}