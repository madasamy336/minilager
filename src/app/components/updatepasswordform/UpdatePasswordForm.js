import React, {useState} from "react";

const UpdatePasswordForm = (props) => {
    const[toggle, setToggle] = useState(true);
    const showPasswordHandler = () => {
      setToggle(!toggle);
    }
    return (
        <div className="ui form w-50 w-sm-100">
            <div className="field my-3 position-relative">
                <input type={toggle ? "password" : "text"} placeholder={props.placeholdertext} />
                {!toggle && <div onClick={showPasswordHandler}>
                    <svg className="eyeopen position-absolute r-2 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31.937 21.446">
                        <g id="Group_56" data-name="Group 56" transform="translate(0 0)" opacity="0.65">
                            <g id="password" transform="translate(0 0)">
                                <path id="Path_93" data-name="Path 93" d="M878.2-407.131c.228-.29.464-.574.682-.872,2.62-3.56,5.766-6.5,9.985-8.034,5.525-2.011,10.626-.952,15.309,2.451a22.867,22.867,0,0,1,5.8,6.2.882.882,0,0,1,.111.754c-2.479,4.291-5.658,7.9-10.324,9.863-5.088,2.145-9.828,1.223-14.213-1.972a28.547,28.547,0,0,1-6.984-7.546,4.836,4.836,0,0,0-.37-.444Zm22.676.8a6.669,6.669,0,0,0-6.6-6.652,6.684,6.684,0,0,0-6.712,6.622,6.686,6.686,0,0,0,6.648,6.685,6.666,6.666,0,0,0,6.669-6.661Z" transform="translate(-878.19 417.051)" fill="#686868" />
                                <path id="Path_94" data-name="Path 94" d="M971.814-358.949a3.951,3.951,0,0,1-3.954-4.059,3.949,3.949,0,0,1,4.059-3.953,3.948,3.948,0,0,1,3.953,4.057A3.948,3.948,0,0,1,971.814-358.949Z" transform="translate(-955.837 373.676)" fill="#686868" />
                            </g>
                        </g>
                    </svg>
                </div>}
        
                {toggle && <div onClick={showPasswordHandler}>
                    <svg className="eyeclose position-absolute r-2 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31.937 25.414">
                        <g id="Group_56" data-name="Group 56" transform="translate(0 0.707)" opacity="0.59">
                            <g id="password" transform="translate(0 0)">
                                <path id="Path_93" data-name="Path 93" d="M878.2-407.131c.228-.29.464-.574.682-.872,2.62-3.56,5.766-6.5,9.985-8.034,5.525-2.011,10.626-.952,15.309,2.451a22.867,22.867,0,0,1,5.8,6.2.882.882,0,0,1,.111.754c-2.479,4.291-5.658,7.9-10.324,9.863-5.088,2.145-9.828,1.223-14.213-1.972a28.547,28.547,0,0,1-6.984-7.546,4.836,4.836,0,0,0-.37-.444Zm22.676.8a6.669,6.669,0,0,0-6.6-6.652,6.684,6.684,0,0,0-6.712,6.622,6.686,6.686,0,0,0,6.648,6.685,6.666,6.666,0,0,0,6.669-6.661Z" transform="translate(-878.19 417.051)" fill="#686868" />
                                <path id="Path_94" data-name="Path 94" d="M971.814-358.949a3.951,3.951,0,0,1-3.954-4.059,3.949,3.949,0,0,1,4.059-3.953,3.948,3.948,0,0,1,3.953,4.057A3.948,3.948,0,0,1,971.814-358.949Z" transform="translate(-955.837 373.676)" fill="#686868" />
                            </g>
                            <line id="Line_7" data-name="Line 7" y1="24" x2="24" transform="translate(4.242)" fill="none" stroke="#707070" stroke-width="2" />
                        </g>
                    </svg>
                </div>}
            </div>
        </div>
    )
}

export default UpdatePasswordForm;