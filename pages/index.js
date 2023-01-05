import landingPageStyles from "./stylesheet/index.module.css"
import defaultStyles from "./stylesheet/global.module.css";
import ClientQuestionForm from "@components/forms/ClientQuestionForm";
import {Carousel, CarouselItem, Col, Container, Row} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {getAllHighligtsInclusiveProduct} from "@lib/api";
import {isEventNow} from "@components/Utils";
import HighlightView from "@components/views/HighlightView";
import {useElementSize} from "usehooks-ts";

export default function IndexPage({session, host}) {

    const [activeHighlights, setActiveHighlights] = useState([])
    const [carouselItemRef, carouselItem] = useElementSize()
    const ref = useRef(null)

    useEffect(() => {

    })

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

    return (
        <div className={landingPageStyles.landingPage}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
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
                        <h2 className={defaultStyles.pageSubtitle}>Special Offer</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Carousel className={landingPageStyles.highlightCarouselElement} interval={10000} fade>
                            {
                                activeHighlights.map((highlight, index) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            <div className={landingPageStyles.highlightView} ref={carouselItemRef}>
                                                <HighlightView prop={highlight} presentingProduct={highlight.product} finalHeight={600} finalWidth={carouselItem.width}/>
                                            </div>

                                        </Carousel.Item>
                                    )
                                })
                            }
                        </Carousel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2 className={defaultStyles.pageSubtitle}>Why Thunderboost</h2>
                    </Col>
                </Row>
            </Container>


        </div>
    )
}