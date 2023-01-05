import { useState } from "react"

export function useShoppingCart() {
    const [products, setProducts] = useState([])
    const [isVisible, setIsVisible] = useState(true)

    const add = (product) => {
        setProducts(prevProducts => {
            const index = prevProducts.findIndex(p => p.id === product.id)
            if (index === -1) {
                const newProduct = { ...product, amount: 1 }
                return [...prevProducts, newProduct]
            } else {
                const nextProducts = [...prevProducts]
                const p = nextProducts[index]
                nextProducts[index] = { ...p, amount: p.amount + 1 }
                return nextProducts
            }
        })
    }

    const remove = (product, force = false) => {
        setProducts(prevProducts => {
            const index = products.findIndex(p => p.id === product.id)
            if (index !== -1 && !force) {
                const nextProducts = [...prevProducts]
                const newProduct = { ...product, amount: product.amount - 1 }
                if (newProduct.amount > 0) {
                    nextProducts[index] = newProduct
                }
                return nextProducts
            } else {
                return prevProducts.filter(p => p.id !== product.id)
            }
        })
    }

    const toggle = () => setIsVisible(v => !v)
    const show = () => setIsVisible(true)
    const hide = () => setIsVisible(false)

    return {
        add, remove, toggle, show, hide, isVisible, products
    }
}