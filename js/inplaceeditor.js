$(document).ready(function () {

    const TEXT_MODE = "text";
    const HTML_MODE = "html";
    const NONE_MODE = "none";
    const ADVANCED_HTML_MODE = "advanced";
    var EDITING_MODE = NONE_MODE;
    var current = undefined;
    var highlighting = true;

    //modes PHP, NODE, DEMO
    const SEVER = 'DEMO';
    const pathPrefix = SEVER == 'PHP' ? '/server.php?action=' : '/';

    const savePath = pathPrefix + 'save';
    const copyPath = pathPrefix + 'duplicate';
    const loginPath = pathPrefix + 'login';
    const logoutPath = pathPrefix + 'logout';
    const loginStatusPath = pathPrefix + 'isloggedin';


    console.log("########################################");
    console.log("########## InPlaceEditor v.0.1 #######");
    console.log("########################################");

    function InPlaceEditor() {
        return InPlaceEditor;
    }

    window.InPlaceEditor = window.InPlaceEditor  || InPlaceEditor;

    var stopHighlighting = function (selector) {
        $(selector).removeClass('editablearea');
        highlighting = false;
    };

    var isEditable = function (selector) {
        var isEditorControls = $(selector).hasClass('editorControls');
        var closestEditorControls = $(selector).closest('.editorControls').find(selector);
        var isChildOfEditorControls = closestEditorControls != undefined && closestEditorControls.length != 0;
        var isChildOfBody = $(selector).parents('body').length > 0;

        return  ( !isEditorControls && !isChildOfEditorControls && isChildOfBody );
    };

    function stripX(str) {
        str = style_html(str);
        return str.replace(/\&(?!(\w+;))/g, '&amp;').replace(/</g, '&lt;');
    }

    InPlaceEditor.insertTextAtCursor = function (text) {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode( document.createTextNode(text) );
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
        }
    }

    /**
     * entering advanced mode
     */
    InPlaceEditor.initMouesListeners = function () {
        $(document).mouseout(function (event) {
            if (isEditable(event.target))
                $(event.target).removeClass('editablearea');
        });
        $(document).mouseover(function (event) {
            //console.log("mouse overe MODE check:" + EDITING_MODE);
            if (highlighting && isEditable(event.target) && EDITING_MODE == NONE_MODE )
                $(event.target).addClass('editablearea');
        });
        $(document).click(function (event) {
            if (!isEditable(event.target)) return true;
            if ($(event.target).is('[contentEditable]')) return false;
            if ($(event.target).parents('[contentEditable]').length != 0) return false;
            if (current && !$(event.target).is('[contentEditable]'))
                InPlaceEditor.stopEditing();
            if ($(event.target).children().length > 0) EDITING_MODE = HTML_MODE;
            else EDITING_MODE = TEXT_MODE;
            // activate edit mode
            $(event.target).attr('contentEditable', '');
            current = event.target;
            current.onpaste = function(e) {
                console.log("onpaste..." + e.clipboardData.getData('text/plain') + "+");
                InPlaceEditor.insertTextAtCursor( e.clipboardData.getData('text/plain') );
                return false; // to prevent user insert
            }
            stopHighlighting(event.target);
        });
        $(document).dblclick(function (event) {
            if (!isEditable(event.target)) return false;
            if (EDITING_MODE == ADVANCED_HTML_MODE || $('.prettyprint').length != 0) {
                console.warn("current mode:" + ADVANCED_HTML_MODE);
                return false;
            }
            current = event.target;
            $(current).html('<pre class="prettyprint" id="prettyprint">' + stripX($(current).html()) + '</pre>');
            prettyPrint();
            stopHighlighting(event.target);
            EDITING_MODE = ADVANCED_HTML_MODE;
        });


        $(document).keyup(function (e) {
            //processKeyEvent(e);
            if (e.keyCode == 27)
                InPlaceEditor.stopEditing();
            return false;
        });
//
//        $(document).keypress(function (e) {
//            processKeyEvent(e);
//        });

        if (typeof document.addEventListener != "undefined") {
            document.addEventListener("keypress", processKeyEvent, false);
        } else if (typeof document.attachEvent != "undefined") {
            document.attachEvent("onkeypress", processKeyEvent);
        }
    }

    function handleEnter(e) {
        var sel, range, br, addedBr = false;
        var evt = e || window.event;
        var charCode = evt.which || evt.keyCode;
            //set curret at end of contentEditable (FIX problem with cursor it beyond the pretty print area)
            if (EDITING_MODE == ADVANCED_HTML_MODE) {
                var el = document.getElementById("prettyprint");
                var range = document.createRange();
                var sel = window.getSelection();
                if ($(sel.anchorNode).is('[contenteditable]') && el.lastChild) {
                    range.setStart(el.lastChild, el.lastChild.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            if (typeof window.getSelection != "undefined") {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    br = document.createElement("br");
                    range.insertNode(br);
                    range.setEndAfter(br);
                    range.setStartAfter(br);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    addedBr = true;
                }
            } else if (typeof document.selection != "undefined") {
                sel = document.selection;
                if (sel.createRange) {
                    range = sel.createRange();
                    range.pasteHTML("<br>");
                    range.select();
                    addedBr = true;
                }
            }

            // If successful, prevent the browser's default handling of the keypress
            if (addedBr) {
                if (typeof evt.preventDefault != "undefined") {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            }
    }

    var processKeyEvent = function (e) {
        console.log("key:" + e.keyCode);
//        if (e.keyCode == 27)
//            InPlaceEditor.stopEditing();
        if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
            //cursor exited the edited area
            if ($(window.getSelection().anchorNode).parents('[contentEditable]').length == 0)
                InPlaceEditor.stopEditing();
        } else if (e.keyCode == 13) {
            handleEnter(e);
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

    InPlaceEditor.stopEditing = function () {
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
        console.log("new value:" + content);
        if ($(current).parents('body').length == 0 ) {
            $(document).unbind('click');
            $(document).unbind('dblclick');
            $(document).unbind('mouseover');
            $(document).unbind('mouseout');
        }
        $(current).html(content);
        highlighting = true;
        EDITING_MODE = NONE_MODE;
        current = undefined;
    };

    InPlaceEditor.appendServiceStylesAndDependencies = function () {
        if ($("link[href*='prettify.css']").length == 0)
            $('head').append('<link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css" type="text/css" />');
        if ($("script[src*='prettify.js']").length == 0)
            $('body').append('<script src="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.js"/>');
        if ($("script[src*='beautify-html.js']").length == 0)
            $('body').append('<script src="https://raw.github.com/einars/js-beautify/master/beautify-html.js"/>');
    }

    InPlaceEditor.addControls = function() {
        if ($('.editorControls').length > 0) $('.editorControls').remove();
        var controlsCss = ' style=" top: 50px; position: fixed; right: 18px; "';
        $('body').append('<div class="editorControls" ' + controlsCss + '><button id="saveBtn" class="btn" >Save</button><button id="actionCopy" class="btn" >Copy</button> </div></div>');
        controlsCss = ' style=" bottom: 20px; float: right; position: fixed; right: 18px; "';
        $('body').append('<div class="editorControls" ' + controlsCss + '><a href="' + logoutPath + '">Logout</div>');
        $('#saveBtn').click(function () {
            console.log("do save...");
            InPlaceEditor.saveChanges();
        });
        $('#actionCopy').click(function () {
            console.log("do copy...");
            duplicate();
        });
        //add rollover style for highliting elements
        $("<style type='text/css'> .editablearea { box-shadow: 0 0 10px hsl(212, 80%, 50%); outline: 1px solid hsla(206, 77%, 61%, 0.3); } </style>").appendTo("head");
    }

    InPlaceEditor.startEditing = function() {
        console.log("editing...." + EDITING_MODE);
        InPlaceEditor.addControls();
        InPlaceEditor.initMouesListeners();
        highlighting = true;
    }

    var initialize = function () {
        console.log("initialize..." + window.InPlaceEditor);
        if (!window.InPlaceEditor) InPlaceEditor = new InPlaceEditor();
        InPlaceEditor.appendServiceStylesAndDependencies();
        if (SEVER == 'DEMO') {
            InPlaceEditor.startEditing()
        } else {
            $.get(loginStatusPath, function (data) {
                if ($.trim( data ) == 'true') {
                    InPlaceEditor.startEditing();
                } else {
                    var controlsCss = ' style=" bottom: 20px; float: right; position: fixed; right: 18px; "';
                    $('body').append('<div class="editorControls" ' + controlsCss + '><a href="' + loginPath + '">Admin</div>');
                    highlighting = false;
                }
            });
        }
    };

    InPlaceEditor.removeControls = function() {
        $('.editorControls').remove();
    }

    InPlaceEditor.clearDutyCode = function() {
        $("[contentEditable]").removeAttr("contentEditable");
        $("[editablearea]").removeAttr("editablearea");
        $("style:contains('.editablearea')").remove();
        $("script[src*='ga.js']").remove();
        $("script#facebook-jssdk").remove();
        $("style:contains('.fb_')").remove();
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

    InPlaceEditor.duplicate = function () {
        if ( SEVER == 'DEMO') return false;
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

    InPlaceEditor.saveChanges = function () {
        if ( SEVER == 'DEMO') return false;
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1) || 'index.html';
        InPlaceEditor.removeControls();
        InPlaceEditor.clearDutyCode();
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

    initialize();
});	

