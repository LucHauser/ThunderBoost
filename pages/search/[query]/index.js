import defaultStyles from "../../stylesheet/global.module.css"
import searchPageStyles from "../../stylesheet/productSearch.module.css"
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getAllProductByFilterParameter} from "@lib/api";
import {Col, Container, Form, Row} from "react-bootstrap";
import ProductArticle from "@components/views/ProductCollectionItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faXmark} from "@fortawesome/free-solid-svg-icons";

export default function searchPage({session, host, shoppingCart}) {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [matchedProducts, setMatchedProducts] = useState([])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filterText, setFilterText] = useState("")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const {query} = router.query

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!query) return
        setFilterText(query)
        const queringProducts = async () => {
            try {
                const response = await getAllProductByFilterParameter(host, `q=${query}`)
                setMatchedProducts(response.filter(p => p.active))
            } catch (e) {
                console.log(e)
            }
        }
        queringProducts()
    },[query, host])

    return (
        <div className={searchPageStyles.page}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <button
                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonSm} ${defaultStyles.buttonFilledAutoWidth}`}
                            onClick={() => router.push("../../")}>
                            <FontAwesomeIcon icon={faArrowLeft} color={"white"} style={{marginRight: 10}}/>Back
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className={defaultStyles.pageTitle}>Search in Thunderboost</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{order: "last", span: 12}} sm={{order: "first", span: 5}} md={4} className={searchPageStyles.matchInformation}>
                        <b>{matchedProducts.length} Matches found</b>
                    </Col>
                    <Col xs={8} sm={5} md={6} lg={{span: 4, offset: 2}} xl={{span: 3, offset: 4}} className={searchPageStyles.filterCol}>
                        <Form.Control style={{width: "100%"}} className={defaultStyles.formInputField} onChange={(e) => setFilterText(e.target.value)} defaultValue={filterText}/>
                    </Col>
                    <Col xs={4} sm={2} md={2} lg={2} xl={{span: 1}} className={searchPageStyles.filterCol}>
                        <button className={defaultStyles.buttonFilled} onClick={() => router.push(`../search/${filterText}`)}>Search</button>
                    </Col>
                </Row>
                {
                    matchedProducts.length > 0 ?
                        <Row>
                            {
                                matchedProducts.map((m, index) => {
                                    return (
                                        <>
                                            <Col xs={12} sm={6} md={4} lg={3} xl={2} className={searchPageStyles.filterCol}>
                                                <ProductArticle session={session} product={m} showAll={true} routeToDetail={() => router.push(`../boosters/${m.id}`)}/>
                                            </Col>
                                        </>
                                    )
                                })
                            }
                        </Row>
                        : <Row>
                            <Col className={searchPageStyles.notFoundedProduct}>
                                <FontAwesomeIcon icon={faXmark} color={"#FFFFFF"} size={"2x"}/>
                                <p>No products found</p>
                            </Col>
                        </Row>
                }
            </Container>
        </div>
    )
}