import {useEffect, useState} from "react";
import {getAllBaseDataVariety} from "@lib/api";
import defaultStyles from "../pages/stylesheet/global.module.css"
import varietySelectionListStyles from "./VarietySelectionList.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faX} from "@fortawesome/free-solid-svg-icons";
import {Form} from "react-bootstrap";
import BaseDataVarietyForm from "@components/BaseDataVarietyForm";

export default function VarietySelectionList({session, onEditVarieties, onSelectedVarieties, toggleDialog}) {

    const [selectedVarieties, setSelectedVarieties] = useState([])
    const [choiceVarieties, setChoiceVarieties] = useState([])
    const [filterVariety, setFilterVariety] = useState("")
    const [showVarietyForm, setShowVarietyForm] = useState(false)

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const allVarieties = await getAllBaseDataVariety()
                const allActiveVarieties = allVarieties.filter(v => v.active)
                let allNames = allActiveVarieties.map(v => v.name)
                if (onEditVarieties.length > 0) {
                    for (let i = 0; i < onEditVarieties.length; i++) {
                        allNames = allNames.filter(n => n !== onEditVarieties[i])
                    }
                    setSelectedVarieties(onEditVarieties)
                }
                setChoiceVarieties(allNames)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [])


    function selectVariety(name){
        if (!selectedVarieties.includes(name)) {
            setSelectedVarieties(selectedVarieties => [...selectedVarieties, name])
            setChoiceVarieties(choiceVarieties.filter(v => v !== name))
        }
    }

    const deselectVariety = name => {
        if (!choiceVarieties.includes(name)) {
            setChoiceVarieties(choiceVarieties => [...choiceVarieties, name])
            setSelectedVarieties(selectedVarieties.filter(sel => sel !== name))
        }
    }

    const saveVarietiesToModel = () => {
        onSelectedVarieties(selectedVarieties)
        toggleDialog()
    }

    return (
        <div className={varietySelectionListStyles.container}>
            <div>
                <h2>Choose Varieties</h2>
                <div className={defaultStyles.formSeparatorLine} style={{marginBottom: 0}}/>
                {
                    selectedVarieties.length > 0 ?
                        <>
                            <h3 style={{marginTop: 15}}>Selected</h3>
                            <div className={`${varietySelectionListStyles.varietiesCollections} ${varietySelectionListStyles.selectedVarieties}`}>

                                {
                                    selectedVarieties.map((sel, index) => {
                                        return (
                                            <p key={index} className={varietySelectionListStyles.selectionOption}>{sel}
                                                <FontAwesomeIcon icon={faX} size={"1xs"} onClick={() => deselectVariety(sel)} className={varietySelectionListStyles.removeBtn}/>
                                            </p>
                                        )
                                    })
                                }
                            </div>
                        </>:
                        null
                }
                {
                    !showVarietyForm ?
                        <>
                            <h3 style={{marginTop: 15}}>All Varieties</h3>
                            <div className={varietySelectionListStyles.searchFieldGroup}>
                                <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                <Form.Control className={varietySelectionListStyles.searchField} onChange={(e) => setFilterVariety(e.target.value)} placeholder={"Filter variety"}/>
                            </div>
                            <div className={varietySelectionListStyles.varietiesCollections}>
                                {
                                    choiceVarieties.filter(v => v.toString().includes(filterVariety))
                                        .sort()
                                        .map((variety, index) => {
                                            return (
                                                <p className={varietySelectionListStyles.selectionOption} onClick={() => selectVariety(variety)} key={index}>{variety}</p>
                                            )
                                        })
                                }
                                <button onClick={() => setShowVarietyForm(true)} className={`${varietySelectionListStyles.createVarietyBtn}`}>+ add new variety</button>
                            </div>
                        </> :
                        <>
                            <h3 style={{marginTop: 15}}>Add Variety to choice</h3>
                            <div className={varietySelectionListStyles.varietyForm}>
                                <BaseDataVarietyForm session={session} toggleForm={() => setShowVarietyForm(false)} disableRouting={true} onVarietyCreated={(variety) => setChoiceVarieties(choiceVarieties => [...choiceVarieties, variety])} smallInputs={true}/>
                            </div>
                        </>


                }
            </div>
            <div className={varietySelectionListStyles.buttonGroup}>
                <button onClick={() => saveVarietiesToModel()} className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}>Finish</button>
                <button
                    className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonTransparent} ${defaultStyles.buttonFilledAutoWidth}`}
                    onClick={() => toggleDialog()}>Cancel</button>
            </div>
        </div>
    )
}