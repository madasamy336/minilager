import React, {useState} from "react";
import ReactSlider from "react-slider";

const UnitsRangeSlider = (props) => {
    console.log('rangesider');
    let intialMin 
    let intialMax
    intialMin =Number(sessionStorage.getItem('MinValue'));
    intialMax = Number(sessionStorage.getItem('MaxValue'));
    const[min, setMin] = useState(intialMin);
    const[max, setMax] = useState(intialMax);
    
    const handleChange = (event)=> {
        setMin(min);
        setMax(max);
    }
    return (
        <div className="range-div mt-2">
            <ReactSlider
                className="range-slider"
                thumbClassName="thumb"
                trackClassName="track"
                defaultValue={[intialMin, intialMax]}
                min={intialMin}
                max={intialMax}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext="auto"
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
                step={10}
                
                // onChange={handleChange}
            />
        </div>
    )
}

export default UnitsRangeSlider