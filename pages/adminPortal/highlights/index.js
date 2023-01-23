import defaultStyles from "../../stylesheet/global.module.css"
import highlightManagementStyles from "../../stylesheet/highlightManagement.module.css"
import AdminPortalHeader from "@components/pageUtils/AdminPortalNav";
import {useEffect, useState} from "react";
import {deleteHighlight, getAllHighlights, getAllHighligtsInclusiveProduct, updateHighlight} from "@lib/api";
import {Col, Container, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck, faCalendarXmark,
    faCircle,
    faCopy,
    faEye,
    faLock,
    faLockOpen,
    faPencil, faPenToSquare,
    faPlus, faSquarePlus, faT, faTag, faTrash, faWineBottle,
} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import HighlightView from "@components/views/HighlightView";
import formatTimestamp, {checkIfEventIsNowBetweenStartTime} from "@components/Utils";
import {
    Accordion
} from "react-bootstrap";
import CloneHighlightDialog from "@components/forms/CloneHighlightForm";

export default function HighlightManagementPage({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const viewModeOptions = ["All", "Pending", "Active running", "Expired", "Inactive Highlights", "Draft"]

    const [allHighlights, setAllHighlights] = useState([])
    const [filterHighlightText, setFilterHighlightText] = useState("")
    const [tableViewMode, setTableViewMode] = useState("")
    const [filteredHighlight, setFilteredHighlight] = useState([])
    const [showHighlightView, setShowHighlightView] = useState(false)
    const [showCloneHighlightDialog, setShowCloneHighlightDialog] = useState(false)
    const [selectedHighlight, setSelectedHighlight] = useState({})
    const [productToSelectedHighlight, setProductToSelectedHighlight] = useState({})

    const router = useRouter()

    useEffect(() => {
        const loadHighlights = async () => {
            try {
                const highlights = await getAllHighligtsInclusiveProduct(host)
                setAllHighlights(highlights)
                setFilteredHighlight(highlights)
            } catch (e) {
                console.log(e)
            }
        }
        loadHighlights()
    }, [host])

    useEffect(() => {
        filterHighlight()
    }, [filterHighlightText])

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
        setProductToSelectedHighlight(highlightToSelect?.product)
        console.log(highlightToSelect)
        setSelectedHighlight(highlightToSelect)
        setShowCloneHighlightDialog(true)
    }

    function addNewCloneToState(newHighlight, navigateToEditAfterClone) {
        newHighlight.product = productToSelectedHighlight
        setAllHighlights(allHighlights => [...allHighlights, newHighlight])
        if (navigateToEditAfterClone) {
            router.push(`./highlights/${newHighlight.id}/edit`)
        }
    }

    const handleActivateHighlight = async (highlight) => {
        const relatedProduct = highlight?.product
        highlight.active = !highlight.active;
        delete highlight?.product
        try {
            const updatedHighlight = await updateHighlight(host, highlight, session.accessToken)
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
        await deleteHighlight(host, id, session.accessToken)
        setAllHighlights((prevState) => prevState.filter(h => h.id !== id))
    }

    function filterHighlight() {
        let filteredHighlight = allHighlights
        filteredHighlight = filteredHighlight.filter(h => h.designation.includes(filterHighlightText))
        setFilteredHighlight(filteredHighlight)
    }

    return (
        <div className={defaultStyles.page}>
            <Container fluid={true} id={highlightManagementStyles["highlightManagementPageLayout"]}>
                <Row>
                    <Col>
                        <AdminPortalHeader session={session} currentPage={2}/>
                    </Col>
                </Row>
                <Row className={defaultStyles.listFilterBar}>
                    <Col sm={12} md={10}>
                        <div className={defaultStyles.filterActionBar}>
                            <div className={defaultStyles.filterGroup}>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <p style={{fontSize: 20}} className={defaultStyles.paragraphs}>Filter Highlight:</p>
                                    <Form.Control className={defaultStyles.filterInputField} style={{width: 250}} onChange={(e) => setFilterHighlightText(e.target.value)} placeholder={"Filter Highlight"}/>
                                </div>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <p className={defaultStyles.paragraphs} style={{fontSize: 20}}>View Mode:</p>
                                    <Form.Select className={defaultStyles.dropDownFilter} onChange={changeViewMode}>
                                        {viewModeOptions.map((opt, index) => {
                                            return (
                                                <option key={index} value={index}>{opt}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className={`${defaultStyles.alignmentCenter} ${highlightManagementStyles.addBtnCol}`}>
                        <button className={highlightManagementStyles.addBtn} onClick={() => router.push("./highlights/create")}>
                            <FontAwesomeIcon
                                style={{marginRight: 10}}
                                icon={faPlus}
                                color={"white"}
                            />
                            New
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Accordion flush alwaysOpen>
                            {
                                filteredHighlight.map((highlight, index) => (
                                    <Accordion.Item key={index} className={defaultStyles.accordionItem} eventKey={highlight.id}>
                                        <Accordion.Header className={defaultStyles.accordionHeader}>
                                            <div className={highlightManagementStyles.accordionHeadingContent}>
                                                <p>{highlight.designation}</p>
                                                <div className={defaultStyles.formGroupHorizontal}>
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
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className={defaultStyles.accordionBody}>
                                            <Container fluid={true}>
                                                <Row>
                                                    <Col md={10}>
                                                        <h3>Information</h3>
                                                        <table className={highlightManagementStyles.highlightInformation}>
                                                            <tr>
                                                                <th><FontAwesomeIcon icon={faT}/>&nbsp;&nbsp;&nbsp;</th>
                                                                <th>Description:</th>
                                                                <td>{highlight.description}</td>
                                                            </tr>
                                                            <tr>
                                                                <th><FontAwesomeIcon icon={faTag}/></th>
                                                                <th>Event Type:</th>
                                                                <td>{highlight.eventType}</td>
                                                            </tr>
                                                            <tr>
                                                                <th><FontAwesomeIcon icon={faSquarePlus}/></th>
                                                                <th>Created:</th>
                                                                <td>{formatTimestamp(highlight.created, "dd.MMMM.yyyy HH:mm")}</td>
                                                            </tr>
                                                            {
                                                                highlight.edited ?
                                                                    <tr>
                                                                        <th><FontAwesomeIcon icon={faPenToSquare}/></th>
                                                                        <th>Edited:</th>
                                                                        <td>{formatTimestamp(highlight.edited, "dd.MMMM.yyyy HH.mm")}</td>
                                                                    </tr> : null
                                                            }
                                                            <tr>
                                                                <th><FontAwesomeIcon icon={faWineBottle}/></th>
                                                                <th>Related Product:</th>
                                                                <td>{highlight?.product?.name ? highlight.product.name : "-"}</td>
                                                            </tr>
                                                            {
                                                                highlight.dateFrom && highlight.dateUntil ? <>
                                                                    <th colSpan={3}>Presentation start and end</th>
                                                                    <tr>
                                                                        <th><FontAwesomeIcon icon={faCalendarCheck}/></th>
                                                                        <th>Start</th>
                                                                        <td>{formatTimestamp(highlight.dateFrom, "dd.MMMM.yyyy HH:mm")}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th><FontAwesomeIcon icon={faCalendarXmark}/></th>
                                                                        <th>End</th>
                                                                        <td>{formatTimestamp(highlight.dateUntil, "dd.MMMM.yyyy HH:mm")}</td>
                                                                    </tr>
                                                                </> : null
                                                            }

                                                        </table>
                                                    </Col>
                                                    <Col md={2} className={highlightManagementStyles.buttonSection}>
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
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))
                            }
                        </Accordion>
                    </Col>
                </Row>
            </Container>
            {
                showHighlightView ?
                    <div className={highlightManagementStyles.dialog} onClick={() => setShowHighlightView(false)}>
                        <div className={highlightManagementStyles.highlightView}>
                            <HighlightView editorViewMode={true} presentingProduct={productToSelectedHighlight} prop={selectedHighlight}/>
                        </div>
                    </div> : null
            }
            {
                showCloneHighlightDialog ?
                    <div className={highlightManagementStyles.dialog}>
                        <div className={highlightManagementStyles.highlightCloneForm}>
                            <CloneHighlightDialog
                                session={session}
                                highlightToClone={selectedHighlight}
                                toggleDialog={() =>
                                    setShowCloneHighlightDialog(false)
                                }
                                onHighlightCloned={(newHighlight, goEditAfterClone) => addNewCloneToState(newHighlight, goEditAfterClone)}/>
                        </div>
                    </div> : null
            }
            <button className={`${highlightManagementStyles.addBtnFloat}`} onClick={() => router.push("./highlights/create")}>
                <FontAwesomeIcon
                    icon={faPlus}
                    color={"white"}
                    size={"2x"}
                />
            </button>

        </div>
    )
}