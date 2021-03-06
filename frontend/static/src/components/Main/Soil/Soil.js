import "./Soil.css";
import React from "react";
import EsriLoaderReact from "esri-loader-react";
import Cookie from "js-cookie";
import { useState, useEffect, useRef } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { Button, Collapse } from "react-bootstrap";

function Soil(props) {
    const firstRender = useRef(true);
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [soil, setSoil] = useState({
        id: null,
        characteristics: "",
        recommendations: "",
        soil_order: "",
    });
    const [showDetails, setShowDetails] = useState(false);
    const [coordinates, setCoordinates] = useState({
        latitude: "",
        longitude: ""
    })

    const soilDiv = useRef();

    useEffect(() => {
        props.setShowNav(true);
    }, []);

    useEffect(() => {
        if (firstRender.current === true) {
            firstRender.current = false;
        } else {
            getSoilDetails();
            setShowDetails(true);

            setTimeout(() => {
                scrollToSoil();
            }, 300);
        }
    }, [soil.soil_order]);

    const options = {
        url: "https://js.arcgis.com/4.21/",
    };

    async function getSoilDetails() {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
        };
        const response = await fetch(
            `/api/soils/?soil=${soil.soil_order}`,
            options
        );
        if (response.ok === false) {
            console.log("failed", response);
        } else {
            const data = await response.json();
            console.log("SUCCESS", data);
            if (data.length === 0) {
                console.log("soil selection failed");
            } else {
                console.log("soil details success", data);
                setSoil({
                    ...soil,
                    id: data[0].id,
                    characteristics: data[0].characteristics,
                    recommendations: data[0].recommendations,
                });
            }
        }
    }


    async function handleSaveSoilClick() {

        console.log("COORDINATES", coordinates)

        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookie.get("csrftoken"),
            },
            body: JSON.stringify({ soil: soil.id, location: coordinates }),
        };
        const response = await fetch(
            `/api/gardens/${props.match.params.garden}/`,
            options
        );
        if (!response.ok) {
            console.log("SOIL PATCH FAILED", response);
        } else {
            const data = await response.json();
            console.log("SOIL PATCH SUCCESS", data);
            props.history.push(`/${data.id}/vegetables/`);
        }
    }

    function scrollToSoil() {
        soilDiv.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
        });
    }

    setTimeout(() => {
        setLoaded(true);
    });

    if (props.isAuth === false) {
        return <Redirect to="/" />
     }

    return (
        <div className="soil-outer-container">
            <div className="soil-inner-container">
                <div className="soil-heading-map-flex-container">
                    <div
                        className="soil-heading-container"
                        // id={maxWidth ? "max-width" : ""}
                    >
                        <div className="soil-heading">
                            {/* <h2 className="soil-heading">Find your Soil Type</h2> */}
                            <p className="soil-description">
                                <strong>In this step</strong>, you will use the
                                soil map below to find your soil type by
                                clicking on your desired location. When you
                                click on a location, the soil type at that
                                precise location will be saved and the
                                characateristics and recommendations for your
                                soil will appear below the soil map.
                            </p>
                        </div>
                    </div>

                    <div
                        className="soil-map-container"
                    >
                            <div className="map-view">
                                <EsriLoaderReact
                                    options={options}
                                    modulesToLoad={[
                                        "esri/config",
                                        "esri/Map",
                                        "esri/views/MapView",
                                        "esri/layers/FeatureLayer",
                                        "esri/widgets/Locate",
                                        "esri/geometry/Point",
                                    ]}
                                    onReady={({
                                        loadedModules: [
                                            esriConfig,
                                            Map,
                                            MapView,
                                            FeatureLayer,
                                            Locate,
                                            Point,
                                        ],
                                        containerNode,
                                    }) => {
                                        esriConfig.apiKey =
                                            "AAPK6b9ac47a7781479997be4a3c4f55379anHD405J2ju5NAgpM61QOKL_3OuxNpXIuC0e9p5uaVHSyQ7UQMwWHIuxYbSixZnev";

                                        const map = new Map({
                                            basemap: "arcgis-topographic",
                                        });

                                        const view = new MapView({
                                            container: containerNode,
                                            map: map,
                                            center: [-82.4, 34.8518],
                                            zoom: 13,
                                        });

                                        const soilsLayer = new FeatureLayer({
                                            url: "https://landscape11.arcgis.com/arcgis/rest/services/USA_Soils_Map_Units/featureserver/0",
                                            outFields: ["taxorder"],
                                            opacity: 0.5,
                                        });
                                        map.add(soilsLayer, 0);

                                        const locate = new Locate({
                                            view: view,
                                            useHeadingEnabled: false,
                                            goToOverride: function (
                                                view,
                                                options
                                            ) {
                                                options.target.scale = 1500;
                                                return view.goTo(
                                                    options.target
                                                );
                                            },
                                        });
                                        let soilOrder1;
                                        let soilOrder2;
                                        view.on("immediate-click", (event) => {
                                            const latitude =
                                                event.mapPoint.latitude;
                                            const longitude =
                                                event.mapPoint.longitude;
                                            const screenPoint = view.toScreen(
                                                new Point({
                                                    latitude,
                                                    longitude,
                                                })
                                            );
                                            setCoordinates({
                                                latitude: latitude,
                                                longitude: longitude
                                            })
                                            view.hitTest(screenPoint).then(
                                                (hitTestResult) => {
                                                    soilOrder1 =
                                                        hitTestResult.results[0]
                                                            .graphic.attributes
                                                            .esrisymbology;
                                                    if (
                                                        soilOrder1 !==
                                                        soilOrder2
                                                    ) {
                                                        setSoil({
                                                            id: null,
                                                            soil_order:
                                                                soilOrder1,
                                                            characteristics: "",
                                                            recommendations: "",
                                                        });
                                                        soilOrder2 = soilOrder1;
                                                    } else {
                                                        soilOrder2 = soilOrder1;
                                                    }
                                                }
                                            );
                                        });

                                        view.ui.add(locate, "top-left");
                                    }}
                                />
                            </div>
                    </div>
                </div>
                <div
                    className="soil-lower-half-container"
                    id={showDetails ? "" : "hide"}
                >
                    <div className="display-results-container">
                        <div
                            className="display-characteristics-container"
                            ref={soilDiv}
                        >
                            <h2 className="display-characteristics-heading">
                                Soil Characteristics:
                            </h2>
                            <p>{soil.characteristics}</p>
                        </div>
                        <div className="display-recommendations-container">
                            <h2 className="display-recommendations-heading">
                                Soil Recommendations:
                            </h2>
                            <p>{soil.recommendations}</p>
                        </div>
                    </div>
                    <button
                        id="soil-save-btn"
                        className="btn flagship-btn"
                        onClick={handleSaveSoilClick}
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Soil);
