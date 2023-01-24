import defaultStyles from "../../stylesheet/global.module.css"
import HighlightForm from "@components/forms/HighlightForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import {Col, Container, Row} from "react-bootstrap";

export default function createHighlight({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()

    return (
        <div>
            <div className={defaultStyles.page}>
                <Container fluid={true} className={defaultStyles.pageContentGap15}>
                    <Row>
                        <Col className={defaultStyles.disableColumnPaddings}>
                            <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() => router.push("../highlights")}>
                                <FontAwesomeIcon icon={faLeftLong}/>
                                &nbsp;&nbsp;&nbsp;Back
                            </button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={defaultStyles.disableColumnPaddings}>
                            <h1>Plan a new Highlight</h1>
                        </Col>
                    </Row>
                </Container>
            </div>
            <HighlightForm session={session} host={host}/>
        </div>
    )
}