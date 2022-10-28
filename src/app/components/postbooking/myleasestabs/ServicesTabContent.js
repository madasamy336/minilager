import React from 'react'

export default function ServicesTabContent() {
  return (
    
    <div className='serviceContent overflow-x-auto'>
     <div className='serviceTable'>
       <table className='w-100  text-center table-layout-fixed'>
        <thead className='py-2'>
          <tr>
            <th>
              SERVICE
            </th>
            <th>
              TYPE
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
              {service:'Shift Units',date:'02/09/2021',type:'Invoice Based Service',amount:'$200'},
              {service:'Cleaning',date:'08/09/2021',type:'One Time Charge',amount:'$200'},
              {service:'Shift Units',date:'21/09/2021',type:'Invoice Based Service',amount:'$200'},

            ].map(({service,date,type,amount})=>(
            
          <tr>
            <td>
              <div className='d-flex justify-content-center'>
                <div className=''>
                  <img height='75' width='75' src='/assets/images/serviceTabPeoples.svg' alt='servicePeople' />
                </div>
                <div className='text-left ml-2'>
                  <p className='fw-700 my-1'>{service}</p>
                  <p className='text-light-gray fs-8 fw-600'>{date}</p>
                </div>


              </div>
            </td>
            <td className='veritical-align-middle'>
              <span className='fw-600'>{type}</span>
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
