import loginStyles from "./LoginRegisterForm.module.css";
import defaultStyle from "../../pages/stylesheet/global.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faExclamation} from "@fortawesome/free-solid-svg-icons";
import {Form} from "react-bootstrap";
import {useState} from "react";
import {useRouter} from "next/router";
import {register} from "@lib/api";

function validateRegister(register, checkedAgree) {
    const errors = {
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        repeatPassword: "",
        notChecked: ""
    }

    let isValid = true

    if (register.firstName.trim().length === 0) {
        errors.firstName = "First name is required"
        isValid = false
    }
    if (register.lastName.trim().length === 0) {
        errors.lastName = "Last name is required"
        isValid = false
    }
    if (register.email.trim().length === 0) {
        errors.email = "Email-Adress is required"
        isValid = false
    }
    if (!register.email.includes("@")) {
        errors.email = "Email-Address is invalid"
        isValid = false
    }
    if (register.username.trim().length === 0) {
        errors.username = "Username is required"
        isValid = false
    }
    if (register.password.trim().length === 0) {
        errors.password = "Password is required"
        isValid = false
    }
    if (register.password.length < 8) {
        errors.password = "Password must have 8 characters or more"
        isValid = false
    }
    if (register.repeatPassword.trim().length === 0) {
        errors.repeatPassword = "Please repeat the above Password"
        isValid = false
    }
    if (!register.repeatPassword === register.password) {
        errors.repeatPassword = "The repeated password does not match"
        isValid = false
    }
    if (!checkedAgree) {
        errors.notChecked = "Please accept the Terms & Conditions"
        isValid = false
    }
    return {errors, isValid}
}

export default function RegisterForm({session}) {

    const defaultRegisterModel = {
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        repeatPassword: "",
    }

    const DEFAULT_USER_ROLE = 3

    const [registerModel, setRegisterModel] = useState(defaultRegisterModel)

    const [registerErrors, setRegisterErrors] = useState(defaultRegisterModel)
    const [isLoading, setIsLoading] = useState(false)
    const [checkedAgree, setCheckedAgree] = useState(false)
    const router = useRouter()

    const handleRegisterChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setRegisterModel({
            ...registerModel,
            [name]: value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setRegisterErrors(defaultRegisterModel)
        const res = validateRegister(registerModel, checkedAgree)
        if (!res.isValid) {
            setRegisterErrors(res.errors)
            setIsLoading(false)
            return
        }
        try {
            const now = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
            const response = await register(registerModel.title,
                registerModel.firstName,
                registerModel.lastName,
                registerModel.email,
                registerModel.username,
                now,
                DEFAULT_USER_ROLE,
                registerModel.password)
            await session.login(response)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Form onSubmit={handleRegister} className={loginStyles.formContainer}>
                <h2 className={defaultStyle.formTitle}>Create an account</h2>
                <div className={defaultStyle.formSeparatorLine}/>
                <ul className={loginStyles.userBenefitsContainer}>
                    <li><FontAwesomeIcon icon={faCheck} color="white"/><p>Add Products to cart</p></li>
                    <li><FontAwesomeIcon icon={faCheck} color="white"/><p>Leave a review of a product</p></li>
                    <li><FontAwesomeIcon icon={faCheck} color="white"/><p>View orders and backorders</p></li>
                    <li><FontAwesomeIcon icon={faCheck} color="white"/><p>Register as a new customer</p></li>
                </ul>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>Title</Form.Label>
                    <Form.Select className={defaultStyle.formInputField} name="title" onChange={handleRegisterChange}>
                        <option disabled={true} value="">Choose title</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>First name</Form.Label>
                    <Form.Control className={`${defaultStyle.formInputField} ${registerErrors.firstName && defaultStyle.formInputError}`} type="text" name="firstName" placeholder="Enter your first name" onChange={handleRegisterChange}/>
                    {registerErrors.firstName && <p>{registerErrors.firstName}</p>}
                </Form.Group>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>Last name</Form.Label>
                    <Form.Control className={`${defaultStyle.formInputField} ${registerErrors.lastName && defaultStyle.formInputError}`} type="text" name="lastName" placeholder="Enter your last name" onChange={handleRegisterChange}/>
                    {registerErrors.lastName && <p>{registerErrors.lastName}</p>}
                </Form.Group>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>Email-Address</Form.Label>
                    <Form.Control className={`${defaultStyle.formInputField} ${registerErrors.email && defaultStyle.formInputError}`} type="text" name="email" placeholder="Enter your email-address" onChange={handleRegisterChange}/>
                    {registerErrors.email && <p>{registerErrors.email}</p>}
                </Form.Group>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>Username</Form.Label>
                    <Form.Control className={`${defaultStyle.formInputField} ${registerErrors.username && defaultStyle.formInputError}`} type="text" name="username" placeholder="Enter your new username" onChange={handleRegisterChange}/>
                    {registerErrors.username && <p>{registerErrors.username}</p>}
                </Form.Group>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>Password</Form.Label>
                    <Form.Control className={`${defaultStyle.formInputField} ${registerErrors.password && defaultStyle.formInputError}`} type="password" name="password" placeholder="Enter your new password" onChange={handleRegisterChange}/>
                    {registerErrors.password && <p>{registerErrors.password}</p>}
                </Form.Group>
                <Form.Group className={defaultStyle.formGroup}>
                    <Form.Label className={defaultStyle.formLabel}>Repeat Password</Form.Label>
                    <Form.Control className={`${defaultStyle.formInputField} ${registerErrors.repeatPassword && defaultStyle.formInputError}`} type="password" name="repeatPassword" placeholder="Repeat your new password" onChange={handleRegisterChange}/>
                    {registerErrors.repeatPassword && <p>{registerErrors.repeatPassword}</p>}
                </Form.Group>
                <Form.Group className={`${defaultStyle.formGroup}`}>
                    <div className={loginStyles.formGroupTerms}>
                        <Form.Control className={defaultStyle.formCheckbox} type="checkbox" name="agreedTerms" onChange={(e) => setCheckedAgree(e.target.checked)}/>
                        <Form.Label className={defaultStyle.formLabel}>I have read and agree to the<br/> <a>Terms & Conditions</a> & <a>Privacy Policy</a><br/> of this online store</Form.Label>
                    </div>
                    {registerErrors.notChecked && <p>{registerErrors.notChecked}</p>}
                </Form.Group>
                <button className={defaultStyle.buttonFilled} type="submit">Register</button>
            </Form>
        </>
    )
}