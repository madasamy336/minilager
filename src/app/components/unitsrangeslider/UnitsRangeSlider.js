import React, {useState} from "react";
import ReactSlider from "react-slider";

const UnitsRangeSlider = () => {
    const[min, setMin] = useState(100);
    const[max, setMax] = useState(2000);
    return (
        <div className="range-div mt-2">
            <ReactSlider
                className="range-slider"
                thumbClassName="thumb"
                trackClassName="track"
                defaultValue={[min, max]}
                min={100}
                max={2000}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={state => `Thumb value ${state.valueNow}`}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={300}
                onChange={(min, max) => {
                    setMin(min);
                    setMax(max);
                }}
            />
        </div>
    )
}

export default UnitsRangeSlider