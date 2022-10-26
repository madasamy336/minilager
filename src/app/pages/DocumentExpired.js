import React from "react"
import Lottie from 'react-lottie-player'
import DocumentExpiredLottie from '../../json/documentExpired.json'

const DocumentExpired = () => {
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
                <button className="ui button bg-secondary text-white fw-100 mr-2 mb-1">Cancel</button>
                <button className="ui button bg-danger-light text-white fw-100 mb-1">Try Again</button>
            </div>
        </div>
    )
}

export default DocumentExpired