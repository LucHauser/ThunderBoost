import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Form} from "react-bootstrap";
import {faCheck, faExclamation} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import loginStyle from "./stylesheet/login.module.css"
import defaultStyle from "./stylesheet/global.module.css"
import {login, register} from "@lib/api";
import {useRedirectToHome} from "@lib/session";

function validateLogin(login) {

    const errors = {
        email: "",
        password: ""
    }

    let isValid = true

    if (login.email.trim().length === 0) {
        errors.email = "Email is required"
        isValid = false
    }
    if (!login.email.includes('@')) {
        errors.email = "Invalid Email"
        isValid = false
    }
    if (login.password.trim().length === 0) {
        errors.password = "Password is required"
        isValid = false
    }
    return { errors, isValid }
}

function validateRegister(register) {
    const errors = {
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        repeatPassword: "",
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
    return {errors, isValid}
}

export default function LoginPage({session}) {

    useRedirectToHome(session)

    const defaultLoginModel = {
        email: "",
        password: "",
    }

    const defaultRegisterModel = {
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        repeatPassword: "",
    }

    const [loginModel, setLoginModel] = useState(defaultLoginModel)
    const [registerModel, setRegisterModel] = useState(defaultRegisterModel)
    const [loginErrors, setLoginErrors] = useState(defaultLoginModel)
    const [registerErrors, setRegisterErrors] = useState(defaultRegisterModel)
    const [isLoading, setIsLoading] = useState(false)
    const [checkedAgree, setCheckedAgree] = useState(false)
    const [notChecked, setNotChecked] = useState("")
    const router = useRouter()

    useEffect(() => {
        document.title = "Thunderboost - Login"
    }, [])

    const handleLoginChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setLoginModel({
            ...loginModel,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        // debugger
        setIsLoading(true)
        setLoginErrors(defaultLoginModel)
        const res = validateLogin(loginModel)
        if (!res.isValid) {
            setLoginErrors(res.errors)
            setIsLoading(false)
            return
        } try {
            const response = await login(loginModel.email, loginModel.password)
            await session.login(response)
            router.push("/")
        } catch (e) {
            setLoginErrors({
                ...loginErrors,
                login: "Login failed - Try again"
            })
        }
    }

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
        const res = validateRegister(registerModel)
        if (!res.isValid) {
            setRegisterErrors(res.errors)
            setIsLoading(false)
            return
        } else if (!checkedAgree) {
            setNotChecked("Please check")
            setIsLoading(false)
            return
        } else {
            setNotChecked("")
        }

        try {
            const now = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
            const response = await register(registerModel.title,
                registerModel.firstName,
                registerModel.lastName,
                registerModel.email,
                registerModel.username,
                now,
                registerModel.password)
            await session.login(response)
        } catch (e) {
            console.log(e)
        }
    }

    const handleCheckAgree = () => {
        setCheckedAgree(!checkedAgree)
        console.log(checkedAgree)
    }

    return(
        <div className={loginStyle.loginPage}>
            <h1 className={defaultStyle.pageTitle}>Login or create an account</h1>
            <div className={loginStyle.formsContainer}>
                <Form className={loginStyle.formContainer} onSubmit={handleLogin}>
                    <h2 className={defaultStyle.formTitle}>Login</h2>
                    <div className={defaultStyle.formSeparatorLine}/>
                    { loginErrors.login && <div className={loginStyle.errorText}>
                        <FontAwesomeIcon icon={faExclamation} className={loginStyle.faExclamation}/>{loginErrors.login}</div>
                    }
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Email-Address</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="text" name="email" onChange={handleLoginChange} placeholder="Enter your Email-Address"/>
                        {loginErrors.email && <p>{loginErrors.email}</p>}
                    </Form.Group>
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Password</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="password" name="password" onChange={handleLoginChange} placeholder="Enter your password"/>
                        {loginErrors.password && <p>{loginErrors.password}</p>}
                    </Form.Group>
                    <button className={defaultStyle.buttonFilled} type="submit">Login</button>
                </Form>

                <Form onSubmit={handleRegister} className={loginStyle.formContainer}>
                    <h2 className={defaultStyle.formTitle}>Create an account</h2>
                    <div className={defaultStyle.formSeparatorLine}/>
                    <ul className={loginStyle.userBenefitsContainer}>
                        <li><FontAwesomeIcon icon={faCheck} color="white"/> Add Products to cart</li>
                        <li><FontAwesomeIcon icon={faCheck} color="white"/> Leave a review of a product</li>
                        <li><FontAwesomeIcon icon={faCheck} color="white"/> View orders and backorders</li>
                        <li><FontAwesomeIcon icon={faCheck} color="white"/> Register as a new customer</li>
                    </ul>
                    {notChecked && <div className={loginStyle.errorText}>
                        <FontAwesomeIcon icon={faExclamation} className={loginStyle.faExclamation}/>{notChecked}</div>
                    }
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
                        <Form.Control className={defaultStyle.formInputField} type="text" name="firstName" placeholder="Enter your first name" onChange={handleRegisterChange}/>
                        {registerErrors.firstName && <p>{registerErrors.firstName}</p>}
                    </Form.Group>
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Last name</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="text" name="lastName" placeholder="Enter your last name" onChange={handleRegisterChange}/>
                        {registerErrors.lastName && <p>{registerErrors.lastName}</p>}
                    </Form.Group>
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Email-Address</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="text" name="email" placeholder="Enter your email-address" onChange={handleRegisterChange}/>
                        {registerErrors.email && <p>{registerErrors.email}</p>}
                    </Form.Group>
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Username</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="text" name="username" placeholder="Enter your new username" onChange={handleRegisterChange}/>
                        {registerErrors.username && <p>{registerErrors.username}</p>}
                    </Form.Group>
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Password</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="password" name="password" placeholder="Enter your new password" onChange={handleRegisterChange}/>
                        {registerErrors.password && <p>{registerErrors.password}</p>}
                    </Form.Group>
                    <Form.Group className={defaultStyle.formGroup}>
                        <Form.Label className={defaultStyle.formLabel}>Repeat Password</Form.Label>
                        <Form.Control className={defaultStyle.formInputField} type="password" name="repeatPassword" placeholder="Repeat your new password" onChange={handleRegisterChange}/>
                        {registerErrors.repeatPassword && <p>{registerErrors.repeatPassword}</p>}
                    </Form.Group>
                    <Form.Group className={`${defaultStyle.formGroup} ${loginStyle.formGroupTerms}`}>
                        <Form.Control className={defaultStyle.formCheckbox} type="checkbox" name="agreedTerms" onChange={handleCheckAgree}/>
                        <Form.Label className={defaultStyle.formLabel}>I have read and agree to the<br/> <a>Terms & Conditions</a> & <a>Privacy Policy</a><br/> of this online store</Form.Label>
                    </Form.Group>
                    <button className={defaultStyle.buttonFilled} type="submit">Register</button>
                </Form>
            </div>

        </div>
    )
}