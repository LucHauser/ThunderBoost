import productReviewFormStyles from "./ProductReviewForm.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {useEffect, useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import ReactStars from "react-stars"
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {editProductReview, postProductReview} from "@lib/api";
import formatTimestamp from "@components/Utils";

export default function ProductReviewForm({session, productId, host, onReviewed, reviewToEdit, onReviewEdited}) {

    function validateModel(model) {
        let isValid = true
        const errors = {
            title: "",
            text: "",
            starRate: ""
        }
        if (model.title.trim().length === 0) {
            errors.title = "Title is required"
            isValid = false
        }
        if (model.title.length > 50) {
            errors.title = "Title too long (max. 50 Character)"
            isValid = false
        }
        if (model.text.trim().length === 0) {
            errors.text = "Text is Required"
            isValid = false
        }
        if (model.text.length > 150) {
            errors.text = "Text too long (max. 150 Characters)"
            isValid = false
        }
        if (model.starRate === 0) {
            errors.starRate = "Please give a star rate"
            isValid = false
        }
        return {errors, isValid}
    }

    const defaultModel = {
        title: "",
        text: "",
        starRate: 0,
        reviewDate: "",
        productId: null,
        userId: null
    }

    const [model, setModel] = useState(defaultModel)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (reviewToEdit) {
            setModel(reviewToEdit)
        }
    }, [reviewToEdit])

    const handleChange = (e) => {
        setModel({
            ...model,
            [e.target.name]: e.target.value
        })
    }

    const rateProduct = async (e) => {
        console.log(model)
        e.preventDefault()
        const result = validateModel(model)
        if (!result.isValid) {
            setErrors(result.errors)
            return
        }
        if (model.id) {
            try {
                const response = await editProductReview(host, model, session.accessToken)
                response.user = session.user
                onReviewEdited(response)
            } catch (e) {
                console.log(e)
            }
        }
        model.reviewDate = formatTimestamp(new Date(), "yyyy-MM-ddTHH:mm")
        model.userId = session.user.id
        model.productId = parseInt(productId)
        try {
            const response = await postProductReview(host, model)
            onReviewed(response)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={productReviewFormStyles.component}>
            <Form onSubmit={rateProduct}>
                <Container fluid={true}>
                    <Row>
                        <Col className={productReviewFormStyles.columns}>
                            <h3 className={defaultStyles.formTitle}>Write your Review</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className={productReviewFormStyles.columns}>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Title</Form.Label>
                                <Form.Control
                                    className={`${defaultStyles.formInputField} ${errors.title && defaultStyles.formInputError}`}
                                    name="title"
                                    onChange={handleChange}
                                    placeholder={"Enter a title"}
                                    defaultValue={model.title}
                                />
                                {errors.title && <p>{errors.title}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className={productReviewFormStyles.columns}>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Text</Form.Label>
                                <textarea
                                    className={`${defaultStyles.formInputField} ${defaultStyles.formTextfield} ${errors.text && defaultStyles.formInputError}`}
                                    onChange={handleChange}
                                    name={"text"}
                                    placeholder={"Enter your review"}
                                    rows={3}
                                    defaultValue={model.text}
                                />
                                {errors.text && <p>{errors.text}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={productReviewFormStyles.columns}>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Star Rating</Form.Label>
                                <ReactStars
                                    count={5}
                                    value={model.starRate}
                                    size={32}
                                    color2={"#FFB800"}
                                    half={true}
                                    onChange={(e) =>
                                        setModel({...model, starRate: e})
                                    }
                                />
                                {errors.starRate && <p>{errors.starRate}</p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={{span: 2, offset: 10}} className={productReviewFormStyles.columns}>
                            <button type={"submit"} className={`${defaultStyles.buttonFilled}`}>Submit</button>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </div>
    )
}