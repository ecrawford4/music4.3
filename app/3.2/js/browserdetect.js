$("#browserwarning").hide();
if($.browser.mozilla)
{
    $("#browserwarning").show();
}

$("#closewarning").click(function() {
    
    $("#browserwarning").hide();
    
})

$("#closedurationwarning").click(function() {
    
    $("#durationwarning").hide();
    
})