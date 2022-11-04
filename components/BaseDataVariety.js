import {useEffect, useState} from "react";
import {getAllBaseDataVariety} from "@lib/api.js"
import {Form, Modal, ModalBody, ModalHeader, Table} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import baseDataVarietyStyles from "./BaseDataVariety.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faMagnifyingGlass, faPlus} from "@fortawesome/free-solid-svg-icons";
import BaseDataVarietyForm from "@components/BaseDataVarietyForm";
import {useRouter} from "next/router";

export default function BaseDataVariety(session) {

    const [varieties, setVarieties] = useState([])
    const [filterVariety, setFilterVariety] = useState("")
    const [varietyToEdit, setVarietyToEdit] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const varieties = await getAllBaseDataVariety()
                setVarieties(varieties)
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [])

    const handleChange = (e) => {
        setFilterVariety(e.target.value)
        console.log(filterVariety)
    }

    // https://stackoverflow.com/questions/69470041/react-adding-search-to-a-table-correct-way for Filter Column
    return (
        <div className={baseDataVarietyStyles.wrapper}>
            <h3 className={baseDataVarietyStyles.title}>Base Data Varieties</h3>
            <p className={baseDataVarietyStyles.information}>Base Data Variety, which use to filter products by Variety. Manage the Base Data or create an new variety, when you publish a new product</p>
            <Table responsive className={defaultStyles.tableContainer}>
                <thead className={defaultStyles.tableHeader}>
                    <tr>
                        <th colSpan={3}>
                            <Form.Control className={baseDataVarietyStyles.filterInput} placeholder={"Filter variety"} onChange={handleChange}/>
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={"1x"} color={"white"}/>
                        </th>
                        <th className={baseDataVarietyStyles.tableAction}>
                            <button className={baseDataVarietyStyles.addBtn} onClick={() => {
                                setVarietyToEdit(null)
                                setShowForm(true)
                            }}><FontAwesomeIcon icon={faPlus} size={"1x"} color={"white"} title={"Add a new variety"} /> Add variety</button>
                        </th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>Designation</th>
                        <th colSpan={2}>Description</th>
                    </tr>
                </thead>
                <tbody className={defaultStyles.tableBody}>
                {
                    varieties.filter(
                        variety => variety.name.toString().toLowerCase().includes(filterVariety) ||
                        variety.description.toString().toLowerCase().includes(filterVariety))
                    .map((variety) => {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <tr key={variety.id}>
                                <td title={"Id: " + variety.id}>{variety.id}</td>
                                <td>{variety.name}</td>
                                <td>{variety.description}</td>
                                <td className={baseDataVarietyStyles.tableAction}>
                                    <button className={baseDataVarietyStyles.editBtn} onClick={() => {
                                        setVarietyToEdit(variety)
                                        setShowForm(true)
                                    }} title={`Edit ${variety.name}`}>
                                        <FontAwesomeIcon icon={faPen} size={"2x"} color={"white"}/>
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>

            </Table>

            <Modal show={showForm} className={baseDataVarietyStyles.formModal} animation={true}>
                    <BaseDataVarietyForm session={session} varietyToEdit={varietyToEdit} toggleModal={() => setShowForm(false)} onVarietyEdited={(variety) => {
                        setVarieties(_varieties => _varieties.map(v => {
                            if (v.id === variety.id) {
                                return variety
                            } else {
                                return v
                            }
                        }))
                    }} onVarietyCreated={(variety) => {
                        setVarieties([...varieties, variety])
                        setFilterVariety("")
                    }}/>
            </Modal>

        </div>
    )
}