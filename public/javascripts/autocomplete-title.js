$(document).ready(function() {

    var input = document.getElementById("title");

    autocomplete({
        input: input,
        minLength: 1,
        emptyMsg: "No texts found...",
        render: custRender,
        fetch: function(text, update) {
            text = text.toLowerCase();
            $.get("search/suggestions?title=" + text, function(data) {
                // console.log(suggestions);
                update(data);
            });
        },
        onSelect: function(item) {
            input.value = item.text_title;
        },
        customize: selectedOnHover
    });


});

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
