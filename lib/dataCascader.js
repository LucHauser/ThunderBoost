import {getAllProducts} from "@lib/api";


export async function checkVarietyToProductBeforeDelete(variety) {
    const products = await getAllProducts()
    console.log("Variety From Parameter: " + variety)
    let result = false
    for (let i = 0; i < products.length; i++) {
        for (let v = 0; v < products[i].varieties.length; v++) {
            console.log(products[i].varieties[v])
            if (products[i].varieties[v] === variety) {
                result = true
            }
        }
    }
    return result
}