import {useEffect, useState} from "react";
import {getAllBaseDataVariety} from "@lib/api.js"
import {Form, Table} from "react-bootstrap";
import defaultStyles from "../pages/stylesheet/global.module.css"
import baseDataVarietyStyles from "./BaseDataVariety.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export default function BaseDataVariety(session) {

    const [varieties, setVarieties] = useState([])
    const [filterVariety, setFilterVariety] = useState("")

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


    // https://stackoverflow.com/questions/69470041/react-adding-search-to-a-table-correct-way for Filter Column
    return (
        <div className={baseDataVarietyStyles.wrapper}>
            <h3 className={baseDataVarietyStyles.title}>Base Data Varieties</h3>
            <p className={baseDataVarietyStyles.information}>Base Data Variety, which use to filter products by Variety. Manage the Base Data or create an new variety, when you publish a new product</p>
            <Table responsive className={defaultStyles.tableContainer}>
                <thead className={defaultStyles.tableHeader}>
                    <tr>
                        <th colSpan={4}>
                            <Form.Control className={baseDataVarietyStyles.filterInput} placeholder={"Filter variety"} onChange={() => setFilterVariety(this.target.value)}/>
                            <FontAwesomeIcon icon={faMagnifyingGlass} size={"1x"} color={"white"}/>
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
                    varieties.filter((row) => {
                        !filterVariety.length || row.name
                            .toString()
                            .toLowerCase()
                            .includes(filterVariety.toString().toLowerCase())
                    })
                    .map((variety) => {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <tr key={variety.id}>
                                <td title={"Id: " + variety.id}>{variety.id}</td>
                                <td>{variety.name}</td>
                                <td>{variety.description}</td>
                                <td className={baseDataVarietyStyles.tableAction}>
                                    <button className={baseDataVarietyStyles.editBtn}><FontAwesomeIcon icon={faPen} size={"2x"} color={"white"}/></button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </div>
    )
}