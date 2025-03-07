import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { RechartsLightcurve } from './components/RechartsLightcurve';
import { ApexChartsLightcurve } from './components/ApexChartsLightcurve';
import Chart from 'react-apexcharts';
import { PlotlyLightcurve } from './components/PlotlyLightcurve';

export const SERVICE_URL = 'http://127.0.0.1:8000';

function App() {
  const [sources, setSources] = useState(undefined);
  const [sourceSummaries, setSourceSummaries] = useState(undefined);
  const [lightcurve, setLightcurve] = useState();
  const [domain, setDomain] = useState();

  useEffect(() => {
    async function getSources() {
      const sources = await (
        await fetch(`${SERVICE_URL}/sources/`)
      ).json();
      setSources(sources)
    }
    getSources();
  }, [])

  useEffect(() => {
    if (!sources) return;
    async function getSourceSummaries() {
      const data = await Promise.all(
        sources.map(async (source) => (await fetch(`${SERVICE_URL}/sources/${source.id}/summary`)).json())
      )
      setSourceSummaries(data)
    }
    getSourceSummaries()
  }, [sources])

  useEffect(() => {
    if (!sources) return;
    async function getLightcurve() {
      const data = await (
        await fetch(`${SERVICE_URL}/lightcurves/${sources[0].id}/all`)
      ).json()
      setLightcurve(data)
    }
    getLightcurve()
  }, [sources])
  
  if (lightcurve) {
    return (
      <div>
        {/* <details>
          <summary>Recharts Lightcurve</summary>
          <RechartsLightcurve lightcurveBand={lightcurveBand} />
        </details>
        <details>
          <summary>ApexCharts Lightcurve</summary>
          <ApexChartsLightcurve lightcurveBand={lightcurveBand} />
        </details>
        <details>
          <summary>Plotly Lightcurve</summary> */}
          <PlotlyLightcurve lightcurve={lightcurve} />
        {/* </details> */}
      </div>
    )
  } else {
    return null
  }
}

export default App
