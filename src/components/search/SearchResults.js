import React from "react"
import { useLocation } from "react-router-dom";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import { AnimalListComponent } from "../animals/AnimalList";
import EmployeeList from "../employees/EmployeeList";
import { LocationList } from "../locations/LocationList";
import "./SearchResults.css"


export default () => {
    const location = useLocation()
    const { getCurrentUser } = useSimpleAuth()

    const displayAnimals = () => {
        //if the state passed from NavBar.js contains animals, render the animalList component using that state.
        if (location.state?.animals.length) {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        <AnimalListComponent matchingAnimals={location.state?.animals} />
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayEmployees = () => {
        //if the state passed from NavBar.js contains employees, render the EmployeeList component using that state.
        if (location.state?.employees.length) {
            return (
                <React.Fragment>
                    <h2>Matching Employees</h2>
                    <section className="employees">
                        <EmployeeList matchingEmployees={location.state?.employees} />
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayLocations = () => {
        //if the state passed from NavBar.js contains locations, render the LocationList component using that state.
        if (location.state?.locations.length) {
            return (
                <React.Fragment>
                    <h2>Matching Locations</h2>
                    <section className="locations">
                        <LocationList matchingLocations={location.state?.locations} />
                    </section>
                </React.Fragment>
            )
        }
    }

    //return all search results as one fragment to be rendered whenever user hits enter key in search box (when user is pushed to /search) 
    return (
        <>
            {
                getCurrentUser().employee
                    ? <React.Fragment>
                        <article className="searchResults">
                            {displayAnimals()}
                            {displayEmployees()}
                            {displayLocations()}
                        </article>
                    </React.Fragment>
                    : <React.Fragment>
                        <article className="searchResults">
                            {displayEmployees()}
                            {displayLocations()}
                        </article>
                    </React.Fragment>
            }
        </>
    )

}
