import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Animal } from "./Animal"
import { AnimalDialog } from "./AnimalDialog"
import AnimalRepository from "../../repositories/AnimalRepository"
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository"
import useModal from "../../hooks/ui/useModal"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import OwnerRepository from "../../repositories/OwnerRepository"

import "./AnimalList.css"
import "./cursor.css"


export const AnimalListComponent = ({ matchingAnimals }) => {
    const [animals, petAnimals] = useState([])
    const [animalOwners, setAnimalOwners] = useState([])
    const [owners, updateOwners] = useState([])
    const [currentAnimal, setCurrentAnimal] = useState({ treatments: [] })
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    let { toggleDialog, modalIsOpen } = useModal("#dialog--animal")

    const syncAnimals = () => {
        //on first page render, either render list of matching animals, or all animals
        if (matchingAnimals) {
            petAnimals(matchingAnimals)
        } else {
            AnimalRepository.getAll().then(data => petAnimals(data))
        }
    }

    useEffect(() => {
        //every subsequent time matchingAnimals changes (new search term typed), change state
        if (matchingAnimals) {
            petAnimals(matchingAnimals)
        }
    }, [matchingAnimals])

    useEffect(() => {
        OwnerRepository.getAllCustomers().then(updateOwners)
        AnimalOwnerRepository.getAll().then(setAnimalOwners)
        syncAnimals()
    }, [])

    const showTreatmentHistory = animal => {
        setCurrentAnimal(animal)
        toggleDialog()
    }

    useEffect(() => {
        const handler = e => {
            if (e.keyCode === 27 && modalIsOpen) {
                toggleDialog()
            }
        }

        window.addEventListener("keyup", handler)

        return () => window.removeEventListener("keyup", handler)
    }, [toggleDialog, modalIsOpen])


    const ownersAnimals = () => {
        const user = getCurrentUser()

        const foundArray = animals.filter((anml) => {
            let boolean = false
            for (const animalOwner of anml.animalOwners) {
                if (animalOwner.userId === user.id) {
                    boolean = true
                }
            }
            return boolean
        }
        )
        return foundArray
    }

    return (
        <>
            <AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} setCurrentAnimal={setCurrentAnimal} />


            {
                getCurrentUser().employee
                    ? ""
                    : <div className="centerChildren btn--newResource">
                        <button type="button"
                            className="btn btn-success "
                            onClick={() => { history.push("/animals/new") }}>
                            Register Animal
                        </button>
                    </div>
            }


            <ul className="animals">
                {
                    getCurrentUser().employee
                        ? animals.map(anml =>
                            <Animal key={`animal--${anml.id}`} animal={anml}
                                animalOwners={animalOwners}
                                owners={owners}
                                syncAnimals={syncAnimals}
                                setAnimalOwners={setAnimalOwners}
                                showTreatmentHistory={showTreatmentHistory}
                            />)
                        : ownersAnimals().map(anml =>
                            <Animal key={`animal--${anml.id}`} animal={anml}
                                animalOwners={animalOwners}
                                owners={owners}
                                syncAnimals={syncAnimals}
                                setAnimalOwners={setAnimalOwners}
                                showTreatmentHistory={showTreatmentHistory}
                            />)
                }
            </ul>
        </>
    )
}
