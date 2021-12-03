import { useState } from "react"

//authentication functions 
//unlike useSimpleAuth, does not provide a register function or a way to get the current user. 
//It also sets a password and email in the localStorage on login.
//This is not used in the application at all. 

const useAPIAuth = () => {
    //initialize state (boolean), and setter function
    const [loggedIn, setIsLoggedIn] = useState(false)

    const isAuthenticated = () =>
        loggedIn
        || localStorage.getItem("credentials") !== null
        || sessionStorage.getItem("credentials") !== null

    const login = (email, password, storageType = localStorage) => {
        storageType.setItem(
            "credentials",
            JSON.stringify({
                email: email,
                password: password
            })
        )
        setIsLoggedIn(true)
    }

    const logout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem("credentials")
        sessionStorage.removeItem("credentials")
    }

    return { isAuthenticated, logout, login }
}

export default useAPIAuth



