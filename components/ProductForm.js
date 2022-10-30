import {useState} from "react";

export default function ProductForm({session, onProductCreated}) {

    function validateProductModel() {
        const errors = {
            name: "",
            price: null,
            servings: null,
            description: "",
            stockAmount: null,
            releaseDate: "",
        }

        let isValid = true

        // TODO Validating Inputs

        return {errors, isValid}
    }

    const defaultProductModel = {
        name: "",
        price: null,
        servings: null,
        usage: "",
        description: "",
        stockAmount: null,
        img: "",
        releaseDate: "",
        active: false
    }

    const [productModel, setProductModel] = useState(defaultProductModel)
    const [errors, setErrors] = useState(null)
    const [loadProduct, setLoadProduct] = useState(false)

    const handleChange = (e) => {
        const tatget = e.target
        const name = e.name
        const value = target.value
        setProductModel({
            ...productModel,
            [name]: value
        })
    }


}