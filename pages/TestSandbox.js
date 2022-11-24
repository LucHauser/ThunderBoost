import {useEffect, useReducer, useState} from "react";

export default function Sandbox() {

    const initialCount = 0;

    const [count, setCount] = useState(initialCount)
    const [input, setInput] = useState("")

    function increment() {
        setCount(function (prevCount) {
            return (prevCount += 1)
        })
    }

    function OutputInComp({prop}) {

        return (
            <p style={{color: "#FF00FF"}}>{prop}</p>
        )
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
            <hr/>
            <input onChange={e => setInput(e.target.value)}/>
            <p style={{color: "#FFFFFF"}}>{input}</p>
            <OutputInComp prop={input}/>
        </>
    )
}