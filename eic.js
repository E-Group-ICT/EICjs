/* global _ */

var EIC = (function() {
    var charValues = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15, 'g': 16, 'h': 17, 'i': 18, 'j': 19, 'k': 20, 'l': 21, 'm': 22, 'n': 23, 'o': 24, 'p': 25, 'q': 26, 'r': 27, 's': 28, 't': 29, 'u': 30, 'v': 31, 'w': 32, 'x': 33, 'y': 34, 'z': 35,
        '-': 36
    };

    var valueChars = _.invert(charValues);

    var mapping = function(x) {
        return charValues[x];
    };

    var weighting = function(x, index) {
        return (16-index)*x;
    };

    // https://www.entsoe.eu/fileadmin/user_upload/edi/library/downloads/EIC_Reference_Manual_Release_5.pdf pp14-16
    var types = {
        'x': "PARTY",
        'y': "AREA",
        'z': "MEASUREMENT_POINT",
        'v': "LOCATION",
        'w': "RESOURCE",
        't': "TIE_LINE",
        'a': "SUBSTATION",
    };

    // https://www.entsoe.eu/data/energy-identification-codes-eic/eic-lio-websites/Pages/default.aspx
    var issuers = {
        "10": {"name": "ENTSOES", "country": "EU"},
        "11": {"name": "BDEW", "country": "DE"},
        "12": {"name": "Swissgrid", "country": "CH"},
        "13": {"name": "A&B", "country": "AT"},
        "14": {"name": "APCS", "country": "AT"},
        "15": {"name": "Mavir", "country": "HU"},
        "16": {"name": "REN", "country": "PT"},
        "17": {"name": "RTE", "country": "FR"},
        "18": {"name": "REE", "country": "ES"},
        "19": {"name": "PSE S.A.", "country": "PL"},
        "20": {"name": "CREOS", "country": "LU"},
        "21": {"name": "ENTSO-G", "country": ""},
        "22": {"name": "Elia", "country": "BE"},
        "23": {"name": "EFET", "country": ""},
        "24": {"name": "SEPS", "country": "SK"},
        "25": {"name": "Gas Connect", "country": "AT"},
        "26": {"name": "Terna", "country": "IT"},
        "27": {"name": "CEPS", "country": "CZ"},
        "28": {"name": "Eles", "country": "SI"},
        "29": {"name": "IPTO", "country": "GR"},
        "30": {"name": "Transelectrica", "country": "RO"},
        "31": {"name": "HOPS", "country": "HR"},
        "32": {"name": "ESO", "country": "AD"},
        "33": {"name": "MEPSO", "country": "MK"},
        "34": {"name": "EMS", "country": "RS"},
        "35": {"name": "CGES", "country": "ME"},
        "36": {"name": "NOS-BIH", "country": "BA"},
        "37": {"name": "DVGW", "country": "DE"},
        "38": {"name": "Elering", "country": "EE"},
        "39": {"name": "FGSZ", "country": "HU"},
        "40": {"name": "TEIAS", "country": "TR"},
        "41": {"name": "LITGRID", "country": "UAB"},
        "42": {"name": "EU-STREAM", "country": "SK"},
        "43": {"name": "AUGSTSPRIEGUMA", "country": "LV"},
        "44": {"name": "Fingrid Oyj", "country": "FI"},
        "45": {"name": "Energinet", "country": "DK"},
        "46": {"name": "SVK", "country": "SE"},
        "47": {"name": "Eirgrid", "country": "IE"},
        "48": {"name": "NationalGrid", "country": "UK"},
        "49": {"name": "Tennet", "country": "NL"},
        "50": {"name": "Statnett", "country": "NO"},
        "51": {"name": "Plinovodi", "country": "SI"},
        "52": {"name": "GTS", "country": "NL"},
        "53": {"name": "GAZ-SYSTEM", "country": "PL"},
        "54": {"name": "OST", "country": "AL"},
        "55": {"name": "XOSERVE", "country": "UK"},
        // "56": {"name": "UKRTRANSGAZ", "country": "UA"}, ????
        "56": {"name": "FLUXYS", "country": "BE"}
    };

    /**
     *  Does given string look like an EIC code? This function returns true if given string may be an EIC coce:
     *  it has the correct length and format; however, this function does not examine the check character.
     *
     *  @param  {string} str The examined string
     *  @return {boolean} True if the given string looks like an EIC code: has the correct length, format, etc.
     */
    var mayBeEIC = function(str) {
        if(str.length!=15 && str.length!=16) return false;
        str = str.toLowerCase();
        for(var i=0, len=str.length; i<len; ++i) {
            if(!((str.charCodeAt(i)>=97 && str.charCodeAt(i)<=122) || (str.charCodeAt(i)>=48 && str.charCodeAt(i)<=57) || str[i] == '-')) return false;
        }
        return true;
    };

    /**
     *  Calculates the check character for given string. The string must be 15 characters long (or 16 characters long,
     *  but in that case the 16th character is discarded).
     *
     *  @param  {string} str The examined string. Must be 15 or 16 characters long, and must be a well-formed EIC-string.
     *  @return {character} A single character that is the check character for the given string.
     */
    var calcCheckChar = function(str) {
        var s = str.substring(0,15).toLowerCase().split("");
        var c = _.sum(
            _.map(
                _.map(s, mapping),
                weighting
            )
        );

        return valueChars[(36 - ((c - 1)%37))];
    };

    /**
     *  Check to see if a given EIC string is valid.
     *
     *  Returns true iff the given string is exactly 16 characters long, it's in the correct format, and the
     *  check character checks out.
     */
    var isValid = function(str) {
        return examine(str).isValid;
    };

    /**
     *  Examine a string to see if it's a valid EIC code.
     *
     *  This resturns an object containing the possibly lists of errors and warnings concerning the given string, and also the issuer and type, if any.
     */
    var examine = function(str) {
        var result = {
            isValid: true,
            errors: [],
            warnings: [],
            issuer: undefined,
            type: undefined
        };

        if(str.length < 16) {
            result.errors.push({ errorMessage: "TOO_SHORT" });
        }
        if(str.length > 16) {
            result.errors.push({ errorMessage: "TOO_LONG" });
        }

        str = str.toLowerCase();
        for(var i=0, len=str.length; i<len; ++i) {
            if(!((str.charCodeAt(i)>=97 && str.charCodeAt(i)<=122) || (str.charCodeAt(i)>=48 && str.charCodeAt(i)<=57) || str[i] == '-')) {
                result.errors.push({ errorMessage: "INVALID_CHARACTER", errorParams: [i, str[i]] });
            }
        }

        // if we have an error by this time, we just throw away the pencil: no other check makes sense.
        if(result.errors.length) {
            result.isValid = false;
            return result;
        }

        var cc = calcCheckChar(str);
        if(str[15] != cc) {
            result.errors.push({ errorMessage: "CHECKCHAR_MISMATCH", errorParams: [cc, str[15]] });
        }

        if(str[15] == cc && cc == '-') {
            result.errors.push({ errorMessage: "CHECKCHAR_HYPHEN" });
        }

        if(!(str[2] in types)) {
            result.warnings.push({ errorMessage: "UNKNOWN_TYPE", errorParams: str[2] });
        }

        if(!(str.substring(0,2) in issuers)) {
            result.warnings.push({ errorMessage: "UNKNOWN ISSUER", errorParams: str.substring(0,2) });
        }

        result.issuer = getIssuer(str);
        result.type = getType(str);
        result.isValid = result.errors.length === 0;

        return result;
    };


    /**
     *  Return the type of the object represented by a valid EIC code. The type may be "PARTY", "AREA", "MEASUREMENT_POINT", "LOCATION",
     *  "RESOURCE", "TIE_LINE" or "SUBSTATION". For more information about these, see the
     *  [Reference Manual](https://www.entsoe.eu/fileadmin/user_upload/edi/library/downloads/EIC_Reference_Manual_Release_5.pdf).
     */
    var getType = function(str) {
        if(!mayBeEIC(str)) throw new Error("Malformed EIC code");
        return types[str[2]];
    };

    var getIssuer = function(str) {
        if(!mayBeEIC(str)) throw new Error("Malformed EIC code");
        return issuers[str.substr(0, 2)];
    };

    return {
        "mayBeEIC": mayBeEIC,
        "calcCheckChar": calcCheckChar,
        "isValid": isValid,
        "getType": getType,
        "getIssuer": getIssuer,
        "examine": examine
    };
})();
