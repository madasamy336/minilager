import React, { useState, useEffect } from "react";
import Lottie from 'react-lottie-player'
import ViewDocumentsLottie from '../../json/viewDocuments.json'
import { Modal, Button, Loader, Placeholder, Segment } from 'semantic-ui-react';
import { json, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import axios from "axios";
import Spinner from "../components/Spinner/Spinner";

export default function ViewDocuments(props) {
    const [showEsignDocument, setEsignDocument] = useState(false);
    const [eSignData, setESignData] = useState({});
    const [isLoading, setLoader] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // compeleteEsignProcess()
    }, [])


    // const viewEsignDocument = () => {
    //     setLoader(true)
    //     const currentsession = JSON.parse(sessionStorage.getItem('tenantInfo'));
    //     console.log("viewDocuments Triggered");
    //     // const successUrl = window.location.hostname + '/preBooking/viewEsignDocuments' + "?eSigned=true"
    //     // console.log(successUrl);
    //     //         {
    //     // 	"event_type": "UPDATE_ESIGN_STATUS",
    //     // 	"country_code": "NOR",
    //     //   	"tenant_id": "b4d5ec07-1d2a-4907-a6eb-7b531f8d6487",
    //     // 	"initiated_by": "Shashank",
    //     //     "tenant_type": "BUSINESS",
    //     //     "document_id": "d91f5f17-a473-4bf4-8b0b-af8100b097ba",
    //     //     "status": "SUCCESS"
    //     // }
    //     let authorizationToken = sessionStorage.getItem('authToken');

    //     console.log("document_id : ", sessionStorage.getItem('bankIdDocumentId'));
    //     console.log("initiated_by : ", currentsession.firstName);
    //     console.log("authorizationToken : ", authorizationToken);
    //     const requestBody = {
    //         "event_type": "UPDATE_ESIGN_STATUS",
    //         "country_code": "NOR",
    //         "tenant_id": "b4d5ec07-1d2a-4907-a6eb-7b531f8d6487",
    //         "tenant_type": "PERSON",
    //         "initiated_by": currentsession.firstName,
    //         "document_id": sessionStorage.getItem('bankIdDocumentId'),
    //         "status": "SUCCESS"
    //     }
    //     // console.log("authorizationToken", authorizationToken);
    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${JSON.parse(authorizationToken)}`
    //         },
    //     }

    //     axios.post('https://usuat-sixverifier-api.8storage.com/esign', requestBody, config).then(response => {
    //         // console.log(response);
    //         return response
    //     }).then(result => {
    //         console.log("eSignCompletionREsponse:-", JSON.stringify(result.data.body));
    //         setESignData(result.data.body)
    //         sessionStorage.setItem("eSignDocumentURL", result.data.body.document_url)
    //         setLoader(false)

    //     }).catch(err => {
    //         console.log(err);
    //     })
    //     console.log("viewDocumnet");
    //     setEsignDocument(true)
    // }

    const viewEsignDocument = async () => {
        setLoader(true);
        const currentsession = JSON.parse(sessionStorage.getItem('tenantInfo'));
        const requestBody = {
            "event_type": "UPDATE_ESIGN_STATUS",
            "country_code": "NOR",
            "tenant_id": currentsession.userId,
            "tenant_type": "PERSON",
            "initiated_by": currentsession.firstName,
            "document_id": sessionStorage.getItem('bankIdDocumentId'),
            "status": "SUCCESS"
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
        }
        const eSignUrl = process.env.REACT_APP_ESIGN_URL

        try {
            const response = await axios.post(eSignUrl, requestBody, config);
            console.log("eSignCompletionREsponse:-", JSON.stringify(response.data.body));
            setESignData(response.data.body)
            sessionStorage.setItem("eSignDocumentURL", response.data.body.document_url)
            setLoader(false);
        } catch (err) {
            console.log(err);
        }
        setEsignDocument(true);
    }

    const downloadFile = async () => {
        const response = await axios({
            url: eSignData.document_url, // Replace with your own AWS S3 bucket URL
            method: 'GET',
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', "Esign"); // Replace with the desired filename
        document.body.appendChild(link);
        link.click();
    };

    const continueToMoveIn = () => {
        localStorage.setItem("eSignatureCompleted", true)
        navigate('/preBooking/eSignPayment')
    }

    return (<> {
        isLoading ?
        <Spinner/>
        //  <Loader size='large' active>{t("Loading")}</Loader> 
        :
            (<>{showEsignDocument ?
                <div className="iframe-container"><iframe height="100vh" width="100%" src={eSignData.document_url} title="ESigned Data"></iframe>
                    <div className="d-flex justify-content-center mb-2 mt-2"><Button className="ui button text-black close-btn fs-7 fw-400 text-dark px-5 mr-2" onClick={() => setEsignDocument(false)}>{t("Close")}</Button><Button className="ui button fs-7 fw-400 text-white px-5 mr-2 download-btn" onClick={() => downloadFile()}>{t("Download")}</Button></div>
                </div> :
                <div className="bg-white border-radius-15 text-center card-boxshadow border-radius-15 border-top-success-4 w-35 mx-auto px-2 py-5 mt-5">
                    <div className="success-img text-center mb-2">
                        <Lottie
                            loop
                            animationData={ViewDocumentsLottie}
                            play
                            style={{ width: 250, height: 200, margin: '0 auto' }}
                        />
                    </div>
                    <p className="mb-2">{t("Great! You've Successfully signed the documents")}</p>
                    <div className="text-center">
                        <button className="ui button bg-success-dark text-white fw-100 mr-2 mb-1" onClick={() => viewEsignDocument()} >{t("View Documents")}</button>
                        <button className="ui button bg-secondary text-white fw-100 mb-1" onClick={() => continueToMoveIn()}>{t("Continue")}</button>
                    </div>
                </div>
            }</>)}
    </>)
}


