import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getProductById} from "@lib/api";

export default function ProductDiscountManager({session}) {

    const router = useRouter()
    const {id} = router.query

    const [product, setProduct] = useState()

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const product = await getProductById(id)
                setProduct(product)
            } catch (e) {
                console.log(e)
            }
        }
        loadProduct()
    }, [id])
}