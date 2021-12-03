import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"

// For issue 10 I used the prop setEmployees on line 24 to transfer to the Employee.js module. 

export default ({ matchingEmployees }) => {
    const [emps, setEmployees] = useState([])

    useEffect(
        () => {
            //on first page render, either render list of matching employees, or all employees
            if (matchingEmployees) {
                setEmployees(matchingEmployees)
            } else {
                EmployeeRepository.getAll()
                    .then(setEmployees)
            }
            // eslint-disable-next-line
        }, []
    )

    useEffect(() => {
        //every subsequent time matchingEmployees changes (new search term typed), change state
        if (matchingEmployees) {
            setEmployees(matchingEmployees)
        }
    }, [matchingEmployees])




    
    return (
        <>
            <div className="employees">
                {
                    emps.map(a => <Employee key={a.id} employee={a} setEmployees={setEmployees} />)
                }
            </div>
        </>
    )
}
