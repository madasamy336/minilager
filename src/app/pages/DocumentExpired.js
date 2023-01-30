import React, { useState, useEffect } from "react";
import Lottie from 'react-lottie-player'
import { Button } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import DocumentExpiredLottie from '../../json/documentExpired.json'
import axios from "axios";



export default function DocumentExpired(props) {

    const [isLoading, setLoader] = useState(false);
    const [isButtonLoading, setButtonLoader] = useState(false);

    const navigate = useNavigate();

    const triggerEsign = (e) => {
        debugger
        e.preventDefault();
        console.log("Triggered");
        const currentsession = JSON.parse(sessionStorage.getItem('tenantInfo'));
        setButtonLoader(true)
        const successUrl = `https://${window.location.hostname}/preBooking/viewEsignDocuments?eSigned=true`
        //const successUrl = window.location.hostname + '/preBooking/viewEsignDocuments' + "?eSigned=true"
        console.log(successUrl);
        const requestBody = {
            "event_type": "INITIATE_ESIGN_DOCUMENT_CREATION",
            "country_code": "NOR",
            "integrated_with": "signicat",
            "tenant_id": "470c0600-3c51-4da5-8f26-3fc1918b48a5",
            "initiated_by": currentsession.firstName,
            "request_from": "BOOKING_PORTAL",
            "redirect_settings": {
                "success_url": "https://" + window.location.host + '/preBooking/viewEsignDocuments',
                "abort_url": "https://" + window.location.host,
                "error_url": "https://" + window.location.host + '/preBooking/documentExpired'
            },
            "title": "As simple as that",
            "description": "This is an important document",
            "external_id": "ae7b9ca7-3839-4e0d-a070-9f14bffbbf55",
            "contact_details": {
                "email": "test@test.com"
            },
            "data_to_sign": {
                "base64_content": "VGhpcyB0ZXh0IGNhbiBzYWZlbHkgYmUgc2lnbmVk",
                "file_name": "sample.txt"
            }
        }
        let authorizationToken = sessionStorage.getItem('authToken');
        // console.log("authorizationToken", authorizationToken);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authorizationToken}`
            },
        }

        axios.post('https://usuat-sixverifier-api.8storage.com/esign', requestBody, config).then(response => {
            // console.log(response);
            return response
        }).then(result => {
            console.log("result", result.data.body);
            let redirectUrl = result.data.body.url;
            // console.log(redirectUrl);
            window.location.replace(redirectUrl);
            sessionStorage.setItem("bankIdDocumentId", result.data.body.document_id);
            sessionStorage.setItem("external_id", result.data.body.external_id);
            setButtonLoader(false)

        }).catch(err => {
            console.log(err);
        })
    }


    return (
        <div className="bg-white border-radius-15 text-center card-boxshadow w-35 mx-auto px-2 py-5 mt-5">
            <div className="success-img text-center mb-2">
                <Lottie
                    loop
                    animationData={DocumentExpiredLottie}
                    play
                    style={{ width: 250, height: 200, margin: '0 auto' }}
                />
            </div>
            <h6 className="text-danger fs-6 fw-500 mb-1">The document has expired</h6>
            <p className="mb-2">This document has expired and can no longer be signed. Please start the E-Sign process by Clicking on the link again</p>
            <div className="text-center">
                <Button className="ui button bg-secondary text-white fw-100 mr-2 mb-1" disabled={isButtonLoading} onClick={() => navigate('/')}>Cancel</Button>
                <Button className="ui button bg-danger-light text-white fw-100 mb-1" disabled={isButtonLoading} loading={isButtonLoading} onClick={(e) =>triggerEsign(e)}>Try Again</Button>
            </div>
        </div>
    )
}

