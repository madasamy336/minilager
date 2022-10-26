import React from "react"
import Lottie from 'react-lottie-player'
import ViewDocumentsLottie from '../../json/viewDocuments.json'

const ViewDocuments = () => {
    return (
        <div className="bg-white border-radius-15 text-center card-boxshadow border-radius-15 border-top-success-4 w-35 mx-auto px-2 py-5 mt-5">
            <div className="success-img text-center mb-2">
                <Lottie
                    loop
                    animationData={ViewDocumentsLottie}
                    play
                    style={{ width: 250, height: 200, margin: '0 auto' }}
                />
            </div>
            <p className="mb-2">Great! You've Successfully signed the documents</p>
            <div className="text-center">
                <button className="ui button bg-success-dark text-white fw-100 mr-2 mb-1">View Documents</button>
                <button className="ui button bg-secondary text-white fw-100 mb-1">Continue</button>
            </div>
        </div>
    )
}

export default ViewDocuments