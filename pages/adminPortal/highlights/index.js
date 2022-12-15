import defaultStyles from "../../stylesheet/global.module.css"
import highlightManagementStyles from "../../stylesheet/highlightManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {useEffect, useState} from "react";
import {getAllHighlights, getAllHighligtsInclusiveProduct} from "@lib/api";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircle, faPlus, faX} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import HighlightView from "@components/HighlightView";
import formatTimestamp, {checkIfEventIsNowBetweenStartTime} from "@components/Utils";
import {
    Accordion,
    AccordionItem,
    AccordionItemPanel,
    AccordionItemButton,
    AccordionItemHeading
} from "react-accessible-accordion";

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
    const [collapsedItem, setCollapsedItem] = useState(null)
    const [showHighlightView, setShowHighlightView] = useState(false)
    const [selectedHighlight, setSelectedHighlight] = useState({})
    const [productToSelectedHighlight, setProductToSelectedHighlight] = useState({})

    const router = useRouter()

    useEffect(() => {
        const loadHighlights = async () => {
            try {
                const highlights = await getAllHighligtsInclusiveProduct()
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

    const collapseItem = (index) => {
        setCollapsedItem(index)
    }
    function HighlightStatusText({dateFrom, dateUntil}) {

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
            <Accordion allowZeroExpanded={true}>
                {
                    allHighlights.map((highlight, index) => (
                        <AccordionItem key={index} className={highlightManagementStyles.accordionItem}>
                            <AccordionItemHeading className={highlightManagementStyles.accordionItemHeading}>
                                <AccordionItemButton className={highlightManagementStyles.accordionItemButton}>
                                    <p>{highlight.designation}</p>
                                    <div>
                                        {
                                            !highlight.isDraft ?
                                                <>
                                                    <p>Active: </p>
                                                    <FontAwesomeIcon
                                                        icon={faCircle}
                                                        color={
                                                            highlight.isActive ? "#6aa84f" : "#cc0000"
                                                        }
                                                    />
                                                    <p>On Air: </p>
                                                    <FontAwesomeIcon
                                                        icon={faCircle}
                                                        color={checkIfEventIsNowBetweenStartTime(highlight.dateFrom, highlight.dateUntil) ? "green" : "red"}
                                                    />
                                                </> : <p className={highlightManagementStyles.draftHighlightText}>Draft</p>
                                        }
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <p>{highlight.description}</p>
                            </AccordionItemPanel>
                        </AccordionItem>
                    ))
                }
            </Accordion>
        </div>
    )
}