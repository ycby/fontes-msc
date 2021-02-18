$(document).ready(function() {

    //shrink the search container
    $("#search-container-collapser").click(shrinkSearch);

    //copy citation
    $(".cite").find(".copy").click(clipboardCopy);

    //copy popup
    $(".cite").find(".popup").click(copyClicked);

    //write see all records href
    $("#all-records").attr("href", replaceAllRecordsHref());

    //pinning entries
    $(".pin").click(toggleEntryInPinned);
    $(".pin").each(setPinnedIfPinned);

    //print records & csv
    var queryIndex = window.location.href.indexOf("?");

    if (queryIndex != -1) {

        var queryString = window.location.href.substring(window.location.href.indexOf("?"));
        var printQuery = $("#print-records").attr("href") + queryString;
        var downloadQuery = $("#download-records").attr("href") + queryString;
        $("#print-records").attr("href", printQuery);
        $("#download-records").attr("href", downloadQuery);
    }

    //open and close accordions
    $(".accordion").click(accordionActive);

    //set pagination links
    $(".pagination").find("a").each(setPaginationLinks);

    //autocomplete
    var input = document.getElementById("title");

    if (document.getElementById("target-text").checked) {
        autocomplete({
            input: input,
            minLength: 1,
            emptyMsg: "No texts found...",
            render: custRender,
            fetch: function(text, update) {
                text = text.toLowerCase();
                $.get(baseUrl + "search/targetsuggestions?title=" + text, function(data) {
                    // console.log(suggestions);
                    update(data);
                });
            },
            onSelect: function(item) {
                input.value = item.text_title;
            },
            customize: selectedOnHover
        });
    } else {
        autocomplete({
            input: input,
            minLength: 1,
            emptyMsg: "No texts found...",
            render: custRender,
            fetch: function(text, update) {
                text = text.toLowerCase();
                $.get(baseUrl + "search/sourcesuggestions?title=" + text, function(data) {
                    // console.log(suggestions);
                    update(data);
                });
            },
            onSelect: function(item) {
                input.value = item.text_title;
            },
            customize: selectedOnHover
        });
    }


    //swap page on different search
    $("input[type=radio][name=texttype]").change(function() {
        $("#title").val("");
        $("#author").val("");
        $("#edition").val("");
        $("#reference").val("");
        sessionStorage.setItem("title", "")
        sessionStorage.setItem("author", "")
        sessionStorage.setItem("edition", "")
        sessionStorage.setItem("reference", "")
        $("form").submit();
    });

    //remembering the search
    $("#title").val(sessionStorage.getItem("title"));
    $("#author").val(sessionStorage.getItem("author"));
    $("#edition").val(sessionStorage.getItem("edition"));
    $("#reference").val(sessionStorage.getItem("reference"));

    $("#search-breadcrumb").text($("#search-breadcrumb").text() + " " + (sessionStorage.getItem("title") != null ? sessionStorage.getItem("title") : ""));
    $("#search-breadcrumb").attr("href", (sessionStorage.getItem("query") != null ? baseUrl + "search/?" + sessionStorage.getItem("query") : baseUrl + "search/"));

    $("#submit-query-button").click(saveQuery);

    //modal for citation
    var citeButtons = $(".cite-button");
    var modals = $(".modal");
    var modalCloses = $(".modal-close");

    citeButtons.click(function() {
        modals.eq(getCiteButtonNumber($(this))).show();
    });

    modalCloses.click(function() {
        modals.hide();
    });

    $(window).click(function(e) {
        if (e.target.className.match(/(modal )/)) {
            modals.hide();
        }
    });
});

// auto complete
function custRender(item, currentValue) {
    var divcontainer = document.createElement("div");
    var divtitle = document.createElement("div");
    var divauthor = document.createElement("div");

    divcontainer.classList.add("suggested-container");
    divtitle.textContent = item.text_title;
    divtitle.classList.add("suggested-title");
    divauthor.textContent = item.text_author;
    divauthor.classList.add("suggested-author");

    divcontainer.appendChild(divtitle);
    divcontainer.appendChild(divauthor);

    return divcontainer;
}

function selectedOnHover() {
    $(".autocomplete").children().hover(function() {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}

//save the submission
function saveQuery() {
    sessionStorage.setItem("title", $("#title").val());
    sessionStorage.setItem("author", $("#author").val());
    sessionStorage.setItem("edition", $("#edition").val());
    sessionStorage.setItem("reference", $("#reference").val());

    var query = {
        texttype: $("input[name=texttype]:checked").val(),
        title: $("#title").val(),
        author: $("#author").val(),
        edition: $("#edition").val(),
        reference: $("#reference").val()
    }

    sessionStorage.setItem("query", $.param(query));
}

// accordion active
function accordionActive(e) {

    if (!e.target.classList.contains("pin")) {
        $(this).toggleClass("accordion-active");
        $(this).find(".entry-arrow").toggleClass("rotated")
        $(this).next().slideToggle(200);
    }
}

// pinning entries
function toggleEntryInPinned(event) {

    $(this).toggleClass("pinned");
    var id = $(this).parent().next().find("._id").text();
    var pinnedEntries = JSON.parse(localStorage.getItem("pinned-entries"));

    if ($(this).hasClass("pinned")) {
        //add to the pinned list

        if (pinnedEntries == null) {

            localStorage.setItem("pinned-entries", JSON.stringify([id]));
        } else {

            pinnedEntries.push(id);
            localStorage.setItem("pinned-entries", JSON.stringify(pinnedEntries));
        }
    } else {

        //remove from the pinned list
        // console.log(pinnedEntries)
        if (pinnedEntries != null) {

            var removeIndex = pinnedEntries.indexOf(id);

            if (removeIndex != -1) {
                pinnedEntries.splice(removeIndex, 1);
                localStorage.setItem("pinned-entries", JSON.stringify(pinnedEntries));
            }
        }
    }
}

//for making records which were already pinned, pinned on page load
function setPinnedIfPinned() {

    if (localStorage.getItem("pinned-entries") != null) {
        if (JSON.parse(localStorage.getItem("pinned-entries")).includes($(this).parent().next().find("._id").text())) {
            $(this).toggleClass("pinned");
        }
    }
}

// copying stuff (citation)
function clipboardCopy() {

    var thisButton = $(this);
    //from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    navigator.permissions.query({name: "clipboard-write"}).then(function(result) {
        if (result.state == "granted" || result.state == "prompt") {
            var copiedText = $(this).next(".cite-box").find("p").text();
            navigator.clipboard.writeText(copiedText);
        }
    }).catch(function(reason) {
        // console.log(reason);
        fallbackCopy(thisButton);
    });
}

function fallbackCopy(thisButton) {

    //https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
    //for dealing with turning p into an input

    var pText = thisButton.next(".cite-box").find("p").text();
    var hiddenInput = $("<input>");

    $("body").append(hiddenInput);
    hiddenInput.val(pText).select();

    document.execCommand("copy");

    hiddenInput.remove();
}

function copyClicked() {

    console.log("clicked in popup");
    $(this).find(".popuptext").toggleClass("show-popup");
}

function getCiteButtonNumber(citeButton) {

    return parseInt(citeButton.attr("id").replace("cite-button-", ""));
}

// shrink search area
function shrinkSearch() {
    $("#advanced-search").slideToggle(200, "linear");
    $(this).toggleClass("flipped");
}

//pagination link
function setPaginationLinks() {

    var searchstring = "?text-type=target-text&title=&author=&edition=&reference=";
    var href = window.location.href;
    var pagiHref = $(this).attr("href");
    var shownText = $(this).text();

    if (href.search("\\?") == -1) {
        href += searchstring;
    }

    var pageNoExist = href.search(/(pageNo=[0-9]+)/);

    if (shownText == "Next »") {
        if (pageNoExist == -1) {
            $(this).attr("href", href + "&pageNo=2");
        } else {
            var extra = parseInt(href.substring(pageNoExist).substring(7)) + 1;
            $(this).attr("href", href.replace(/(&pageNo=[0-9]+)/, "&pageNo=" + extra));
        }
    } else if (shownText == "« Prev") {
        //no need to worry if pageno isnt in url because that means its on the first page
        //if on other pages
        var extra = parseInt(href.substring(pageNoExist).substring(7)) - 1;
        $(this).attr("href", href.replace(/(&pageNo=[0-9]+)/, "&pageNo=" + extra));
    } else {
        if (pageNoExist == -1) {
            $(this).attr("href", href + "&pageNo=" + shownText);
        } else {
            $(this).attr("href", href.replace(/(&pageNo=[0-9]+)/, "&pageNo=" + shownText));
        }
    }
}

function replaceAllRecordsHref() {

    var currentHref = window.location.href;
    var hasQuery = true;

    if (!currentHref.includes("?")) {
        currentHref += "?";
        hasQuery = false;
    }

    if (currentHref.includes("pageNo=")) {

        currentHref = currentHref.replace(/pageNo=\d/, "pageNo=1");
    } else {
        if (hasQuery) currentHref += "&";
        currentHref += "pageNo=1";
    }

    currentHref += "&stepSize=-1"

    return currentHref;
}
