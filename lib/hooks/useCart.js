import {useEffect, useState} from "react";
import {getAllCartItemsByParam} from "@lib/api";

export default function useShoppingCart(session, host) {

    function getCartItems() {

    }

    const [products, setProducts] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        setLoggedIn(session.user !== null)
    },[session])



    const add = (product, amount) => {

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

    return {
        add, remove, clear, incrementAmount, decrementAmount, numbersOfProduct, getSum, products, loggedIn
    }
}