import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"

// lz-issue 10 & 2 in this module. Line 29-32 useEffect is for issue 2 so that the browser knows that the person logged in is an employee. Line 71-80 JSX is a ternary statement that only shows the button when the user is an employee and shows an empty string when the user is a pet owner. The onClick is to delete the employee from the database and the setEmployee function is to rerender the page to show the current employees.  

export default ({ employee, setEmployees }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const [isEmployee, setAuth] = useState(false)
    const history = useHistory()



    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
    }, [resource])

    const NewEmployeeLocation = () => {
         {
            EmployeeRepository.assignEmployee({
                location: resource.employeeLocations.locationId,
               
            })            
                .then(() => history.push("/employees"))
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
                                {/* getting the amount (.length) of animals connected to resource (employee) */}
                                Caring for {resource?.animals?.length} animal(s)
                            </section>
                            <section>
                                {/* mapping locations of resource (employee) and returning the location name */}
                                Working at {resource?.locations?.map(emplocation => {
                                    return <p key={emplocation.location.id}> {emplocation.location.name}</p>
                                })}

                            </section>
                            <section>

                                <div className="form-group">
                                    <label htmlFor="location"></label>
                                    <select value={location}

                                    onChange={
                                        (evt) => {
                                            const copy = { ...resource }
                                            copy.locationId = evt.target.value
                                            resolveResource(copy)
                                        }
                                    }
                                        defaultValue=""
                                        name="location"
                                        className="form-control"
                                    >
                                        <option name="locations">Please Assign a Location</option>
                                        <option name="locations">Nashville North</option>
                                        <option name="locations">Nashville South</option>


                                        ))
                                    </select>
                                </div>
                                <button type="submit"
                                    onClick={
                                        evt => {
                                            evt.preventDefault()
                                            NewEmployeeLocation()
                                        }
                                    }
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
