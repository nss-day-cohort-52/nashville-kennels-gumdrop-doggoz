import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import LocationRepository from "../../repositories/LocationRepository";
import { useHistory } from "react-router";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";



export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [employees, setEmployees] = useState([])
    const [locations, setLocations] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [locationId, setLocationId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const history = useHistory()
    const [userChoices, setUserChoices] = useState({
        currentEmployee: {}
    })
    const { getCurrentUser } = useSimpleAuth()

    useEffect(() => {
        const copy = { ...userChoices }
        const findDemEmployees = employees.find(e => e.id === parseInt(employeeId))
        console.log(findDemEmployees)
        copy.currentEmployee = findDemEmployees
        setUserChoices(copy)
    }, [employeeId])

    useEffect(() => {
        EmployeeRepository.getAll()
            .then(setEmployees)
    }, [])

    useEffect(() => {
        LocationRepository.getAll()
            .then(setLocations)
    }, [])

    const constructNewAnimalOwner = (addedAnimal) => {
        AnimalOwnerRepository.assignOwner(addedAnimal.id, getCurrentUser().id)
    }

    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(employeeId)

        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const caretakerWithOneLocation = {
                name: animalName,
                breed: breed,
                locationId: parseInt(userChoices.currentEmployee.employeeLocations[0].locationId)
            }

            const caretakerWithMultipleLocations = {
                name: animalName,
                breed: breed,
                locationId: parseInt(locationId)
            }
            
            if(userChoices?.currentEmployee?.employeeLocations?.length === 1) {
            AnimalRepository.addAnimal(caretakerWithOneLocation)
                .then((addedAnimal)=>{constructNewAnimalOwner(addedAnimal)})
                .then(() => setEnabled(true))
                .then(() => history.push("/animals"))
        } else {
            AnimalRepository.addAnimal(caretakerWithMultipleLocations)
                .then(() => setEnabled(true))
                .then(() => history.push("/animals"))
        }
    }} 

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div className="form-group">
                <label htmlFor="employee">Make appointment with caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setEmployeeId(e.target.value)
                    }
                >
                    <option value="">Select an employee</option>
                    {employees.map(e => (
                        <option key={e.id} id={e.id} value={e.id}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>
            {
                userChoices?.currentEmployee?.employeeLocations?.length > 1
                    ? <div className="form-group">
                        <label htmlFor="employee">Make an appointment at this location</label>
                        <select
                            defaultValue=""
                            name="location"
                            id="locationId"
                            className="form-control"
                            onChange={e => setLocationId(e.target.value)
                            }
                        >
                            <option value="">Select a Location</option>
                            {locations.map(e => (
                                <option key={e.id} id={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    : ""

            }
            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
