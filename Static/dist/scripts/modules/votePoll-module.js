//$(function () {
//    if ($('.poll').length > 0) {
        
//        var contentLinkElement = $("div[data-block-id]")[0];
//        var contentLinkValue = contentLinkElement.attributes[1].nodeValue;
    
//        var pollHubProxy = $.connection.pollHub;

//        pollHubProxy.client.updateResults = function (resultsList) {
//            var model = JSON.parse(resultsList);
//            var voteResults = $("span[data-results='votes']");
//            var percentageResults = $("span[data-results='percentage']");

//            for (var i = 0; i < voteResults.length; i++) {
//                voteResults[i].textContent = ("Votes: " + model[i].votesCount);
//                percentageResults[i].textContent = (model[i].percentage + " %");
//            }
//        };
    
//        $.connection.hub.start({ url: "~/Static/dist/scripts/plugins/server.js", transport: "serverSentEvents" }).done(function () {
//            $('.poll-item').on('click', function () {
//                var basepath = window.location.origin + "/PollBlock/Vote?contentLink=" + contentLinkValue + "&votedItemId=" + this.attributes[1].textContent;

//                if (window.localStorage["Voted"] != "true") {
//                    $.ajax({
//                        url: basepath,
//                        success: function (result) {
//                            var pollResults = parseResults(result);
//                            window.localStorage["Voted"] = true;
//                            pollHubProxy.server.send(pollResults);
//                        }
//                    });
//                }
//            });
//            });
//    }
//});


//function parseResults(result) {
//    var model = [];
//    result.PollItems.forEach(function (element) {
//        model.push({ "votesCount": element.NumberOfVotes, "percentage": element.PercentageResult });
//    });
//    return model;
//}


$(function () {
    if ($('.poll').length > 0) {
        var contentLinkElement = $("div[data-block-id]")[0];
        var contentLinkValue = contentLinkElement.attributes[1].nodeValue;
        (function () {
            Vote(-1, contentLinkValue, false);
            setTimeout(arguments.callee, 30000);
            if (localStorage.Voted == "true") {
                displayPercentages();
            }
        })();
    }
});

function Vote(id, contentLink, userclick) {
    var basepath = window.location.origin + "/PollBlock/Vote?contentLink=" + contentLink + "&votedItemId=" + id;

    if (window.localStorage["Voted"] != "true" || (window.localStorage["Voted"] == "true" && userclick != true)) {
        $.ajax({
            url: basepath,
            success: function (result) {
                var poleResults = parseResults(result);
                updateResults(poleResults);
                if (userclick == true) {
                    window.localStorage["Voted"] = true;
                    displayPercentages();
                }
            }
        });
    }
    
}

function parseResults(result) {
    var model = [];
    result.PollItems.forEach(function (element) {
        model.push({ "votesCount": element.NumberOfVotes, "percentage": element.PercentageResult });
    });
    return model;
}

function updateResults(model) {
    //var voteResults = $("span[data-results='votes']");
    var percentageResults = $("span[data-results='percentage']");

    for (var i = 0; i < percentageResults.length; i++) {
        //voteResults[i].textContent = ("Votes: " + model[i].votesCount);
        percentageResults[i].textContent = (model[i].percentage + " %");
    }

}

function displayPercentages() {
    var elements = $('.poll-item span');
    for (var i = 0; i < elements.length; i++) {
        elements.eq(i).css("display", "inline-block");
    }
}