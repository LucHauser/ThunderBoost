import {useEffect, useState} from "react";
import {addProductToCart, getAllCartItemsByParam} from "@lib/api";
import {getDiscountPrice, isEventNowWithBoolean} from "@components/Utils";

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

    const numbersOfArticles = () => {
        return products.length
    }

    const getSum = () => {
        let sum = 0
        for (let i = 0; i < products.length ; i++) {
            sum += products[i].amount * (isEventNowWithBoolean(products[i].product.discountFrom, products[i].product.discountUntil, products[i].product.discountActive) ? getDiscountPrice(products[i].product.price) : products[i].product.discountPercent)
        }
        return sum
    }

    const printProd = () => {
        console.log(products)
    }

    return {
        add, remove, clear, incrementAmount, decrementAmount, numbersOfArticles, getSum, printProd, products, loggedIn
    }
}