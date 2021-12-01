import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = ({matchingLocations}) => {
    const [ locations, updateLocations ] = useState([])

    useEffect(() => {
        LocationRepository.getAll()
        .then(updateLocations)
    }, [])

    useEffect(() => {
        if(matchingLocations){
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
