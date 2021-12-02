import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import locationImage from "./location.png"
import "./Location.css"
import LocationRepository from "../../repositories/LocationRepository"


export default ({ location }) => {
    const [currentLocation, setLocation] = useState([])

    useEffect(() => {
        LocationRepository.get(location.id)
            .then(setLocation)
    }, [])

    return (
        <article className="card location" style={{ width: `18rem` }}>
            <section className="card-body">
                <img alt="Kennel location icon" src={locationImage} className="icon--location" />
                <h5 className="card-title">
                    <Link className="card-link"
                        to={{
                            pathname: `/locations/${location.id}`,
                            state: { location: location }
                        }}>
                        {location.name}
                    </Link>
                </h5>
            </section>
            <section>
                Total animals: {currentLocation.animals?.length}
            </section>
            <section>
                Total employees: {currentLocation.employeeLocations?.length}
            </section>
        </article>
    )
}
