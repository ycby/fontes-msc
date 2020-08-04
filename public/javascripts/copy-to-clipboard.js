//https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
//the best answer

//using the fallback method. where clipboard api is tried before using execcommand

$(document).ready(function() {

    $(".cite").find(".copy").click(clipboardCopy);
    // $(".cite").find(".copy").click(fallbackCopy);
});

function clipboardCopy() {

    var thisButton = $(this);
    //from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
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
