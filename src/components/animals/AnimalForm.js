import React, { useState, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import LocationRepository from "../../repositories/LocationRepository";
import { useHistory } from "react-router";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";



export default (props) => {
    const [employees, setEmployees] = useState([])
    const [locations, setLocations] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const [saveEnabled, setEnabled] = useState(false)
    const history = useHistory()
    const [userChoices, setUserChoices] = useState({
        currentEmployee: {},
        animalName: "",
        breed: "",
        employeeId: 0,
        locationId: 0
    })

    useEffect(() => {
        EmployeeRepository.getAll()
            .then(setEmployees)
            .then(() => LocationRepository.getAll())
            .then(setLocations)
    }, [])

    useEffect(() => {
        const copy = { ...userChoices }
        copy.currentEmployee = employees.find(emp => emp.id === parseInt(userChoices.employeeId))
        setUserChoices(copy)
    }, [userChoices.employeeId, employees])


    const constructNewAnimalOwner = (addedAnimal) => {
        AnimalOwnerRepository.assignOwner(addedAnimal.id, getCurrentUser().id)
    }

    const constructNewAnimalCaretakers = (addedAnimal) => {
        AnimalOwnerRepository.assignCaretaker(addedAnimal.id, parseInt(userChoices.employeeId))
    }

    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(userChoices.employeeId)

        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const caretakerWithOneLocation = {
                name: userChoices.animalName,
                breed: userChoices.breed,
                locationId: parseInt(userChoices.currentEmployee.employeeLocations[0].locationId)
            }

            const caretakerWithMultipleLocations = {
                name: userChoices.animalName,
                breed: userChoices.breed,
                locationId: parseInt(userChoices.locationId)
            }
            // Optional chaining renders a blank string if a property doesn't exist when browser first attempts to run the constructNewAnimal function. On the rerender when that state exists, it runs the function again. 
            if (userChoices?.currentEmployee?.employeeLocations?.length === 1) {
                AnimalRepository.addAnimal(caretakerWithOneLocation)
                    .then((addedAnimal) => {
                        constructNewAnimalOwner(addedAnimal)
                        constructNewAnimalCaretakers(addedAnimal)
                    })
                    .then(() => setEnabled(true))
                    .then(() => history.push("/animals"))
            } else {
                AnimalRepository.addAnimal(caretakerWithMultipleLocations)
                    .then((addedAnimal) => {
                        constructNewAnimalOwner(addedAnimal)
                        constructNewAnimalCaretakers(addedAnimal)
                    })
                    .then(() => setEnabled(true))
                    .then(() => history.push("/animals"))
            }
        }
    }

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
                    onChange={event => {
                        const copy = { ...userChoices }
                        copy.animalName = event.target.value
                        setUserChoices(copy)
                    }}
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
                    onChange={event => {
                        const copy = { ...userChoices }
                        copy.breed = event.target.value
                        setUserChoices(copy)
                    }}
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
                    onChange={event => {
                        const copy = { ...userChoices }
                        copy.employeeId = event.target.value
                        setUserChoices(copy)
                    }
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
                            onChange={event => {
                                const copy = { ...userChoices }
                                copy.locationId = event.target.value
                                setUserChoices(copy)
                            }}
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
