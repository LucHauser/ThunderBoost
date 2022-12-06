import {useEffect, useState} from "react";
import {getAllBaseDataVariety} from "@lib/api";
import defaultStyles from "../pages/stylesheet/global.module.css"
import varietySelectionListStyles from "./VarietySelectionList.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {Form} from "react-bootstrap";

export default function VarietySelectionList({onEditVarieties, onSelectedVarieties, toggleDialog}) {

    const [selectedVarieties, setSelectedVarieties] = useState([])
    const [choiceVarieties, setChoiceVarieties] = useState([])
    const [filterVariety, setFilterVariety] = useState("")

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const allVarieties = await getAllBaseDataVariety()
                setChoiceVarieties(allVarieties.filter(v => !v.active))
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [])

    return (
        <div className={varietySelectionListStyles.container}>
            <h2>Choose Varieties</h2>
            <div className={defaultStyles.formSeparatorLine}/>
            <div className={varietySelectionListStyles.searchFieldGroup}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
                <Form.Control className={varietySelectionListStyles.searchField} onChange={(e) => setFilterVariety(e.target.value)} placeholder={"Filter variety"}/>
            </div>
            <div>

            </div>
        </div>
    )
}