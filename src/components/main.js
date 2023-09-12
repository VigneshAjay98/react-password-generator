import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { OverlayTrigger, Tooltip, Button, Form } from "react-bootstrap";

import { generatePassword } from '../utils/generatePassword'

function Main(){

    const { handleSubmit, setError, clearErrors, formState: { errors } } = useForm();

    const [ checkbox, setCheckBox ] = useState({
        alphabets: false,
        numbers: false,
        symbols: false
    });

    const [ showTooltip, setShowTooltip ] = useState(false);
    const [ passwordGenerated, setPasswordGenerated ] = useState(null)
    const [ recentPasswords, setRecentPasswords ] = useState([])

    const initializeOldPasswords = () => {
        const oldPasswords = localStorage.getItem('passwords');
        if(oldPasswords) {
            let oldPasswordsArr = JSON.parse(oldPasswords)
            oldPasswordsArr = oldPasswordsArr.reverse()

            if(oldPasswordsArr.length > 5) {
                oldPasswordsArr =oldPasswordsArr.slice(0, 5)
            }
            setRecentPasswords(oldPasswordsArr)
        }
    }

    useEffect(() => {
        initializeOldPasswords()
    }, [])

    const copyPassword = (text) => {
        navigator.clipboard.writeText(text);
        setShowTooltip(true)
        setTimeout(() => {
            setShowTooltip(false)
        }, 1000)
    };

    const handleCheckBox = (field) => {

        clearErrors('checkbox')
        let newCheckState = checkbox
        newCheckState[field] = !checkbox[field]
        setCheckBox(prevState => {
            return {
                ...prevState,
                ...newCheckState
            }
        })
    }

    const clearAllPasswords = () => {
        localStorage.removeItem("passwords")
        setRecentPasswords([])
    }

    const onSubmit = () => {
        clearErrors('checkbox')

        let checkedData = Object.keys(checkbox).filter(key => checkbox[key] === false)
        if (checkedData.length === 3) {
            setError("checkbox", {
                type: "manual",
                message: "Atleast one pattern must be selected!"
            });
            return;
        }

        let password = generatePassword(checkbox)

        if(password) {

            let filteredPasswords = []

            const storedPasswords = localStorage.getItem('passwords');

            if(storedPasswords) {
                let passwordsArr = JSON.parse(storedPasswords)
                passwordsArr.push(password)
                localStorage.setItem('passwords', JSON.stringify(passwordsArr));
                filteredPasswords = passwordsArr.reverse()
            }else {
                let newPasswords = recentPasswords
                newPasswords.push(password)
                localStorage.setItem('passwords', JSON.stringify(newPasswords));
                filteredPasswords = newPasswords.reverse()
            }

            if(filteredPasswords.length > 5) {
                filteredPasswords =filteredPasswords.slice(0, 5)
            }

            setRecentPasswords(filteredPasswords)
            setPasswordGenerated(password)
        }

    }

    return(
        <>
            <div className="container">
                <div className="card-wrapper d-flex align-items-center justify-content-center">
                    <div className="col-6 card">
                        <div className="card-header text-center text-capitalize">
                            <h3>Password Generator</h3>
                        </div>
                        <div className="card-body">
                            { passwordGenerated &&
                                <div className="password-field d-flex justify-content-between align-items-center rounded-2 p-1 mb-1">
                                    <span>{passwordGenerated}</span>
                                    <OverlayTrigger
                                        trigger='click'
                                        overlay={
                                            showTooltip ? (
                                                <Tooltip id={`tooltip`}>Copied: {passwordGenerated}</Tooltip>
                                            ) : (
                                                <span></span>
                                            )
                                        }
                                        >
                                            <Button variant="secondary" type="button" className="btn-outline-secondary btn-sm" style={{ color: '#fff' }} onClick={() => copyPassword(passwordGenerated)}>Copy</Button>
                                    </OverlayTrigger>
                                </div>
                            }
                            <Form onSubmit={handleSubmit(onSubmit)}> 
                                <div className="card">
                                    <div className="card-body">
                                        {['checkbox'].map((type) => (
                                            <div key={`alphabets`} className="mb-3">
                                                <Form.Check
                                                    type={type}
                                                    id={`alphabets`}
                                                    label={`Include Alphabets`}
                                                    onChange={() => handleCheckBox('alphabets')} checked={checkbox['alphabets']}
                                                />
                                            </div>
                                        ))}
                                        {['checkbox'].map((type) => (
                                            <div key={`numbers`} className="mb-3">
                                                <Form.Check
                                                    type={type}
                                                    id={`numbers`}
                                                    label={`Include Numbers`}
                                                    onChange={() => handleCheckBox('numbers')} checked={checkbox['numbers']}
                                                />
                                            </div>
                                        ))}
                                        {['checkbox'].map((type) => (
                                            <div key={`symbols`} className="mb-3">
                                                <Form.Check
                                                    type={type}
                                                    id={`symbols`}
                                                    label={`Include Special Characters`}
                                                    onChange={() => handleCheckBox('symbols')} checked={checkbox['symbols']}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {errors.checkbox && <span className="error">{errors.checkbox.message}</span> }

                                <Form.Group className="form-group d-grid">
                                    <Button variant="dark" type="submit">Generate Password</Button>
                                </Form.Group>
                            </Form>
                            <hr/>
                            { recentPasswords.length > 0 &&
                                <div className="card">
                                    <div className="card-header d-flex justify-content-center text-center">
                                        <div className="col-9 text-center">
                                            <h5>Recent Passwords</h5>
                                        </div>
                                        <div className="col-3">
                                            <Button variant="danger" type="button" className="btn-outline-danger btn-sm" style={{ color: '#fff' }} onClick={clearAllPasswords}>Clear All</Button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        { recentPasswords.map((elem, index) => {
                                                return (
                                                    <div className="old-password-field d-flex align-items-center justify-content-center rounded-2 p-1 mb-1" key={index}>
                                                        <span>{elem}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main;