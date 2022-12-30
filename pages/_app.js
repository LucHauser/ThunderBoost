import Header from "@components/pageUtils/Header"
import useSession from "@lib/session"
import "./_app.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "@components/pageUtils/Footer";

export default function App({ Component, pageProps }) {
    const session = useSession()
    const newPageProps = {
        ...pageProps,
        session
    }

    return (
        <>
            <Header session={session}/>
            <main className="page">
                <Component {...newPageProps} />
                <Footer/>
            </main>

        </>
    )
}