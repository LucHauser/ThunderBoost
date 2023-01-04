import {getAllBaseDataVariety} from "@lib/api";
import {useState} from "react";

export function getListOfVarietyUsageFromProducts(products) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [varieties, setVarieties] = useState([])
    const loadVarieties = async () => {
        const allVarieties = await getAllBaseDataVariety()
        setVarieties(allVarieties)
    }
    loadVarieties()
    let listToFilter = []
    for (let i = 0; i < products.length; i++) {
        if (products[i].varieties) {
            for (let v = 0; v < products[i].length; v++) {
                
            }
        }
    }
}