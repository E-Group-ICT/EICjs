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

    var types = ['x', 'y', 'z', 'v', 'w'];

    /**
     *  Does given string look like an EIC code? This function returns true if given string may be an EIC coce:
     *  it has the correct length and format; however, this function does not examine the check character.
     *
     *  @param  {string} str The examined string
     *  @return {boolean} True if the given string looks like an EIC code: has the correct length, format, etc.
     */
    var mayBeEIC = function(str) {
        str = str.toLowerCase();
        if(str.length!=15 && str.length!=16) return false;
        for(var i=0, len=str.length; i<len; ++i) {
            if(!((str.charCodeAt(i)>=97 && str.charCodeAt(i)<=122) || (str.charCodeAt(i)>=48 && str.charCodeAt(i)<=57) || str[i] == '-')) return false;
        }
        if(!~types.indexOf(str[2])) return false;
        return true;
    };

    /**
     *  Calculates the check character for given string. The string must be 15 characters long (or 16 characters long,
     *  but in that case the 16th character is discarded).
     *
     *  @param  {string} str The examined string. Must be 15 or 16 characters long, and must be a well-formed EIC-string.
     *  @return {character} A single character that is the check character for the given string.
     */
    calcCheckChar = function(str) {
        var s = str.substring(0,15).toLowerCase().split("");
        console.log(s)
        var c = _.sum(
            _.map(
                _.map(s, mapping),
                weighting
            )
        );

        return valueChars[(36 - ((c - 1)%37))];
    };

    return {
        "mayBeEIC": mayBeEIC,
        "calcCheckChar": calcCheckChar
    };
})();
