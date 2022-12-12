import React from "react";
import { Dropdown, Image } from 'semantic-ui-react';
import { useEffect, useState } from "react";
import instance from '../../services/instance';
import request from '../../services/request';

const DebitCardTab = (props) => {
    console.log("props : ", props);
    const [isLoading, setLoading] = useState(false);
    const [showtable, setShowTable] = useState(true);
    const showTableHandler = () => {
        setShowTable(true);
    }
    const showCardHandler = () => {
        setShowTable(false);
    }
    const trigger = (
        <span>
            <Image avatar src="/assets/images/black-menu.svg" />
        </span>
    )

    function handleDropdownChange(_e, data, cardData) {
        // console.log(data.value);
        data.value == 'MakeAsPrimary' ? makeCardAsPrimary(cardData) : deleteCardDetail(cardData)
    }

    function makeCardAsPrimary(cardData) {
        // setLoading(true);
        // console.log("cardData", cardData)
        let userId = localStorage.getItem('userid');
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const data = {
            cardId: cardData.cardId,
            cardLastFour: cardData.cardNumber,
        };
        instance.post(request.card_make_default + userId + `/${cardData.id}`, data, config)
            .then((response) => {
                console.log("makeCardAsPrimary", response.data);
                const res = response.data;
                if (res.isSuccess !== false && res.isSuccess === true && res.returnCode === "SUCCESS") {
                    props.listCardFunction()
                } else {
                    setLoading(false);
                }
            }).catch((err) => {
                console.log(err);
                // setLoadingButton(false);
            });
        // location.reload()
    }



    function deleteCardDetail(params) {

    }

    const CardOptions = [
        { key: 'Make as primary', text: 'Make as primary', value: 'Make as primary', image: { src: '/assets/images/credit-cardd.svg' } },
        { key: 'Delete', text: 'Delete', value: 'Delete', image: { src: '/assets/images/delete.svg' }, },
    ]
    return (
        <div className="debitCardtab py-4 px-3 px-sm-1">
            {/* <iframe /> */}
            {showtable && <div className="ml-2 text-right">
                <button className="ui button bg-success-dark text-white fs-7 fw-400 px-2 mb-2" onClick={showCardHandler}>Add New Card</button>
            </div>}
            {!showtable && <div className="ui form w-50 w-sm-100">
                <iframe src={props.cardForm} width="100%" height="800px" />

                {/* <div className="field mb-3">
                    <label className="fw-500 mb-2">Name<i className="text-danger ">*</i></label>
                    <input placeholder='Enter Name' />
                </div>
                <div className="field mb-3">
                    <label className="fw-500 mb-2">Email Address<i className="text-danger ">*</i></label>
                    <input placeholder='Enter Email Address' />
                </div>
                <div className="field mb-3">
                    <label className="fw-500 mb-2">IBAN<i className="text-danger ">*</i></label>
                    <input placeholder='Enter IBAN' />
                </div>
                <div className="mt-2 text-left">
                    <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2">CANCEL</button>
                    <button className="ui button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2" onClick={showTableHandler}>SAVE</button>
                </div> */}
            </div>}

            {showtable && <div className="bg-white paymentTable">
                {props.cards.length !== 0 ? <table className="w-100 card-boxShadow">
                    <thead>
                        <th className="text-center">IBAN Number</th>
                        <th className="text-center">Default</th>
                        <th className="text-center">Action</th>
                    </thead>

                    <tbody>
                        {props.cards.map(card => {
                            return <tr key={card.id}>
                                <td className="text-center"><p>{card.cardNumber}</p></td>
                                {card.isDefault ? <td className="text-center"><img src="/assets/images/tick-img.png" alt="Success" /></td> : <td className="text-center">-</td>}
                                {/* <td className="text-center"><img src="/assets/images/tick-img.png" alt="Success" /></td> */}
                                <td className="text-center"><Dropdown downward floating options={CardOptions} trigger={trigger} icon="null" /></td>
                            </tr>
                        })}
                    </tbody>

                </table> : <div className="noUnits-Found">"No Record Found"</div>}
            </div>}
        </div>
    )
}

export default DebitCardTab;