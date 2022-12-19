import React from "react";
import { useEffect, useState } from "react";
import { Dropdown, Image, Radio, Loader, Grid, Placeholder, Segment } from 'semantic-ui-react';
import instance from '../../services/instance';
import request from '../../services/request';

const CreditCardTab = (props) => {

    const [creditCardDetails, setCreditCardDetails] = useState([]);
    const [showcard, setShowCard] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [openAutopayDropdown, SetopenAutopayDropdown] = useState(false);
    const [cardMenuDetailsVal, setCardMenuDetailsVal] = useState();
    const userId = localStorage.getItem('userid');

    const showCardHandler = () => {
        setShowCard(true);
    }
    const CreditFormHandler = () => {
        props.addCreditCardForm();
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
        listCreditCards();
    }, []);


    useEffect(() => {
        const ReceiveIframeResponse = (event) => {
            console.log(event);
            let data;
            if (event?.data?.message) {
                data = JSON.parse(event.data.message);
            }
            if (data) {
                sixStorageOnPaymentProcessed(data);
            }
        };

        window.addEventListener("message", ReceiveIframeResponse);

        // clean up
        return () => window.removeEventListener("message", ReceiveIframeResponse);
    }, []);

    function sixStorageOnPaymentProcessed(paymentResponse) {
        if (paymentResponse?.paymentStatus?.toUpperCase() === "SUCCESS") {
            listCreditCards();
        }
    }

    function listCreditCards() {
        setLoading(true);
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
                setLoading(false);
                if (data.data.isSuccess !== false && data.data.returnCode === "SUCCESS") {
                    setCreditCardDetails(data.data.result);
                    setShowCard(true);
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    const handleDropdownChange = (e, data, cardData) => {
        data.value == 'make_default' ? makeCardAsPrimary(cardData) : data.value == 'delete_card' ? deleteCardDetail(cardData) : '';
    }

    function makeCardAsPrimary(cardData) {

        let configVal = JSON.parse(sessionStorage.getItem('configdata'));

        let paymentModeId = configVal.paymentModes.filter(val => val.value == "CreditCard");

        setLoading(true);

        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const data = {
            paymentModeId: paymentModeId[0].id,
            userId: userId,
            cardLastFour: cardData.cardNumber,
        };
        instance.post(request.card_make_default + userId + `/${cardData.id}`, data, config)
            .then(response => {
                return response;
            }).then(data => {
                console.log(data);
                setLoading(false);
                const res = data.data;
                console.log(res);
                if (res.isSuccess !== false && res.isSuccess === true && res.returnCode === "SUCCESS") {
                    listCreditCards();
                    setShowCard(true);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    const deleteCardDetail = (cardData) => {

        let configVal = JSON.parse(sessionStorage.getItem('configdata'));

        let paymentModeId = configVal.paymentModes.filter(val => val.value == "CreditCard");

        setLoading(true);

        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const data = {
            paymentModeId: paymentModeId[0].id,
            cardId: cardData.cardId,
            cardLastFour: cardData.cardNumber,
        };

        instance
            .post(request.delete_card + userId + `/${cardData.id}`, data, config)
            .then(response => {
                return response;
            }).then(data => {
                console.log(data);
                setLoading(false);
                const res = data.data;
                console.log(res);
                if (res.isSuccess !== false && res.isSuccess === true && res.returnCode === "SUCCESS") {
                    listCreditCards();
                    setShowCard(true);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (

        <div className="creditCardtab py-4 px-3 px-sm-1">
            {isLoading ? (
                <Grid columns={3} stackable>
                    <Grid.Column>
                        <Segment raised>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment raised>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment raised>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Segment>
                    </Grid.Column>
                </Grid>
            ) : (
                <div>
                    {!showcard && <div className="ui form w-50 w-sm-100">
                        <iframe src={props.paymentFom} width="100%" height="800px" />
                        <div className="mt-2 text-left">
                            <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2" onClick={() => showCardHandler()}>CANCEL</button>
                        </div>
                    </div>}
                    {showcard &&
                        <div className="row">
                            {typeof creditCardDetails !== 'undefined' && creditCardDetails !== null && creditCardDetails !== "" && creditCardDetails.length !== 0 ? creditCardDetails.map(card => {
                                return <div className="col-lg-4 col-md-6 col-sm-12 px-1 mb-2" key={card.id}>
                                    <div className="card p-2 border-radius-20">
                                        {creditCardDetails.length > 1 ? (
                                            <div className="card-dropdown-div text-right mb-1">
                                                <Dropdown downward="true" floating trigger={trigger} >
                                                    <Dropdown.Menu onMouseLeave={() => SetopenAutopayDropdown(false)}>
                                                        {card.isDefault ? (<Dropdown.Item key={1} onClick={(e, data) => handleDropdownChange(e, data, card)}><Radio className="autopayToggle" toggle label='Autopay' /> </Dropdown.Item>) : ""}
                                                        <>{card.isDefault === false ? (
                                                            <>
                                                                <Dropdown.Item key={2} value={'make_default'} onClick={(e, data) => handleDropdownChange(e, data, card)}><img src="/assets/images/credit-cardd.svg" /> Make as primary </Dropdown.Item>
                                                                <Dropdown.Item key={3} value={'delete_card'} onClick={(e, data) => handleDropdownChange(e, data, card)}><img src="/assets/images/delete.svg" /> Delete </Dropdown.Item>
                                                            </>
                                                        ) : (
                                                            <Dropdown.Item key={3} value={'delete_card'} onClick={(e, data) => handleDropdownChange(e, data, card)}><img src="/assets/images/delete.svg" /> Delete </Dropdown.Item>
                                                        )}</>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        ) : ''}
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
                            }) : ''}
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