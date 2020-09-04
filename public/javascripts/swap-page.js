$(document).ready(function() {

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
});
