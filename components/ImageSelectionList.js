import defaultStyles from "../pages/stylesheet/global.module.css"
import imageSelectionListStyles from "./ImageSelectionList.module.css"
import {useEffect, useState} from "react";
import {getAllImagesByUsage} from "@lib/api";
import {Col, Container, Form, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export default function ImageSelectionList({usage, selectedImage, toggleDialog, host}) {

    const [images, setImages] = useState([])
    const [filterImage, setFilterImage] = useState("")

    useEffect(() => {
        if (!usage) return
        const loadImages = async () => {
            try {
                const images = await getAllImagesByUsage(host, usage)
                setImages(images)
            } catch (e) {
                console.log(e)
            }
        }
        loadImages()
    }, [usage, host])

    const onChooseImage = (imagePath) => {
        selectedImage(imagePath)
        toggleDialog()
    }

    return (
        <div className={imageSelectionListStyles.container}>
            <Modal>
                <Container fluid={true}>
                    <Row>
                        <Col>
                            <h2>Choose image</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className={defaultStyles.formSeparatorLine}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </Col>
                        <Col>
                            <Form.Control className={imageSelectionListStyles.searchField} onChange={(e) => setFilterImage(e.target.value)} placeholder={"Search image by name"}/>
                        </Col>
                    </Row>
                    <Row>

                    </Row>
                </Container>
            </Modal>



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