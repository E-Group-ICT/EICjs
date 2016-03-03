$(document).ready(function() {
    var fragment = $("#eic-fragment");
    var fragment_cc = $("#eic-fragment-cc");

    var ident = $("#eic");
    var eic_validity = $("#eic-validity");

    var eic_validate_form = {
        form: $("#eic-validate-form"),
        explanation: $("#eic-validate-form").find('.eic-explain').first(),
        errors: $("#eic-validate-form").find('.eic-errors').first(),
        warnings: $("#eic-validate-form").find('.eic-warnings').first()
    }

    var warningClass = "fa-exclamation-triangle";
    var errorClass = "red fa-times";
    var validClass = "green fa-check";
    var toRemove = _.join([warningClass, errorClass, validClass], " ");

    var explain = function(validity, form) {
        if(validity.errors.length > 0) {
            form.explanation.text("Invalid EIC code.");
        } else if(validity.warnings.length > 0) {
            form.explanation.text("Almost valid.");
        } else {
            form.explanation.text(sprintf(
                "Valid EIC code denoting a %s, issued by %s (%s)",
                EIC.localize(validity.type).toLowerCase(),
                validity.issuer.name,
                validity.issuer.country
            ));
        }

        form.errors.empty();
        form.warnings.empty();
        for(var i=0; i<validity.errors.length; ++i) {
            form.errors.append($('<li>').text(EIC.localizeError(validity.errors[i])));
        }
        for(var i=0; i<validity.warnings.length; ++i) {
            form.warnings.append($('<li>').text(EIC.localizeError(validity.warnings[i])));
        }
    };

    var validateEic = function() {
        if(!ident.val()) {
            eic_validate_form.explanation.text("");
            eic_validate_form.errors.empty();
            eic_validate_form.warnings.empty();
            return;
        }

        var validity = EIC.examine(ident.val());

        var toAdd = undefined;
        if(validity.warnings.length > 0) {
            toAdd = warningClass;
        }
        if(validity.errors.length > 0) {
            toAdd = errorClass;
        }
        if(toAdd === undefined) {
            toAdd = validClass;
        }
        eic_validity.removeClass(toRemove).addClass(toAdd);

        explain(validity, eic_validate_form);
    };

    var calcCheckChar = function(ev) {
        if(!EIC.mayBeEIC(fragment.val())) {
            fragment_cc.text('?');
        } else {
            fragment_cc.text(EIC.calcCheckChar(fragment.val()));
        }
    };

    fragment.bind('input propertychange', calcCheckChar);
    ident.bind('input propertychange', validateEic);
    validateEic();
});
