import React, {useState , useEffect} from "react";
import Helper from "../../helper";
let helper = new Helper();
const AddonCard = (props) => {
  const [count, setCount] = useState(0);
    const merchandiseDeleteItem = (e) => {
        e.preventDefault();
        if(count >0){
          setCount(count - props.decrementBy)

        }
           
    }

    // useEffect(()=>{
    //   if(count > props.response.availableStock){
    //     window.alert('test');
    //   }

    // },[count])

    const merchandiseAddItem = (e) => {
        e.preventDefault();
        if(count >= props.response.availableStock){
          window.alert('Out of Stock');
          return
        }else{
          setCount(count + props.incrementBy)

        }
       
    }
    return(
        <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
        <div className='card card-border-secondary border-radius-10'>
          <div className='merchandise-img text-center py-1 card-border-bottom'>
            <img src={props.response.imageUrl} alt="Merchandise" />
          </div>
          <div className='row p-1'>
            <div className='col-lg-6 col-md-6 col-sm-6'>
              <p>{props.response.productName}</p>
              <span className='text-success-dark fw-500'>{helper.displayCurrency(props.response.price.netAmount)}</span>
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