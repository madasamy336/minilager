
import { useNavigate } from "react-router-dom";
import { Dropdown, Flag, Input } from "semantic-ui-react";
import countriecodes from "../components/CountryCode";
export default function PostSignupForm() {
    const navigate = useNavigate();

    const ValidateSignin = (e) => {
        e.preventDefault();
        navigate('/login');
    }

    return (
        <>
            <div className="createAccountform my-5 mx-auto overflow-hidden">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="createAccountform-img d-flex justify-content-center align-items-center py-6 h-100">
                            <img src="/assets/images/createacc.png" alt="Create Account" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="createAccountform-inputs bg-white h-100">
                            <div className="form-title">
                                <h2 className="text-success fw-600">CREATE YOUR ACCOUNT</h2>
                                <p>Already a User? <a href="/" onClick={e => ValidateSignin(e)}>Sign in </a></p>
                            </div>
                            <form>
                                <div className="form-control">
                                    <label className="d-block">First Name</label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" placeholder="Enter First Name" />
                                        <svg className="position-absolute l-1 t-1" id="user-svgrepo-com" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30.667 30.667">
                                            <g id="Group_6355" data-name="Group 6355">
                                                <path id="Path_18913" data-name="Path 18913" d="M26.176,4.49A15.334,15.334,0,0,0,4.49,26.176,15.334,15.334,0,0,0,26.176,4.49ZM15.333,28.973a13.64,13.64,0,1,1,13.64-13.64A13.658,13.658,0,0,1,15.333,28.973Z" fill="#b5b3b3" />
                                                <path id="Path_18914" data-name="Path 18914" d="M184.889,83.883a3.992,3.992,0,1,0-3.989-3.995A3.995,3.995,0,0,0,184.889,83.883Zm0-6.29a2.3,2.3,0,1,1-2.3,2.3A2.3,2.3,0,0,1,184.889,77.593Z" transform="translate(-169.555 -71.14)" fill="#b5b3b3" />
                                                <path id="Path_18915" data-name="Path 18915" d="M130.687,234.1a7.439,7.439,0,0,0-12.091,0,13.409,13.409,0,0,0-1.969,6.19.845.845,0,0,0,1.681.176c.533-5.161,2.665-7.776,6.334-7.776s5.8,2.615,6.334,7.776a.848.848,0,0,0,.84.759.413.413,0,0,0,.088-.006.845.845,0,0,0,.753-.928A13.385,13.385,0,0,0,130.687,234.1Z" transform="translate(-109.308 -216.513)" fill="#b5b3b3" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="d-block">Last Name</label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" placeholder="Enter Last Name" />
                                        <svg className="position-absolute l-1 t-1" id="user-svgrepo-com" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30.667 30.667">
                                            <g id="Group_6355" data-name="Group 6355">
                                                <path id="Path_18913" data-name="Path 18913" d="M26.176,4.49A15.334,15.334,0,0,0,4.49,26.176,15.334,15.334,0,0,0,26.176,4.49ZM15.333,28.973a13.64,13.64,0,1,1,13.64-13.64A13.658,13.658,0,0,1,15.333,28.973Z" fill="#b5b3b3" />
                                                <path id="Path_18914" data-name="Path 18914" d="M184.889,83.883a3.992,3.992,0,1,0-3.989-3.995A3.995,3.995,0,0,0,184.889,83.883Zm0-6.29a2.3,2.3,0,1,1-2.3,2.3A2.3,2.3,0,0,1,184.889,77.593Z" transform="translate(-169.555 -71.14)" fill="#b5b3b3" />
                                                <path id="Path_18915" data-name="Path 18915" d="M130.687,234.1a7.439,7.439,0,0,0-12.091,0,13.409,13.409,0,0,0-1.969,6.19.845.845,0,0,0,1.681.176c.533-5.161,2.665-7.776,6.334-7.776s5.8,2.615,6.334,7.776a.848.848,0,0,0,.84.759.413.413,0,0,0,.088-.006.845.845,0,0,0,.753-.928A13.385,13.385,0,0,0,130.687,234.1Z" transform="translate(-109.308 -216.513)" fill="#b5b3b3" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="d-block">Email Address</label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" placeholder="Enter Email Address" />
                                        <svg className="position-absolute l-1 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28.667 28.667">
                                            <path id="email-svgrepo-com_2_" data-name="email-svgrepo-com (2)" d="M24.469,4.2A14.333,14.333,0,0,0,4.2,24.469,14.348,14.348,0,0,0,19.913,27.54l-.691-1.633a12.562,12.562,0,1,1,7.671-11.573c0,3.034-1.864,4.415-3.6,4.415s-3.6-1.382-3.6-4.415a5.374,5.374,0,1,0-1.076,3.221,5.538,5.538,0,0,0,.948,1.366,5.132,5.132,0,0,0,7.448,0,6.494,6.494,0,0,0,1.645-4.587A14.24,14.24,0,0,0,24.469,4.2ZM14.333,17.929a3.6,3.6,0,1,1,3.6-3.6A3.6,3.6,0,0,1,14.333,17.929Z" opacity="0.22" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="field form-control w-100">
                                    <label className="d-block">Mobile Number</label>
                                    <div className="ui input w-100">
                                    <Input className="noCounterNumber w-100" type="number" placeholder="Enter Mobile Number"
                                            label={<Dropdown defaultValue='+91'  search  options={countriecodes} />}
                                            labelPosition='left' />
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="d-block">Password</label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="password" placeholder="Enter Password" />
                                        <svg className="position-absolute l-1 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 22.036 32">
                                            <g id="password-svgrepo-com" transform="translate(-31.62)" opacity="0.21">
                                                <path id="Path_18916" data-name="Path 18916" d="M50.9,11.539h-.521v-3.8a7.739,7.739,0,0,0-15.479,0v3.8h-.522A2.761,2.761,0,0,0,31.62,14.3V29.243A2.761,2.761,0,0,0,34.377,32H50.9a2.761,2.761,0,0,0,2.757-2.757V14.3A2.76,2.76,0,0,0,50.9,11.539Zm-13.636-3.8a5.376,5.376,0,0,1,10.752,0v3.8H37.262Zm14.03,21.5a.4.4,0,0,1-.394.394H34.377a.4.4,0,0,1-.394-.394V14.3a.4.4,0,0,1,.394-.394H50.9a.4.4,0,0,1,.394.394Z" />
                                                <path id="Path_18917" data-name="Path 18917" d="M95.229,116.309a1.182,1.182,0,0,0-1.182,1.182v4.524a1.182,1.182,0,1,0,2.363,0v-4.524A1.182,1.182,0,0,0,95.229,116.309Z" transform="translate(-52.591 -97.983)" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <button className="ui button w-100 fw-100" onClick={e => ValidateSignin(e)}>Create an account</button>
                            </form>
                            <div className="signup-div text-center">
                            <p>Already have an Account? <a href="/" onClick={e => ValidateSignin(e)}>Sign in</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
