import defaultStyles from "../../stylesheet/global.module.css"
import highlightManagementStyles from "../../stylesheet/highlightManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {useEffect, useState} from "react";
import {getAllHighlights} from "@lib/api";
import {AccordionButton, Form, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlus, faX} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import HighlightView from "@components/HighlightView";
import formatTimestamp from "@components/Utils";
import {Accordion, AccordionItem, AccordionItemPanel} from "react-accessible-accordion";
import AccordionHeader from "react-bootstrap/AccordionHeader";

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
    const [openedItem, setOpenedHighlight] = useState(null)
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
            <div className={`${defaultStyles.tableHeader} ${highlightManagementStyles.tableHeader}`}>
                <div className={highlightManagementStyles.filterActions}>
                    <p>View Mode:&nbsp;</p>
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
                    New
                </button>
            </div>
            Test
            <Accordion>
                {allHighlights.map((highlight, index) => {
                    return (
                        <AccordionItem key={index}>
                            <AccordionHeader>
                                <AccordionButton>
                                    <p>Hello</p>
                                </AccordionButton>
                            </AccordionHeader>
                            <AccordionItemPanel>

                            </AccordionItemPanel>
                        </AccordionItem>
                    )
                })}

            </Accordion>

        </div>
    )
}