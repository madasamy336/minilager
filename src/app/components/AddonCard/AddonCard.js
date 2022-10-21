import React, {useState} from "react";

const AddonCard = (props) => {
    const [count, setCount] = useState(1);

    const merchandiseDeleteItem = (e) => {
        e.preventDefault();
        if (count > 1) {
            setCount(count - props.decrementBy)
        }
    }
    const merchandiseAddItem = (e) => {
        e.preventDefault();
        setCount(count + props.incrementBy)
    }
    return(
        <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
        <div className='card card-border-secondary border-radius-10'>
          <div className='merchandise-img text-center py-1 card-border-bottom'>
            <img src="/assets/images/merchandise.png" alt="Merchandise" />
          </div>
          <div className='row p-1'>
            <div className='col-lg-6 col-md-6 col-sm-6'>
              <p>Small Box</p>
              <span className='text-success-dark fw-500'>$150</span>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-6'>
              <div className='counter'>
                <a href="/" onClick={merchandiseDeleteItem} className='text-white'>-</a>
                <input className='merchandiseInput' type="text" value={count} />
                <a href="/" onClick={merchandiseAddItem} className='text-white'>+</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default AddonCard;