import highlightViewStyles from "./HighlightView.module.css"

export default function HighlightView({prop}) {

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
                <img src={"https://via.placeholder.com/400"}/>
            </div>
            <div>
                <h1>{prop.title === "" ? "Enter a title" : prop.title}</h1>
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