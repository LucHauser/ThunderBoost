import defaultStyles from "../../stylesheet/global.module.css"
import BaseDataVarietyForm from "@components/forms/BaseDataVarietyForm";
import {useRouter} from "next/router";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/session";
import {Col, Container, Row} from "react-bootstrap";

export default function AddVariety({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    const router = useRouter()

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push("../baseDataVariety")}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            &nbsp;&nbsp;&nbsp;Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Add Variety</h1>
                        <div className={defaultStyles.formSeparatorLine}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <BaseDataVarietyForm session={session} host={host}/>
                    </Col>
                </Row>
            </Container>



        </div>
    )
}