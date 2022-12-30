import {useEffect, useState} from "react";
import clientQuestionFormStyles from "./ClientQuestionForm.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {Form, FormGroup} from "react-bootstrap";
import {postCustomerQuestion} from "@lib/api";

export default function ClientQuestionForm({session}) {

    const defaultModel = {
        title: "",
        text: "",
        lastName: "",
        firstName: "",
        isUser: false,
        publicPersonalityInformation: false,
        answerText: "",
        isPublic: false,
        questionDate: "",
        answerDate: ""
    }

    const [model, setModel] = useState(defaultModel)
    const [errors, setErrors] = useState({})
    const [loadQuestion, setLoadQuestion] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    function validateModel(model) {
        const errors = {
            title: "",
            text: "",
            lastName: "",
            firstName: "",
        }
        let isValid = true

        if (model.title.trim().length === 0) {
            errors.title = "Title is required"
            isValid = false
        }
        if (model.title.length > 100) {
            errors.title = "Title too long (Max. 100 Character)"
            isValid = false
        }
        if (model.text.length > 100) {
            errors.text = "Text too long (Max. 100 Character)"
            isValid = false
        }
        if (!model.isUser && model.lastName.trim().length === 0) {
            errors.lastName = "Last name is required"
            isValid = false
        }
        if (!model.isUser && model.lastName.length > 30) {
            errors.name = "Last name too long (Max. 30 Character)"
            isValid = false
        }
        if (!model.isUser && model.firstName.trim().length === 0) {
            errors.firstName = "First is required"
            isValid = false
        }
        if (!model.isUser && model.firstName.length > 30) {
            errors.firstName = "First name too long (Max. 30 Character)"
            isValid = false
        }

        return {errors, isValid}
    }

    useEffect(() => {
        if (session.user) {
            setModel({
                ...model,
                lastName: session.user.lastName,
                firstName: session.user.firstName,
                isUser: true
            })
            console.log(model)
        }
    }, [session])

    const onModelChange = (e) => {
        const target = e.target
        const name = target.name
        const value = target.value
        setModel({
            ...model,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoadQuestion(true)
        const result = validateModel(model)
        if (!result.isValid) {
            setErrors(result.errors)
            setLoadQuestion(false)
            return
        }
        try {
            await postCustomerQuestion(model)
            setSubmitted(true)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        !submitted ?
            <div className={clientQuestionFormStyles.wrapper}>
                <h2 className={defaultStyles.formTitle}>Ask question to Thunderboost</h2>
                <div className={defaultStyles.formSeparatorLine}/>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className={defaultStyles.formGroup}>
                        <Form.Label className={defaultStyles.formLabel}>Title / Question</Form.Label>
                        <Form.Control className={defaultStyles.formInputField} name={"title"} onChange={onModelChange}/>
                    </Form.Group>
                    <Form.Group className={defaultStyles.formGroup}>
                        <Form.Label className={defaultStyles.formLabel}>Text</Form.Label>
                        <Form.Control className={defaultStyles.formInputField} name={"text"} onChange={onModelChange}/>
                    </Form.Group>
                    {session.user ?
                        <div className={clientQuestionFormStyles.formGroupRow}>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Last name</Form.Label>
                                <Form.Control className={defaultStyles.formInputField} name={"last Name"} onChange={onModelChange}/>
                            </Form.Group>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>First name</Form.Label>
                                <Form.Control className={defaultStyles.formInputField} name={"firstName"} onChange={onModelChange}/>
                            </Form.Group>
                        </div>
                        : <div className={clientQuestionFormStyles.justifyContent}>
                            <p><b>Name:</b> {session.user.lastName}</p>
                            <p><b>First name:</b> {session.user.firstName}</p>
                        </div>
                    }
                    <FormGroup className={clientQuestionFormStyles.justifyContent}>
                        <Form.Control type={"checkbox"} className={defaultStyles.formCheckbox} name={"publicPersonalityInformation"} onChange={(e) => setModel({...model, publicPersonalityInformation: e.target.checked})}/>
                        <Form.Label className={defaultStyles.formLabel}>Show personal information to public</Form.Label>
                    </FormGroup>
                    <div className={clientQuestionFormStyles.btnGroup}>
                        <button type={"submit"} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonTransparent}`}>Submit</button>
                        <button type={"reset"} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ${defaultStyles.buttonTransparent}`}>Reset Draft</button>
                    </div>
                </Form>
            </div> : <div>Submitted</div>


    )
}