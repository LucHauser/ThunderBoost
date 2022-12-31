import Header from "@components/pageUtils/Header"
import useSession from "@lib/session"
import "./_app.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "@components/pageUtils/Footer";
import {formatServerUrl} from "@components/Utils";
import {useEffect, useState} from "react";

export default function App({ Component, pageProps }) {
    const session = useSession()
    const [host, setHost] = useState("")

    useEffect(() => {
        setHost(formatServerUrl(document.location.hostname))
    }, [])

    const newPageProps = {
        ...pageProps,
        session,
        host
    }

    return (
        <>
            <Header session={session}/>
            <main className="page">
                <Component {...newPageProps} />
            </main>

        </>
    )
}