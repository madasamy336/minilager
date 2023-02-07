import React from "react";
import { Dropdown, Image, Radio, Grid, Placeholder, Segment } from 'semantic-ui-react';
import { useEffect, useState } from "react";
import instance from '../../services/instance';
import request from '../../services/request';
import { useTranslation } from "react-i18next";

const DebitCardTab = (props) => {
    const { t, i18n } = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [showtable, setShowTable] = useState(true);
    const [achCardDetails, setACHCardDetails] = useState([]);
    const [openAutopayDropdown, SetopenAutopayDropdown] = useState(false);
    const [cardMenuDetailsVal, setCardMenuDetailsVal] = useState();
    const userId = localStorage.getItem('userid');

    useEffect(() => {
        listACHCards();
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
        console.log(paymentResponse);
        if (paymentResponse?.paymentStatus?.toUpperCase() === "SUCCESS") {
            listACHCards();
        }
    }

    const showTableHandler = () => {
        setShowTable(true);
    }
    const showCardHandler = () => {
        props.addCreditCardForm();
        setShowTable(false);
    }
    const trigger = (
        <span>
            <Image avatar src="/assets/images/black-menu.svg" />
        </span>
    )

    const handleDropdownClick = (_e, data, cardData) => {

        data.value == 'make_default' ? makeCardAsPrimary(cardData) : data.value == 'delete_card' ? deleteCardDetail(cardData) : '';
    }

    function makeCardAsPrimary(cardData) {

        let configVal = JSON.parse(sessionStorage.getItem('configdata'));

        let paymentModeId = configVal.paymentModes.filter(val => val.value == "DirectDebit");

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
                    listACHCards();
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    const deleteCardDetail = (cardData) => {

        let configVal = JSON.parse(sessionStorage.getItem('configdata'));

        let paymentModeId = configVal.paymentModes.filter(val => val.value == "DirectDebit");

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
                    listACHCards();
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    function listACHCards() {

        setLoading(true);

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
                setLoading(false);
                if (data.data.isSuccess !== false && data.data.returnCode === "SUCCESS") {
                    setACHCardDetails(data.data.result);
                    setShowTable(true);
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    return (
        <div className="debitCardtab py-4 px-3 px-sm-1">
            {isLoading ? (
                <Placeholder>
                    <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Paragraph>
                    <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Paragraph>
                </Placeholder>
            ) : (<div>
                {/* <iframe /> */}
                {showtable && <div className="ml-2 text-right">
                    <button className="ui button bg-success-dark text-white fs-7 fw-400 px-2 mb-2" onClick={showCardHandler}>Add New Card</button>
                </div>}
                {!showtable && <div className="ui form w-50 w-sm-100">
                    <iframe src={props.cardForm} width="100%" height="400px" />
                    <div className="mt-2 text-left">
                        <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-2" onClick={() => showTableHandler()}>CANCEL</button>
                    </div>
                </div>}
                {showtable && <div className="bg-white paymentTable row">
                    {typeof achCardDetails !== 'undefined' && achCardDetails !== null && achCardDetails !== "" && achCardDetails.length !== 0 ? <table className="w-100 card-boxShadow">
                        <thead>
                            <th className="text-center">IBAN Number</th>
                            <th className="text-center">Default</th>
                            <th className="text-center">Action</th>
                        </thead>
                        <tbody>
                            {achCardDetails.map(card => {
                                return <tr key={card.id}>
                                    <td className="text-center"><p>{card.cardNumber}</p></td>
                                    {card.isDefault ? <td className="text-center"><img src="/assets/images/tick-img.png" alt="Success" /></td> : <td className="text-center">-</td>}
                                    {achCardDetails.length > 1 ? <td className="text-center"><Dropdown downward floating trigger={trigger} icon="null">
                                        <Dropdown.Menu onMouseLeave={() => SetopenAutopayDropdown(false)}>
                                            {card.isDefault ? (<Dropdown.Item key={1} onClick={(e, data) => handleDropdownClick(e, data, card)}><Radio className="autopayToggle" toggle label='Autopay' /> </Dropdown.Item>) : ""}
                                            <>{card.isDefault === false ? (
                                                <>
                                                    <Dropdown.Item key={2} value={'make_default'} onClick={(e, data) => handleDropdownClick(e, data, card)}><img src="/assets/images/credit-cardd.svg" /> Make as primary </Dropdown.Item>
                                                    <Dropdown.Item key={3} value={'delete_card'} onClick={(e, data) => handleDropdownClick(e, data, card)}><img src="/assets/images/delete.svg" /> Delete </Dropdown.Item>
                                                </>
                                            ) : (
                                                <Dropdown.Item key={3} value={'delete_card'} onClick={(e, data) => handleDropdownClick(e, data, card)}><img src="/assets/images/delete.svg" /> Delete </Dropdown.Item>
                                            )}</>
                                        </Dropdown.Menu>
                                    </Dropdown></td> : ""}
                                </tr>
                            })}
                        </tbody>
                    </table> : <div className="noUnits-Found">{t("No Record Found")}</div>}
                </div>}
            </div>)}
        </div>
    )
}

export default DebitCardTab;