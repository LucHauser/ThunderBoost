import {Col, Container, Row, Stack} from "react-bootstrap";
import highlightStyles from "./Highlight.module.css"
import formatTimestamp, {getDiscountPrice, isEventNowWithBoolean} from "@components/Utils";
import markdown from "/components/views/MarkdownReview.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function Highlight({prop, presentingProduct, navigateToDetail}) {
    return (
        <div className={highlightStyles.container}>
            <Container fluid={true}>
                <Row className={highlightStyles.layoutParent}>
                    <Col sm={6} md={4} lg={3}>
                        <div className={highlightStyles.productImage} style={{backgroundImage: `url(${presentingProduct.images !== [] ? presentingProduct.images[prop.productImageIndex] : "https://via.placeholder.com/400"})`, backgroundSize: "cover", backgroundColor: "#707070"}}/>
                    </Col>
                    <Col sm={12} md={{span: 8}} lg={{offset: 1, span: 8}}>
                        <div className={highlightStyles.content}>
                            <div>
                                <h2>{presentingProduct.name}</h2>
                                {
                                    isEventNowWithBoolean(presentingProduct.discountFrom, presentingProduct.discountUntil, presentingProduct.discountActive) ?
                                        <h4 className={`${highlightStyles.productPrice}`}>{getDiscountPrice(presentingProduct.price, presentingProduct?.discountPercent)} CHF <span>instead {presentingProduct.price} CHF</span></h4>
                                        : <h4 className={highlightStyles.productPrice}>{presentingProduct.price} CHF</h4>
                                }
                                <div>
                                    {/* eslint-disable-next-line react/no-children-prop */}
                                    <ReactMarkdown children={prop.text + `<br><b>Offer Until ${formatTimestamp(prop.dateUntil, "dd.MM.yyyy HH.mm")}</b>`} rehypePlugins={rehypeRaw} remarkPlugins={remarkGfm} className={markdown.elements}/>
                                </div>
                            </div>

                            <Stack direction={"horizontal"} gap={4}>
                                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth} ms-auto`}>
                                    more
                                </button>
                                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>
                                    Add to Cart
                                </button>
                            </Stack>
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}