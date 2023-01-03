import styles from "./stylesheet/index.module.css"
import defaultStyles from "./stylesheet/global.module.css";
import ClientQuestionForm from "@components/forms/ClientQuestionForm";
import {Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getAllHighligtsInclusiveProduct} from "@lib/api";

export default function IndexPage({session, host}) {

    const [activeHighlights, setActiveHighlights] = useState([])

    useEffect(() => {
        const loadHights = async () => {
            try {
                const response = await getAllHighligtsInclusiveProduct(host)
                setActiveHighlights(response.filter(h => h.active))
            } catch (e) {
                console.log(e)
            }
        }
    }, [host])

    return (
        <div className={styles.landingPage}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <div style={{width: "100%", height: 300, background: "#F784D6"}}/>
                    </Col>
                </Row>
                <Row>
                    <h1 className={defaultStyles.pageTitle}>Welcome at Thunderboost</h1>
                </Row>
            </Container>


        </div>
    )
}