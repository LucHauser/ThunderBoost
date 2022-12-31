import defaultStyles from "../../stylesheet/global.module.css"
import imagesManagementStyles from "../../stylesheet/imageManagement.module.css"
import AdminPortalHeader from "@components/pageUtils/AdminPortalNav";
import {useEffect, useState} from "react";
import {editImage, getAllImages} from "@lib/api";
import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEye, faLock, faLockOpen,
    faMagnifyingGlass,
    faPencil,
    faPlus,
    faUpload, faX,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export default function ImagesManagementPage({session, host}) {

    const [images, setImages] = useState([])
    const [filteredImages, setFilteredImages] = useState([])
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [previewImage, setPreviewImage] = useState("")

    const router = useRouter()

    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await getAllImages(host)
                setImages(images)
                setFilteredImages(images)
            } catch (e) {
                console.log(e)
            }
        }
        loadImages()
    }, [host])

    const handleImageActivation = async (image) => {
        image.active = !image.active
        try {
            const updatedImage = await editImage(host, image, session.accessToken)
            setImages(images => {
                return (images.map(i => {
                    if (i.id === updatedImage.id) {
                        return {...i, ...updatedImage}
                    } else {
                        return i
                    }
                }))
            })
        } catch (e) {
            console.log(e)
        }
    }

    const closeFullPicMode = () => {
        setShowImagePreview(false)
        setPreviewImage("")
    }

    return (
        <div className={defaultStyles.adminPageWrapper}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col>
                        <AdminPortalHeader session={session} currentPage={4}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={defaultStyles.filterActionBar}>
                            <div className={defaultStyles.filterGroup}>
                                <div className={defaultStyles.formGroupHorizontal}>
                                    <Form.Control className={defaultStyles.filterInputField} placeholder={"Filter Image"}/>
                                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                </div>
                            </div>
                            <button className={defaultStyles.createBtn} onClick={() => router.push("./imagesManagement/uploadImage")}>
                                <FontAwesomeIcon icon={faUpload} size={"1x"} color={"white"} title={"Upload new Image"} /> Upload Image
                            </button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive className={defaultStyles.tableContainer}>
                            <thead className={defaultStyles.tableHeader}>
                            <tr>
                                <th>#</th>
                                <th>Designation</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Usage</th>
                                <th colSpan={2}>Active</th>
                            </tr>
                            </thead>
                            <tbody className={defaultStyles.tableBody}>
                            {
                                images.map((image, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{image.id}</td>
                                            <td>{image.designation}</td>
                                            <td>.{image.fileType}</td>
                                            <td>{image.description}</td>
                                            <td>{image.usage}</td>
                                            <td>
                                                {
                                                    image.active ?
                                                        <FontAwesomeIcon icon={faCheck} color={"white"}/>
                                                        : <FontAwesomeIcon icon={faXmark} color={"white"}/>
                                                }
                                            </td>
                                            <td>
                                                <div className={defaultStyles.tableRowActions}>
                                                    <button className={defaultStyles.tblRowBtn} onClick={() => {
                                                        setPreviewImage(image.img)
                                                        setShowImagePreview(true)
                                                    }}>
                                                        <FontAwesomeIcon icon={faEye}/>
                                                    </button>
                                                    <button className={defaultStyles.tblRowBtn} onClick={() => router.push(`./imageManagement/${image.id}/edit`)}>
                                                        <FontAwesomeIcon icon={faPencil}/>
                                                    </button>
                                                    <button className={defaultStyles.tblRowBtn} onClick={() => handleImageActivation(image)}>
                                                        {
                                                            image.active ?
                                                                <FontAwesomeIcon icon={faLockOpen}/>
                                                                : <FontAwesomeIcon icon={faLock}/>
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>


            {
                showImagePreview ?
                    <div className={imagesManagementStyles.imagePreview} onClick={() => closeFullPicMode()}>
                        <img alt src={previewImage} style={{maxWidth: 1000}}/>
                        <button className={`${imagesManagementStyles.closeButtonImagePreview}`} onClick={() => closeFullPicMode()}>
                            <FontAwesomeIcon icon={faX} color={"white"} size={"2xl"}/>
                        </button>
                    </div> : null
            }
        </div>
    )
}