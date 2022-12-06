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
    unit_info_by_id :"v1/movein/lease/calculation",
    promo_discount : "v1/unit/discount",
    validate_promocode: "v1/unit/discount/promocode",
    check_addons: "v1/moveIn/rent/rentDetails",
    tenant_details :"v1/user",
    lease_documents : "/v1/movein/lease/documents/",
    custom_Fields: "v2/common/custom-fields",
    lease_agreement: "v1/moveIn/preview",
    movein_paymentform: "v1/moveIn/paymentform"

}

export default requests; 