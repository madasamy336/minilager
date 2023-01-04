import React, {useState , useEffect} from "react";
import Helper from "../../helper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let helper = new Helper();
const AddonCard = (props) => {
  let unitId = localStorage.getItem('unitid');
  let merchandiseSessionvalue =JSON.parse(sessionStorage.getItem('merchandiseItem'));
  let merchandiseItem = [];
  const [countItem, setCount] = useState(0);
    const merchandiseDeleteItem = (e, unitid, merchandiseid) => {
        e.preventDefault();
        if(countItem >0){
          setCount(countItem - props.decrementBy)
          setMerchandiseAddcard(unitid,merchandiseid,countItem)
         
        }   

          
    }

    const setMerchandiseAddcard = (unitId, itemId, count ) => {
    let obj = {
      itemId: itemId,
      qnty: parseInt(count),
    };
    let pos = -1;
    if (merchandiseItem.length > 0) {
      pos = merchandiseItem
        .map(function (e) {
          return e.unitId;
        })
        .indexOf(unitId);
    }
    if (pos > -1) {
      let addedMerch = merchandiseItem[pos];
      let addedItemPos = addedMerch.merchandise
        .map(function (e) {
          return e.itemId;
        })
        .indexOf(itemId);
      if (addedItemPos > -1) {
        if (obj.qnty > 0) {
          merchandiseItem[pos].merchandise[addedItemPos].qnty = obj.qnty;
        } else {
          merchandiseItem[pos].merchandise.splice(addedItemPos, 1);
          if (merchandiseItem[pos].merchandise.length <= 0) {
            merchandiseItem.splice(pos, 1);
          }
        }
      } else {
        merchandiseItem[pos].merchandise.push(obj);
      }
    } else {
      if (obj.qnty > 0) {
        merchandiseItem.push({
          unitId: unitId,
          merchandise: [obj]
        });
      }
    }
    if (merchandiseItem.length > 0) {
      pos = merchandiseItem
        .map(function (e) {
          return e.unitId;
        })
        .indexOf(unitId);
    }
    }

    useEffect(()=>{
    
      if(merchandiseSessionvalue !== null){
        merchandiseSessionvalue.forEach((merchandiseItem)=> {
         let newArray = merchandiseItem.merchandise.filter((e)=> e.itemId === props.response.id);
         newArray.forEach((e)=> {
          setCount(e.qnty);
         })

  
        });
      }

    },[])

    const merchandiseAddItem = (e,unitid, merchandiseId) => {
        e.preventDefault();
        if(countItem >= props.response.availableStock){
          toast.error('Out of Stock', {
            position: "top-right",
            autoClose: 3000,
            duration:100,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            toastId:"merchandiseError"
            });
          return
        }else{
          setCount(countItem + props.incrementBy);
          setMerchandiseAddcard(unitid,merchandiseId,countItem);
         

        }

       
    }
    return(
        <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
           <ToastContainer />       
        <div className='card card-border-secondary border-radius-10'>
          <div className='merchandise-img text-center py-1 card-border-bottom'>
            {props.response.imageUrl !== null?
             <img src={props.response.imageUrl} alt="Merchandise" />:
             <img src="/assets/images/merchandise.png" alt="Merchandise" />
              
            }          
          </div>
          <div className='row p-1'>
            <div className='col-lg-6 col-md-6 col-sm-6'>
              <p>{props.response.productName}</p>
              <span className='text-success-dark fw-500'>{helper.displayCurrency(props.response.price.netAmount)}</span>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-6'>
              <div className='counter'>
                <a href="/" onClick={(e)=>{merchandiseDeleteItem(e,unitId,props.response.id)}} className='text-white'>-</a>
                <input className={`merchandiseInput merchandise_${props.response.id}`} type="text" value={countItem  } />
                <a href="/" onClick={(e)=>merchandiseAddItem(e,unitId,props.response.id)} className='text-white'>+</a>
                {
                  
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default AddonCard;