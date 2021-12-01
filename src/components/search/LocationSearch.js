import React, { useEffect, useState } from "react"
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = ({matchingLocations}) => {
    
    return (
        <div className="locations">
            {matchingLocations.map(l => <Location key={l.id} location={l} />)}
        </div>
    )
}