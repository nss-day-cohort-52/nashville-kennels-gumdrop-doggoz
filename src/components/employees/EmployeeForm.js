import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import LocationRepository from "../../repositories/LocationRepository";
import "./EmployeeForm.css"




export default (props) => {
    const [employee, updateEmployee] = useState()
    const [locations, defineLocations] = useState([])
    const history = useHistory()
    
    const constructNewEmployee = () => {
        if (employee.locationId === 0) {
            window.alert("Please select a location")
        } else {
            EmployeeRepository.addEmployee({
                name: employee.name,
                employee: true
            })
            .then(employee => {
                EmployeeRepository.assignEmployee({
                    employeeId: employee.id,
                    employeeName: employee.name,
                    
                })
            })
            .then(() => history.push("/employees"))
        }
    }
    const handleUserInput = (event) => {
        const copy = {...employee}
        copy[event.target.id] = event.target.value
        updateEmployee(copy)
    }

    useEffect(() => {
      LocationRepository.getAll()
            .then(defineLocations)
    }, [])



    return (
        <>
            <form className="employeeForm">
                <h2 className="employeeForm__title">New Employee</h2>
                <div className="form-group">
                    <label htmlFor="employeeName">Employee name</label>
                    <input onChange={handleUserInput}
                        type="text"
                        required
                        autoFocus
                        className="form-control"
                        placeholder="Employee name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Assign to location</label>
                    <select onChange={handleUserInput}
                        defaultValue=""
                        name="location"
                        className="form-control"
                    >
                        <option value="0">Select a location</option>
                        {locations.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            constructNewEmployee()
                        }
                    }
                    className="btn btn-primary"> Save Employee </button>
            </form>
        </>
    )
}
