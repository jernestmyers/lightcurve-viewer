import { useState, useEffect } from "react";
import { SERVICE_URL } from "../configs/constants";
import { useParams } from "react-router";
import { PlotlyLightcurve } from "./PlotlyLightcurve";

export function Source() {
    const {id} = useParams();
    const [sourceSummary, setSourceSummary] = useState(undefined);
    const [lightcurveData, setLightcurveData] = useState(undefined);

    useEffect(() => {
        async function getSourceSummary() {
            const data = await (await fetch(`${SERVICE_URL}/sources/${id}/summary`)).json()
            setSourceSummary(data)
        }
        getSourceSummary();
    }, [])

    useEffect(() => {
        async function getLightcurveData() {
        const data = await (
            await fetch(`${SERVICE_URL}/lightcurves/${id}/all`)
        ).json()
        setLightcurveData(data)
        }
        getLightcurveData()
    }, [])

    if (sourceSummary && lightcurveData) {
        return (
            <>
                <h2>Source</h2>
                <h3>ra: {sourceSummary.source.ra.toFixed(5)}, dec: {sourceSummary.source.dec.toFixed(5)}</h3>
                <br />
                <h3>Lightcurve</h3>
                <PlotlyLightcurve lightcurve={lightcurveData} />
            </>
        )
    } else {
        return (
            <h2>Loading...</h2>
        )
    }
}