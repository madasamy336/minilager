import moment from "moment";
import Intel from 'intl-tel-input';
import React, { useState, useEffect } from "react";

class Helper {
    culture;
    currency;
    dateFormat;
    cultureInfo;
    numberFormatter;
    numberParser;
    dateFormatter;
    dateParser;
    currencyFormatter;
    percentageFormatter;
    axiosHttp;
    sixStorageOverrideCultureCurrency;

    constructor() {
        if(sessionStorage.getItem("culture") !== null){
            this.culture = JSON.parse(sessionStorage.getItem("culture")).culture;
            this.currency =JSON.parse(sessionStorage.getItem("culture")).currency;
            this.dateFormat =JSON.parse(sessionStorage.getItem("culture")).dateFormat

        }

       
    }

    checkPhoneNumber(event) {
        let inputValue = event.target.value;
        let numbers = inputValue.replace(/[^0-9]/g, '');
        event.target.value = numbers;
    }

    checkNumber(event) {
        let inputValue = event.target.value;
        let numbers = inputValue.replace(/[^0-9]/g, '');
        event.target.value = numbers;
    }

    checkAlphanumeric(event) {
        let inputValue = event.target.value;
        let numbers = inputValue.replace(/[^a-zA-Z0-9\-_\s]/g, '');
        event.target.value = numbers;
    }

    checkAlphabets(event) {
        let inputValue = event.target.value;
        let numbers = inputValue.replace(/[^a-zA-Z\-_\s]/g, '');
        event.target.value = numbers;
    }

    isNumber(event) {
        if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
            event.preventDefault();
        }
    }

    // checkEmail(event) {
    //     const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //     let inputValue = this.value;
    //     if (inputValue.match(mailformat)) {
    //         return true;
    //     } else {
    //         const err = document.getElementById(`${this.id}-err`);
    //         if (typeof err !== "undefined" && err != null) {
    //             err.style.display = "";
    //             err.innerHTML = `Please Enter Valid Email`;
    //         }
    //         return false;
    //     }
    // }

    validURL(str) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        let url = new RegExp(regexp, "g");
        if (url.test(str)) {
            return true;
        }
        else {
            return false;
        }
    }

    validateEmail(input) {
        const mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let inputValue = input.value;
        if (inputValue.match(mailformat)) {
            const err = document.getElementById(`${input.id}-err`);
            err.style.display = "none";
            return true;
        } else {
            const err = document.getElementById(`${input.id}-err`);
            if (typeof err !== "undefined" && err != null) {
                err.style.display = "";
                err.innerHTML = `Please Enter Valid Email`;
            }
            return false;
        }
    }

    getURIParams(formData) {
        // let parameters = [];

        // const data = [...formData.entries()];
        // const asString = data
        //     .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
        //     .join('&');
        //   [...formData.entries()] // expand the elements from the .entries() iterator into an actual array
        //     .map(e => encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1]));

        let parameters = [...formData.entries()] // expand the elements from the .entries() iterator into an actual array
            .map(e => encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1])); // transform the elements into encoded key-value-pairs
        return parameters.join("&");
        //return asString;
    }

    //DIsplay Date In Localised Format
    displayDate(date) {


        //let dateFormat = '';
        let returnFormat = moment(date).format(this.convertMomentDateFormat(this.dateFormat));// new Intl.DateTimeFormat(this.culture).format(date);
        // if (typeof this.cultureInfo !== 'undefined' && this.cultureInfo !== null) {
        //     //new Intl.DateTimeFormat(this.cultureInfo.culture).format(date)
        //     dateFormat = this.cultureInfo.shortDate.replace("d", "D").replace("d", "D");
        // }
        return returnFormat;
    }

    //Read Date From Localised Format
    readDate(date) {

        // let dateFormat = '';
        // if (typeof this.cultureInfo !== 'undefined' && this.cultureInfo !== null) {
        //     dateFormat = this.convertMomentDateFormat(this.cultureInfo.shortDate);//.replace("d", "D").replace("d", "D");
        // }
        const momentDate = moment(date, this.convertMomentDateFormat(this.dateFormat));
        return `${momentDate.year()}-${momentDate.month() + 1}-${momentDate.date()}`;
    }

    //Display Float In Localised Currency
    displayCurrency(amount) {

        let returnFormat = new Intl.NumberFormat(this.culture, {
            style: "currency",
            currency: typeof this.currency !== 'undefined' && this.currency != null ? this.currency : 'USD',
            maximumFractionDigits: 2
        }).format(amount);
        if (this.culture === 'ar-SA') {
            returnFormat = `SAR ` + amount;
        } else if (this.culture === 'is-IS') {
            returnFormat = amount + 'kr';
        }

        return returnFormat;
    }

    // displayCurrency_listing(amount) {

    //     let returnFormat = new Intl.NumberFormat(this.culture, {
    //         style: "currency",
    //         currency: typeof this.currency !== 'undefined' && this.currency != null ? this.currency : 'USD',
    //         maximumFractionDigits: 0
    //     }).format(amount);
    //     if (this.culture === 'ar-SA') {
    //         returnFormat = SAR + amount;
    //     } else if (this.culture === 'is-IS') {
    //         returnFormat = amount + 'kr';
    //     }

    //     return returnFormat;
    // }

    //Display Number In Localised Format
    displayNumber(number) {

        let returnFormat = new Intl.NumberFormat(this.culture, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        }).format(number);
        if (this.culture === 'ar-SA') {
            returnFormat = number;
        }
        return returnFormat;
    }

    //Display Number In Localised Percentage
    displayPercent(number) {

        let returnFormat = new Intl.NumberFormat(this.culture, {
            style: "percent",
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        }).format(number > 0 ? number / 100 : number);
        if (this.culture === 'ar-SA') {
            returnFormat = number + `% `;
        }
        return returnFormat;
    }

    initTelephoneNumber(id) {
        const country = this.culture.substring(this.culture.indexOf('-') + 1, this.culture.length).toLowerCase();
        let fields = document.querySelectorAll(typeof id !== 'undefined' && id !== null && id !== "" ? id : ".telephone");
        if (fields.length > 0) {
            Array.prototype.forEach.call(fields, (item) => {
                const intl = Intel(item, {
                    separateDialCode: "true",
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.11/js/utils.js",
                    initialCountry: country,
                    preferredCountries: [country],
                });
            })
        }
    }



    getMomentLocaleData() {
        debugger;
        // Get user locale
        let locale = this.culture || window.navigator.userLanguage || window.navigator.language;
        // Set locale to moment
        moment.locale(locale);

        // Get locale data
        return moment.localeData();
    }

    sanitizeMaterialDateFormat(inputstring) {
        return inputstring.toLowerCase();
    }

    convertMomentDateFormat(inputstring) {
        return inputstring.toUpperCase();
    }


    getHostURL() {
        return window.location.href;
    }

    // getParameterByName(name, url = window.location.href) {
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    //         results = regex.exec(url);
    //     if (!results) return null;
    //     if (!results[2]) return '';
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

    measurementDisplayFormat(format) {
        let returnResult = "";

        switch (format) {
            case "M2": {
                return (<div>m<sup className="cc">2</sup></div>);
            }
            case "MQ": {
                returnResult = `m<sup class="cc">3</sup>`;
                break;
            }
            case "QCM": {
                returnResult = `cm<sup class="cc">3</sup>`;
                break;
            }
            case "QFT": {
                returnResult = `ft<sup class="cc">3</sup>`;
                break;
            }
            case "QMT": {
                returnResult = `m<sup class="cc">3</sup>`;
                break;
            }
            case "QSIZE": {
                returnResult = `WxLxH`;
                break;
            }
            case "SIZE": {
                returnResult = `WxL`;
                break;
            }
            case "SQFT": {
                returnResult = `ft<sup class="cc">2</sup>`;
                break;
            }
            default: {
                returnResult = "";
                break;
            }
        }
        return returnResult;
    }

    displayMeasurementSize(value, format) {
        let returnResult = value;

        switch (format) {
            case "M2": {
                returnResult = this.displayNumber(returnResult);
                break;
            }
            case "MQ": {
                returnResult = this.displayNumber(returnResult);
                break;
            }
            case "QCM": {
                returnResult = this.displayNumber(returnResult);
                break;
            }
            case "QFT": {
                returnResult = this.displayNumber(returnResult);
                break;
            }
            case "QMT": {
                returnResult = this.displayNumber(returnResult);
                break;
            }
            case "QSIZE": {
                let dimensionArr = returnResult.split('x');
                returnResult = `${this.displayNumber(dimensionArr[0])}x${this.displayNumber(dimensionArr[1])}x${this.displayNumber(dimensionArr[2])}`;
                break;
            }
            case "SIZE": {
                let dimensionArr = returnResult.split('x');
                returnResult = `${this.displayNumber(dimensionArr[0])}x${this.displayNumber(dimensionArr[1])}`;
                break;
            }
            case "SQFT": {
                returnResult = this.displayNumber(returnResult);
                break;
            }
            default: {
                break;
            }
        }
        return returnResult;
    }



    getUserBrowsername() {
        let agent = { browser: { name: null, version: null, v: null, userAgent: null, app: null, os: null }, mobile: false, pointlock: false };

        let nVer = navigator.appVersion;
        let nAgt = navigator.userAgent;
        let browserName = navigator.appName;
        let fullVersion = '' + parseFloat(navigator.appVersion);
        let majorVersion = parseInt(navigator.appVersion, 10);
        let nameOffset, verOffset, ix;
        agent.pointlock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
            (verOffset = nAgt.lastIndexOf('/'))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);

        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        agent.browser.name = browserName;
        agent.browser.version = fullVersion;
        agent.browser.v = majorVersion;
        agent.browser.app = navigator.appName;
        agent.browser.userAgent = navigator.userAgent;
        let OSName = "Unknown OS";
        if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
        if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
        if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

        agent.browser.os = OSName;
        agent.mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
        return `${agent.browser.name}/${agent.browser.version}-${agent.browser.os}`
    }

}
export default Helper;
