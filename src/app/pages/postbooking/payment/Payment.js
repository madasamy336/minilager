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
  const [showcard, setShowCard] = useState(false);


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
          // setShowCard(true)
        }
      }
    };
    window.addEventListener("message", ReceiveIframeResponse);

    return () => window.removeEventListener("message", ReceiveIframeResponse);
  }, []);


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
            return creditCardDetails;
          });
          setShowCard(true);
        }
      }).catch((err) => {
        console.log(err);
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
      });
  }

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
        console.log(err);
      });
  }

  const handleTabChange = (e => {
    listCreditCards(e.target.innerText)
    return e.target.innerText
  })



  const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));

  let testData = clientDataconfig.paymentModes.filter(paymentmode => paymentmode.value !== 'PayLater').map((filteredPaymentmode, i) => {
    // console.log("filteredPaymentmode", filteredPaymentmode.value);
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
      <div className="bg-white card-boxShadow border-radius-15 pb-2 mb-2 overflow-hidden">
        <div className="payment-tabs">
          <Tab panes={testData} onTabChange={(e) => handleTabChange(e)} />
        </div>
      </div>
    </div>
  )
}
