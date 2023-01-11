import useSession from "@lib/hooks/session"
import "./_app.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "@components/pageUtils/Footer";
import {formatServerUrl} from "@components/Utils";
import {useEffect, useState} from "react";
import useShoppingCart from "@lib/hooks/useCart";
import Navigation from "@components/pageUtils/Navbar";

export default function App({ Component, pageProps }) {
    const session = useSession()
    const [host, setHost] = useState("")

    useEffect(() => {
        setHost(formatServerUrl(document.location.hostname))
    }, [])

    const shoppingCart = useShoppingCart(session, host)

    const newPageProps = {
        ...pageProps,
        session,
        host,
        shoppingCart
    }

    return (
        <>
            <Navigation shoppingCart={shoppingCart} session={session}/>
            <main className="page">
                <Component {...newPageProps} />
            </main>
            <Footer/>
        </>
    )
}