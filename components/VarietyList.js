import {useEffect, useState} from "react";
import {getAllBaseDataVariety} from "@lib/api";

export default function VarietyList(productHasVarieties) {

    const [varieties, setVarieties] = useState([])
    const varietiesToShow = []

    useEffect(() => {
        const loadData = async () => {
            try {
                const varieties = await getAllBaseDataVariety()
                setVarieties(varieties)
            } catch (e) {
                console.log(e)
            }
        }
        loadData()
    }, [])

    for (let i = 0; i < productHasVarieties.length; i++) {
        for (let v = 0; v < varieties.length; v++) {
            if (productHasVarieties[i].baseDataVarietyId === varieties[v].id) {
                console.log("HERE" + varieties[v])
                varietiesToShow.push(varieties[v].name)
            }
        }
    }

    return (
        <div style={{background: "#FFFF00"}}>
            {varietiesToShow.map(variety => {
                return (
                    <p key={variety}>{variety}</p>
                )
            })}
        </div>
    )
}