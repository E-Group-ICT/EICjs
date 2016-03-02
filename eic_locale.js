/* global _ */
/* global sprintf */

(function(root) {
    var _locale = 'en';
    var _locales = {
        'en': {
            type: {
                PARTY: 'Party',
                AREA: 'Area',
                MEASUREMENT_POINT: 'Measurement point',
                LOCATION: 'Location',
                RESOURCE: 'Resource object',
                TIE_LINE: 'Tieline',
                SUBSTATION: 'Substation'
            },
            errors: {
                TOO_SHORT: "The given string is too short: an EIC code is exactly 16 characters long",
                TOO_LONG: "The given string is too short: an EIC code is exactly 16 characters long",
                INVALID_CHARACTER: "Invalid character at place %1$d: '%2$s'. An EIC code may only contain the letters of the English alphabet, digits, and a hyphen.",
                CHECKCHAR_MISMATCH: "Bad check character '%2$s', expected '%1$s'",
                CHECKCHAR_HYPHEN: "Check character is a hyphen. The manual suggests not to use EIC codes whose check character is a hyphen.",
                UNKNOWN_TYPE: "Unkown type '%s'.",
                UNKNOWN_ISSUER: "Unknown issuer identifier '%s'",
            }
        }
    };

    var loc = {
        locale: function(identifier) {
            if(identifier) _locale = identifier;
            return _locale;
        },
        localize: function(token) {
            return _locales[_locale].type[token];
        },
        localizeError: function(error) {
            return vsprintf(_locales[_locale].errors[error.errorMessage.toUpperCase()], error.errorParams);
        }
    };

    root.EIC = root.EIC || {};
    _.merge(root.EIC, loc);
})(this);
