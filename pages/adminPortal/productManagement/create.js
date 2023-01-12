import defaultStyles from "../../stylesheet/global.module.css"
import ProductForm from "@components/forms/ProductForm";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {Col, Container, Row} from "react-bootstrap";
import {formatServerUrl} from "@components/Utils";
import {useEffect} from "react";

export default function createProductPage({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    // const host = formatServerUrl(document.location.hostname)

    return (
        <div className={defaultStyles.page}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push("../productManagement")}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            &nbsp;&nbsp;&nbsp;Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Create new Product</h1>
                        <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <ProductForm session={session} host={host}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}