import {useEffect, useState} from "react";
import {getAllProductByFilterParameter, getAllProducts} from "@lib/api";
import defaultStyles from "../stylesheet/global.module.css"
import boosterPageStyles from "../stylesheet/boostersPage.module.css"
import ProductArticle from "@components/views/ProductCollectionItem";
import {useRouter} from "next/router";

export default function BoostersPage({session, host}) {

    const [products, setProducts] = useState([])
    const [filterProduct, setFilterProduct] = useState("")
    const [varietyList, setVarietyList] = useState([])
    const [filterVariety, setFilterVariety] = useState({})
    const [filteredProduct, setFilteredProduct] = useState([])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProductByFilterParameter(host, "active=true")
                setProducts(products)
                setFilteredProduct(products)
            } catch (e) {
                console.log(e)
            }
        }
        loadProducts()
    }, [host])

    const router = useRouter()

    return (
        <div className={boosterPageStyles.page}>
            <h1 className={`${defaultStyles.pageTitle} ${boosterPageStyles.pageTitle}`}>All boosters in assortment</h1>
            <div></div>
            <div className={boosterPageStyles.articles}>
                {
                    products.map((article, index) => {
                        return (
                            <div key={index} className={boosterPageStyles.article}>
                                <ProductArticle session={session} product={article} routeToDetail={() => router.push(`./boosters/${article.id}/`)}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}