import React, { useState, useEffect } from "react";
import { Icon, Pagination } from 'semantic-ui-react';

export default function MYInvoices() {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState({
    chk: false,
  });

  const selectAll = (value) => {
    setCheckedAll(value);
    setChecked((prevState) => {
      const newState = { ...prevState };
      for (const inputName in newState) {
        newState[inputName] = value;
      }
      return newState;
    });
  };

  const toggleCheck = (inputName) => {
    setChecked((prevState) => {
      const newState = { ...prevState };
      newState[inputName] = !prevState[inputName];
      return newState;
    });
  };

  useEffect(() => {
    let allChecked = true;
    for (const inputName in checked) {
      if (checked[inputName] === false) {
        allChecked = false;
      }
    }
    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [checked]);

  return (
    <div className="mx-2 mx-sm-1">
      <div>
        <p className="fs-6 fw-500 text-success-dark ml-1 mb-2">14 Records Selected</p>
        <div className="bg-white card-boxShadow border-radius-15 py-1 mb-2">
          <div className="row dashed-bottom px-4 py-2 px-sm-2">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <h6 className="fs-6 fw-500"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24.041 31">
                <g id="Group_7114" data-name="Group 7114" transform="translate(15182.979 1058)">
                  <g id="XMLID_39_" transform="translate(-15182.979 -1058)">
                    <g id="Group_7113" data-name="Group 7113" transform="translate(0.633 0.633)">
                      <path id="Path_19728" data-name="Path 19728" d="M350.061,400,345,405.061V400Z" transform="translate(-327.286 -375.327)" fill="#328128" />
                      <path id="Path_19729" data-name="Path 19729" d="M87.775,10V34.673H82.714v5.061H65V10Z" transform="translate(-65 -10)" fill="none" />
                    </g>
                    <path id="Path_19730" data-name="Path 19730" d="M79.041.633A.633.633,0,0,0,78.408,0H55.633A.633.633,0,0,0,55,.633V30.367a.633.633,0,0,0,.633.633H73.347a.633.633,0,0,0,.448-.185l5.061-5.061a.631.631,0,0,0,.184-.447h0ZM73.347,24.673a.633.633,0,0,0-.633.633v4.429H56.265V1.265h21.51V24.673Zm.633,4.167v-2.9h2.9Z" transform="translate(-55)" fill="#328128" />
                  </g>
                  <rect id="Rectangle_5979" data-name="Rectangle 5979" width="6" height="1" transform="translate(-15179.979 -1054)" fill="#328128" />
                  <rect id="Rectangle_5980" data-name="Rectangle 5980" width="8" height="1" transform="translate(-15179.979 -1053)" fill="#328128" />
                  <path id="Path_19731" data-name="Path 19731" d="M126.449,125H110.633a.633.633,0,0,0-.633.633v18.031a.633.633,0,0,0,.633.633H122.02v-1.265h-6.01v-5.694h9.806v2.531h1.265V125.633A.633.633,0,0,0,126.449,125Zm-.633,3.48H116.01v-2.214h9.806Zm-9.806,1.265h9.806v2.531H116.01Zm-1.265-3.48v2.214h-3.48v-2.214Zm-3.48,16.765V129.745h3.48v13.286Zm4.745-6.959v-2.531h9.806v2.531Z" transform="translate(-15289.5 -1175.092)" fill="#328128" />
                  <rect id="Rectangle_5981" data-name="Rectangle 5981" width="1" height="1" transform="translate(-15176.979 -1044)" fill="#328128" />
                  <rect id="Rectangle_5982" data-name="Rectangle 5982" width="1" height="1" transform="translate(-15176.979 -1041)" fill="#328128" />
                  <rect id="Rectangle_5983" data-name="Rectangle 5983" width="1" height="2" transform="translate(-15176.979 -1037)" fill="#328128" />
                  <rect id="Rectangle_5984" data-name="Rectangle 5984" width="1" height="1" transform="translate(-15176.979 -1034)" fill="#328128" />
                </g>
              </svg>
                <span className="veritical-align-text-top ml-1">Invoice</span></h6>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 text-right">
              <h2 className="fs-6 fw-500 text-danger">Total:$234 <button className="ui button bg-success-dark text-white fs-7 fw-400 px-4 px-sm-1 py-sm-1 ml-1">Pay Now</button></h2>
            </div>
          </div>
          <div className="myInvoiceTable">
            <table className="w-100">
              <thead>
                <tr>
                  <th className="text-center"><input type="checkbox" onChange={(event) => selectAll(event.target.checked)}
                    checked={checkedAll} /></th>
                  <th className="text-center">Invoice Amount</th>
                  <th className="text-center">Invoice Date</th>
                  <th className="text-center">Paid On</th>
                  <th className="text-center">Invoice Details</th>
                  <th className="text-center">Payment Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center"><input type="checkbox" disabled /></td>
                  <td className="text-center"><p className="fw-500"><label className="success-label">PAID</label> $98.00</p></td>
                  <td className="text-center"><p className="fw-500">18/08/2022</p></td>
                  <td className="text-center"><p className="fw-500">23/08/2022</p></td>
                  <td className="text-center"><p>Invoice#: 456 132 9870 <label><svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label></p></td>
                  <td className="text-center"><p>Receipt#: 456 132 9870 <label><svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label></p></td>
                </tr>

                <tr>
                  <td className="text-center"><input name="chk" type="checkbox" onChange={() => toggleCheck("chk")}
                    checked={checked["chk"]} /></td>
                  <td className="text-center"><p className="fw-500 error"><label className="danger-label">NOTPAID</label> $98.00</p></td>
                  <td className="text-center"><p className="fw-500">18/08/2022</p></td>
                  <td className="text-center"><p className="fw-500">23/08/2022</p></td>
                  <td className="text-center"><p>Invoice#: 456 132 9870 <label>
                    <svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label></p></td>
                  <td className="text-center"><p>-</p></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='pagination-div mt-2 mb-3 text-center'>
          <Pagination ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }} defaultActivePage={1} totalPages={10} />
        </div>
      </div>
    </div>
  )
}
