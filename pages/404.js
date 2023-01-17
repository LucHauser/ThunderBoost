import defaultStyles from "./stylesheet/global.module.css"
import {Col, Container, Row} from "react-bootstrap";
import {useRouter} from "next/router";

export default function Page404() {
    const router = useRouter()
    return (
        <div className={defaultStyles.page} style={{display: "flex", alignItems: "center"}}>
            <Container>
                <Row>
                    <Col>
                        <h1 className={defaultStyles.pageTitle}>Error 404</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p style={{width: "100%", textAlign: "center", fontFamily: "Nunito, sans-serif", fontSize: 20}}>Oops, something went wrong</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={{span: 6, offset: 3}}>
                        <button className={defaultStyles.buttonFilled} onClick={() => router.push("./")}>Back to Home</button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}