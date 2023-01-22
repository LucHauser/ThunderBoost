import {useEffect, useState} from "react";
import {
    addProductToCart,
    getAllCartItemsByParam,
    getCartItemById, getProductById,
    removeProductFromCart,
    updateCartItem
} from "@lib/api";
import {getDiscountPrice, isEventNow, isEventNowWithBoolean} from "@components/Utils";

export default function useShoppingCart(session, host) {

    const [products, setProducts] = useState([])
    const [numbersOfArticles, setNumbersOfArticles] = useState(0)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        setLoggedIn(session.user !== null)
    },[session])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => {
        if (loggedIn) {
            fetchProducts().then(data => setProducts(data))
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
        return await getAllCartItemsByParam(host, `userId=${session.user.id}&_expand=product`)
    }

    async function fetchProductById(id) {
        return await getAllCartItemsByParam(host, `id=${id}&userId=${session.user.id}&_expand=product`)
    }

    const addProduct = (productId, amount) => {
        const getProduct = async (id) => {
            try {
                return await getProductById(host, id)
            } catch (e) {
                console.log(e)
            }
        }
        const article = getProduct(productId)
        const getCartItemByProductId = async (productId) => {
            return await getAllCartItemsByParam(host, `userId=${session.user.id}&productId=${productId}`)
        }
        let existingProduct = products.filter(p => p.productId === productId)
        console.log(existingProduct)
        debugger
        if (getCartItemByProductId(productId).length > 0) {
            const modelToUpdate = existingProduct[0]
            if (parseInt(article.stockAmount) >= modelToUpdate.amount + amount) {
                modelToUpdate.amount += amount
            } else {
                modelToUpdate.amount += parseInt(article.stockAmount) - modelToUpdate.amount
            }
            const updateCart = async (item) => {
                try {
                    await updateCartItem(host, item, session.accessToken)
                } catch (e) {
                    console.log(e)
                }
            }
            updateCart(modelToUpdate)
        } else {
            const model = {
                amount: amount,
                productId: productId,
                userId: session.user.id
            }
            const saveIntoDb = async () => {
                try {
                    await addProductToCart(host, model, session.accessToken)
                } catch (e) {
                    console.log(e)
                }
            }
            saveIntoDb()
        }
        fetchProducts().then(data => setProducts(data))
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
        addProduct, remove, clear, incrementAmount, decrementAmount, numbersOfArticles, getSum, getShippmentPrice, printProd, products, loggedIn
    }
}