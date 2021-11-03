import React from "react";
import "./Vegetables.css";
import Cookie from "js-cookie";
import { useState, useEffect } from "react";
import FilteredVegetableList from "./FilteredVegetableList";
import UserVegetableList from "./UserVegetableList";

export default function Vegetables() {
    let queryString = "";

    const [filterData, setFilterData] = useState({
        name: "",
        exposure: "",
        heat_tolerant: "",
        drought_tolerant: "",
        life_cycle: "",
        seasonality: "",
    });

    const [filteredVegetables, setFilteredVegetables] = useState();
    const [userVegetables, setUserVegetables] = useState([])

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
            console.log("SUCCESS", data);
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
        queryString = "";
    }

    function addToUserList(id) {
        let index = filteredVegetables.findIndex(element => element.id = id);
        let updatedFilteredVegetables = [...filteredVegetables];
        updatedFilteredVegetables.splice(index, 1);
        let userVeggie = updatedFilteredVegetables.splice(index, 1);
        console.log("USERVEG", userVeggie)
        setFilteredVegetables(updatedFilteredVegetables);
        setUserVegetables([...userVegetables, userVeggie[0]]);
    }

    console.log("user-veg-list",userVegetables)


    return (
        <div className="vegetables-container">
            <div className="vegetables-form-container">
                <h2>Pick Vegetables by Filtering:</h2>
                <form
                    action=""
                    className="form-control vegetables-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="name">Name (Optional):</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChange}
                    />

                    <label htmlFor="exposure">Sun Exposure</label>
                    <select
                        name="exposure"
                        id="exposure"
                        onChange={handleChange}
                    >
                        <option value="">Both</option>
                        <option value="FS">Full Sun</option>
                        <option value="PS">Partial Sun</option>
                    </select>

                    <div className="vegetables-checkboxes-container">
                        <input
                            type="checkbox"
                            id="heat_tolerant"
                            name="heat_tolerant"
                            value="TRUE"
                            onChange={handleChange}
                        />
                        <label htmlFor="heat_tolerant">Heat Tolerant</label>
                        <input
                            type="checkbox"
                            id="drought_tolerant"
                            name="drought_tolerant"
                            value="TRUE"
                            onChange={handleChange}
                        />
                        <label htmlFor="drought_tolerant">
                            Drought Tolerant
                        </label>
                    </div>

                    <label htmlFor="life_cycle">Life Cycle</label>
                    <select
                        name="life_cycle"
                        id="life_cycle"
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="AN">Annual</option>
                        <option value="BI">Biennial</option>
                        <option value="PE">Perennial</option>
                    </select>

                    <label htmlFor="seasonality">Seasonality</label>
                    <select
                        name="seasonality"
                        id="seasonality"
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="CS">Cool Season</option>
                        <option value="WS">Warm Season</option>
                    </select>
                    <button className="btn btn-success flagship-btn">
                        Search
                    </button>
                </form>
            </div>

            <FilteredVegetableList filteredVegetables={filteredVegetables} userVegetables={userVegetables} addToUserList={addToUserList}/>
            <UserVegetableList userVegetables={userVegetables}/>
        </div>
    );
}