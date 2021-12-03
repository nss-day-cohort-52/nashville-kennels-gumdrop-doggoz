import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = ({ matchingLocations }) => {
    const [locations, updateLocations] = useState([])

    useEffect(() => {
        //on first page render, either render list of matching locations, or all locations
        if (matchingLocations) {
            updateLocations(matchingLocations)
        } else {
            LocationRepository.getAll()
                .then(updateLocations)
        }
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        //every subsequent time matchingLocations changes (new search term typed), change state
        if (matchingLocations) {
            updateLocations(matchingLocations)
        }
    }, [matchingLocations])

    return (
        <div className="locations">
            {
                locations.map(l => <Location key={l.id} location={l} />)
            }
        </div>
    )
}
