import { ErrorBar, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

export function RechartsLightcurve({lightcurveBand}) {
    const zippedData = lightcurveBand.time.map(
      (time, index) => {
        const day = new Date(time).getTime() / (1000 * 60 * 60 * 24);
        const flux = lightcurveBand.i_flux[index];
        const errorY = [flux - lightcurveBand.i_uncertainty[index], flux + lightcurveBand.i_uncertainty[index]]
        return {x: day, y: flux, errorY}
      }
    )
    const timeVals = zippedData.map(d => d.x)
    const min = Math.min(...timeVals)
    const max = Math.max(...timeVals)
    return (
      <ScatterChart
        width={1200}
        height={500}
        // onDoubleClick={(e) => setDomain([e.xValue - 10, e.xValue + 10])}
      >
        <Tooltip />
        {/* <XAxis dataKey="x" label="time" type='number' unit="d" domain={domain ?? [min, max]}/> */}
        <XAxis dataKey="x" label="time" type='number' unit="d" domain={[min, max]}/>
        <YAxis dataKey="y" label="flux" type='number' unit="mJy" />
        {/* <Scatter data={zippedData.filter(d => domain ? d.x > domain[0] && d.y < domain[1] : d)}> */}
        <Scatter data={zippedData}>
          <ErrorBar dataKey="errorY" width={4} strokeWidth={2} direction='y' />
        </Scatter>
      </ScatterChart>
    )
}