import defaultStyles from "../pages/stylesheet/global.module.css"
import imageSelectionListStyles from "./ImageSelectionList.module.css"
import {useEffect, useState} from "react";
import {getAllImagesByUsage} from "@lib/api";
import {Col, Container, Form, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export default function ImageSelectionList({usage, selectedImage, toggleDialog, host, show}) {

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
        <Modal show={show} onHide={() => toggleDialog()} contentClassName={imageSelectionListStyles.container}>
            <Modal.Header>
                <h2>Select Image</h2>
            </Modal.Header>
            <Container fluid={true} className={imageSelectionListStyles.imageCollections}>
                <Row>
                    <Col xs={1} className={defaultStyles.alignmentCenter}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </Col>
                    <Col xs={11}>
                        <Form.Control className={defaultStyles.filterInputField} onChange={(e) => setFilterImage(e.target.value)} placeholder={"Search image by name"}/>
                    </Col>
                </Row>
                <Row>
                    {
                        images.filter(i => i.designation.toString().toLowerCase().includes(filterImage) && i.active)
                            .map((image, index) => {
                                return (
                                    <Col key={index} xs={4}>
                                        <img src={image.img} className={imageSelectionListStyles.imageObj}/>
                                    </Col>

                                )
                            })
                    }
                </Row>
                <Row>
                    <Col>
                        <button
                            className={`${defaultStyles.buttonFilled} ${defaultStyles.buttonFilledAutoWidth}`}
                            style={{marginLeft: "auto"}}
                            onClick={() => {
                                toggleDialog()
                            }}>
                            Cancel</button>
                    </Col>
                </Row>
            </Container>
        </Modal>
    )
}