import React, { useState, useEffect } from "react";
import { Icon, Item, ItemMeta, Pagination, Button, Modal, Placeholder, Loader, Segment, Image } from 'semantic-ui-react';
import parse from "html-react-parser";
import instance from "../../../services/instance";
import request from '../../../services/request';
import Helper from "../../../helper";
import { json } from "react-router-dom";
import ReactDOM from 'react-dom';
import { useTranslation } from "react-i18next";

let helper = new Helper();
let userid = localStorage.getItem("userid");
let invoiceId_No_Array = [];
let TotalAmountArray = [];
//let totalAmount = 0;
let currentRecords;
let pageNumbers;
let nPages;
export default function MYInvoices() {
  const { t, i18n } = useTranslation();
  const [invoiceitems, setInvoiceItems] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCheck, setIsCheck] = useState([]);
  const [invoiceNum, setInvoiceNo] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [PaymentModal, setpaymentModal] = useState({ open: false, dimmer: undefined })
  const [mondelcontent, setModelcontent] = useState(``);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [isLoading, setLoader] = useState(false);
  let invoiceFeeid;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  if (typeof invoiceitems !== "undefined" && invoiceitems !== null && invoiceitems !== "" && invoiceitems.length > 0) {
    currentRecords = invoiceitems.slice(indexOfFirstRecord, indexOfLastRecord);
    nPages = Math.ceil(invoiceitems.length / recordsPerPage);
    pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  }

  const prevPage = () => {
    if (currentPage !== 1)
      setCurrentPage(currentPage - 1);
  }

  const nextPage = () => {
    setLoader(true)
    if (currentPage !== nPages) {
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setLoader(false)
      }, 1500);
    }
  }


  const selectInvoice = (e, unitid, latefees) => {
    let invoiceNumber = 0;
    let selectallcheckbox = document.querySelectorAll(`.six-multi-select-check-${unitid}`);
    if (e.target.checked == true) {
      setIsCheck(isCheck.concat(unitid));
      selectallcheckbox.forEach((data) => {
        if (data.dataset.latefees === e.target.dataset.latefees) {
          data.checked = true;
          if (data.disabled) {
            data.checked = false;
          }
          invoiceId_No_Array.push({
            invoiceId: data.value,
            invoiceNumber: data.dataset.invoicenumber,
            amount: data.dataset.amount,
            feesid: data.dataset.latefees
          });
          selectallcheckbox = [];
        }
      })
    } else {
      setIsCheck(isCheck.filter((e) => e !== unitid));
      selectallcheckbox.forEach((data) => {
        if (data.dataset.latefees === e.target.dataset.latefees) {
          data.checked = false;
          const objWithIdIndex = invoiceId_No_Array.findIndex((obj) => obj.feesid === data.dataset.latefees);
          if (objWithIdIndex > -1) {
            invoiceId_No_Array.splice(objWithIdIndex, 1);
          }
          selectallcheckbox = [];

        }
      })

    }
    sessionStorage.setItem("invoiceselected", JSON.stringify(invoiceId_No_Array));
    let invoiceSelected = JSON.parse(sessionStorage.getItem('invoiceselected'));
    if (invoiceSelected !== 'undefined' && invoiceSelected !== null) {
      invoiceSelected.forEach((item) => {
        invoiceNumber = invoiceNumber + parseFloat(item.amount);
      })

    }


    setTotalAmount(invoiceNumber);

  }

  const selectAllCheckBox = (e) => {

    let unPaidInvoiceStaus = invoiceitems.filter(i => i.invoiceStatus === "UNPAID");
    if (typeof unPaidInvoiceStaus !== "undefined" && unPaidInvoiceStaus !== null && unPaidInvoiceStaus !== "" && unPaidInvoiceStaus.length > 0) {
      setIsCheck(unPaidInvoiceStaus.map(item => item.id));
    }
    if (isCheckAll) {
      setIsCheck([]);
    }
    if (e.target.checked) {
      setIsCheckAll(true);  
      TotalAmountArray = [];
      unPaidInvoiceStaus.forEach(item => {
        TotalAmountArray.push(item.unPaidBalance);
      });
      //totalAmount = TotalAmountArray.reduce((pre, curr) => pre + curr, 0);

    } else {
      setIsCheckAll(false);
      TotalAmountArray = [];
      //totalAmount = 0;
    }
  }

  const paymentProcess = (paymentTransactionResponse) => {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    var invoiceNumber = 0;
    let invoiceSelected = JSON.parse(sessionStorage.getItem('invoiceselected'));
    if (typeof invoiceSelected !== 'undefined' && invoiceSelected !== null) {
      invoiceSelected.forEach((item) => {
        invoiceNumber = invoiceNumber + parseFloat(item.amount);
      })
    }

    let paymentProcessRequest;
    paymentProcessRequest = {
      leaseInvoices: invoiceId_No_Array,
      totalPayment: invoiceNumber,
      paymentRefNumber: paymentTransactionResponse.last4Digit,
      paymentType: "CreditCard",
      paymentTransactionResponse: paymentTransactionResponse
    }

    instance
      .post(request.invoicePaymentFormSuccess + '/' + userid, paymentProcessRequest, config)
      .then((response) => {
        const successMsgData = response.data;
        if (typeof successMsgData !== "undefined" && successMsgData !== null && successMsgData !== "") {
          if (response.data.isSuccess === true && response.data.returnMessage === "SUCCESS") {
            setpaymentModal({ open: false });
            //totalAmount = 0;
            setTotalAmount(0);
            TotalAmountArray = [];
            setIsCheck([]);
            customInvoices();
            sessionStorage.setItem('invoiceselected', JSON.stringify([]))
            invoiceId_No_Array = [];
            setIsCheckAll(false);
          }

        }

      })
      .catch((error) => {
        console.log(error);
      })

  }

  useEffect(() => {
    setTotalAmount(0);
    customInvoices();
    const ReceiveIframeResponse = (event) => {
      if (event.data.message !== null && typeof event.data.message !== 'undefined') {
        let paymentTransactionResponse = JSON.parse(event.data.message);
        if (typeof paymentTransactionResponse !== "undefined" && paymentTransactionResponse !== null && paymentTransactionResponse !== "") {
          paymentProcess(paymentTransactionResponse);
        }
      }
    }

    window.addEventListener("message", ReceiveIframeResponse, false);

    return () => window.removeEventListener("message", ReceiveIframeResponse, false);

  }, []);


  const customInvoices = () => {
    setLoader(true)
    let userid = localStorage.getItem("userid");
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let unitInvoice;

    unitInvoice = {
      userId: userid
    }

    instance

      .get(request.invoices + '/' + userid, unitInvoice, config)
      .then(response => {
        invoiceId_No_Array = [];
        sessionStorage.setItem('invoiceselected', JSON.stringify([]))
        const invoiceData = response.data;
        if (typeof invoiceData !== "undefined" && invoiceData !== null && invoiceData !== "") {
          const invoiceResult = response.data.result;
          if (typeof invoiceResult !== "undefined" && invoiceResult !== null && invoiceResult !== "") {
            setInvoiceItems(invoiceResult);
          }

        }
        setLoader(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const paymentformload = () => {

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let paymentForm;

    paymentForm = {
      userId: userid,
      hostURL: "",
      chargeableAmount: totalAmount
    }

    instance
      .post(request.invoicePaymentForm + '/' + userid, paymentForm, config)
      .then((response) => {
        const paymentformData = response.data;
        if (typeof paymentformData !== "undefined" && paymentformData !== null && paymentformData !== "") {
          const paymentFormUrl = response.data.result;
          if (typeof paymentFormUrl !== "undefined" && paymentFormUrl !== null && paymentFormUrl !== "") {
            setModelcontent(`
            <div className='row' style="height:400px;">
            <div className='col-12 col-md-12 mb-3 px-1'>
              <iframe id="iframePreviewLicense"  scrolling="auto" type='application/pdf' loading="lazy" src="${paymentFormUrl}" style="width:100%;height:100%;"></iframe>
            </div>
            </div>`)
            setpaymentModal({ open: true });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })


  }

  return (
    <div className="mx-2 mx-sm-1">
      <div>
        {isCheck.length > 0 && <p className="fs-6 fw-500 text-success-dark ml-1 mb-2"> {isCheck.length} {t("Records Selected")}</p> }
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
                <span className="veritical-align-text-top ml-1">{t("Invoice")}</span></h6>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 text-right">
              <h2 className="fs-6 fw-500 text-danger">{t("Total")}: {helper.displayCurrency(totalAmount)}  {totalAmount > 0 ? <button className="ui button bg-success-dark text-white fs-7 fw-400 px-4 px-sm-1 py-sm-1 ml-1" onClick={() => paymentformload()}>{t("Pay Now")}</button> : ""} </h2>
            </div>
          </div>
          <div className="myInvoiceTable">
            {isLoading ? (<Segment>
              <Placeholder fluid>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder></Segment>) : (
              <table className="w-100">
                <thead>
                  <tr>
                    <th className="text-center"><span></span></th>
                    {/* <th className="text-center d-none"><input type="checkbox" id="selectedAllCheckbox" onChange={(e) => selectAllCheckBox(e)} /></th> */}
                    <th className="text-center">{t("Invoice Amount")}</th>
                    <th className="text-center">{t("Invoice Date")}</th>
                    <th className="text-center">{t("Paid On")}</th>
                    <th className="text-center">{t("Invoice Details")}</th>
                    <th className="text-center">{t("Payment Receipt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {typeof currentRecords !== "undefined" && currentRecords !== null && currentRecords !== "" && currentRecords.length > 0 ?
                    currentRecords.map((item) => {
                      if (item.invoiceItems !== null) {
                        item.invoiceItems.forEach((invoice) => {
                          if (invoice.invoiceId !== null) {
                            invoiceFeeid = invoice.invoiceId;
                          } else {
                            invoiceFeeid = item.id;
                          }

                        });

                      } else {
                        invoiceFeeid = item.id;

                      }
                      return <tr key={item.id}>
                        <td className="text-center">
                          {item.invoiceStatus === "PAID" || item.invoiceStatus === "Processing" ? <input type="checkbox" disabled /> : item.invoiceStatus === "UNPAID" || item.invoiceStatus === "PARTIALLY-PAID" && item.unPaidBalance > 0 ? <input className={`six-multi-select-check-${item.unitId}`} type="checkbox" name={item.id} id={item.id} value={item.id} data-latefees={invoiceFeeid} data-unitid={item.unitId} data-amount={item.unPaidBalance} data-invoicenumber={item.invoiceNo} onChange={(e) => selectInvoice(e, item.unitId, invoiceFeeid)} /> : ''}
                        </td>
                        <td className="text-center">
                          <p className="fw-500">
                            {item.invoiceStatus === "PAID" ? <label className="success-label">{t("PAID")}</label> : item.invoiceStatus === "UNPAID" ? <label className="danger-label">{t("NOT-PAID")}</label> : item.invoiceStatus === "PARTIALLY-PAID" ? <label className="danger-label" color="orange">{t("PARTIALLY-PAID")}</label> : item.invoiceStatus === "Processing" ? <label className="danger-label">{t("PROCESSING")}</label> : ''}
                            &nbsp; {item.invoiceStatus === "PARTIALLY-PAID" && item.unPaidBalance > 0 ? helper.displayCurrency(item.unPaidBalance) : helper.displayCurrency(item.invoiceAmount)}</p>
                          {/* <p>{item?.invoiceItems?.invoiceItems[0]?.name}</p> */}
                        </td>
                        <td className="text-center"><p className="fw-500">{helper.show_date_format2(item.invoiceDate)}</p></td>
                        <td className="text-center">
                          {typeof item.receiptDetails !== "undefined" && item.receiptDetails !== null && item.receiptDetails !== "" && item.receiptDetails.length > 0 && item.invoiceStatus === "PAID" ?
                            <p className="fw-500">{helper.show_date_format2(item.receiptDetails[0].paidOn)}</p> : "-"
                          }
                        </td>
                        <td className="text-center"><p>{t("Invoice")}#: {item.invoiceNo}
                          {typeof item.invoiceUrl !== "undefined" && item.invoiceUrl !== null && item.invoiceUrl !== "" ? <a href={item.invoiceUrl} target="_blank" rel="noreferrer"><label><svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label>
                          </a> : <a href="#" onClick={(event) => { event.preventDefault(); }}><label><svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label>
                          </a>}
                        </p>
                        </td>
                        <td className="text-center">
                          {typeof item.receiptDetails !== "undefined" && item.receiptDetails !== null && item.receiptDetails !== "" && item.receiptDetails.length > 0 ?
                            <p>{t("Receipt")}#: {item.receiptDetails[0].receiptNo}
                              {typeof item.receiptDetails[0].receiptUrl !== "undefined" && item.receiptDetails[0].receiptUrl !== null && item.receiptDetails[0].receiptUrl !== "" ?
                                <a href={item.receiptDetails[0].receiptUrl} target="_blank" rel="noreferrer"><label><svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label>
                                </a> : <a href="#" onClick={(event) => { event.preventDefault(); }}><label><svg className="ml-1 cursor-pointer" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 363.2 384.08"><path d="M181.19,384.05c-42.35,0-84.69,.09-127.04-.03-26.03-.08-47.02-16.85-52.68-41.94-.94-4.19-1.34-8.58-1.37-12.88-.14-20-.14-40,.03-60,.02-2.87,.39-6.66,2.18-8.37,2.48-2.38,6.39-4.2,9.81-4.43,4.19-.28,7.45,2.76,8.65,7.02,.62,2.2,.74,4.6,.75,6.91,.06,19.33,0,38.67,.04,58,.05,21.13,13.23,34.45,34.27,34.46,83.86,.04,167.72,.05,251.57,0,20.65-.01,34.17-13.53,34.26-34.12,.09-20.17,0-40.34,.04-60.51,.02-6.14,2.3-9.69,7.03-11.43,6.31-2.32,13.9,1.83,13.95,8.67,.19,24.32,1.44,48.79-.85,72.91-2.61,27.42-25.43,45.64-53.11,45.72-42.51,.12-85.03,.03-127.54,.03Z" /><path d="M170.86,239.4v-5.42c0-72.67,0-145.33,0-218,0-1,0-2,0-3C170.91,4.98,174.98,.02,181.49,0c6.61-.02,10.61,4.76,10.61,12.93,.02,73.5,.01,147,.01,220.5,0,1.97,0,3.93,0,7.21,2.07-1.88,3.37-2.97,4.56-4.16,20.28-20.26,40.52-40.56,60.88-60.75,1.94-1.92,4.38-3.81,6.93-4.55,4.55-1.31,8.63,.3,11.27,4.4,2.61,4.06,2.35,8.23-.42,12.15-.85,1.21-1.97,2.25-3.03,3.31-26.99,26.99-53.98,53.98-80.98,80.96-7.29,7.28-12.28,7.28-19.59-.01-27-26.98-54.01-53.96-80.95-81-1.84-1.85-3.81-3.99-4.62-6.38-1.51-4.43-.38-8.58,3.47-11.64,3.55-2.83,8.77-2.99,12.56-.27,1.61,1.16,3.03,2.6,4.44,4.01,19.82,19.78,39.63,39.57,59.39,59.41,1.27,1.27,2.1,2.97,3.13,4.48,.56-.4,1.13-.81,1.69-1.21Z" /></svg></label>
                                </a>
                              }
                            </p> : "NA"
                          }
                        </td>
                      </tr>

                    }) : ''
                  }
                </tbody>
              </table>)}
          </div>
        </div>
        {!isLoading ? (
          <div className='pagination-div mt-2 mb-3 text-center'>
            {typeof pageNumbers !== "undefined" && pageNumbers !== null && pageNumbers !== "" && pageNumbers.length > 10 ?
              pageNumbers.map((pagNumber) => {
                return <>
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      <li className="page-item"><a className="page-link" onClick={prevPage} >{t("Previous")}</a></li>
                      <li key={pagNumber} className="page-item"><a className={(currentPage === pagNumber ? 'active ' : '') + "page-link"} onClick={() => setCurrentPage(pagNumber)}>{pagNumber}</a></li>
                      <li className="page-item"><a className="page-link" id="nextbtn" onClick={nextPage} >{t("Next")}</a></li>
                    </ul>
                  </nav>
                </>
              }) : ""
            }
          </div>
        ) : ("")}

        {/** Payment Form Modal Start */}
        <Modal
          dimmer={PaymentModal.dimmer}
          open={PaymentModal.open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          onClose={() => setpaymentModal({ open: false })}>
          <Modal.Header className={`bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative `}>
            <svg onClick={() => setpaymentModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
              <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
            </svg>
          </Modal.Header>
          <Modal.Content className=' overflow-y-auto'>
            {parse(mondelcontent)}
          </Modal.Content>
        </Modal>

        { /** Payment Form Modal End */}

      </div>
    </div>
  )
}
