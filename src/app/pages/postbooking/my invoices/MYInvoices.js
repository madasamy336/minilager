import React from "react"; 
import { Icon, Pagination } from 'semantic-ui-react';

export default function MYInvoices() {
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
                  <th className="text-center"><input value="all" type="checkbox" /></th>
                  <th className="text-center">Invoice Amount</th>
                  <th className="text-center">Invoice Date</th>
                  <th className="text-center">Paid On</th>
                  <th className="text-center">Invoice Details</th>
                  <th className="text-center">Payment Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center"><input type="checkbox" disabled/></td>
                  <td className="text-center"><p className="fw-500"><label className="success-label">PAID</label> $98.00</p></td>
                  <td className="text-center"><p className="fw-500">18/08/2022</p></td>
                  <td className="text-center"><p className="fw-500">23/08/2022</p></td>
                  <td className="text-center"><p>Invoice#: 456 132 9870 <label for="uploadInvoice"><svg className="ml-1 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18">
                    <path id="Path_121" data-name="Path 121" d="M19.5,16.5v3H6.5v-3h-2v3c0,1.238.763,3,2,3h13a3.757,3.757,0,0,0,3-3v-3Zm-12-7,1,2,3-3v9h3v-9l3,3,1-2-5-5Z" transform="translate(-4.5 -4.5)" fill="#686868" />
                  </svg></label><input id="uploadInvoice" type="file" /></p></td>
                  <td className="text-center"><p>Receipt#: 456 132 9870 <label for="uploadReceipt"><svg className="ml-1 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18">
                    <path id="Path_121" data-name="Path 121" d="M19.5,16.5v3H6.5v-3h-2v3c0,1.238.763,3,2,3h13a3.757,3.757,0,0,0,3-3v-3Zm-12-7,1,2,3-3v9h3v-9l3,3,1-2-5-5Z" transform="translate(-4.5 -4.5)" fill="#686868" />
                  </svg></label><input id="uploadReceipt" type="file" /></p></td>
                </tr>

                <tr>
                  <td className="text-center"><input value="1" type="checkbox" /></td>
                  <td className="text-center"><p className="fw-500 error"><label className="danger-label">NOTPAID</label> $98.00</p></td>
                  <td className="text-center"><p className="fw-500">18/08/2022</p></td>
                  <td className="text-center"><p className="fw-500">23/08/2022</p></td>
                  <td className="text-center"><p>Invoice#: 456 132 9870 <label for="uploadInvoice">
                    <svg className="ml-1 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18">
                      <path id="Path_121" data-name="Path 121" d="M19.5,16.5v3H6.5v-3h-2v3c0,1.238.763,3,2,3h13a3.757,3.757,0,0,0,3-3v-3Zm-12-7,1,2,3-3v9h3v-9l3,3,1-2-5-5Z" transform="translate(-4.5 -4.5)" fill="#686868" />
                    </svg></label><input id="uploadInvoice" type="file" /></p></td>
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
