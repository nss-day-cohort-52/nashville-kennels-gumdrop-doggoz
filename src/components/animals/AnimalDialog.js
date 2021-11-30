import React, { useState } from "react"
import AnimalRepository from "../../repositories/AnimalRepository"


export const AnimalDialog = ({ toggleDialog, animal, setCurrentAnimal }) => {
    const [treatment, setTreatment] = useState("")
    return (
        <dialog id="dialog--animal" className="dialog--animal">
            <h2 style={{ marginBottom: "1.3em" }}>Medical History for {animal?.name}</h2>
            {
                animal?.treatments?.map(t => (
                    <div key={t.id}>
                        <h4>{new Date(t.timestamp).toLocaleDateString("en-US")}</h4>
                        <p>{t.description}</p>
                    </div>
                ))

                
            }
            <input type="text" id="treatmentText" onChange={evt => setTreatment(evt.target.value)} placeholder="Add new treatment"/>
            <button id="submitTreatment" onClick={()=> {
                const newTreatment= {
                    animalId: animal?.id,
                    timestamp: Date.now(),
                    description: treatment
                }
                AnimalRepository.addTreatment(newTreatment)
                .then(()=>{
                    AnimalRepository.get(animal?.id)
                    .then(setCurrentAnimal)
                })
                document.getElementById("treatmentText").value = ""
                
            }}>Submit</button>
            <button style={{
                position: "absolute",
                top: "1em",
                right: "2em"
            }}
                id="closeBtn"
                onClick={toggleDialog}>close</button>
        </dialog>
    )
}
