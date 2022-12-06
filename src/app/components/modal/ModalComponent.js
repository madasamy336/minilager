
import {Modal } from 'semantic-ui-react';
import React, { useState, useEffect } from 'react';
import parse from "html-react-parser";

function ModalComponent(props) {
    console.log(props.modalState);
   
    const [newModal,setnewModal]=useState({
        open:props.modalState,
        dimmer: undefined,
      })
      console.log(newModal);
    return (
       

        <Modal
            dimmer={newModal.dimmer}
            open={newModal.open}
            onClose={() => setnewModal({ open: false })}>
            <Modal.Header className={`bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative ${!props.headerRequired && 'd-none'}`}>PROMO CODES
                <svg onClick={() => setnewModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
                    <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
                </svg>
            </Modal.Header>
            <Modal.Content className='mh-400 overflow-y-auto '>
                {parse(props.content)}
            </Modal.Content>
        </Modal>

    );
}

export default ModalComponent;