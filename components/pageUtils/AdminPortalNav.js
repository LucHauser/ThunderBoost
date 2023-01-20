import adminPortalNavStyles from "./AdminPortalNav.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBox, faBullhorn, faDashboard, faImage, faQuestion, faTags, faUsers} from "@fortawesome/free-solid-svg-icons";

export default function AdminPortalHeader({session, currentPage}) {

    const router = useRouter()

    const pagesInNav = [
        {name: "Dashboard", ico: faDashboard, routerTo: "/"},
        {name: "Product Management", ico: faBox, routerTo: "/productManagement"},
        {name: "Highlights", ico: faBullhorn, routerTo: "/highlights"},
        {name: "Base Data Variety", ico: faTags, routerTo: "/baseDataVariety"},
        {name: "Images Management", ico: faImage, routerTo: "/imagesManagement"},
        {name: "Questions from Client", ico: faQuestion, routerTo: "/clientQuestions"},
        {name: "Users and Privileges", ico: faUsers, routerTo: "/usersAndPrivileges"},
    ]

    function navigateToTargetPath(targetPath) {
        router.push(`/adminPortal${targetPath}`)
    }

    return (
        <div className={adminPortalNavStyles.container}>
            <h1 className={adminPortalNavStyles.mainTitle}>Admin Portal</h1>
            <div className={adminPortalNavStyles.tabWrapper}>
                <ul className={adminPortalNavStyles.nav}>
                    {pagesInNav.map((page, index) => {
                        return (
                            <li 
                                key={index} 
                                className={`${currentPage === index ? adminPortalNavStyles.activeNavElement : null} ${adminPortalNavStyles.navElement}`} 
                                onClick={() => 
                                    navigateToTargetPath(page.routerTo)
                                }>
                                <FontAwesomeIcon icon={page.ico} style={{marginRight: 15}}/>
                                {page.name}
                            </li>
                        )
                    })}
                </ul>
            </div>

            <h2 className={adminPortalNavStyles.currentPageTitle}>{pagesInNav[currentPage].name}</h2>
        </div>
    )
}