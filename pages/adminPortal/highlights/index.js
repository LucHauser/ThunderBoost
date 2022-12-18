import defaultStyles from "../../stylesheet/global.module.css"
import highlightManagementStyles from "../../stylesheet/highlightManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {useEffect, useState} from "react";
import {deleteHighlight, getAllHighlights, getAllHighligtsInclusiveProduct, updateHighlight} from "@lib/api";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCaretDown,
    faCaretUp,
    faCheck, faChevronDown, faChevronUp,
    faCircle,
    faCopy,
    faEye,
    faLock,
    faLockOpen,
    faPencil,
    faPlus, faTrash,
    faX
} from "@fortawesome/free-solid-svg-icons";
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
import CloneHighlightDialog from "@components/CloneHighlightForm";

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
    const [collapsedItem, setCollapsedItem] = useState("")
    const [showHighlightView, setShowHighlightView] = useState(false)
    const [showCloneHighlightDialog, setShowCloneHighlightDialog] = useState(false)
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

    function openHighlightView(id) {
        const highlightToSelect = allHighlights.filter(h => h.id === id)[0]
        setProductToSelectedHighlight(highlightToSelect?.product)
        delete highlightToSelect?.product
        setSelectedHighlight(highlightToSelect)
        setShowHighlightView(true)
    }

    function cloneHighlight(id) {
        const highlightToSelect = allHighlights.filter(h => h.id === id)[0]
        setSelectedHighlight(highlightToSelect)
        setShowCloneHighlightDialog(true)
    }

    const handleActivateHighlight = async (highlight) => {
        const relatedProduct = highlight?.product
        highlight.active = !highlight.active;
        delete highlight?.product
        try {
            const updatedHighlight = await updateHighlight(highlight, session.accessToken)
            updatedHighlight.product = relatedProduct
            setAllHighlights(allHighlights => {
                return allHighlights.map(h => {
                    if (h.id === updatedHighlight.id) {
                        return {...h, ...updatedHighlight}
                    } else {
                        return h
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    const handleDeleteHighlight = async (id) => {
        await deleteHighlight(id, session.accessToken)
        setAllHighlights((prevState) => prevState.filter(h => h.id !== id))
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
                                <AccordionItemButton className={highlightManagementStyles.accordionItemButton} onClick={() => setCollapsedItem(highlight.id)}>
                                    <p>{highlight.designation}</p>
                                    <div>
                                        {
                                            !highlight.isDraft ?
                                                <>
                                                    <p>Active: </p>
                                                    <FontAwesomeIcon
                                                        icon={faCircle}
                                                        color={
                                                            highlight.active ? "#6aa84f" : "#cc0000"
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
                                <div className={highlightManagementStyles.accordionPanel}>
                                    <div>
                                        <h3>Information</h3>
                                        <table className={highlightManagementStyles.highlightInformation}>
                                            <tr>
                                                <th>Description:</th>
                                                <td>{highlight.description}</td>
                                            </tr>
                                            <tr>
                                                <th>Event Type:</th>
                                                <td>{highlight.eventType}</td>
                                            </tr>
                                            <tr>
                                                <th>Created:</th>
                                                <td>{formatTimestamp(highlight.created, "dd.MMMM.yyyy HH:mm")}</td>
                                            </tr>
                                            {
                                                highlight.edited ?
                                                    <tr>
                                                        <th>Edited:</th>
                                                        <td>{formatTimestamp(highlight.edited, "dd.MMMM.yyyy HH.mm")}</td>
                                                    </tr> : null
                                            }
                                            <tr>
                                                <th>Related Product:</th>
                                                <td>{highlight?.product?.name ? highlight.product.name : "-"}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className={highlightManagementStyles.buttonSection}>
                                        <h3>Edit & View</h3>
                                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => openHighlightView(highlight.id)}>
                                            <FontAwesomeIcon icon={faEye} color={"black"} style={{marginRight: 5}}/>
                                            View
                                        </button>
                                        <div className={highlightManagementStyles.buttonGroup}>
                                            <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push(`./highlights/${highlight.id}/edit`)}>
                                                <FontAwesomeIcon icon={faPencil} color={"black"} style={{marginRight: 5}}/>
                                                Edit
                                            </button>
                                            <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${highlight.active ? defaultStyles.buttonGreen: defaultStyles.buttonRed}`} onClick={() => handleActivateHighlight(highlight)}>
                                                <FontAwesomeIcon icon={highlight.active ? faLockOpen : faLock} color={"white"}/>
                                            </button>
                                        </div>
                                        <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => cloneHighlight(highlight.id)}>
                                            <FontAwesomeIcon icon={faCopy} color={"black"} style={{marginRight: 5}}/>
                                            Create Copy
                                        </button>
                                        <button className={`${defaultStyles.buttonRed} ${defaultStyles.buttonSm} ${defaultStyles.buttonFilled}`} onClick={() => handleDeleteHighlight(highlight.id)}>
                                            <FontAwesomeIcon icon={faTrash} color={"white"} style={{marginRight: 5}}/>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    ))
                }
            </Accordion>
            {
                showHighlightView ?
                    <div className={highlightManagementStyles.dialog}>
                        <div className={highlightManagementStyles.highlightView}>
                            <HighlightView editorViewMode={true} presentingProduct={productToSelectedHighlight} prop={selectedHighlight}/>
                        </div>
                        <button className={highlightManagementStyles.closeDialogBtn} onClick={() => setShowHighlightView(false)}>
                            <FontAwesomeIcon icon={faX} color={"white"} size={"2xl"}/>
                        </button>
                    </div> : null
            }
            {
                showCloneHighlightDialog ?
                    <div className={highlightManagementStyles.dialog}>
                        <div className={highlightManagementStyles.highlightCloneForm}>
                            <CloneHighlightDialog session={session} highlightToClone={selectedHighlight}/>
                        </div>
                    </div> : null
            }

        </div>
    )
}