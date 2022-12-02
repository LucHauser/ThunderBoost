import adminPortalNavStyles from "./AdminPortalNav.module.css"
import {useRouter} from "next/router";

export default function AdminPortalHeader({session, currentPage}) {

    const router = useRouter()

    const pagesInNav = [
        {name: "Dashboard", routerTo: "/"},
        {name: "Product Management", routerTo: "/productManagement"},
        {name: "Highlights", routerTo: "/highlights"},
        {name: "Base Data Variety", routerTo: "/baseDataVariety"},
        {name: "Questions from Client", routerTo: "/clientQuestions"},
        {name: "Users and Privileges", routerTo: "/usersAndPrivileges"},
    ]

    function navigateToTargetPath(targetPath) {
        router.push(`/adminPortal${targetPath}`)
    }

    return (
        <div className={adminPortalNavStyles.container}>
            <h1 className={adminPortalNavStyles.mainTitle}>Admin Portal</h1>
            <div className={adminPortalNavStyles.nav}>
                {pagesInNav.map((page, index) => {
                    return (
                        <div key={index} className={`${currentPage === index ? adminPortalNavStyles.activeNavElement : null} ${adminPortalNavStyles.navElement}`} onClick={() => navigateToTargetPath(page.routerTo)}>{page.name}</div>
                    )
                })}
            </div>
            <h2 className={adminPortalNavStyles.currentPageTitle}>{pagesInNav[currentPage].name}</h2>
        </div>
    )
}