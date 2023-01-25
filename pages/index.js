import landingPageStyles from "./stylesheet/index.module.css"
import defaultStyles from "./stylesheet/global.module.css";
import ClientQuestionForm from "@components/forms/ClientQuestionForm";
import {Carousel, CarouselItem, Col, Container, Row, Stack} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {getAllHighligtsInclusiveProduct, getProductReviewsByParam} from "@lib/api";
import {isEventNow} from "@components/Utils";
import HighlightView from "@components/views/HighlightView";
import {useElementSize} from "usehooks-ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {placeholderText100, whyThunderboostInformations} from "@lib/database/constants";
import {faQuoteLeft} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default function IndexPage({session, host, shoppingCart}) {

    const [activeHighlights, setActiveHighlights] = useState([])
    const [carouselItemRef, carouselItem] = useElementSize()
    const [topProductReview, setTopProductReview] = useState([])
    const ref = useRef(null)

    useEffect(() => {
        const loadProductReviews = async () => {
            try {
                const reviews = await getProductReviewsByParam(host, `sort=starRate&_order=desc&_expand=user`)
                setTopProductReview(reviews.slice(0, 3))
            } catch (e) {
                console.log(e)
            }
        }
        loadProductReviews()
    }, [host])

    useEffect(() => {
        const loadHights = async () => {
            try {
                const response = await getAllHighligtsInclusiveProduct(host)
                setActiveHighlights(response.filter(h => h.active && !h.isDraft && isEventNow(h.dateFrom, h.dateUntil)))
                console.log(activeHighlights)
            } catch (e) {
                console.log(e)
            }
        }
        loadHights()
    }, [host])

    const router = useRouter()

    return (
        <div>
            <Stack>
                <Container fluid={true} className={`${defaultStyles.pageContentGap15} ${defaultStyles.page} ${defaultStyles.pageContentGap15}`}>
                    <Row>
                        <h1 className={defaultStyles.pageTitle}>Welcome at Thunderboost</h1>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{width: "100%", height: 300, background: "#F784D6"}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p>{placeholderText100}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2 className={defaultStyles.pageSubtitle}>Special Offer</h2>
                        </Col>
                    </Row>
                </Container>
                <div className={landingPageStyles.highlightCarousel}>
                    <Carousel className={landingPageStyles.highlightCarouselElement} interval={10000} fade>
                        {
                            activeHighlights.map((highlight, index) => {
                                return (
                                    <Carousel.Item key={index}>
                                        <div className={landingPageStyles.highlightView} ref={carouselItemRef}>
                                            <HighlightView prop={highlight} presentingProduct={highlight.product} navigateToDetail={() => router.push(`./boosters/${highlight.product.id}`)}/>
                                        </div>
                                    </Carousel.Item>
                                )
                            })
                        }
                    </Carousel>
                </div>
                <div className={landingPageStyles.highlightMobile}>
                    {
                        activeHighlights.map((highlight, index) => {
                            return (
                                <div key={index} className={landingPageStyles.highlightView} style={{marginBottom: 30}}>
                                    <HighlightView prop={highlight} presentingProduct={highlight.product}/>
                                </div>
                            )
                        })
                    }
                </div>
                <Container fluid={true} className={`${defaultStyles.page} ${defaultStyles.pageContentGap15}`}>
                    <Row>
                        <Col>
                            <h2 className={defaultStyles.pageSubtitle}>Why Thunderboost</h2>
                        </Col>
                    </Row>
                    <Row id={landingPageStyles["why-thunderboost"]}>
                        {
                            whyThunderboostInformations.map((c, index) => {
                                return (
                                    <Col key={index} xs={12} sm={6} lg={3} style={{marginBottom: 20}}>
                                        <div>
                                            <FontAwesomeIcon icon={c.icon} color={"white"} size={"2xl"}/>
                                            <p>{c.text}</p>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    <Row>
                        <Col>
                            <h2 className={defaultStyles.pageSubtitle}>What our customers say</h2>
                        </Col>
                    </Row>
                    <Row id={landingPageStyles["bestReviewsPicks"]}>
                        {
                            topProductReview.map((r, index) => {
                                return (
                                    <Col key={index} xs={12} md={4} style={{marginBottom: 20}}>
                                        <div>
                                            <FontAwesomeIcon icon={faQuoteLeft} color={"#EB3E7A"} size={"2xl"}/>
                                            <i>{r.text}</i>
                                            <p>- {r.user.firstName} {r.user.lastName[0]}.</p>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Container>
            </Stack>
        </div>
    )
}