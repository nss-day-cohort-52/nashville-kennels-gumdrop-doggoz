import { useEffect, useState } from "react"

const useResourceResolver = () => {
    //initialize state
    const [resource, setResource] = useState({})

    useEffect(() => {
       console.log('resolved resource', resource)
    }, [resource])

    const resolveResource = (property, param, getter) => {
        // Resource passed as prop
        if (property && "id" in property) {
            setResource(property)
        }
        else {
            // If being rendered indepedently (ROUTE PARAMETER)
            //(used if we are getting a parameter from the router with useParams)
            if (param) {
                getter(param).then(retrievedResource => {
                    setResource(retrievedResource)
                })
            }
        }
    }

    //returns an object, with the first property being a setter function and the second being a variable to hold state from the setter function.
    //resource will either be from the property parameter in resolveResource or the result of the getter function using the param (also both in the parameters)
    return { resolveResource, resource }
}

export default useResourceResolver
