import defaultStyles from "../../stylesheet/global.module.css"
import imagesManagementStyles from "../../stylesheet/imageManagement.module.css"
import AdminPortalHeader from "@components/AdminPortalNav";
import {useEffect, useState} from "react";
import {editImage, getAllImages} from "@lib/api";
import {Form, Table} from "react-bootstrap";
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
import baseDataVarietyStyles from "../../stylesheet/baseDataVariety.module.css";
import {useRouter} from "next/router";

export default function ImagesManagementPage({session}) {

    const [images, setImages] = useState([])
    const [filteredImages, setFilteredImages] = useState([])
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [previewImage, setPreviewImage] = useState("")

    const router = useRouter()

    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await getAllImages()
                setImages(images)
                setFilteredImages(images)
            } catch (e) {
                console.log(e)
            }
        }
        loadImages()
    }, [])

    const handleImageActivation = async (image) => {
        image.active = !image.active
        try {
            const updatedImage = await editImage(image, session.accessToken)
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
            <AdminPortalHeader session={session} currentPage={4}/>
            <Table responsive className={defaultStyles.tableContainer}>
                <thead className={defaultStyles.tableHeader}>
                <tr>
                    <th colSpan={4}>
                        <Form.Control className={imagesManagementStyles.filterInput} placeholder={"Filter Image"}/>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </th>
                    <th colSpan={2}/>
                    <th className={imagesManagementStyles.buttonCol}>
                        <button className={imagesManagementStyles.addBtn} onClick={() => router.push("./imagesManagement/uploadImage")}>
                            <FontAwesomeIcon icon={faUpload} size={"1x"} color={"white"} title={"Upload new Image"} /> Upload Image
                        </button>
                    </th>
                </tr>
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
                                <td className={imagesManagementStyles.buttonCol}>
                                    <button className={imagesManagementStyles.colBtn} onClick={() => {
                                        setPreviewImage(image.img)
                                        setShowImagePreview(true)
                                    }}>
                                        View Image&nbsp;&nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                    <button className={imagesManagementStyles.colBtn} onClick={() => router.push(`./imageManagement/${image.id}/edit`)}>
                                        Edit&nbsp;&nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faPencil}/>
                                    </button>
                                    <button className={imagesManagementStyles.colBtn} onClick={() => handleImageActivation(image)}>
                                        <button className={imagesManagementStyles.colBtn}>
                                            {
                                                image.active ?
                                                    <FontAwesomeIcon icon={faLockOpen}/>
                                                    : <FontAwesomeIcon icon={faLock}/>
                                            }
                                        </button>
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
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