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
                TOO_SHORT: "The given string is too short: an EIC code is exactly 16 characters long.",
                TOO_LONG: "The given string is too long: an EIC code is exactly 16 characters long.",
                INVALID_CHARACTER: "Invalid character at place %1$d: '%2$s'. An EIC code may only contain the letters of the English alphabet, digits, and a hyphen.",
                CHECKCHAR_MISMATCH: "Bad check character '%2$s', expected '%1$s'",
                CHECKCHAR_HYPHEN: "Check character is a hyphen. The manual suggests not to use EIC codes whose check character is a hyphen.",
                UNKNOWN_TYPE: "Unkown type '%s'.",
                UNKNOWN_ISSUER: "Unknown issuer identifier '%s'",
            }
        },
        'hu': {
            type: {
                PARTY: 'Piaci szereplő',
                AREA: 'Terület',
                MEASUREMENT_POINT: 'Mérési pont',
                SUBSTATION: 'Alállomás'
            },
            errors: {
                TOO_SHORT: "A megadott karaktersor túl rövid: az EIC pontosan 16 karakterből áll.",
                TOO_LONG: "A megadott karaktersor túl hosszú: az EIC pontosan 16 karakterből áll.",
                INVALID_CHARACTER: "A(z) %1$d. helyen álló karakter ('%2$d') érvénytelen. Az EIC kód csak az angol ábécé betűit, számokat, és kötőjelet tartalmazhat.",
                CHECKCHAR_MISMATCH: "Rossz ellenőrző karakter. '%2$s' helyett '%1$s' lenne a helyes.",
                CHECKCHAR_HYPHEN: "Az ellenőrző karakter kötőjel. A kézikönyv azt javasolja, kerüljük az ilyen kódokat.",
                UNKNOWN_TYPE: "Ismeretlen típuskód '%s'.",
                UNKNOWN_ISSUER: "Ismeretlen kódosztó hivatali azonosító '%s'",
            }
        }
    };

    var loc = {
        locale: function(identifier) {
            if(identifier) _locale = identifier;
            return _locale;
        },
        localize: function(token) {
            return _locales[_locale].type[token] || token;
        },
        localizeError: function(error) {
            return vsprintf(_locales[_locale].errors[error.errorMessage.toUpperCase()], error.errorParams || []);
        }
    };

    root.EIC = root.EIC || {};
    _.merge(root.EIC, loc);
})(this);
