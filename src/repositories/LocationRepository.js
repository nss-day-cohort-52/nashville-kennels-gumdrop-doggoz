import Settings from "./Settings"
import { fetchIt } from "./Fetch"
import OwnerRepository from "./OwnerRepository"

export default {
    async get(id) {
        const employees = await OwnerRepository.getAllEmployees()
        return await fetchIt(`${Settings.remoteURL}/locations/${id}?_embed=animals&_embed=employeeLocations`)
            .then(location => {
                /*
                    for current location (should only be one location total due to fetch call), 
                    map through employeeLocations, and add a user object expanded on each employeeLocation
                    object by matching the userId
                */
                location.employeeLocations = location.employeeLocations.map(
                    el => {
                        el.employee = employees.find(e => e.id === el.userId)
                        return el
                    }
                )
                //end result of fetch is a location object with animals and employeeLocations embedded (on which there is a user object)
                return location
            })
    },
    async search(terms) {
        const employees = await OwnerRepository.getAllEmployees()
        return await fetchIt(`${Settings.remoteURL}/locations/?name_like=${encodeURI(terms)}&_embed=animals&_embed=employeeLocations`)
            .then(locations => {
                locations = locations.map(location => {
                    /* 
                        for current location, map through employeeLocations, and add a user object expanded on each employeeLocation
                        object by matching the userId
                    */
                    location.employeeLocations = location.employeeLocations.map(
                        el => {
                            el.employee = employees.find(e => e.id === el.userId)
                            return el
                        }
                    )
                    return location
                })
                //end result of fetch is an array of location objects with animals and employeeLocations embedded (on which there is a user object)
                return locations
            })
    },
    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/locations/${id}`, "DELETE")
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/locations?_embed=animals&_embed=employeeLocations`)
    }
}
