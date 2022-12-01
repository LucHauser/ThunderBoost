import highlightViewStyles from "./HighlightView.module.css"
import defaultStyles from "../pages/stylesheet/global.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {hexToRgba} from "@components/stylesUtils";
import {faBullhorn, faCartShopping} from "@fortawesome/free-solid-svg-icons";
import markdownElements from "@components/MarkdownReview.module.css";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Countdown from 'react-countdown'

export default function HighlightView({prop, presentingProduct, editViewMode}) {

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
            className={highlightViewStyles.container}
            style={
                Object.assign(prop.backgroundStyle !== "2" ?
                    {background: backgroundingBySettings(prop.backgroundStyle, prop.gradientStyle, prop.primaryBackgroundColor, prop.primaryBackgroundColorOpacity, prop.secondaryBackgroundColor, prop.secondaryBackgroundColorOpacity)}
                    : {backgroundImage: `url(${prop.backgroundImg})`, backgroundSize: "cover"},
                    prop.highlightContentShadow ?
                        {boxShadow: `0 0 8px 8px ${hexToRgba(prop.highlightShadowColor, prop.highlightShadowColorOpacity)}`}
                        : null)
        }
        >
            <div className={highlightViewStyles.imageArea}>
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
                <img
                    className={highlightViewStyles.productImage}
                    src={"https://via.placeholder.com/300"}
                />
            </div>
            <div className={highlightViewStyles.contentArea}>
                <h1
                    style={
                        {
                            color: prop.titleColor,
                            marginBottom: "auto",
                            fontFamily: prop.titleFontFamily !== "HK-Modular" ?
                                prop.titleFontFamily :
                                null,
                            textShadow: prop.showTitleShadow ? `${prop.titleShadowStyle} ${prop.titleShadowColor}` : null
                        }
                    }
                    className={prop.titleFontFamily === "HK-Modular" ?
                        defaultStyles.getHKModular :
                        null
                }>
                    {prop.title === "" ?
                        "Enter a title..."
                        : prop.title
                    }</h1>
                {
                    presentingProduct?.price &&
                    <p className={!prop.showProductPrice ? defaultStyles.hideElement : null} style={{marginBottom: "auto"}}>{presentingProduct.price}</p>
                }
                <div style={{
                    marginBottom: "auto",
                    color: prop.textColor,
                    fontFamily: prop.textFontFamily,
                    textShadow: prop.showTextShadow ? `${prop.textShadowStyle} ${prop.textShadowColor}` : null
                    }}
                     className={prop.titleFontFamily === "HK-Modular" ? defaultStyles.getHKModular : null}>
                    <ReactMarkdown
                        className={`${markdownElements.elements}`}
                        /* eslint-disable-next-line react/no-children-prop */
                        children={prop.text !== "" ? prop.text : "Write your text..."}
                        rehypePlugins={[rehypeRaw, remarkGfm]}
                    />
                </div>
            </div>
            <div className={highlightViewStyles.footerArea}>
                {prop.showUntilDate ?
                    <div className={highlightViewStyles.dateUntilBox} style={{background: hexToRgba(prop.dateUntilBackground, prop.dateUntilBackgroundOpacity)}}>
                        <h3 style={{color: prop.dateUntilColor}}>{`${prop.additionalUntilText !== "" ? prop.additionalUntilText : "Until"}`}</h3>
                        {prop.runningCountdown ?
                            <h3 style={{fontFamily: "Arial, sans-serif", fontSize: 23, color: prop.dateUntilColor}}>
                                <Countdown date={prop.dateUntil}/>
                            </h3>
                            : <h3 style={{color: prop.dateUntilColor}}>{prop.dateUntil}</h3>
                        }
                    </div>
                    : null
                }
                {
                    !prop.disableButtonToProduct || !prop.disableButtonCart ?
                        <div style={{background: hexToRgba(prop.buttonAreaBackground, prop.buttonAreaBackgroundOpacity)}} className={highlightViewStyles.buttonSector}>
                            {
                                !prop.disableButtonToProduct ?
                                    <button>{prop.buttonToProductText !== "" ? prop.buttonToProductText : "more..."}</button>
                                    : null
                            }
                            {
                                !prop.disableButtonCart ?
                                    <button><FontAwesomeIcon icon={faCartShopping} color={"black"}/>&nbsp;Add to Cart</button>
                                    : null
                            }


                        </div>
                        : null
                }

            </div>

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