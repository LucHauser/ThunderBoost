import highlightViewStyles from "./HighlightView.module.css"
import defaultStyles from "../pages/stylesheet/global.module.css"

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
            <div>
                <img src={"https://via.placeholder.com/300"}/>
            </div>
            <div>
                <h1 style={{color: prop.titleColor, fontFamily: prop.titleFontFamily !== "HK-Modular" ? prop.titleFontFamily : null}} className={prop.titleFontFamily === "HK-Modular" ? defaultStyles.getHKModular : null}>{prop.title === "" ? "Enter a title..." : prop.title}</h1>
                {presentingProduct?.price && <p>{presentingProduct.price}</p>}
                <p style={{color: prop.textColor}}>{prop.text === "" ? "Write a text..." : prop.text}</p>
            </div>
            <div className={highlightViewStyles.footerArea}>

            </div>

        </div>
    )
}

/*
*  style={{background: "rgba(255,0,0,0.2)"}}
*  style={{background: "rgba(255,255,0,0.2)"}}
*  style={{background: "rgba(255,0,255,0.2)"}}*/