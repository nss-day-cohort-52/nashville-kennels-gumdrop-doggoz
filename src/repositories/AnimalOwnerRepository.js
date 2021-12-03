import AnimalRepository from "./AnimalRepository"
import { fetchIt } from "./Fetch"
import Settings from "./Settings"

export default {
    async get(params) {
        const e = await fetch(`${Settings.remoteURL}/animalOwners/${params}`, {
            headers: {
                /* //?It seems like some of these functions don't use fetchIt because they 
                have an Authorization header, which is not in the fetchIt function. 
                What is the purpose of the Authorization: Bearer if it is only checking for a user, and not for
                a specific type of user? Shouldn't there always be a logged in user in components where we call 
                these functions? Otherwise it would route back to the login screen anyway.*/
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            }
        })
        return await e.json()
    },

    async delete(id) {
        const e = await fetch(`${Settings.remoteURL}/animalOwners/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            }
        })
        return await e.json()
    },

    async removeOwnersAndCaretakers(animalId) {
        //get an animal object (which has animalOwners and animalCaretakers embedded on it)
        return AnimalRepository.get(animalId)
            .then(animal => {
                //delete animalOwners object associated with animal
                const ownerDeletes = animal.animalOwners.map(
                    ao => fetchIt(`${Settings.remoteURL}/animalOwners/${ao.id}`,"DELETE")
                )
                //delete animalOwners object associated with animal
                const employeeDeletes = animal.animalCaretakers.map(
                    c => fetchIt(`${Settings.remoteURL}/animalCaretakers/${c.id}`, "DELETE")
                )
                //after deleting all applicable animalOwners object, delete applicable animalCaretakers object
                //? Why does this need a Promise.all? Why not just more .thens?
                return Promise.all(ownerDeletes)
                    .then(() => Promise.all(employeeDeletes))
            })
    },

    //?Why do we need this function? First one was included in the code, second was our copy for caretakers. Seems like we could use AnimalRepository.get and just access animal.animalOwners
    async getOwnersByAnimal (animalId) {
        return await fetchIt(`${Settings.remoteURL}/animalOwners?animalId=${animalId}&_expand=user`)
    },

    async getCaretakersByAnimal (animalId) {
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers?animalId=${animalId}&_expand=user`)
    },

    async assignOwner(animalId, userId) {
        const e = await fetch(`${Settings.remoteURL}/animalOwners`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            },
            "body": JSON.stringify({ animalId, userId })
        })
        return await e.json()
    },

    async assignCaretaker(animalId, userId) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
                
            },
            "body": JSON.stringify({ animalId, userId })
        })
        return await e.json()
    },

    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/animalOwners?_expand=user&user.employee=false&_expand=animal`)
    },
    
    async removeCaretaker(animalId, caretakerId) {
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers/?userId=${caretakerId}&animalId=${animalId}`)
            .then((caretakerArray) => {
                fetchIt(`${Settings.remoteURL}/animalCaretakers/${caretakerArray[0].id}`, "DELETE")
            })
    }
}