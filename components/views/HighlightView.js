import highlightViewStyles from "./HighlightView.module.css"
import defaultStyles from "../../pages/stylesheet/global.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import formatTimestamp, {getDiscountPrice, hexToRgba} from "@components/Utils";
import {faBullhorn, faCartShopping} from "@fortawesome/free-solid-svg-icons";
import markdownElements from "@components/views/MarkdownReview.module.css";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Countdown from 'react-countdown'
import {Col, Container, Row} from "react-bootstrap";

export default function HighlightView({prop, presentingProduct, editorViewMode}) {

    function backgroundingBySettings(styleOption, gradientOption, primaryColor, primaryOpacity, secondaryColor, secondaryOpacity) {
        let val = ``
        switch (styleOption) {
            case "0":
                val = `${hexToRgba(primaryColor, primaryOpacity)}`
                break
            case "1": {
                switch (gradientOption) {
                    case "0":
                        val = `linear-gradient(${hexToRgba(primaryColor, primaryOpacity)}, ${hexToRgba(secondaryColor, secondaryOpacity)})`
                        break
                    case "1":
                        val = `linear-gradient(to right, ${hexToRgba(primaryColor, primaryOpacity)}, ${hexToRgba(secondaryColor, secondaryOpacity)})`
                        break
                    case "2":
                        val = `linear-gradient(to left, ${hexToRgba(primaryColor, primaryOpacity)}, ${hexToRgba(secondaryColor, secondaryOpacity)})`
                        break
                    case "3":
                        val = `linear-gradient(to bottom right, ${hexToRgba(primaryColor, primaryOpacity)}, ${hexToRgba(secondaryColor, secondaryOpacity)})`
                        break
                    case "4":
                        val = `linear-gradient(to bottom left, ${hexToRgba(primaryColor, primaryOpacity)}, ${hexToRgba(secondaryColor, secondaryOpacity)})`
                        break
                    case "5":
                        val = `linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)`
                        break
                    case "6":
                        val = `linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)`
                        break
                }
            }
        }
        return val;
    }

    return (
        <div
            className={highlightViewStyles.highlightView}
            style={
                Object.assign(prop.backgroundStyle !== "2" ?
                    {background: backgroundingBySettings(prop.backgroundStyle, prop.gradientStyle, prop.primaryBackgroundColor, prop.primaryBackgroundColorOpacity, prop.secondaryBackgroundColor, prop.secondaryBackgroundColorOpacity)}
                    : {backgroundImage: `url(${prop.backgroundImg})`, backgroundSize: "cover"},
                    prop.highlightContentShadow ?
                        {boxShadow: `0 0 8px 8px ${hexToRgba(prop.highlightShadowColor, prop.highlightShadowColorOpacity)}`}
                        : null)
        }
        >
            <Container fluid={true}>
                <Row>
                    <Col>
                        <div
                            className={highlightViewStyles.eventType}
                            style={
                                {
                                    background: hexToRgba(prop.eventTypeBackground, prop.eventTypeBackgroundOpacity)
                                }
                            }>
                            <FontAwesomeIcon icon={faBullhorn} color={prop.eventTypeTextColor}/>
                            <i style={
                                {
                                    color: prop.eventTypeTextColor
                                }}
                               className={prop.eventTypeTextRgbAnimation ? highlightViewStyles.textRgbAnimation : null}>
                                {prop.enableCustomEventType? prop.customEventTypeText : prop.eventType}
                            </i>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <img
                            className={highlightViewStyles.productImage}
                            src={presentingProduct?.images[prop.productImageIndex]}
                            alt={"Img"}/>
                    </Col>
                    <Col>
                        <Container>
                            <Row>
                                <Col>
                                    <h1
                                        style={Object.assign(
                                            {
                                                color: prop.titleColor,
                                                fontFamily: prop.titleFontFamily !== "HK-Modular" ?
                                                    prop.titleFontFamily :
                                                    null,
                                                textShadow: prop.showTitleShadow ? `${prop.titleShadowStyle} ${prop.titleShadowColor}` : null
                                            }, prop.showTitleBackground ? {background: hexToRgba(prop.titleBackgroundColor, prop.titleBackgroundOpacity), padding: "3px 10px"} : null)
                                        }
                                        className={prop.titleFontFamily === "HK-Modular" ?
                                            defaultStyles.getHKModular :
                                            null
                                        }>
                                        {prop.title === "" ?
                                            "Enter a title..."
                                            : prop.title
                                        }</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        prop.showProductPrice ?
                                            <p className={
                                                !prop.showProductPrice ?
                                                    defaultStyles.hideElement
                                                    : null
                                            }
                                               style={Object.assign({
                                                   fontFamily: prop.productPriceFontFamily,
                                                   color: prop.productPriceColor
                                               }, prop.enableProductPriceBackground ? {
                                                   background: hexToRgba(prop.productPriceBackground, prop.productPriceBackgroundOpacity),
                                                   padding: 5
                                               } : null )
                                               }
                                               id={highlightViewStyles["productPrice"]}>
                                                {presentingProduct?.discountActive && prop?.showProductPriceInclusiveDiscount ?
                                                    getDiscountPrice(presentingProduct?.price, presentingProduct?.discountPercent) : presentingProduct?.price}$
                                                {presentingProduct?.discountActive && prop?.showProductPriceInclusiveDiscount ? <span style={{alignSelf: prop.originalPriceAlignment, color: prop.originalPriceColor}}>instead {presentingProduct.price}$</span> : null}
                                            </p> : null
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div style={Object.assign({
                                        marginBottom: "auto",
                                        color: prop.textColor,
                                        fontFamily: prop.textFontFamily,
                                        textShadow: prop.showTextShadow ? `${prop.textShadowStyle} ${prop.textShadowColor}` : null
                                    }, prop.showTextBackground ? {
                                        background: hexToRgba(prop.textBackgroundColor, prop.textBackgroundOpacity),
                                        padding: "5px 10px"
                                    } : null)}
                                         className={`${prop.titleFontFamily === "HK-Modular" ? defaultStyles.getHKModular : null}`}
                                         id={highlightViewStyles["highlightText"]}>
                                        <ReactMarkdown
                                            className={`${markdownElements.elements}`}
                                            /* eslint-disable-next-line react/no-children-prop */
                                            children={prop.text !== "" ? prop.text : "Write your text..."}
                                            rehypePlugins={[rehypeRaw, remarkGfm]}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row className={highlightViewStyles.footerArea}>
                    <Col>
                        { prop.showUntilDate ?
                            <div className={highlightViewStyles.dateUntilBox} style={{background: hexToRgba(prop.dateUntilBackground, prop.dateUntilBackgroundOpacity)}}>
                                <h3 style={{color: prop.dateUntilColor}}>{`${prop.additionalUntilText !== "" ? prop.additionalUntilText : "Until"}`}</h3>
                                {prop.runningCountdown ?
                                    <h3 style={{fontFamily: "Nunito, sans-serif", fontSize: 23, color: prop.dateUntilColor}}>
                                        <Countdown date={prop.dateUntil}/>
                                    </h3>
                                    : <h3 style={{color: prop.dateUntilColor}}>{formatTimestamp(prop.dateUntil, "dd.MM.yyyy HH:mm")}</h3>
                                }
                            </div>
                            : null
                        }
                    </Col>
                    <Col>
                        {
                            !prop.disableButtonToProduct || !prop.disableButtonCart ?
                                <div style={{background: hexToRgba(prop.buttonAreaBackground, prop.buttonAreaBackgroundOpacity)}} className={highlightViewStyles.buttonSector}>
                                    {
                                        !prop.disableButtonToProduct ?
                                            <button style={{background: hexToRgba(prop.buttonToProductBackground, prop.buttonToProductBackgroundOpacity), color: prop.buttonToProductTextColor}}>{prop.buttonToProductText !== "" ? prop.buttonToProductText : "more..."}</button>
                                            : null
                                    }
                                    {
                                        !prop.disableButtonCart ?
                                            <button style={{background: hexToRgba(prop.buttonCartBackground, prop.buttonCartBackgroundOpacity), color: prop.buttonCartTextColor}}><FontAwesomeIcon icon={faCartShopping} color={prop.buttonCartIconColor}/>&nbsp;Add to Cart</button>
                                            : null
                                    }
                                </div>
                                : null
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

/*
*  style={{background: "rgba(255,0,0,0.2)"}}
*  style={{background: "rgba(255,255,0,0.2)"}}
*  style={{background: "rgba(255,0,255,0.2)"}}
*
* Countdown Tip, read it for later in highlight countdown:
* https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks
*
* Converter Code Template hex to rgba oder rgb
* https://stackoverflow.com/a/28056903/20557975*/