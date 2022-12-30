import productReviewFormStyles from "./ProductReviewForm.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";

export default function ProductReviewForm({session, productId}) {

    const defaultModel = {
        title: "",
        text: "",
        starRate: "",
        reviewDate: "",
        productId: null,
        userId: null
    }

    const [model, setModel] = useState(defaultModel)

    const handleChange = (e) => {
        setModel({
            ...model,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <Form>
                <h3 className={defaultStyles.formTitle}>Write your Review</h3>
                <Container>
                    <Row>
                        <Col md={4}>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Title</Form.Label>
                                <Form.Control className={defaultStyles.formInputField} name="title" onChange={handleChange} placeholder={"Enter a title"}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className={defaultStyles.formGroup}>
                                <Form.Label className={defaultStyles.formLabel}>Text</Form.Label>
                                <textarea className={defaultStyles.formInputField} onChange={handleChange} name={"text"} placeholder={"Enter your review"}/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>



                <Form.Group className={defaultStyles.formGroup}>

                </Form.Group>
            </Form>
        </>
    )
}