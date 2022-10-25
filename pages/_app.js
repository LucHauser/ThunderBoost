import Header from "@components/Header"
import useSession from "@lib/session"
import "./_app.css"
import {useState} from "react";

export function handleShowHeader() {
    if (showHeader) {
        showHeader = false
    } else {
        showHeader = true
    }
}

let showHeader = true

export default function App({ Component, pageProps }) {
    const session = useSession()
    const newPageProps = {
        ...pageProps,
        session
    }

    return (
        <>
            {showHeader ? <Header session={session}/> : null }
            <main className="page">
                <Component {...newPageProps} />
            </main>
        </>
    )
}