import { useCallback, useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { SERVICE_URL } from '../configs/constants';

export function PlotlyLightcurve({lightcurve}) {
    const [tooltipContent, setTooltipContent] = useState(undefined);
    const [clickedMarkerIndex, setClickedMarkerIndex] = useState(undefined);

    const [plotData, setPlotData] = useState(
      () => {
        return lightcurve.bands.sort((a,b) => a.band.frequency > b.band.frequency).map(lightcurveBand => {
          const data = {
            name: `${lightcurveBand.band.name}, ${lightcurveBand.band.telescope}, ${lightcurveBand.band.instrument}`,
            x: [],
            y: [], 
            error_y: {
              type: 'data',
              array: [],
              color: null,
            },
            type: 'scatter',
            mode: 'markers',
            marker: {
              size: 10,
              line: {
                width: [],
                color: "#FFF"
              }
            },
            // hovertemplate: 'Time: %{x|%H:%M %d %b %Y} <br><br> Flux: %{y} mJy <extra></extra>'
          };
          lightcurveBand.time.forEach(
            (time, index) => {
              const day = new Date(time);
              const flux = lightcurveBand.i_flux[index];
              const errorY = lightcurveBand.i_uncertainty[index]
              data.x.push(day)
              data.y.push(flux)
              data.error_y.array.push(errorY)
              data.marker.line.width.push(0);
            }
          )
          return data;
        })
      }
    )

    const changeMarkerLineWidth = useCallback(
      (hoverData, newLineWidth, reset) => {
        setPlotData(
          (prev) => prev.map((d, i) => {
            if (reset) {
              const newWidths = new Array(d.length, 0);
              return ({
                ...d,
                marker: {
                  ...d.marker,
                  line: {
                    ...d.marker.line,
                    width: newWidths,
                  }
                }
              })
            }

            if (hoverData && hoverData.curveNumber === i) {
              const newWidths = [...d.marker.line.width];
              if (!clickedMarkerIndex) {
                newWidths[hoverData.pointIndex] = newLineWidth;
              } else {
                if (!(hoverData.curveNumber === clickedMarkerIndex.curveNumber && hoverData.pointIndex === clickedMarkerIndex.pointIndex)) {
                  newWidths[hoverData.pointIndex] = newLineWidth;
                }
              }
              return ({
                ...d,
                marker: {
                  ...d.marker,
                  line: {
                    ...d.marker.line,
                    width: newWidths,
                  }
                }
              })
            } else {
              return d
            }
          })
        )
      }, [clickedMarkerIndex]
    )

    const handleKeyDown = useCallback((e) => {
      if (tooltipContent && e.key == 'Escape') {
        setTooltipContent(undefined)
        setClickedMarkerIndex(undefined)
        changeMarkerLineWidth(undefined, 0, true)
      }
    }, [tooltipContent, changeMarkerLineWidth])

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [handleKeyDown]);

    const handleDataClick = useCallback(
      async (e) => {
        const {pointIndex, curveNumber} = e.points[0];
        const id = lightcurve.bands[curveNumber].id[pointIndex];
        const point = {
          x: e.points[0].x, 
          y: Number(e.points[0].y).toFixed(3), 
          i_uncertainty: Number(e.points[0]["error_y.array"]).toFixed(3),
          clientX: e.event.clientX,
          clientY: e.event.clientY,
        };
        const response = await fetch(`${SERVICE_URL}/cutouts/flux/${id}`)
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setTooltipContent({image: imageUrl, data: point});
        changeMarkerLineWidth(undefined, 1, false);
        setClickedMarkerIndex({pointIndex, curveNumber});
      }, [lightcurve, clickedMarkerIndex]
    )

    const handleOnHover = useCallback(
      (e) => {
        const {pointIndex, curveNumber} = e.points[0];
        changeMarkerLineWidth({pointIndex, curveNumber}, 1, false)
      }, [changeMarkerLineWidth]
    )

    const handleOnUnhover = useCallback(
      (e) => {
        const {pointIndex, curveNumber} = e.points[0];
        changeMarkerLineWidth({pointIndex, curveNumber}, 0, false)
      }, [changeMarkerLineWidth]
    )

    const plotLayout = useMemo(() => ({
      width: 1200,
      height: 500,
      yaxis: {
        title: {
          text: 'Flux (mJy)',
        },
      },
      xaxis: {
        title: {
          text: 'Time (d)',
        },
      }
    }), []);
    
    return (
      <div>
        <Plot
          layout={plotLayout}
          data={plotData}
          onClick={handleDataClick}
          onRelayout={() => setTooltipContent(undefined)}
          onHover={handleOnHover}
          onUnhover={handleOnUnhover}
        />
        {tooltipContent && (
          <div style={{
              position: 'absolute', 
              left: `${tooltipContent.data.clientX}px`, 
              top: `${tooltipContent.data.clientY}px`,
              backgroundColor: 'white',
              opacity: 0.8,
              border: '1px solid black',
              padding: 5,
            }}
          >
            <button
              style={{margin: '0 auto'}}
              title="Click to close (or press Esc)"
              onClick={() => {
                setTooltipContent(undefined); 
                setClickedMarkerIndex(undefined)
                changeMarkerLineWidth(undefined, 0, true)
              }}
            >
              x
            </button>
            <p>Time: {tooltipContent.data.x}</p>
            <p>Flux: {tooltipContent.data.y} +/- {tooltipContent.data.i_uncertainty} mJy</p>
            <img src={tooltipContent.image} />
          </div>
        )}
      </div>
    )
}