import {useEffect, useState} from "react";
import {getAllBaseDataVariety} from "@lib/api.js"
import {Table} from "react-bootstrap";

export default function BaseDataVariety(session) {

    const [varieties, setVarieties] = useState([])

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

    return (
        <div>
            <Table>
                <tr>
                    <th>Id</th>
                    <th>Designation</th>
                    <th>Description</th>
                </tr>
                {
                    varieties.map((variety, index) => {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <tr key={index}>
                                <td>{variety.id}</td>
                                <td>{variety.name}</td>
                                <td>{variety.description}</td>
                            </tr>
                        )
                    })
                }
            </Table>
        </div>
    )
}