import React from "react";
import { Spinner } from "react-bootstrap";
import Cookie from "js-cookie";
import { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router";
import "./Companions.css";

function Companions(props) {
    const [userVegetables, setUserVegetables] = useState();
    let [queryString, setQueryString] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    // const [queryVegetable, setQueryVegetable] = useState();
    const firstRender1 = useRef(true);
    const firstRender2 = useRef(true);

    useEffect(() => {
        getGardenDetails();
    }, []);

    useEffect(() => {
        if (firstRender1.current) {
            firstRender1.current = false;
        } else {
            getVegetableDetails();
        }
    }, [queryString]);

    useEffect(() => {
        if (firstRender2.current) {
            firstRender2.current = false;
        } else {
            addNewVegetableToGarden();
        }
    }, [userVegetables]);

    function grabPKvalues(vegetables) {
        return vegetables.map((vegetable) => vegetable.id);
    }

    async function getGardenDetails() {
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
            console.log("GET DETAILS FAILED", response);
        } else {
            const data = await response.json();
            console.log("GET DETAILS SUCCESS", data);
            setUserVegetables(data.vegetables_details);
        }
    }

    async function getVegetableDetails() {
        queryString = `name=${queryString}`;
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
        };
        const response = await fetch(`/api/vegetables?${queryString}`, options);
        if (response.ok === false) {
            console.log("failed", response);
        } else {
            const data = await response.json();
            console.log("SUCCESS QUERY", data);

            let duplicate = false;
            userVegetables.forEach((vegetableObj) => {
                if (vegetableObj.name === data[0].name) {
                    duplicate = true;
                }
            });
            if (!duplicate) {
                let updatedGarden = [...userVegetables, data[0]];
                setUserVegetables(updatedGarden);
            }
        }
    }

    function handleAddCompanion(e) {
        let val = e.target.value;
        setQueryString(val.trim());

        setShowSuccessAlert(true);
        setTimeout( () => {
            let companionTable = document.querySelector(".companion-layout-container");
            window.scrollTo({ top: companionTable.scrollHeight, behavior: 'smooth' })
        }, 200)


        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 800);
    }

    async function addNewVegetableToGarden() {
        let pkValues = grabPKvalues(userVegetables);

        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
            body: JSON.stringify({ vegetables: pkValues }),
        };
        const response = await fetch(
            `/api/gardens/${props.match.params.garden}/`,
            options
        );
        if (response.ok === false) {
            console.log("VEG PATCH FAILED", response);
        } else {
            const data = await response.json();
            console.log("success yes", data);
        }
    }

    if (!userVegetables) {
        return (
            <Spinner
                animation="border"
                variant="success"
                className="garden-detail-spinner"
            />
        );
    } else {
        console.log(userVegetables);
    }

    return (
        <div className="companions-container">
            {showSuccessAlert ? (
                <div
                    class="alert alert-success companions-save-alert"
                    role="alert"
                >
                    Variety Saved!
                </div>
            ) : (
                <div></div>
            )}
            <table>
                <thead className="companions-thead">
                    <tr className="companions-tr">
                        <th className="companions-th">Your Vegetable</th>
                        <th className="companions-th">Companions</th>
                        <th className="companions-th">Adversaries</th>
                    </tr>
                </thead>
                <tbody className="companions-tbody">
                    {userVegetables.length === 0
                        ? ""
                        : userVegetables.map((vegetable) => {
                              return (
                                  <tr className="companions-tr">
                                      <td className="companions-td">
                                          <strong>{vegetable.name}</strong>
                                      </td>
                                      {vegetable.companions === null ? (
                                          <td>None</td>
                                      ) : (
                                          <td id="companion-list" className="companions-td">
                                              {vegetable.companions
                                                  .split(",")
                                                  .map((companion) => {
                                                      return (
                                                          <button
                                                              value={companion}
                                                              onClick={
                                                                  handleAddCompanion
                                                              }
                                                              className="companion-vegetable-btn"
                                                          >
                                                              {companion + ", "}
                                                          </button>
                                                      );
                                                  })}
                                          </td>
                                      )}
                                      {vegetable.adversaries === null ? (
                                          <td className="companions-td">None</td>
                                      ) : (
                                          <td id="adversary-list" className="companions-td">
                                              {vegetable.adversaries}
                                          </td>
                                      )}
                                  </tr>
                              );
                          })}
                </tbody>
                <tfoot></tfoot>
            </table>
        </div>
    );
}

export default withRouter(Companions);
