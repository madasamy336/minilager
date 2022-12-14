import React from "react";
import { useEffect, useState } from "react";
import { Dropdown, Image, Radio, Loader } from 'semantic-ui-react';
import instance from '../../services/instance';
import request from '../../services/request';

const CreditCardTab = (props) => {
    console.log("CreditCardTab props : ", props);
    const [showcard, setShowCard] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [openAutopayDropdown, SetopenAutopayDropdown] = useState(false);
    const userId = localStorage.getItem('userid');

    const showCardHandler = () => {
        setShowCard(true);
    }
    const CreditFormHandler = () => {
        setShowCard(false);
    }
    const trigger = (
        <span>
            <Image avatar src="/assets/images/menu.svg" />
        </span>
    )
    const CardOptions = [
        { key: 'Make as primary', text: 'Make as primary', value: 'MakeAsPrimary', image: { src: '/assets/images/credit-cardd.svg' } },
        { key: 'Delete', text: 'Delete', value: 'Delete', image: { src: '/assets/images/delete.svg' }, },
    ]

    useEffect(() => {
        // setLoading(props.loader)
    },);

    function handleDropdownChange(_e, data, cardData) {
        // console.log(data.value);
        data.value == 'MakeAsPrimary' ? makeCardAsPrimary(cardData) : deleteCardDetail(cardData)
    }

    function makeCardAsPrimary(cardData) {
        // setLoading(true);
        // console.log("cardData", cardData)
        // let userId = localStorage.getItem('userid');
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
                    props.listCardFunction(cardData.ca)
                } else {
                    setLoading(false);
                }
            }).catch((err) => {
                console.log(err);
                // setLoadingButton(false);
            });
        // location.reload()
    }

    const deleteCardDetail = (cardData) => {

        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const data = {
        };

        instance
            .post(request.delete_card + userId + `/${cardData.id}`, data, config)
            .then(response => {
                return response;
            }).then(data => {
                console.log(data);
                const res = data.data.result;
                if (res.isSuccess !== false && res.isSuccess === true && res.returnCode === "SUCCESS") {
                    props.listCardFunction();
                    setShowCard(true)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (

        <div className="creditCardtab py-4 px-3 px-sm-1">
            {isLoading ? (
                <Loader size='large' active>Loading</Loader>
            ) : (
                <div>
                    {!showcard && <div className="ui form w-50 w-sm-100">
                        <iframe src={props.paymentFom} width="100%" height="800px" />
                        <div className="mt-2 text-left">
                            <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2" onClick={() => showCardHandler()}>CANCEL</button>
                        </div>
                        {/* <div className="field mb-3">
                            <label className="fw-500 mb-2">Name on the Card<i className="text-danger ">*</i></label>
                            <input placeholder='Name on the Card' />
                        </div> */}
                        {/* <div className="field mb-3 position-relative">
                            <label className="fw-500 mb-2">Card Number<i className="text-danger ">*</i></label>
                            <input placeholder='Card Number' />
                            <div className="mastercard-img position-absolute">
                                <img src="/assets/images/Mastercard-img.png" alt="Master Card" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-9 col-md-12 col-sm-12">
                                <label className="fw-500 mb-2 d-block">Expire Date<i className="text-danger ">*</i></label>
                                <div className="row mb-md-3">
                                    <div className="col-lg-6 col-md-6 col-sm-6 pr-3 pr-md-1">
                                        <input placeholder='Month' />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 pr-3 pr-md-0">
                                        <input placeholder='Year' />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-12 col-sm-12">
                                <div className="field mb-3 position-relative">
                                    <label className="fw-500 mb-2">CVV<i className="text-danger ">*</i></label>
                                    <input placeholder='CVV' />
                                    <div className="cvv-img position-absolute">
                                        <img src="/assets/images/cvv.png" alt="CVV" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-left">
                            <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2">CANCEL</button>
                            <button onClick={showCardHandler} className="ui button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2">SAVE</button>
                        </div> */}
                    </div>}

                    {showcard &&
                        <div className="row">
                            {props.cards.length !== 0 ? props.cards.map(card => {
                                return <div className="col-lg-4 col-md-6 col-sm-12 px-1 mb-2" key={card.id}>
                                    <div className="card p-2 border-radius-20">
                                        <div className="card-dropdown-div text-right mb-1">
                                            {!card.isDefault && <Dropdown downward="true" floating options={CardOptions} trigger={trigger} onChange={(e, data) => handleDropdownChange(e, data, card)} />}
                                            {card.isDefault && <Dropdown
                                                icon='filter'
                                                floating
                                                className='icon'
                                                simple={openAutopayDropdown}
                                                onClick={() => trigger}
                                                item
                                                trigger={trigger}
                                            >
                                                <Dropdown.Menu onMouseLeave={() => SetopenAutopayDropdown(false)}>
                                                    <Dropdown.Item><Radio className="autopayToggle" toggle label='Autopay' /> </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>}
                                        </div>
                                        <div className="card-title d-flex justify-content-between align-items-start mb-5">
                                            {card.isDefault && <p className="fs-7 text-white-light">Primary Card</p>}
                                            <div className="card-master-img mr-2">
                                                <img src="/assets/images/Mastercard-img.png" alt="Master Card" />
                                            </div>
                                        </div>
                                        <div className="card-details">
                                            <p className="fs-7 text-white-light">{card.customerName}</p>
                                            <p className="fs-7 text-white">{card.cardNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            }) : <div>No Records Found</div>}



                            {/* Need To render ths belowe code based conditions */}
                            {/* <div className="col-lg-4 col-md-6 col-sm-12 px-1 mb-2">
                    <div className="card p-2 border-radius-20">
                        <div className="card-autopay-dropdown-div text-right mb-1">
                            <Dropdown
                                icon='filter'
                                floating

                                className='icon'
                                simple={openAutopayDropdown}
                                onClick={() => SetopenAutopayDropdown(true)}
                                item
                                trigger={trigger}
                            >
                                <Dropdown.Menu onMouseLeave={() => SetopenAutopayDropdown(false)}>
                                    <Dropdown.Item><Radio className="autopayToggle" toggle label='Autopay' /> </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="card-title d-flex justify-content-between align-items-start mb-5">
                            <p className="fs-7 text-white-light">Primary Card</p>
                            <div className="card-master-img mr-2">
                                <img src="/assets/images/Mastercard-img.png" alt="Master Card" />
                            </div>
                        </div>
                        <div className="card-details">
                            <p className="fs-7 text-white-light">Peter</p>
                            <p className="fs-7 text-white">5142 - 8164 - 6526 - 2563</p>
                        </div>
                    </div>
                </div> */}
                            <div className="col-lg-4 col-md-6 col-sm-12 px-1 mb-2">
                                <div className="card bgImg-none card-border-secondary-dashed p-2 border-radius-20 d-flex justify-content-center align-items-center text-center">
                                    <div className="cursor-pointer" onClick={CreditFormHandler}>
                                        <p className="fs-1 fw-500">+</p>
                                        <p>Add New Card</p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>)}

        </div>)
}

export default CreditCardTab;