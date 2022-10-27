import Header from "@components/Header"
import useSession from "@lib/session"
import "./_app.css"

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
            </main>
        </>
    )
}