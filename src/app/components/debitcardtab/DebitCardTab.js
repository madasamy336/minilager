import React, {useState} from "react";
import { Dropdown, Image } from 'semantic-ui-react';

const DebitCardTab = () => {
    const[showtable, setShowTable] = useState(false);
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
      
      const CardOptions = [
        { key: 'Make as primary', text: 'Make as primary', value: 'Make as primary', image: { src: '/assets/images/credit-cardd.svg' } },
        { key: 'Delete', text: 'Delete', value: 'Delete', image: { src: '/assets/images/delete.svg' }, },
      ]

    return(
        <div className="debitCardtab py-4 px-3 px-sm-1">
            {showtable && <div className="ml-2 text-right">
                <button className="ui button bg-success-dark text-white fs-7 fw-400 px-2 mb-2" onClick={showCardHandler}>Add New Card</button>
            </div> }
            {!showtable && <div className="ui form w-50 w-sm-100">
                <div className="field mb-3">
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
                </div>
            </div>}

            {showtable && <div className="bg-white paymentTable">
                <table className="w-100 card-boxShadow">
                    <thead>
                        <th className="text-center">IBAN Number</th>
                        <th className="text-center">Default</th>
                        <th className="text-center">Action</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center"><p>XXXX-XXXX-XXXX-XXXX-XX3003</p></td>
                            <td className="text-center"><img src="/assets/images/tick-img.png" alt="Success" /></td>
                            <td className="text-center"><Dropdown downward floating options={CardOptions} trigger={trigger} icon="null" /></td>
                        </tr>
                        <tr>
                            <td className="text-center"><p>XXXX-XXXX-XXXX-XXXX-XX33201</p></td>
                            <td className="text-center"><p><a className="text-underline" href="/">Make Default</a></p></td>
                            <td className="text-center"><Dropdown downward floating options={CardOptions} trigger={trigger} icon="null" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default DebitCardTab;