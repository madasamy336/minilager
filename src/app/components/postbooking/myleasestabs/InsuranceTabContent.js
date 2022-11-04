import React, { useState } from 'react'

export default function InsuranceTabContent() {
    const [activePlan,SetactivePlan]=useState('');
    const [changePlan,SetChangePlan]=useState(false);
    const [ownInsurance,SetownInsurance]=useState(false)
    const SavePlan=(e)=>{
        e.preventDefault();
        SetChangePlan(false)
    }
  return (
    <div className='insuranceContent'>
           <div className="row">
              {changePlan
              
              && [
                 
                  { plane: 'GOLD PLAN', amount: '$5000', monthpay: '$200', planStatus: 1 },
                  { plane: 'SILVER PLAN', amount: '$2000', monthpay: '$150', planStatus: 0 },
                  { plane: 'FLOATER PLAN', amount: '$2000', monthpay: '$100', planStatus: 0 },
                  { plane: 'I HAVE A', amount: 'OWN INSURANCE' }
              ].map(({ plane, amount, monthpay, planStatus }) => (
               
                  <div className='col-lg-3 col-md-6 col-sm-12 px-4 mb-1'>
                      <div className={`card changePlanCard cursor-pointer  border-radius-10 text-center p-2 ${activePlan === plane && 'active'}`} onClick={() => SetactivePlan(plane)}>
                          <p className=' fs-7 fw-500 pb-1 mt-2'>{plane}</p>
                          <h4 className={` fs-4 fw-500 pb-2 ${activePlan === plane ? 'text-white' : 'text-success-dark'}`}>{amount}</h4>
                          {monthpay && <span className='fs-8 fw-600 d-block mb-1'>{monthpay} Per Month</span>}
                          {planStatus === 1 && <span className='text-danger fs-8 d-block fw-600 mb-2'>Current Plan</span>}

                      </div>
                  </div>
               
              ))
              }
           </div>
          
              {
                !changePlan &&
         <div className="row">
            <div className='col-lg-4 col-md-4 col-sm-12 px-4 mb-1 '>
                <div className='card cursor-pointer  border-radius-10 text-center p-2' >
                    <p className=' fs-7 fw-500 pb-1 mt-2'>GOLD PLAN</p>
                    <h4 className=' fs-4 fw-500 pb-2  text-success-dark'>$2000</h4>
                    <span className='fs-8 fw-600 d-block mb-1'>$200 Per Month</span>
                     <span className='text-secondary fs-8 d-block fw-600 mb-2'>Expires on 31/07/2024</span>
                     <button  className="ui button bg-success-dark fs-8 fw-400 text-white px-2 py-1" onClick={()=>SetChangePlan(true)}>Change Plan</button>

                </div>
            </div>
            {
                ownInsurance &&
             <div className='col-lg-8 col-md-8 col-sm-12 px-4 mb-1 '>
                <div className='bg-layout'>
                    <div className='invoiceDocumentContainer overflow-y-auto'>
                        {/* for document preview */}
                    </div>
                    <div className='text-center'>
                    <button   className="ui button basic box-shadow-none border-success-dark-light-1 fs-8 px-2 py-1 my-2" ><span className='text-success'>Download</span></button>
                        </div>
                    
               </div>
               </div>

            }
            </div>
              }
         
              
              

                  {changePlan &&
                <div className='text-center mt-3'>
                <button   className="ui button  basic border-success-dark-1 fs-8 fw-400 text-dark px-5 mr-2"  onClick={()=>SetChangePlan(false)}>CANCEL</button>
                <button className="ui button bg-success-dark   fs-8 fw-400 text-white px-5" onClick={e=>SavePlan(e)}>SAVE</button>
            </div>
              }
    </div>
  )
}
