import React from 'react'

export default function MerchandiseTabContent() {
  return (
    <div className='MerchandiseContent overflow-x-auto'>
    <div className='MerchandiseTable'>
      <table className='w-100 text-center table-layout-fixed'>
       <thead className='py-2'>
         <tr>
           <th>
           PRODUCT NAME
           </th>
           <th>
           QTY
           </th>
           <th>
             AMOUNT
           </th>
         </tr>
       </thead>
       </table>
      <div className='ScrollBody overflow-y-auto'>
       <table className='w-100  text-center table-layout-fixed'>
       <tbody>
         {
           [
             {service:'Shift Units',date:'02/09/2021',quantity:'6',amount:'$200'},
             {service:'Cleaning',date:'08/09/2021',quantity:'6',amount:'$200'},
             {service:'Shift Units',date:'21/09/2021',quantity:'6',amount:'$200'},

           ].map(({service,date,quantity,amount})=>(
           
         <tr>
           <td>
             <div className='d-flex justify-content-center'>
               <div className=''>
                 <img height='75' width='75' src='/assets/images/merchandiseTabbox.svg' alt='servicePeople' />
               </div>
               <div className='text-left ml-2'>
                 <p className='fw-700 my-1'>{service}</p>
                 <p className='text-light-gray fs-8 fw-600'>{date}</p>
               </div>


             </div>
           </td>
           <td className='veritical-align-middle'>
             <span className='fw-600'>{quantity}</span>
           </td>
           <td className='veritical-align-middle'>
             <span className='fw-600'>{amount}</span>
           </td>
         </tr>
           ))
         }
       </tbody>
      </table>
     </div>
    </div>
   </div>
  )
}
