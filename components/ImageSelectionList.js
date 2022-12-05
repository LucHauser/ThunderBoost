import defaultStyles from "../pages/stylesheet/global.module.css"
import imageSelectionListStyles from "./ImageSelectionList.module.css"
import {useEffect, useState} from "react";
import {getAllImagesByUsage} from "@lib/api";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export default function ImageSelectionList({usage, selectedImage, toggleDialog}) {

    const [images, setImages] = useState([])
    const [filterImage, setFilterImage] = useState("")

    useEffect(() => {
        if (!usage) return
        const loadImages = async () => {
            try {
                const images = await getAllImagesByUsage(usage)
                setImages(images)
            } catch (e) {
                console.log(e)
            }
        }
        loadImages()
    }, [usage])

    const onChooseImage = (imagePath) => {
        selectedImage(imagePath)
        toggleDialog()
    }

    return (
        <div className={imageSelectionListStyles.container}>
            <h2>Choose image</h2>
            <div className={defaultStyles.formSeparatorLine}/>
            <div className={imageSelectionListStyles.searchFieldGroup}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
                <Form.Control className={imageSelectionListStyles.searchField} onChange={(e) => setFilterImage(e.target.value)} placeholder={"Search image by name"}/>
            </div>
            <div className={imageSelectionListStyles.imageCollections}>
                {
                    images.filter(i => i.designation.toString().toLowerCase().includes(filterImage) && i.active)
                    .map((image, index) => {
                        return (
                            <div
                                key={index} className={imageSelectionListStyles.imageObj}
                                style={{
                                    background: `url(${image.img})`,
                                    backgroundSize: "140px 140px"}} onClick={() => onChooseImage(image.img)}>
                                <p>{image.designation}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <button className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`} style={{marginLeft: "auto"}} onClick={() => toggleDialog()}>Cancel</button>
            </div>

        </div>
    )
}