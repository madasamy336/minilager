import React from "react";
import { Button, Image, Menu, Tab } from 'semantic-ui-react';
import CreditCardTab from "../../../components/creditcardtab/CreditCardTab";
import DebitCardTab from "../../../components/debitcardtab/DebitCardTab";
import { useEffect, useState, useRef } from "react";
import instance from '../../../services/instance';
import request from '../../../services/request';
import Helper from "../../../helper";

export default function Payment() {
  const [paymentForm, setPaymentFormUrl] = useState();
  const [creditCardDetails, setCreditCardDetails] = useState([]);
  const [achCardDetails, setACHCardDetails] = useState([]);
  const [isLoading, setLoader] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    listCreditCards()
    listACHCards()
    renderAddCardForm();
    const ReceiveIframeResponse = (event) => {
      if (event.data.message !== null && typeof event.data.message !== 'undefined') {
        const data = JSON.parse(event.data.message);
        if (typeof data !== 'undefined' && data !== null && data !== '') {
          listCreditCards()
          listACHCards()
        }
      }
    };
    window.addEventListener("message", ReceiveIframeResponse);

    return () => window.removeEventListener("message", ReceiveIframeResponse);
  }, []);

  function renderAddCardForm(id) {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let userId = localStorage.getItem('userid');
    const data = {
      platform: "WEB",
      paymentModeId: id
    };

    instance
      .post(request.add_card_form + `${userId}`, data, config)
      .then((response) => {
        const res = response.data;
        if (res.isSuccess !== false && res.returnCode === "SUCCESS") {
          setLoader(false);
          setPaymentFormUrl(res.result);
          setPaymentFormUrl((paymentForm) => {
            console.log("paymentForm", paymentForm);
            return paymentForm;
          });
        } else {
          setLoader(false);

        }
      })
      .catch((err) => {
        // setPaymentFormUrl(false);
        console.log(err);
      });
  }

  function listCreditCards(tabName) {
    console.log("listCard", tabName);
    let userId = localStorage.getItem('userid');
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const requestBody = {};
    instance
      .get(request.user_credit_card_details + `${userId}`, requestBody, config)
      .then(response => {
        return response;
      }).then(data => {
        console.log(data);
        if (data.data.isSuccess !== false && data.data.returnCode === "SUCCESS") {
          setCreditCardDetails(data.data.result);
          setCreditCardDetails((creditCardDetails) => {
            console.log("ach", creditCardDetails);
            return creditCardDetails;
          });
        }
      }).catch((err) => {
        console.log(err);
        // setLoadingButton(false);
      });
  }

  function listACHCards(tabName) {
    console.log("listCard", tabName);
    let userId = localStorage.getItem('userid');
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // console.log(requestUrl);
    const requestBody = {};
    instance
      .get(request.user_ach_card_details + `${userId}`, requestBody, config)
      .then(response => {
        return response;
      }).then(data => {
        console.log(data);
        if (data.data.isSuccess !== false && data.data.returnCode === "SUCCESS") {
          setACHCardDetails(data.data.result);
          setACHCardDetails((achCardDetails) => {
            console.log("ach", achCardDetails);
            return achCardDetails;
          });
        }
      }).catch((err) => {
        console.log(err);
        // setLoadingButton(false);
      });
  }

  const handleTabChange = (e => {
    console.log(e.target.innerText)
    listCreditCards(e.target.innerText)
    return e.target.innerText
  })



  const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));

  let testData = clientDataconfig.paymentModes.filter(paymentmode => paymentmode.value !== 'PayLater').map((filteredPaymentmode, i) => {
    console.log("filteredPaymentmode", filteredPaymentmode.value);
    return {
      menuItem: (
        <Menu.Item key={filteredPaymentmode.value}>
          {filteredPaymentmode.value == 'CreditCard' ? <Image className="mr-1" src="/assets/images/credit-card.svg" /> : <Image className="mr-1" src="/assets/images/direct-debit-tab.svg" />}
          {filteredPaymentmode.value}
        </Menu.Item>
      ), render: () => filteredPaymentmode.value == 'CreditCard' ? <Tab.Pane><CreditCardTab listCardFunction={() => listCreditCards()} cards={creditCardDetails} loading={isLoading} paymentFom={paymentForm} /></Tab.Pane> : <Tab.Pane><DebitCardTab cards={achCardDetails} listCardFunction={() => listACHCards()} loader={isLoading} cardForm={paymentForm} /></Tab.Pane>
    }
  });


  return (
    <div className="mx-2 mx-sm-1">
      {/* <p className="my-1 p-1 text-right"><span className="p-1 bg-white border-radius-5 payment-alert-msg d-inline-flex align-items-center"><svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 19.324 19.328">
        <path id="tick" d="M-84.794-492.834h-1.113a1.029,1.029,0,0,0-.143-.031,9.042,9.042,0,0,1-4.145-1.307A9.374,9.374,0,0,1-94.7-500.7c-.066-.356-.1-.718-.148-1.078v-1.113c.012-.066.024-.131.034-.2.058-.408.093-.823.18-1.226a9.225,9.225,0,0,1,3.526-5.557,9.221,9.221,0,0,1,7.753-1.741,9.165,9.165,0,0,1,5.531,3.5,9.237,9.237,0,0,1,1.921,6.726,9.174,9.174,0,0,1-2.317,5.309,9.328,9.328,0,0,1-5.494,3.09C-84.072-492.918-84.434-492.883-84.794-492.834Zm-2.038-7.931c-.349-.323-.7-.64-1.044-.955-.524-.479-1.037-.974-1.584-1.428a.908.908,0,0,0-1.449.488.98.98,0,0,0,.343,1.014q1.539,1.4,3.072,2.795a.949.949,0,0,0,1.456-.036q2.952-2.924,5.9-5.853a2.109,2.109,0,0,0,.152-.162.948.948,0,0,0,.207-.779.948.948,0,0,0-.467-.657.959.959,0,0,0-1.223.221q-2.6,2.6-5.208,5.206c-.047.047-.1.093-.154.148Z" transform="translate(103.768 510.431) rotate(-1)" fill="#34c28d" />
      </svg>You have made this card as default</span></p> */}
      <div className="bg-white card-boxShadow border-radius-15 pb-2 mb-2 overflow-hidden">
        <div className="payment-tabs">
          <Tab panes={testData} onTabChange={(e) => handleTabChange(e)} />
        </div>

      </div>
    </div>
  )
}
