import React from "react";
import { Button, Image, Menu, Tab } from 'semantic-ui-react';
import CreditCardTab from "../../../components/creditcardtab/CreditCardTab";
import DebitCardTab from "../../../components/debitcardtab/DebitCardTab";
import { useEffect, useState, useRef } from "react";
import instance from '../../../services/instance';
import request from '../../../services/request';
import { useTranslation } from "react-i18next";

export default function Payment() {
  const [paymentForm, setPaymentFormUrl] = useState();
  const [creditCardDetails, setCreditCardDetails] = useState([]);
  const [achCardDetails, setACHCardDetails] = useState([]);
  const [isLoading, setLoader] = useState(true);
  const [showcard, setShowCard] = useState(false);
  const { t } = useTranslation();


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
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleTabChange = (e => {
    return e.target.innerText
  })


  const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));

  let paymentMethods = clientDataconfig.paymentModes.filter(paymentmode => paymentmode.value !== 'PayLater').map((filteredPaymentmode, i) => {
    return {
      menuItem: (
        <Menu.Item key={filteredPaymentmode.value}>
          {filteredPaymentmode.value == 'CreditCard' ? <Image className="mr-1" src="/assets/images/credit-card.svg" /> : <Image className="mr-1" src="/assets/images/direct-debit-tab.svg" />}
          {filteredPaymentmode.value == 'CreditCard' ? `${t("Credit Card")}` : `${t("Debit Card")}`}
        </Menu.Item>
      ), render: () => filteredPaymentmode.value == 'CreditCard' ? <Tab.Pane><CreditCardTab addCreditCardForm={() => renderAddCardForm(filteredPaymentmode.id)} cards={creditCardDetails} loading={isLoading} paymentFom={paymentForm} /></Tab.Pane> : <Tab.Pane><DebitCardTab addCreditCardForm={() => renderAddCardForm(filteredPaymentmode.id)} cards={achCardDetails} loader={isLoading} cardForm={paymentForm} /></Tab.Pane>
    }
  });


  return (
    <div className="mx-2 mx-sm-1">
      <div className="bg-white card-boxShadow border-radius-15 pb-2 mb-2 overflow-hidden">
        <div className="payment-tabs">
          <Tab panes={paymentMethods} onTabChange={(e) => handleTabChange(e)} />
        </div>
      </div>
    </div>
  )
}
