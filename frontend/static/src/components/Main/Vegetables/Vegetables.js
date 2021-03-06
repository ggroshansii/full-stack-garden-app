import React from "react";
import "./Vegetables.css";
import Cookie from "js-cookie";
import { useState, useEffect, useRef } from "react";
import FilteredVegetableList from "./FilteredVegetableList";
import UserVegetableList from "./UserVegetableList";
import { withRouter, Redirect } from "react-router";
import { Button, Collapse, Fade } from "react-bootstrap";
import { ImArrowUp } from "react-icons/im";

function Vegetables(props) {

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    let queryString = "";
    let pkValues = [];

    const [filterData, setFilterData] = useState({
        name: "",
        exposure: "",
        heat_tolerant: "",
        drought_tolerant: "",
        life_cycle: "",
        seasonality: "",
    });

    const [filteredVegetables, setFilteredVegetables] = useState([]);
    const [userVegetables, setUserVegetables] = useState([]);
    const [showArrow, setShowArrow] = useState(false);
    const filteredVegScroll = useRef();
    const filterFormScroll = useRef();

    // const [showNoResultsAlert, setNoResultsAlert] = useState(false)

    useEffect(() => {
        getUsersVegetableList();
    }, []);

    useEffect(() => {
        props.setShowNav(true);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    async function getUsersVegetableList() {
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
            console.log("GETTING USER VEGETABLES FAILED", response);
        } else {
            const data = await response.json();
            setUserVegetables(data.vegetables_details);
        }
    }

    async function getVegetableDetails() {
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
            if (data.length === 0) {
                // setNoResultsAlert(true);
                // setTimeout(()=> {
                //     setNoResultsAlert(false)
                // }, 1000)
            }
            setFilteredVegetables(data);
        }
    }

    function handleChange(e) {
        if (e.target.type === "checkbox" && !e.target.checked) {
            let updatedFilterData = { ...filterData, [e.target.name]: "" };
            setFilterData(updatedFilterData);
        } else if (e.target.type === "checkbox" && e.target.checked) {
            let updatedFilterData = { ...filterData, [e.target.name]: "True" };
            setFilterData(updatedFilterData);
        } else {
            let { name, value } = e.target;
            let updatedFilterData = { ...filterData, [name]: value };
            setFilterData(updatedFilterData);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (filterData.name.length > 0) {
            if (queryString.length > 0) {
                queryString += "&";
            }
            queryString = queryString + `name=${filterData.name}`;
        }
        if (filterData.exposure.length > 0) {
            if (queryString.length > 0) {
                queryString += "&";
            }
            queryString = queryString + `exposure=${filterData.exposure}`;
        }
        if (filterData.heat_tolerant.length > 0) {
            if (queryString.length > 0) {
                queryString += "&";
            }
            queryString =
                queryString + `heat_tolerant=${filterData.heat_tolerant}`;
        }
        if (filterData.drought_tolerant.length > 0) {
            if (queryString.length > 0) {
                queryString += "&";
            }
            queryString =
                queryString + `drought_tolerant=${filterData.drought_tolerant}`;
        }
        if (filterData.life_cycle.length > 0) {
            if (queryString.length > 0) {
                queryString += "&";
            }
            queryString = queryString + `life_cycle=${filterData.life_cycle}`;
        }
        if (filterData.seasonality.length > 0) {
            if (queryString.length > 0) {
                queryString += "&";
            }
            queryString = queryString + `seasonality=${filterData.seasonality}`;
        }

        getVegetableDetails();
        setShowArrow(true);

        queryString = "";
        setTimeout(() => {
            scrollToFiltered();
        }, 300);

        // setFilterData({
        //     name: "",
        //     exposure: "",
        //     heat_tolerant: "",
        //     drought_tolerant:"" ,
        //     life_cycle: "",
        //     seasonality: "",
        // });

        console.log("FD", filterData)
    }

    function addToUserList(id) {
        let index = filteredVegetables.findIndex((element) => element.id == id);
        console.log("INDEX", index);
        let updatedFilteredVegetables = [...filteredVegetables];
        let userVeggieToAdd = updatedFilteredVegetables.splice(index, 1);
        setUserVegetables([...userVegetables, userVeggieToAdd[0]]);
        setShowSuccessAlert(true);
    }

    function removeFromUserList(id) {
        let index = userVegetables.findIndex((element) => element.id === id);
        let updatedUserVegetables = [...userVegetables];
        updatedUserVegetables.splice(index, 1);
        setUserVegetables(updatedUserVegetables);
    }

    function grabPKvalues(vegetables) {
        for (let i = 0; i < vegetables.length; i++) {
            pkValues.push(vegetables[i].id);
        }
    }

    function scrollToFiltered() {
        filteredVegScroll.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
        });
    }
    function scrollToForm() {
        filterFormScroll.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
        });
    }

    async function handleSaveVegClick() {
        grabPKvalues(userVegetables);

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
            props.history.push(`/${data.id}/varieties/`);
        }
    }

    function handleArrowClick() {
        scrollToForm();
    }

    if (props.isAuth === false) {
        return <Redirect to="/" />
     }

    return (
        <div className="vegetables-outer-container">
            <div className="vegetables-inner-container">
                <div className="vegetables-heading-form-flex-container ">
                    <div
                        className="vegetables-heading-container"
                    >
                        <p className="vegetables-description">
                            <strong>In this step</strong>, you will pick out
                            your potential vegetables by filtering out for the
                            specifc needs of your garden. As you are using the
                            filter, try to visualize the different parts of your
                            garden. For example, one area might be shady, with
                            poor accessibility to water, therefore, you would
                            check the 'Drought Tolerant' box and, then check the
                            'Partial Sun' from the dropdown. As you visualize
                            the differing needs of your garden landscape, come
                            back to the form and find the most suitable veggies!{" "}
                        </p>

                    </div>

                    <div
                        className="vegetables-form-container"
                    >

                            <form
                                action=""
                                className="form-control vegetables-form"
                                onSubmit={handleSubmit}
                                ref={filterFormScroll}
                            >
                                <div className="form-group">
                                    <label htmlFor="name">
                                        Name (Optional):
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                        className="form-control"
                                        value={filterData.name}
                                    />
                                </div>

                                <div className="form-group mt-2">
                                    <label htmlFor="exposure">
                                        Sun Exposure
                                    </label>
                                    <select
                                        name="exposure"
                                        id="exposure"
                                        onChange={handleChange}
                                        className="form-control mt-2"
                                        value={filterData.exposure}
                                    >
                                        <option value="">ALL</option>
                                        <option value="BO">
                                            Thrive in Both Full & Partial Sun
                                        </option>
                                        <option value="FS">Full Sun</option>
                                        <option value="PS">Partial Sun</option>
                                    </select>
                                </div>

                                <div className="vegetables-checkboxes-container">
                                    <div className="form-group mt-2 vegetables-checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="heat_tolerant"
                                            name="heat_tolerant"
                                            value="TRUE"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="heat_tolerant" className="heat-tolerant-label">
                                            Heat Tolerant
                                        </label>
                                    </div>

                                    <div className="form-group mt-2 vegetables-checkbox-group ">
                                        <input
                                            type="checkbox"
                                            id="drought_tolerant"
                                            name="drought_tolerant"
                                            value={filterData.drought_tolerant}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="drought_tolerant" className="drought-tolerant-label">
                                            Drought Tolerant
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="life_cycle">
                                        Life Cycle
                                    </label>
                                    <select
                                        name="life_cycle"
                                        id="life_cycle"
                                        onChange={handleChange}
                                        className="form-control"
                                        value={filterData.life_cycle}
                                    >
                                        <option value="">All</option>
                                        <option value="AN">Annual</option>
                                        <option value="BI">Biennial</option>
                                        <option value="PE">Perennial</option>
                                    </select>
                                </div>

                                <div className="form-group mt-2">
                                    <label htmlFor="seasonality">
                                        Seasonality
                                    </label>
                                    <select
                                        name="seasonality"
                                        id="seasonality"
                                        onChange={handleChange}
                                        className="form-control"
                                        value={filterData.seasonality}
                                    >
                                        <option value="">All</option>
                                        <option value="CS">Cool Season</option>
                                        <option value="WS">Warm Season</option>
                                    </select>
                                </div>

                                <button className="btn btn-success vegetable-form-btn">
                                    Search
                                </button>
                            </form>
                    </div>
                </div>
                <div ref={filteredVegScroll}>
                    <FilteredVegetableList
                        filteredVegetables={filteredVegetables}
                        userVegetables={userVegetables}
                        addToUserList={addToUserList}
                        // showNoResultsAlert={showNoResultsAlert}
                        showSuccessAlert={showSuccessAlert}
                    />
                </div>
                <div className="vegetables-user-list-container">
                    <UserVegetableList
                        userVegetables={userVegetables}
                        removeFromUserList={removeFromUserList}
                    />
                    <ImArrowUp
                        className="vegetables-arrow-scroll"
                        id={showArrow ? "" : "hide"}
                        onClick={handleArrowClick}
                    />
                </div>
                    <button
                        className="btn flagship-btn vegetables-btn"
                        onClick={handleSaveVegClick}
                    >
                        Save & Continue
                    </button>

            </div>
        </div>
    );
}

export default withRouter(Vegetables);
