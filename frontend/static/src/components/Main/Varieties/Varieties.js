import React from 'react';
import Cookie from 'js-cookie';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router';
import VarietiesDetail from './VarietiesDetail';

function Varieties(props) {

    const [userGarden, setUserGarden] = useState();


    useEffect(() => {
        grabUserGarden();
    }, []);

    async function grabUserGarden() {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
        };
        const response = await fetch(
            `/api/gardens/${props.match.params.garden}/`,
            options
        );
        if (response.ok === false) {
            console.log("GARDEN LIST FAIL", response);
        } else {
            const data = await response.json();
            setUserGarden(data);
        }
    }

    async function updateVarieties(variety) {
        console.log('variety', variety);

        const varieties = {...userGarden.varieties};
        const key = Object.keys(variety)[0];
        varieties[key] = variety[key];
        
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
            body: JSON.stringify({ varieties }),
        };
        const response = await fetch(
            `/api/gardens/${props.match.params.garden}/`,
            options
        );
        if (response.ok === false) {
            console.log("VARIETY PATCH FAILED", response);
        } else {
            const data = await response.json();
            setUserGarden(prevState => ({
                ...prevState,
                varieties: varieties
            }));
            console.log("VARIETY PATCH SUCCESS", data);
        }

    } 


    if (!userGarden) {
        return (
            <Spinner
                animation="border"
                variant="success"
                className="garden-detail-spinner"
            />
        );
    }


    return (
        <div>
            <form action="" className="form-control">
                {userGarden.vegetables_details.map(vegetable => {
                    return <VarietiesDetail {...vegetable} updateVarieties={updateVarieties} />
                })}
            </form>
        </div>
    )
}

export default withRouter(Varieties)