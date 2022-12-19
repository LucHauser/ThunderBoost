import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import cloneHighlightStyles from "./CloneHighlightForm.module.css"
import formatTimestamp, {checkIfDate1IsLowerThanDate2, checkIfEndDateIsGreaterThanStartDate} from "@components/Utils";
import {createHighlight} from "@lib/api";

export default function CloneHighlightDialog({session, highlightToClone, onHighlightCloned, toggleDialog}) {



    const [previousHighlight, setPreviousHighlight] = useState({})
    const [highlight, setHighlight] = useState({})
    const [errors, setErrors] = useState(null)
    const [loadCloneHighlight, setLoadCloneHighlight] = useState(false)

    useEffect(() => {
        if (!highlightToClone.id) return
        setPreviousHighlight(highlightToClone)
        highlightToClone.designation = `${highlightToClone.designation}`
        setHighlight(highlightToClone)


    }, [highlightToClone])

    const onChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setHighlight({
            ...highlight,
            [name]: value
        })
    }

    function validateInputs(highlight, originalDateFrom, originalDateUntil, isDraft) {
        let isValid = true
        const errors = {
            errorsMsg: "",
            designation: "",
            identifier: "",
            dateFrom: "",
            dateUntil: ""
        }
        if (highlight.designation.trim().length === 0) {
            errors.designation = "Designation is Required"
            isValid = false
        }
        if (highlight.designation.length > 30) {
            errors.designation = "Text too long (Max. 30 Character)"
            isValid = false
        }
        if (highlight.identifier.trim().length === 0) {
            errors.identifier = "Identifier is required"
            isValid = false
        }
        if (!isDraft) {
            if (previousHighlight.dateFrom) {
                if (checkIfDate1IsLowerThanDate2(highlight.dateFrom, previousHighlight.dateFrom) && checkIfDate1IsLowerThanDate2(highlight.dateFrom, previousHighlight.dateUntil)) {
                    errors.dateFrom = "Start Date must be greater than start and end date of actual highlight"
                    isValid = false
                }
            }
            if (previousHighlight.dateUntil) {
                if (checkIfDate1IsLowerThanDate2(highlight.dateUntil, previousHighlight.dateFrom) && checkIfDate1IsLowerThanDate2(highlight.dateUntil, previousHighlight.dateUntil)) {
                    errors.dateUntil = "End Date must be greater than start and end date of actual highlight"
                    isValid = false
                }
                if (!checkIfEndDateIsGreaterThanStartDate(highlight.dateFrom, highlight.dateUntil)) {
                    errors.dateUntil = "Date Until must be greater than start"
                    isValid = false
                }
            }
        }
        return {errors, isValid}
    }

    const cloneHighlight = (thenEdit) => {
        const highlightToClone = highlight
        const result = validateInputs(highlightToClone, previousHighlight.dateFrom, previousHighlight.dateUntil, previousHighlight.isDraft)
        if (!result.isValid) {
            setErrors(result.errors)
            return
        }
        delete highlightToClone.id
        delete highlightToClone.product
        fetchNewHighlightClone(highlightToClone, thenEdit)
    }

    const cloneHighlightAsDraft = () => {
        const highlightToClone = highlight
        if (!highlightToClone.isDraft) {
            highlightToClone.isDraft = true
        }
        delete highlightToClone.id
        delete highlightToClone.product
        fetchNewHighlightClone(highlight, false)
    }

    const fetchNewHighlightClone = async (highlight, editAfterClone) => {
        if (previousHighlight.designation === highlight.designation) {
            highlight.designation = `${highlight.designation} - Copy`
        }
        highlight.edited = ""
        highlight.created = formatTimestamp(new Date(), "yyyy-MM-ddTHH:mm")
        try {
            const response = await createHighlight(highlight, session.accessToken)
            onHighlightCloned(response, editAfterClone)
            toggleDialog()
        } catch (e) {
            console.log()
        }
    }

    return (
        <div className={cloneHighlightStyles.dialogWrapper}>
            <h2>Clone {previousHighlight.designation}</h2>
            <div className={defaultStyles.formSeparatorLine}/>
            <Form className={cloneHighlightStyles.form}>
                <Form.Group className={defaultStyles.formGroupSmall}>
                    <Form.Label className={defaultStyles.formLabelSmall}>Designation</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputFieldSmall}
                        name={"designation"}
                        defaultValue={highlight.designation}
                        onChange={onChange}
                    />
                    {errors.designation && <p>{errors.designation}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroupSmall}>
                    <Form.Label className={defaultStyles.formLabelSmall}>Identifier</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputFieldSmall}
                        name={"identifier"}
                        onChange={onChange}
                        defaultValue={highlight.identifier}
                    />
                    {errors.identifier && <p>{errors.identifier}</p>}
                </Form.Group>
                <Form.Group style={{display: "flex", alignItems: "center", gap: 10}}>
                    <Form.Control
                        type={"checkbox"}
                        className={defaultStyles.formCheckbox}
                        onChange={(e) => setHighlight({...highlight, isDraft: e.target.checked})}
                        defaultChecked={highlight.isDraft}
                        name={"isDraft"}/>
                    <Form.Label className={defaultStyles.formLabelSmall}>Clone as Draft</Form.Label>
                </Form.Group>
                <h3 className={defaultStyles.formSubtitle}>Set a new Date</h3>
                <Form.Group className={defaultStyles.formGroupSmall}>
                    <Form.Label className={defaultStyles.formLabelSmall}>Start Date {
                        previousHighlight.dateFrom &&
                            <span style={{fontWeight: "bold"}}>
                                (Previous: {formatTimestamp(previousHighlight.dateFrom, "dd.MMMM.yyyy HH:mm")})
                            </span>
                        }
                    </Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputFieldSmall}
                        type={"datetime-local"}
                        onChange={onChange}
                        name={"dateFrom"}
                        defaultValue={highlight.dateFrom}
                    />
                    {errors.dateFrom && <p>{errors.dateFrom}</p>}
                </Form.Group>
                <Form.Group className={defaultStyles.formGroupSmall}>
                    <Form.Label className={defaultStyles.formLabelSmall}>End Date {
                        previousHighlight.dateUntil &&
                            <span style={{fontWeight: "bold"}}>
                                (Previous : {formatTimestamp(previousHighlight.dateUntil, "dd.MMMM.yyyy HH:mm")})
                            </span>
                        }
                    </Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputFieldSmall}
                        type={"datetime-local"}
                        onChange={onChange}
                        name={"dateUntil"}
                        defaultValue={highlight.dateUntil}
                    />
                    {errors.dateUntil && <p>{errors.dateUntil}</p>}
                </Form.Group>
                <div className={cloneHighlightStyles.buttonGroup}>
                    <button
                        type={"button"}
                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}
                        onClick={() => cloneHighlight(false)}>
                            Clone
                    </button>
                    <button
                        type={"button"}
                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}
                        onClick={() => cloneHighlight(true)}>
                            Clone and <b>Edit</b>
                    </button>
                    <button
                        type={"button"}
                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm}`}
                        onClick={() => cloneHighlightAsDraft()}>
                            Clone as <b>Draft</b>
                    </button>
                    <button
                        type={"button"}
                        className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonSm} ${defaultStyles.buttonTransparent}`}
                        onClick={() => toggleDialog()}>
                            <b>Cancel</b>
                    </button>
                </div>
            </Form>
        </div>
    )
}