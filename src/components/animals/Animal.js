import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import "./AnimalCard.css"

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners }) => {
    const [users, setUsers] = useState([])
    const [myOwners, setPeople] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [allCaretakers, setCaretakers] = useState([])
    const [myCaretakers, setMyCaretaker] = useState([])
    const [isEmployee, setAuth] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [classes, defineClasses] = useState("card animal")
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        //getAll is coming from OwnerRepository component - fetching all users
        OwnerRepository.getAll()
            .then(setUsers)
            .then(() => OwnerRepository.getAllEmployees())
            .then(setCaretakers)
            // setter (property, param, getter) .get is expanding to users table
            .then(() => resolveResource(animal, animalId, AnimalRepository.get))
    }, [])

    useEffect(() => {
        resolveResource(animal)
    }, [myOwners, animal])

    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])

    useEffect(() => {
        getPeople()
        getCaretakers()
    }, [currentAnimal])

    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                .then(() => {
                    OwnerRepository.getAllCustomers().then(registerOwners)
                })
        }
    }, [animalId])


    const getPeople = () => {
        return AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }
    const getCaretakers = () => {
        return AnimalOwnerRepository
            .getCaretakersByAnimal(currentAnimal.id)
            .then(people => setMyCaretaker(people))
    }

    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)
                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                                {
                                    getCurrentUser().employee
                                        ?
                                        currentAnimal?.animalCaretakers?.map(animalCaretaker => {

                                            return <div key={`taker--${animalCaretaker.id}`}>{animalCaretaker.user.name}

                                                <button key={animalCaretaker.id} className={animalCaretaker.id} onClick={() => {
                                                    AnimalOwnerRepository
                                                        .removeCaretaker(currentAnimal.id, animalCaretaker.userId)
                                                        .then(() => {
                                                            AnimalRepository.getAll()
                                                                .then(syncAnimals)
                                                        }) // Get all animals
                                                }}> Remove caretaker </button>
                                            </div>
                                        }
                                        )
                                        : ""
                                }

                                {/* iterate through animalCaretakers array and return the user.name for each caretaker of currentAnimal  */}
                                {
                                    getCurrentUser().employee
                                        ?
                                        myCaretakers.length < 2
                                            ?
                                            <select defaultValue=""
                                                name="caretaker"
                                                className="form-control small"
                                                onChange={(evt) => {
                                                    AnimalOwnerRepository.assignCaretaker(currentAnimal.id, parseInt(evt.target.value))
                                                        .then(syncAnimals)
                                                    evt.target.value = ""

                                                }} >
                                                <option value="">
                                                    Select a new caretaker
                                                </option>
                                                {
                                                    allCaretakers.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)
                                                }
                                            </select>

                                            : ""
                                        : ""

                                }


                            </span>




                            <h6>Owners</h6>
                            <span className="small">

                                {/* mapping through animalOwners array in resource and filtering any user.id that = current animal owner id
                                map through found animal owners and return the id and name */}

                                {
                                    currentAnimal?.animalOwners?.map(owner => {
                                        const foundAnimalOwner = users.filter(user => {
                                            return user.id === owner.userId
                                        })
                                        return (
                                            foundAnimalOwner.map(fao => {
                                                return <div key={fao.id}>{fao.name}</div>
                                            })
                                        )
                                    })
                                }

                            </span>


                            {
                                myOwners.length < 2
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={(evt) => {
                                            AnimalOwnerRepository.assignOwner(currentAnimal.id, parseInt(evt.target.value))
                                                .then(syncAnimals)
                                            evt.target.value = ""

                                        }} >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }


                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? <div className="small">
                                        <h6>Treatment History</h6>
                                        {
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : ""
                            }

                        </section>

                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository
                                        .removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => {
                                            AnimalRepository.delete(currentAnimal.id)
                                        }) // Remove animal
                                        .then(() => {
                                            AnimalRepository.getAll()
                                                .then(syncAnimals)
                                        }) // Get all animals
                                }>Discharge</button>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}