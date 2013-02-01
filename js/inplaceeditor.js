$(document).ready(function () {

    const TEXT_MODE = "text";
    const HTML_MODE = "html";
    const NONE_MODE = "none";
    const ADVANCED_HTML_MODE = "advanced";
    var EDITING_MODE = NONE_MODE;
    var current = undefined;
    var highlighting = true;

    const SEVER = 'NODE';
    const pathPrefix = SEVER == 'PHP' ? '/server.php?action=' : '/';

    const savePath = pathPrefix + 'save';
    const copyPath = pathPrefix + 'duplicate';
    const loginPath = pathPrefix + 'login';
    const logoutPath = pathPrefix + 'logout';
    const loginStatusPath = pathPrefix + 'isloggedin';


    console.log("########################################");
    console.log("########## InPlaceEditor v.0.1 #######");
    console.log("########################################");

    var stopHighlighting = function (selector) {
        $(selector).removeClass('editablearea');
        highlighting = false;
    };

    var isEditable = function (selector) {
        var isEditorControls = $(selector).hasClass('editorControls');
        var closestEditorControls = $(selector).closest('.editorControls').find(selector);
        var isChildOfEditorControls = closestEditorControls != undefined && closestEditorControls.length != 0;
        return  ( !isEditorControls && !isChildOfEditorControls );
    };

    function stripX(str) {
        str = style_html(str);
        return str.replace(/\&(?!(\w+;))/g, '&amp;').replace(/</g, '&lt;');
    }

    /**
     * entering advanced mode
     */
    function initMouesListeners () {
        $(document).mouseout(function (event) {
            if (isEditable(event.target))
                $(event.target).removeClass('editablearea');
        });
        $(document).mouseover(function (event) {
            if (highlighting && isEditable(event.target))
                $(event.target).addClass('editablearea');
        });
        $(document).click(function (event) {
            if (!isEditable(event.target)) return true;
            if ($(event.target).is('[contentEditable]')) return false;
            if ($(event.target).parents('[contentEditable]').length != 0) return false;
            if (current && !$(event.target).is('[contentEditable]'))
                stopEditing();
            if ($(event.target).children().length > 0) EDITING_MODE = HTML_MODE;
            else EDITING_MODE = TEXT_MODE;
            // activate edit mode
            $(event.target).attr('contentEditable', '');
            current = event.target;
            stopHighlighting(event.target);
        });
        $(document).dblclick(function (event) {
            current = event.target;
            if (EDITING_MODE == ADVANCED_HTML_MODE || $('.prettyprint').length != 0) {
                console.warn("current mode:" + ADVANCED_HTML_MODE);
                return false;
            }
            $(current).html('<pre class="prettyprint">' + stripX($(current).html()) + '</pre>');
            prettyPrint();
            stopHighlighting(event.target);
            EDITING_MODE = ADVANCED_HTML_MODE;
        });


        /*$(document).keyup(function (e) {
            processKeyEvent(e.keyCode);
        });*/

        document.onkeyup = processKeyEvent;
    }

    var processKeyEvent = function (e) {
        console.log("key:" + e.keyCode);
        if (e.keyCode == 27)
            stopEditing();
        else if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
            //cursor exited the edited area
            if ($(window.getSelection().anchorNode).parents('[contentEditable]').length == 0)
                stopEditing();
        } else if (e.keyCode == 13) {
            if (!e.shiftKey) {
                console.log("enter not allowed");
                alert("Use Shift+Enter for new line!!!")
                return false;
            }
        }
        return true;
    }

    var clearPrettyPrintFormatting = function (parent) {
        var content = "";
        if ($(parent).find(".prettyprint").children().length == 0)
            content = $(parent).html();
        else
            $('.prettyprint').children().each(function (i) {
                var nodeHtml = $(this).html();
                content += nodeHtml;
            });
        return content;
    };

    var stopEditing = function () {
        console.log("stop editing....");
        $(current).removeAttr('contentEditable');
        $(current).parents().removeAttr('contentEditable');
        var content = EDITING_MODE == TEXT_MODE
            ? $(current).text() : EDITING_MODE == ADVANCED_HTML_MODE
            ? clearPrettyPrintFormatting(current) : $(current).html();
        if (EDITING_MODE == HTML_MODE || EDITING_MODE == ADVANCED_HTML_MODE) {
            content = content.split('&lt;').join('<');
            content = content.split('&gt;').join('>');
        }
        if (EDITING_MODE == HTML_MODE || EDITING_MODE == ADVANCED_HTML_MODE) {
            content = content.split('&lt;').join('<');
            content = content.split('&gt;').join('>');
        }
        console.log("new value:" + content);
        $(current).html(content);
        highlighting = true;
        EDITING_MODE = NONE_MODE;
        current = undefined;
    };

    var appendServiceStylesAndDependencies = function () {
        if ($("link[href*='prettify.css']").length == 0)
            $('head').append('<link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css" type="text/css" />');
        if ($("script[src*='prettify.js']").length == 0)
            $('body').append('<script src="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.js"/>');
        if ($("script[src*='beautify-html.js']").length == 0)
            $('body').append('<script src="https://raw.github.com/einars/js-beautify/master/beautify-html.js"/>');
        $("<style type='text/css'> .editablearea { box-shadow: 0 0 10px hsl(212, 80%, 50%); outline: 1px solid hsla(206, 77%, 61%, 0.3); } </style>").appendTo("head");
    }

    function addControls() {
        if ($('.editorControls').length > 0) $('.editorControls').remove();
        var controlsCss = ' style=" top: 50px; position: absolute; right: 18px; "';
        $('body').append('<div class="editorControls" ' + controlsCss + '><button id="saveBtn" class="btn" >Save</button><button id="actionCopy" class="btn" >Copy</button> </div></div>');
        controlsCss = ' style=" bottom: 20px; position: absolute; right: 18px; "';
        $('body').append('<div class="editorControls" ' + controlsCss + '><a href="' + logoutPath + '">Logout</div>');
        $('#saveBtn').click(function () {
            console.log("do save...");
            saveChanges();
        });
        $('#actionCopy').click(function () {
            console.log("do copy...");
            duplicate();
        });
    }

    var initialize = function () {
        $.get(loginStatusPath, function (data) {
            if ($.trim( data ) == 'true') {
                addControls();
                initMouesListeners();
                highlighting = true;
            } else {
                var controlsCss = ' style=" bottom: 20px; position: absolute; right: 18px; "';
                $('body').append('<div class="editorControls" ' + controlsCss + '><a href="' + loginPath + '">Admin</div>');
                highlighting = false;
            }
        });
    };

    function removeControls() {
        $('.editorControls').remove();
    }

    function clearDutyCode() {
        $("[contentEditable]").removeAttr("contentEditable");
        $("[editablearea]").removeAttr("editablearea");
    }

    var getEntireHtml = function () {
        var node = document.doctype;
        var html = "<!DOCTYPE "
            + node.name
            + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
            + (!node.publicId && node.systemId ? ' SYSTEM' : '')
            + (node.systemId ? ' "' + node.systemId + '"' : '')
            + '>';
        html += $('html')[0].outerHTML;
        return html;
    };

    var duplicate = function () {
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1) || 'index.html';
        var target = window.prompt("Enter new name:", "");
        if (target) {
            var data = {
                from:filename,
                to:target
            };
            $.post(copyPath, data,function (data) {
                console.log("saved:" + data);
                document.location = target;
            }).error(function () {
                    console.log("error");
                });
        }
    };

    var saveChanges = function () {
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1) || 'index.html';
        //removeControls();
        clearDutyCode();
        var entireHtml = getEntireHtml();
        var data = {
            name:filename,
            content:entireHtml
        };
        $.post(savePath, data,function (data) {
            console.log("saved:" + data);
            initialize();
        }).error(function (err) {
                console.log("error" + err);
            });
    };

    appendServiceStylesAndDependencies();
    initialize();
});	

