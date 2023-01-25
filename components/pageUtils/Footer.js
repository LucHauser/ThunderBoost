import footerStyle from "./Footer.module.css"
import {useRouter} from "next/router";
import {Col, Container, NavLink, Row} from "react-bootstrap";

export default function Footer() {

    return (
        <div className={footerStyle.footer}>
            <Container fluid={true}>
                <Row>
                    <Col sm={12} xl>
                        <p>{new Date().getFullYear()} Thunderboost</p>
                    </Col>
                    <Col sm={12} xl>
                        <NavLink href="../about" className={footerStyle.footerLink}>About Thunderboost</NavLink>
                    </Col>
                    <Col sm={12} xl>
                        <NavLink href={"#"} className={footerStyle.footerLink}>Payment and Shipment</NavLink>
                    </Col>
                    <Col sm={12} xl>
                        <NavLink href={"#"} className={footerStyle.footerLink}>Impressum</NavLink>
                    </Col>
                    <Col sm={12} xl>
                        <NavLink href={"#"} className={footerStyle.footerLink}>Privacy Policy</NavLink>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}