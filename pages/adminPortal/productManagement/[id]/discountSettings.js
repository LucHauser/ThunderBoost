import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getProductById, updateProduct} from "@lib/api";
import defaultStyles from "../../../stylesheet/global.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeftLong} from "@fortawesome/free-solid-svg-icons";
import DiscountSettingsForm from "@components/forms/DiscountForm";
import {Col, Container, Row} from "react-bootstrap";
import {formatServerUrl} from "@components/Utils";

export default function ProductDiscountManager({session, host}) {

    const router = useRouter()
    const {id} = router.query

    const [productToEdit, setProductToEdit] = useState({})

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const productForEdit = await getProductById(host, id)
                setProductToEdit(productForEdit)
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
    }, [id, host])

    return (
        <div className={defaultStyles.page}>
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
                        <h1>Edit Discount for {productToEdit.name}</h1>
                        <div className={`${defaultStyles.formSeparatorLine}`} style={{marginTop: 10}}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            <DiscountSettingsForm session={session} productToEdit={productToEdit} host={host}/>
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}