import {useReducer, useState} from "react";

export default function Sandbox() {

    const initialCount = 0;

    const [count, setCount] = useState(initialCount)

    function increment() {
        setCount(function (prevCount) {
            return (prevCount += 1)
        })
    }

    function decrement() {
        setCount(function (prevCount) {
            if (prevCount > 0) {
                return (prevCount -= 1)
            } else {
                return (prevCount = 0)
            }
        })
    }

    return(
        <>
            <h1>{count}</h1>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </>
    )
}