import highlightViewStyles from "./HighlightView.module.css"
import defaultStyles from "../pages/stylesheet/global.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {hexToRgba} from "@components/stylesUtils";
import {faBullhorn} from "@fortawesome/free-solid-svg-icons";
import markdownElements from "@components/MarkdownReview.module.css";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function HighlightView({prop, presentingProduct, editViewMode}) {

    function backgroundingBySettings(styleOption, gradientOption, primaryColor, secondaryColor) {
        let val = ``
        switch (styleOption) {
            case "0":
                val = `${primaryColor}`
                break
            case "1": {
                switch (gradientOption) {
                    case "0":
                        val = `linear-gradient(${primaryColor}, ${secondaryColor})`
                        break
                    case "1":
                        val = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                        break
                    case "2":
                        val = `linear-gradient(to left, ${primaryColor}, ${secondaryColor}`
                        break
                    case "3":
                        val = `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor}`
                        break
                    case "4":
                        val = `linear-gradient(to bottom left, ${primaryColor}, ${secondaryColor}`
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
            style={prop.gradientStyle !== "2" ?
                {background: backgroundingBySettings(prop.backgroundStyle, prop.gradientStyle, prop.primaryBackgroundColor, prop.secondaryBackgroundColor)}
                : {backgroundImage: `url(${prop.backgroundImgUrl})`}
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
                    <p>{presentingProduct.price}</p>
                }
                <div style={{color: prop.textColor, fontFamily: "Arial, sans-serif"}}>
                    <ReactMarkdown
                        className={`${markdownElements.elements}`}
                        /* eslint-disable-next-line react/no-children-prop */
                        children={prop.text}
                        rehypePlugins={[rehypeRaw, remarkGfm]}
                    />
                </div>
            </div>
            <div className={highlightViewStyles.footerArea}>

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