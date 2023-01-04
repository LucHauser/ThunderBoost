import {useRouter} from "next/router";
import defaultStyles from "../../../stylesheet/global.module.css"
import {useEffect, useState} from "react";
import {getProductById} from "@lib/api";
import ProductForm from "@components/forms/ProductForm";
import {useRedirectBlockAdmin, useRedirectToLogin} from "@lib/hooks/session";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import {Col, Container, Row} from "react-bootstrap";
import {formatServerUrl} from "@components/Utils";

export default function editProductPage({session, host}) {

    if (session.user) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectBlockAdmin(session)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useRedirectToLogin(session)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [productToEdit, setProductToEdit] = useState(null)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const {id} = router.query

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!id) return
        const loadProduct = async () => {
            try {
                const product = await getProductById(host, id)
                setProductToEdit(product)
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
    }, [id, host])

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button
                            style={{width: 100}}
                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm}`}
                            onClick={() =>router.push("../../productManagement")}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            &nbsp;&nbsp;&nbsp;Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Edit {productToEdit?.name}</h1>
                        <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
                            <ProductForm session={session} productToEdit={productToEdit} host={host}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}