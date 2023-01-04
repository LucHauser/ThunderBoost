import {getAllBaseDataVariety, updateBaseDataVariety} from "@lib/api";
import {useEffect, useState} from "react";

export function actualizeVarietyListAfterCreatedProduct(session, host, varieties, allVarieties) {
    let targetVarietyToEdit
    for (let i = 0; i < varieties.length; i++) {
        targetVarietyToEdit = allVarieties.filter(v => v.name === varieties[i])[0]
        targetVarietyToEdit.numbersIncludedProducts++
        updateVariety(session, host, targetVarietyToEdit)
    }
}

export function actualizeVarietyListAfterEditedProduct(session, host, previousVarieties, updatedVarieties, allVarieties) {
    let targetVarietyToEdit
    let missingVarieties = []
    let newVarieties = []
    for (let i = 0; i < previousVarieties.length; i++) {
        if (!updatedVarieties.includes(previousVarieties[i])) {
            missingVarieties.push(previousVarieties[i])
        }
    }
    for (let i = 0; i < updatedVarieties.length; i++) {
        if (!previousVarieties.includes(updatedVarieties[i])) {
            newVarieties.push(updatedVarieties[i])
        }
    }
    if (missingVarieties.length > 0) {
        for (let i = 0; i < missingVarieties.length; i++) {
            targetVarietyToEdit = allVarieties.filter(v => v.name === missingVarieties[i])[0]
            targetVarietyToEdit.numbersIncludedProducts--
            updateVariety(session, host, targetVarietyToEdit)
        }
    }
    if (newVarieties.length > 0) {
        for (let i = 0; i < newVarieties.length; i++) {
            targetVarietyToEdit = allVarieties.filter(v => v.name === newVarieties[i])[0]
            targetVarietyToEdit.numbersIncludedProducts++
            updateVariety(session, host, targetVarietyToEdit)
        }
    }
}

export function actualizeVarietyListAfterDeleteProduct(session, host, targetVarieties, allVarieties) {
    let targetVarietyToEdit
    for (let i = 0; i < targetVarieties.length; i++) {
        targetVarietyToEdit = allVarieties.filter(v => v.name === targetVarieties[i])[0]
        targetVarietyToEdit.numbersIncludedProducts++
        updateVariety(session, host, targetVarietyToEdit)
    }
}



async function updateVariety(session, host, variety) {
    try {
        await updateBaseDataVariety(host, variety, session.accessToken)
    } catch (e) {
        console.log("ici")
        console.log(e)
    }
}