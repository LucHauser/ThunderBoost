import footerStyle from "./Footer.module.css"
import {useRouter} from "next/router";
import {Col, Container, NavLink, Row} from "react-bootstrap";

export default function Footer() {

    return (
        <div className={footerStyle.footer}>
            <Container>
                <Row>
                    <Col sm={12} lg>
                        <p>{new Date().getFullYear()} Thunderboost</p>
                    </Col>
                    <Col sm={12} lg>
                        <NavLink href="../about">About Thunderboost</NavLink>
                    </Col>
                    <Col sm={12} lg>
                        <NavLink href={"#"}>Payment and Shipment</NavLink>
                    </Col>
                    <Col sm={12} lg>
                        <NavLink href={"#"}>Impressum</NavLink>
                    </Col>
                    <Col sm={12} lg>
                        <NavLink href={"#"}>Privacy Policy</NavLink>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}