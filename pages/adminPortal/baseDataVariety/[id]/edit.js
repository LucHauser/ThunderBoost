import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getBaseDataVariertyById} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
import BaseDataVarietyForm from "@components/forms/BaseDataVarietyForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import {Col, Container, Row} from "react-bootstrap";

export default function editVariety({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [varietyToEdit, setVarietyToEdit] = useState(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()

    const {id} = router.query

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!id) return
        const loadVariety = async () => {
            try {
                const variety = await getBaseDataVariertyById(host, id)
                setVarietyToEdit(variety)
            } catch (e) {
                console.log(e)
            }
        }
        loadVariety()
    }, [id, host])

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button style={{width: 100}} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`} onClick={() =>router.push("../../baseDataVariety")}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            &nbsp;&nbsp;&nbsp;Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Edit {varietyToEdit?.name}</h1>
                        <div className={defaultStyles.formSeparatorLine}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <BaseDataVarietyForm session={session} varietyToEdit={varietyToEdit} host={host}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}