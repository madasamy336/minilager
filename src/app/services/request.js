const requests = {
    common_config: "v1/common/config",
    facility_cities:"v1/unit/location",
    //Unit Filters
    unit_filters: "v2/unit/filters?UnitVisibility=1&Availability=2",
    user_login:"v1/user/login",
    forgot_password:"v1/user/password/forgot",
    user_signup :"v1/user/signup",
    user_search: "v1/unit/type/price",
    lease_search: "v1/movein/lease",
    get_user_info: "v1/user",
    update_user_info: "v1/user/updateprofile",
    update_user_password: "v1/user/password",
}


export default requests; 