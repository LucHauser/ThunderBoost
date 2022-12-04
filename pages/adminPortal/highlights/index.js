import defaultStyles from "../../stylesheet/global.module.css"
import highlightManagementStyles from "../../stylesheet/highlightManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {useEffect, useState} from "react";
import {getAllHighlights} from "@lib/api";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";

export default function HighlightManagementPage({session}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const viewModeOptions = ["All", "Pending", "Active running", "expired", "Inactive Highlights",]

    const [allHighlights, setAllHighlights] = useState([])
    const [filteredHighlights, setFilteredHighlights] = useState([])
    const [tableViewMode, setTableViewMode] = useState("")

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
            <div className={highlightManagementStyles.tableHeader}>
                <div className={highlightManagementStyles.filterActions}>
                    <p>View Mode:</p>
                    <Form.Select className={highlightManagementStyles.dropdownFilter} onChange={changeViewMode}>
                        {viewModeOptions.map((opt, index) => {
                            return (
                                <option key={index} value={index}>{opt}</option>
                            )
                        })}
                    </Form.Select>
                </div>
                <button className={highlightManagementStyles.addBtn} onClick={() => router.push("./highlights/create")}>
                    <FontAwesomeIcon
                        style={{marginRight: 10}}
                        icon={faPlus}
                        color={"white"}
                    />
                    Plan new Highlight Event
                </button>
            </div>
        </div>
    )
}