function custRender(e,t){var n=document.createElement("div"),i=document.createElement("div"),o=document.createElement("div");return n.classList.add("suggested-container"),i.textContent=e.text_title,i.classList.add("suggested-title"),o.textContent=e.text_author,o.classList.add("suggested-author"),n.appendChild(i),n.appendChild(o),n}function selectedOnHover(){$(".autocomplete").children().hover(function(){$(this).addClass("selected").siblings().removeClass("selected")})}function saveQuery(){sessionStorage.setItem("title",$("#title").val()),sessionStorage.setItem("author",$("#author").val()),sessionStorage.setItem("edition",$("#edition").val()),sessionStorage.setItem("reference",$("#reference").val());var e={texttype:$("input[name=texttype]:checked").val(),title:$("#title").val(),author:$("#author").val(),edition:$("#edition").val(),reference:$("#reference").val()};sessionStorage.setItem("query",$.param(e))}function accordionActive(e){e.target.classList.contains("pin")||($(this).toggleClass("accordion-active"),$(this).find(".entry-arrow").toggleClass("rotated"),$(this).next().slideToggle(200))}function toggleEntryInPinned(e){$(this).toggleClass("pinned");var t=$(this).parent().next().find("._id").text(),n=JSON.parse(localStorage.getItem("pinned-entries"));if($(this).hasClass("pinned"))null==n?localStorage.setItem("pinned-entries",JSON.stringify([t])):(n.push(t),localStorage.setItem("pinned-entries",JSON.stringify(n)));else if(null!=n){var i=n.indexOf(t);-1!=i&&(n.splice(i,1),localStorage.setItem("pinned-entries",JSON.stringify(n)))}}function setPinnedIfPinned(){null!=localStorage.getItem("pinned-entries")&&JSON.parse(localStorage.getItem("pinned-entries")).includes($(this).parent().next().find("._id").text())&&$(this).toggleClass("pinned")}function clipboardCopy(){var e=$(this);navigator.permissions.query({name:"clipboard-write"}).then(e=>{if("granted"==e.state||"prompt"==e.state){var t=$(this).next(".cite-box").find("p").text();navigator.clipboard.writeText(t)}}).catch(function(t){fallbackCopy(e)})}function fallbackCopy(e){var t=e.next(".cite-box").find("p").text(),n=$("<input>");$("body").append(n),n.val(t).select(),document.execCommand("copy"),n.remove()}function copyClicked(){$(this).find(".popuptext").toggleClass("show-popup")}function getCiteButtonNumber(e){return parseInt(e.attr("id").replace("cite-button-",""))}function shrinkSearch(){$("#advanced-search").slideToggle(200,"linear"),$(this).toggleClass("flipped")}function setPaginationLinks(){var e=window.location.href,t=($(this).attr("href"),$(this).text());-1==e.search("\\?")&&(e+="?text-type=target-text&title=&author=&edition=&reference=");var n=e.search(/(pageNo=[0-9]+)/);if("Next »"==t)if(-1==n)$(this).attr("href",e+"&pageNo=2");else{var i=parseInt(e.substring(n).substring(7))+1;$(this).attr("href",e.replace(/(&pageNo=[0-9]+)/,"&pageNo="+i))}else if("« Prev"==t){i=parseInt(e.substring(n).substring(7))-1;$(this).attr("href",e.replace(/(&pageNo=[0-9]+)/,"&pageNo="+i))}else-1==n?$(this).attr("href",e+"&pageNo="+t):$(this).attr("href",e.replace(/(&pageNo=[0-9]+)/,"&pageNo="+t))}function replaceAllRecordsHref(){var e=window.location.href,t=!0;return e.includes("?")||(e+="?",t=!1),e.includes("pageNo=")?e=e.replace(/pageNo=\d/,"pageNo=1"):(t&&(e+="&"),e+="pageNo=1"),e+="&stepSize=-1"}$(document).ready(function(){if($("#search-container-collapser").click(shrinkSearch),$(".cite").find(".copy").click(clipboardCopy),$(".cite").find(".popup").click(copyClicked),$("#all-records").attr("href",replaceAllRecordsHref()),$(".pin").click(toggleEntryInPinned),$(".pin").each(setPinnedIfPinned),-1!=window.location.href.indexOf("?")){var e=window.location.href.substring(window.location.href.indexOf("?")),t=$("#print-records").attr("href")+e,n=$("#download-records").attr("href")+e;$("#print-records").attr("href",t),$("#download-records").attr("href",n)}$(".accordion").click(accordionActive),$(".pagination").find("a").each(setPaginationLinks);var i=document.getElementById("title");document.getElementById("target-text").checked?autocomplete({input:i,minLength:1,emptyMsg:"No texts found...",render:custRender,fetch:function(e,t){e=e.toLowerCase(),$.get("/search/targetsuggestions?title="+e,function(e){t(e)})},onSelect:function(e){i.value=e.text_title},customize:selectedOnHover}):autocomplete({input:i,minLength:1,emptyMsg:"No texts found...",render:custRender,fetch:function(e,t){e=e.toLowerCase(),$.get("/search/sourcesuggestions?title="+e,function(e){t(e)})},onSelect:function(e){i.value=e.text_title},customize:selectedOnHover}),$("input[type=radio][name=texttype]").change(function(){$("#title").val(""),$("#author").val(""),$("#edition").val(""),$("#reference").val(""),sessionStorage.setItem("title",""),sessionStorage.setItem("author",""),sessionStorage.setItem("edition",""),sessionStorage.setItem("reference",""),$("form").submit()}),$("#title").val(sessionStorage.getItem("title")),$("#author").val(sessionStorage.getItem("author")),$("#edition").val(sessionStorage.getItem("edition")),$("#reference").val(sessionStorage.getItem("reference")),$("#search-breadcrumb").text($("#search-breadcrumb").text()+" "+(null!=sessionStorage.getItem("title")?sessionStorage.getItem("title"):"")),$("#search-breadcrumb").attr("href",null!=sessionStorage.getItem("query")?"/search/?"+sessionStorage.getItem("query"):"/search/"),$("#submit-query-button").click(saveQuery);var o=$(".cite-button"),r=$(".modal"),a=$(".modal-close");o.click(function(){r.eq(getCiteButtonNumber($(this))).show()}),a.click(function(){r.hide()}),$(window).click(function(e){e.target.className.match(/(modal )/)&&r.hide()})});
