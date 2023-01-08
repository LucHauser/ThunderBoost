import {useEffect, useState} from "react";
import {addProductToCart, getAllCartItemsByParam} from "@lib/api";

export default function useShoppingCart(session, host) {

    function getCartItems() {

    }

    const [products, setProducts] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        setLoggedIn(session.user !== null)
    },[session])

    useEffect(() => {
        if (loggedIn) {
            fetchProducts()
        } else {
            setProducts([])
        }
    }, [loggedIn])

    async function fetchProducts() {
        const response = await getAllCartItemsByParam(host, `userId=${session.user.id}&_expand=product`)
        setProducts(response)
    }

    const add = (product, amount) => {
        if (products.filter(p => p.productId === product.id)[0] === product.id) {

        } else {
            console.log("HERE")
            const model = {
                amount: amount,
                productId: product.id,
                userId: session.user.id
            }
            const saveIntoDb = async () => {
                const response = await addProductToCart(host, model, session.accessToken)
                response.product = product
                setProducts([...products, response])
            }
            saveIntoDb()
        }
    }

    const remove = (item) => {

    }

    const clear = () => {

    }

    const incrementAmount = (id) => {

    }

    const decrementAmount = (id) => {

    }

    const numbersOfProduct = () => {

    }

    const getSum = () => {

    }

    const printProd = () => {
        console.log(products)
    }

    return {
        add, remove, clear, incrementAmount, decrementAmount, numbersOfProduct, getSum, printProd, products, loggedIn
    }
}