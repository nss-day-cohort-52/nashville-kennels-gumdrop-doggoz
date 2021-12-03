import Settings from "./Settings"
import { fetchIt } from "./Fetch"
import OwnerRepository from "./OwnerRepository"

const expandAnimalUser = (animal, users) => {
    /* 
        map through each animal owner, add a key named "user" that has the value of a found user object
        (should match the userId on the current animalOwner object)
    */
    animal.animalOwners = animal.animalOwners.map(ao => {
        ao.user = users.find(user => user.id === ao.userId)
        return ao
    })
    /* 
        map through each animalCaretaker, add a key named "user" that has the value of a found user object
        (should match the userId on the current animalCaretaker object)
    */
    animal.animalCaretakers = animal.animalCaretakers.map(caretaker => {
        caretaker.user = users.find(user => user.id === caretaker.userId)
        return caretaker
    })

    //returns an animal object that now has the user objects embedded in its animalOwners and animalCaretakers arrays
    return animal
}

export default {
    // async function
    async get(id) {
        const users = await OwnerRepository.getAll()
        // await response of fetch call, only proceed to next promise once 1st promise is resolved
        return await fetchIt(`${Settings.remoteURL}/animals/${id}?_embed=animalOwners&_embed=treatments&_embed=animalCaretakers`)
            .then(animal => {
                //add user objects onto the embedded owners and caretaker arrays
                animal = expandAnimalUser(animal, users)
                // only return once 2nd promise (users, defined on line 22) is resolved
                return animal
                //returns one animal object with animalOwners, treatments, and animalCaretakers embedded on first level, users embedded on animalOwners and animalCaretakers
            })
    },
    async searchByName(query) {
        return await fetchIt(`${Settings.remoteURL}/animals?_expand=employee&_sort=employee.id&_embed=treatments&_expand=location&name_like=${query}`)
    },
    async getCaretakers() {
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers?_expand=user&_expand=animal`)
    },
    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/animals/${id}`, "DELETE")
    },
    async getAll() {
        const users = await OwnerRepository.getAll()
        const animals = await fetchIt(`${Settings.remoteURL}/animals?_embed=animalOwners&_embed=treatments&_embed=animalCaretakers`)
            .then(data => {
                const embedded = data.map(animal => {
                    //add user objects onto the embedded owners and caretaker arrays
                    animal = expandAnimalUser(animal, users)
                    return animal
                    //returns animal array with animalOwners, treatments, and animalCaretakers embedded on first level, users embedded on animalOwners and animalCaretakers
                })
                return embedded
            })
        return animals
    },
    async addAnimal(newAnimal) {
        return await fetchIt(
            `${Settings.remoteURL}/animals`,
            "POST",
            JSON.stringify(newAnimal)
        )
    },
    async addTreatment(newTreatment) {
        return await fetchIt(
            `${Settings.remoteURL}/treatments`,
            "POST",
            JSON.stringify(newTreatment)
        )
    },
    async updateAnimal(editedAnimal) {
        return await fetchIt(
            `${Settings.remoteURL}/animals/${editedAnimal.id}`,
            "PUT",
            JSON.stringify(editedAnimal)
        )
    },
    async updateCaretaker(editedAnimal) {
        return await fetchIt(
            `${Settings.remoteURL}/animalcaretakers/${editedAnimal.id}`,
            "PUT",
            JSON.stringify(editedAnimal)
        )
    }
}
