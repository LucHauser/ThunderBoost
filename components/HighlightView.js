import {useEffect, useState} from "react";

export default function HighlightView(prop) {

    const [requisite, setRequisite] = useState({})

    useEffect(() => {
        setRequisite(prop)
    }, [prop])

    return (
        <div>
            <p>Test</p>
            <p>{prop.title}</p>
            <p>{prop.text}</p>
            <p style={{color: prop.primaryBackgroundColor}}>Prim Color</p>
            <p style={{color: prop.secondaryBackgroundColor}}>Secondary Color</p>
        </div>
    )
}