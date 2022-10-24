import loginStyles from "./LoginRegisterForm.module.css";
import defaultStyle from "../pages/stylesheet/global.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation} from "@fortawesome/free-solid-svg-icons";
import {Form} from "react-bootstrap";
import {useState} from "react";
import {login} from "@lib/api";
import {useRouter} from "next/router";

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

export default function LoginForm({session}) {

    const defaultLoginModel = {
        email: "",
        password: "",
    }

    const [loginModel, setLoginModel] = useState(defaultLoginModel)
    const [loginErrors, setLoginErrors] = useState(defaultLoginModel)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

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

    return (
        <>
            <Form className={loginStyles.formContainer} onSubmit={handleLogin}>
                <h2 className={defaultStyle.formTitle}>Login</h2>
                <div className={defaultStyle.formSeparatorLine}/>
                { loginErrors.login && <div className={loginStyles.errorText}>
                    <FontAwesomeIcon icon={faExclamation} className={loginStyles.faExclamation}/>{loginErrors.login}</div>
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
        </>
    )
}