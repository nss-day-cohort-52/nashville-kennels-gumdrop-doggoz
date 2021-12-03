import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import LocationRepository from "../../repositories/LocationRepository";
import person from "./person.png"
import "./Employee.css"

// lz-issue 10 & 2 in this module. Line 31 in useEffect is for issue 2 so that the browser knows that the person logged in is an employee. Line 134-146 JSX is a ternary statement that only shows the button when the user is an employee and shows an empty string when the user is a pet owner. The onClick is to delete the employee from the database and the setEmployee function is to rerender the page to show the current employees.  

export default ({ employee, setEmployees }) => {
    const [animalCount, setCount] = useState(0)
    const [currentEmployeeLocations, markLocations] = useState([])
    const [classes, defineClasses] = useState("card employee")
    const [locations, setLocations] = useState([])
    const [locationId, setNewLocation] = useState(0)
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const [isEmployee, setAuth] = useState(false)
    const history = useHistory()


    useEffect(() => {
        LocationRepository.getAll()
        .then(setLocations)
    }, [])
    
    useEffect(() => {
        setAuth(getCurrentUser().employee)
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])
    
    
    useEffect(() => {
        /* getting the amount (.length) of animals connected to resource (employee) */
        setCount(resource.animals?.length)
        if (resource.locations?.length > 0) {
            markLocations(resource.locations)
        }
    }, [resource])
    

    const assignNewLocation = evt => {
        evt.preventDefault()
        const lId = parseInt(locationId)

        if (lId === 0) {
            window.alert("Please select a Location")

        } else if (resource.locations?.find(employeelocation => lId === employeelocation.locationId)){
            window.alert("Location Already Assigned")
        
        } else {
            const newLocationChoice = {
                // from state to send to API 
                locationId: parseInt(locationId),
                userId: parseInt(resource.id)
            }
            EmployeeRepository.assignEmployee(newLocationChoice)
                .then(resolveResource(employee, employeeId, EmployeeRepository.get))
            
        }
    }
    

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for {animalCount} animal(s)
                            </section>
                            <section>
                                {/* mapping employeeLocations for current employee and returning the location name */}
                                Working at {
                                    currentEmployeeLocations?.map(emplocation => `${emplocation.location?.name}`).join(", ")
                                }
                            </section>
                            <section>
                                {/* Works for existing employees with locations, but causes errors for 
                                employees who have no locations since state cannot be set properly. Would need 
                                registering a new employee at log in to push them to an employee form, which 
                                would add an employeeLocation object from the start and prevent errors on employeeList*/}
                                <div className="form-group">
                                    <label htmlFor="location"></label>
                                    <select
                                        defaultValue=""
                                        name="location"
                                        id="locationId"
                                        onChange={
                                            (evt) => {
                                                setNewLocation(evt.target.value)
                                            }
                                        }
                                    >
                                        <option value="">Assign a Location</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} id={loc.id} value={loc.id}>
                                                {loc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit"
                                    onClick={assignNewLocation}
                                    className="btn-savelocation"> Save Location</button>
                            </section>
                        </>
                        : ""
                }
                {
                    isEmployee
                        ?
                        <button className="btn--fireEmployee" onClick={() => {
                            EmployeeRepository.delete(resource.id)
                                .then(() => {
                                    EmployeeRepository.getAll()
                                        .then(setEmployees)
                                        .then(() => {
                                            history.push("/employees")
                                        })
                                })
                        }}>Fire</button>
                        : ""
                }

            </section >

        </article >
    )
}
