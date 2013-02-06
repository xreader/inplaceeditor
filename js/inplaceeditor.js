$(document).ready(function () {

    var TEXT_MODE = "text";
    var HTML_MODE = "html";
    var NONE_MODE = "none";
    var ADVANCED_HTML_MODE = "advanced";
    var EDITING_MODE = NONE_MODE;
    var SERVER_PATH = "http://localhost/~talbot/inplaceeditor/";
    var current = undefined;
    var highlighting = true;

    //modes PHP, NODE, DEMO
    var SERVER = 'PHP';
    var pathPrefix = SERVER === 'PHP' ? SERVER_PATH + 'server.php?action=' : '/';

    var savePath = pathPrefix + 'save';
    var copyPath = pathPrefix + 'duplicate';
    var mkdirPath = pathPrefix + 'mkdir';
    var loginPath = pathPrefix + 'login';
    var logoutPath = pathPrefix + 'logout';
    var loginStatusPath = pathPrefix + 'isloggedin';


    console.log("########################################");
    console.log("########## InPlaceEditor v.0.1.3 #######");
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
        var isChildOfEditorControls = closestEditorControls !== undefined && closestEditorControls.length !== 0;
        return  ( !isEditorControls && !isChildOfEditorControls );
    };

    function stripX(str) {
        str = style_html(str);
        return str.replace(/\&(?!(\w+;))/g, '&amp;').replace(/</g, '&lt;');
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
            console.log("mouse overe MODE check:" + EDITING_MODE);
            if (highlighting && isEditable(event.target))
                $(event.target).addClass('editablearea');
        });
        $(document).click(function (event) {
            if (!isEditable(event.target)) return true;
            if ($(event.target).is('[contentEditable]')) return false;
            if ($(event.target).parents('[contentEditable]').length !== 0) return false;
            if (current && !$(event.target).is('[contentEditable]'))
                InPlaceEditor.stopEditing();
            if ($(event.target).children().length > 0) EDITING_MODE = HTML_MODE;
            else EDITING_MODE = TEXT_MODE;
            // activate edit mode
            $(event.target).attr('contentEditable', '');
            current = event.target;
            stopHighlighting(event.target);
        });
        $(document).dblclick(function (event) {
            if (EDITING_MODE === ADVANCED_HTML_MODE || $('.prettyprint').length !== 0) {
                console.warn("current mode:" + ADVANCED_HTML_MODE);
                return false;
            }
            current = event.target;
            $(current).html('<pre class="prettyprint">' + stripX($(current).html()) + '</pre>');
            prettyPrint();
            stopHighlighting(event.target);
            EDITING_MODE = ADVANCED_HTML_MODE;
        });


        $(document).keyup(function (e) {
            processKeyEvent(e);
        });

        $(document).keypress(function (e) {
            processKeyEvent(e);
        });

        //document.onkeypress = processKeyEvent;
        //document.onkeyup = processKeyEvent;
    };

    var processKeyEvent = function (e) {
        console.log("key:" + e.keyCode);
        if (e.keyCode === 27)
            InPlaceEditor.stopEditing();
        else if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            //cursor exited the edited area
            if ($(window.getSelection().anchorNode).parents('[contentEditable]').length === 0)
                InPlaceEditor.stopEditing();
        } else if (e.keyCode === 13) {
            if (!e.shiftKey) {
                e.preventDefault();
                alert("Use Shift+Enter for new line!!!");
                return false;
            }
        }
        return true;
    };

    var clearPrettyPrintFormatting = function (parent) {
        var content = "";
        if ($(parent).find(".prettyprint").children().length === 0)
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
        var content = EDITING_MODE === TEXT_MODE
            ? $(current).text() : EDITING_MODE === ADVANCED_HTML_MODE
            ? clearPrettyPrintFormatting(current) : $(current).html();
        if (EDITING_MODE === HTML_MODE || EDITING_MODE === ADVANCED_HTML_MODE) {
            content = content.split('&lt;').join('<');
            content = content.split('&gt;').join('>');
        }
        console.log("new value:" + content);
        if ($(current).is('body') ) {
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
        if ($("link[href*='prettify.css']").length === 0)
            $('head').append('<link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.css" type="text/css" />');
        if ($("script[src*='prettify.js']").length === 0)
            $('body').append('<script src="http://twitter.github.com/bootstrap/assets/js/google-code-prettify/prettify.js"/>');
        if ($("script[src*='beautify-html.js']").length === 0)
            $('body').append('<script src="https://raw.github.com/einars/js-beautify/master/beautify-html.js"/>');
    };

    InPlaceEditor.addControls = function() {
        if ($('.editorControls').length > 0) $('.editorControls').remove();
        var controlsCss = ' style=" top: 50px; position: absolute; right: 18px; "';
        $('body').append('<div class="editorControls" ' + controlsCss + '><button id="saveBtn" class="btn" >Save</button><button id="actionCopy" class="btn" >Copy</button> <button id="makeDirectory" class="btn" >New Folder</button></div></div>');
        controlsCss = ' style=" bottom: 20px; position: absolute; right: 18px; "';
        $('body').append('<div class="editorControls" ' + controlsCss + '><a href="' + logoutPath + '">Logout</div>');
        $('#saveBtn').click(function () {
            console.log("do save...");
            InPlaceEditor.saveChanges();
        });
        $('#actionCopy').click(function () {
            console.log("do copy...");
            InPlaceEditor.duplicate();
        });
        $('#makeDirectory').click(function () {
          console.log("Creating new directory... \n");
          InPlaceEditor.mkdir();
        });
        //add rollover style for highliting elements
        $("<style type='text/css'> .editablearea { box-shadow: 0 0 10px hsl(212, 80%, 50%); outline: 1px solid hsla(206, 77%, 61%, 0.3); } </style>").appendTo("head");
    };

    InPlaceEditor.startEditing = function() {
        console.log("editing...." + EDITING_MODE);
        InPlaceEditor.addControls();
        InPlaceEditor.initMouesListeners();
        highlighting = true;
    };

    var initialize = function () {
        console.log("initialize..." + window.InPlaceEditor);
        if (!window.InPlaceEditor) InPlaceEditor = new InPlaceEditor();
        InPlaceEditor.appendServiceStylesAndDependencies();
        if (SERVER === 'DEMO') {
            InPlaceEditor.startEditing();
        } else {
            $.get(loginStatusPath, function (data) {
                if ($.trim( data ) === 'true') {
                    InPlaceEditor.startEditing();
                } else {
                    var controlsCss = ' style=" bottom: 20px; position: absolute; right: 18px; "';
                    $('body').append('<div class="editorControls" ' + controlsCss + '><a href="' + loginPath + '">Admin</div>');
                    highlighting = false;
                }
            });
        }
    };

    InPlaceEditor.removeControls = function() {
        $('.editorControls').remove();
    };

    InPlaceEditor.clearDutyCode = function() {
        $("[contentEditable]").removeAttr("contentEditable");
        $("[editablearea]").removeAttr("editablearea");
        $("style:contains('.editablearea')").remove();
    };

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
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1) || 'index.html';
        var target = window.prompt("Enter new name:", "");
        if (target) {
            var data = {
                from:filename,
                to:target
            };
            $.post(copyPath, data, function (data) {
                console.log("saved:" + data);
                document.location = target;
            }).error(function () {
                    console.log("error");
                });
        }
    };
    
    InPlaceEditor.mkdir = function() {
      var dirname = window.prompt("Enter directory name: ", "");
      if (dirname) {
        var data = {
          dirname:dirname
        };
        $.post(mkdirPath, data, function(data) {
          console.log("Directory created: " + data);
        }).error(function() {
         console.log("Error creating directory.");
        });
      }
    };

    InPlaceEditor.saveChanges = function () {
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1) || 'index.html';
        InPlaceEditor.removeControls();
        InPlaceEditor.clearDutyCode();
        var entireHtml = getEntireHtml();
        console.log(filename);
        var data = {
            name:filename,
            content:entireHtml
        };
        console.log(savePath);
        $.post(savePath, data, function (data) {
            console.log("saved: \n" + data);
            initialize();
        }).error(function (err) {
            console.log("error" + err);
        });
    };

    initialize();
});	

