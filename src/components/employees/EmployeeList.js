import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"

// For issue 10 I used the prop setEmployees on line 24 to transfer to the Employee.js module. 

export default ({matchingEmployees}) => {
    const [emps, setEmployees] = useState([])

    useEffect(
        () => {
            EmployeeRepository.getAll()
            .then(setEmployees)
        }, []
    )

    useEffect(() => {
        if(matchingEmployees){
            setEmployees(matchingEmployees)
        }
    }, [matchingEmployees])

    return (
        <>
            <div className="employees">
                {
                    emps.map(a => <Employee key={a.id} employee={a} setEmployees={setEmployees}/>)
                }
            </div>
        </>
    )
}
