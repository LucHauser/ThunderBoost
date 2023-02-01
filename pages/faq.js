import defaultStyles from "./stylesheet/global.module.css"
import {Col, Container, Row} from "react-bootstrap";
import {placeholderText100} from "@lib/database/constants";

export default function faqPage() {

    return (
        <div className={defaultStyles.page}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <h1 className={defaultStyles.pageTitle}>What is Thunderboost?</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{placeholderText100}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className={defaultStyles.pageTitle}>How to use Thunderboost Drink</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{placeholderText100}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}