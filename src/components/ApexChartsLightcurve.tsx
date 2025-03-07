import Chart from 'react-apexcharts';

export function ApexChartsLightcurve({lightcurveBand}) {
    const zippedData = lightcurveBand.time.map(
      (time, index) => {
        const day = new Date(time).getTime() / (1000 * 60 * 60 * 24);
        const flux = lightcurveBand.i_flux[index];
        // const errorY = [flux - lightcurveBandTest.i_uncertainty[index], flux + lightcurveBandTest.i_uncertainty[index]]
        return {x: day, y: flux}
      }
    )

    // const errorBarData = zippedData.reduce(
    //     (prev, curr, index) => {
    //         const data = [
    //             {
    //                 x: curr.x,
    //                 y: [
    //                     curr.y - lightcurveBandTest.i_uncertainty[index],
    //                     curr.y + lightcurveBandTest.i_uncertainty[index]
    //                 ]
    //             },
    //             // {
    //             //     x: curr.x,
    //             //     y: curr.y + lightcurveBandTest.i_uncertainty[index]
    //             // },
    //             // null,
    //         ];
    //         if (prev) {
    //             return prev.concat(data)
    //         } else {
    //             return data
    //         }
    //     }, undefined
    // )

    const rangeBarData = zippedData.map(
        (d, i) => ({
            x: d.x,
            y: [
                d.y - lightcurveBand.i_uncertainty[i],
                d.y + lightcurveBand.i_uncertainty[i],
            ]
        })
    )

    // console.log(rangeBarData)

    return (
        <Chart
            width={1200}
            height={500}
            type='scatter'
            options={{
                chart: {
                    type: 'scatter',
                    zoom: {
                        enabled: true,
                        type: 'xy',
                    },
                    height: 200,
                },
                xaxis: {
                    tickAmount: 40,
                    type: 'category'
                },
                yaxis: {
                    tickAmount: 10,
                },
            }}
            series={[
                {
                    name: "lightcurve",
                    data: zippedData,
                    type: 'scatter',
                },
            ]}
        />
    )
}