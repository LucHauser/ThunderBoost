import footerStyle from "./Footer.module.css"
import {useRouter} from "next/router";
import {Col, Container, NavLink, Row} from "react-bootstrap";

export default function Footer() {

    return (
        <div className={footerStyle.footer}>
            <Container fluid={true}>
                <Row className={"justify-content-xl-between"}>
                    <Col sm={{span: 12, order: 1}} xl={{order: 3, span: "auto"}}>
                        <p>{new Date().getFullYear()} Thunderboost</p>
                    </Col>
                    <Col sm={{span: 12, order: 2}} xl={{span: "auto", order: 1}}>
                        <NavLink href="../about" className={footerStyle.footerLink}>About Thunderboost</NavLink>
                    </Col>
                    <Col sm={{span: 12, order: 3}} xl={{span: "auto", order: 2}}>
                        <NavLink href={"#"} className={footerStyle.footerLink}>Payment and Shipment</NavLink>
                    </Col>
                    <Col sm={{span: 12, order: 4}} xl={{span: "auto", order: 4}}>
                        <NavLink href={"#"} className={footerStyle.footerLink}>Impressum</NavLink>
                    </Col>
                    <Col sm={{span: 12, order: 5}} xl={{span: "auto", order: 5}}>
                        <NavLink href={"#"} className={footerStyle.footerLink}>Privacy Policy</NavLink>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}