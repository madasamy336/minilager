import React from "react";
import { Image, Menu, Tab } from 'semantic-ui-react';
import CreditCardTab from "../../../components/creditcardtab/CreditCardTab";
import DebitCardTab from "../../../components/debitcardtab/DebitCardTab";

export default function Payment() {
  const panes = [
    {
      menuItem: (
        <Menu.Item key='Credit Card'>
          <Image className="mr-1" src="/assets/images/credit-card.svg" />
          Credit Card
        </Menu.Item>
      ), render: () => <Tab.Pane><CreditCardTab /></Tab.Pane>
    },
    {
      menuItem: (
        <Menu.Item key='Direct Debit'>
          <Image className="mr-1" src="/assets/images/direct-debit-tab.svg" />
          Direct Debit
        </Menu.Item>
      ), render: () => <Tab.Pane><DebitCardTab /> </Tab.Pane> 
    },
  ]

  return (
    <div className="mx-2 mx-sm-1">
      <p className="my-1 p-1 text-right"><span className="p-1 bg-white border-radius-5 payment-alert-msg d-inline-flex align-items-center"><svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 19.324 19.328">
        <path id="tick" d="M-84.794-492.834h-1.113a1.029,1.029,0,0,0-.143-.031,9.042,9.042,0,0,1-4.145-1.307A9.374,9.374,0,0,1-94.7-500.7c-.066-.356-.1-.718-.148-1.078v-1.113c.012-.066.024-.131.034-.2.058-.408.093-.823.18-1.226a9.225,9.225,0,0,1,3.526-5.557,9.221,9.221,0,0,1,7.753-1.741,9.165,9.165,0,0,1,5.531,3.5,9.237,9.237,0,0,1,1.921,6.726,9.174,9.174,0,0,1-2.317,5.309,9.328,9.328,0,0,1-5.494,3.09C-84.072-492.918-84.434-492.883-84.794-492.834Zm-2.038-7.931c-.349-.323-.7-.64-1.044-.955-.524-.479-1.037-.974-1.584-1.428a.908.908,0,0,0-1.449.488.98.98,0,0,0,.343,1.014q1.539,1.4,3.072,2.795a.949.949,0,0,0,1.456-.036q2.952-2.924,5.9-5.853a2.109,2.109,0,0,0,.152-.162.948.948,0,0,0,.207-.779.948.948,0,0,0-.467-.657.959.959,0,0,0-1.223.221q-2.6,2.6-5.208,5.206c-.047.047-.1.093-.154.148Z" transform="translate(103.768 510.431) rotate(-1)" fill="#34c28d" />
      </svg>You have made this card as default</span></p>
      <div className="bg-white card-boxShadow border-radius-15 pb-2 mb-2 overflow-hidden">
        <div className="payment-tabs">
        <Tab panes={panes} />
        </div>
      </div>
    </div>
  )
}
