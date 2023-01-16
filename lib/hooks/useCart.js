import {useEffect, useState} from "react";
import {
    addProductToCart,
    getAllCartItemsByParam,
    getCartItemById,
    removeProductFromCart,
    updateCartItem
} from "@lib/api";
import {getDiscountPrice, isEventNow, isEventNowWithBoolean} from "@components/Utils";

export default function useShoppingCart(session, host) {

    function getCartItems() {

    }

    const [products, setProducts] = useState([])
    const [numbersOfArticles, setNumbersOfArticles] = useState(0)
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

    useEffect(() => {
        let sum = 0
        for (let i = 0; i < products.length; i++) {
            sum = sum + products[i].amount
        }
        setNumbersOfArticles(sum)
    }, [products])

    async function fetchProducts() {
        const response = await getAllCartItemsByParam(host, `userId=${session.user.id}&_expand=product`)
        setProducts(response)
    }

    async function fetchProductById(id) {
        return await getAllCartItemsByParam(host, `id=${id}&userId=${session.user.id}&_expand=product`)
    }

    const add = (product, amount) => {
        if (products.filter(p => p.productId === product.id).length === 1) {
            const updateCart = async () => {
                try {
                    const modelToUpdate = await getAllCartItemsByParam(host, `productId=${product.id}&userId=${session.user.id}`)
                    if (parseInt(product.stockAmount) >= modelToUpdate.amount + amount) {
                        modelToUpdate.amount += amount
                    } else {
                        modelToUpdate.amount += parseInt(product.stockAmount) - modelToUpdate.amount
                    }
                    const updated = await updateCartItem(host, modelToUpdate, session.accessToken)
                    updated.product = product
                    setProducts(products => {
                        return products.map(p => {
                            if (p.id === updated.id) {
                                return {...p, ...updated}
                            } else {
                                return p
                            }
                        })
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            updateCart()
        } else {
            const model = {
                amount: amount,
                productId: product.id,
                userId: session.user.id
            }
            const saveIntoDb = async () => {
                try {
                    const response = await addProductToCart(host, model, session.accessToken)
                    response.product = product
                    setProducts([...products, response])
                } catch (e) {
                    console.log(e)
                }
            }
            saveIntoDb()
        }
    }

    const remove = async (id) => {
        if (!id) return
        try {
            await removeProductFromCart(host, id, session.accessToken)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (e) {
            console.log(e)
        }
    }

    const clear = async () => {
        if (products.length === 0) return
        for (let i = 0; i < products.length; i++) {
            await removeProductFromCart(host, products[i].id, session.accessToken)
        }
        setProducts([])
    }

    const incrementAmount = async (id) => {
        try {
            const cartItem = await getCartItemById(host, id)
            cartItem.amount = cartItem.amount + 1
            await updateCart(cartItem)
        } catch (e) {
            console.log(e)
        }
    }

    const decrementAmount = async (id) => {
        try {
            const cartItem = await getCartItemById(host, id)
            cartItem.amount = cartItem.amount - 1
            await updateCart(cartItem)
        } catch (e) {
            console.log(e)
        }
    }

    const updateCart = async (item) => {
        try {
            await updateCartItem(host, item, session.accessToken)
            let afterUpdated = await getAllCartItemsByParam(host, `id=${item.id}&_expand=product`)
            afterUpdated = afterUpdated[0]
            setProducts(products => {
                return products.map(p => {
                    if (p.id === afterUpdated?.id) {
                        return {...p, ...afterUpdated}
                    } else {
                        return p
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    const getSum = () => {
        let sum = 0
        for (let i = 0; i < products.length ; i++) {
            sum += products[i].amount * (isEventNow(products[i].product.discountFrom, products[i].product.discountUntil) && products[i].product.active ? getDiscountPrice(products[i].product.price, products[i].product.discountPercent) : products[i].product.price)
        }
        return sum
    }

    const getShippmentPrice = () => {
        let subTotal = getSum()
        if (subTotal < 50) {
            return 5
        }
        return 0
    }

    const printProd = () => {
        console.log(products)
    }

    return {
        add, remove, clear, incrementAmount, decrementAmount, numbersOfArticles, getSum, getShippmentPrice, printProd, products, loggedIn
    }
}