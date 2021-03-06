import Cookie from "js-cookie";
import React from "react";
import { useState } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function CreateAGarden(props) {
    const [data, setData] = useState({
        name: "",
    });

    function handleChange(e) {
        let { name, value } = e.target;
        let updatedData = { ...data, [name]: value };
        setData(updatedData);
    }

    async function handleCreateGarden(e) {

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
            body: JSON.stringify(data),
        };
        const response = await fetch("/api/gardens/", options);
        if (response.ok === false) {
            console.log("GARDEN NAME FAILED", response);
        } else {
            const data = await response.json();
            console.log("GARDEN NAME SUCCESS", data);

            props.history.push(`/${data.id}/instructions/`);
        }
    }


    function handleKeyPress(e) {
        if(e.key=='Enter'){
            handleCreateGarden();
        } 
      }

    return (
        <div className="get-started-container">
            <Modal.Header closeButton>
                <Modal.Title>Enter a Garden Name:</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={data["name"]}
                        onChange={handleChange}
                        className="form-control"
                        onKeyPress={handleKeyPress}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="btn btn-success"
                        type="submit"
                        onClick={handleCreateGarden}
                        
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
        </div>
    );
}

export default withRouter(CreateAGarden);
