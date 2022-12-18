import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import cloneHighlightStyles from "./CloneHighlight.module.css"

export default function CloneHighlightDialog({session, highlightToClone}) {

    const [previousHighlight, setPreviousHighlight] = useState({})
    const [highlight, setHighlight] = useState({})

    useEffect(() => {
        if (!highlightToClone.id) return
        setPreviousHighlight(highlightToClone)
        highlightToClone.designation = `${highlightToClone.designation} - Copy`
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

    const copyHighlight = (goEditAfterCopy) => {

    }

    return (
        <div className={cloneHighlightStyles.dialogWrapper}>
            <h2>Clone {previousHighlight.designation}</h2>
            <div className={defaultStyles.formSeparatorLine}/>
            <Form className={cloneHighlightStyles.form}>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Designation</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        name={"designation"}
                        defaultValue={highlight.designation}
                        onChange={onChange}
                    />
                </Form.Group>
                <Form.Group className={defaultStyles.formGroup}>
                    <Form.Label className={defaultStyles.formLabel}>Identifier</Form.Label>
                    <Form.Control
                        className={defaultStyles.formInputField}
                        name={"identifier"}
                        onChange={onChange}
                        defaultValue={highlight.identifier}
                    />
                </Form.Group>
                <div>
                    <button>Clone</button>
                    <button>Clone and Edit</button>
                    <button>Clone as Draft</button>
                    <button>Cancel</button>
                </div>
            </Form>
        </div>
    )
}