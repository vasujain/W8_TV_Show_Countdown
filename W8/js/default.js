// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());

            WinJS.xhr({ url: "http://thetvdb.com/api/GetSeries.php?seriesname=fringe&language=english" })
                .done(function complete(result) {
                    var resp = result.responseXML;
                    if (resp) {
                        var items = resp.querySelectorAll("Series");
                        if (items) {
                            var myTable = document.getElementById("tv1");
                            var imdbURL = "http://www.imdb.com/title/" + items[0].querySelector('IMDB_ID').textContent;
                            myTable.innerHTML = "<tr><a href=" + imdbURL + "><img src='http://thetvdb.com/banners/" + items[0].querySelector('banner').textContent + "'/></a></tr>";
                            myTable.innerHTML += "<tr><h2>" + items[0].querySelector("SeriesName").textContent + "</tr></h2>";
                            myTable.innerHTML += "<tr><td><b>Lang:</b> " + items[0].querySelector("language").textContent + " <b>Name:</b> " + items[0].querySelector("SeriesName").textContent + " <b>First Aired:</b> " + items[0].querySelector("FirstAired").textContent + "</td> </tr>";
                            myTable.innerHTML += "<tr><b>Overview: </b>" + items[0].querySelector("Overview").textContent + " </tr>";
                        } else {
                                //outputArea.innerHTML = "There are no items available at this time";
                            }
                        }                         
                    });
            WinJS.xhr({ url: "http://thetvdb.com/api/GetSeries.php?seriesname=supernatural&language=english" })
                .done(function complete(result) {
                    var resp = result.responseXML;
                    if (resp) {
                        var items = resp.querySelectorAll("Series");
                        if (items) {
                            var myTable = document.getElementById("tv2");
                            var imdbURL = "http://www.imdb.com/title/" + items[0].querySelector('IMDB_ID').textContent;
                            myTable.innerHTML = "<tr><a href=" + imdbURL + "><img src='http://thetvdb.com/banners/" + items[0].querySelector('banner').textContent + "'/></a></tr>";
                            myTable.innerHTML += "<tr><h2>" + items[0].querySelector("SeriesName").textContent + "</tr></h2>";
                            myTable.innerHTML += "<tr><td><b>Lang:</b> " + items[0].querySelector("language").textContent + " <b>Name:</b> " + items[0].querySelector("SeriesName").textContent + " <b>First Aired:</b> " + items[0].querySelector("FirstAired").textContent + "</td> </tr>";
                            myTable.innerHTML += "<tr><b>Overview: </b>" + items[0].querySelector("Overview").textContent + " </tr>";
                        } else {
                            //outputArea.innerHTML = "There are no items available at this time";
                        }
                    }                         
                });
            WinJS.xhr({ url: "http://thetvdb.com/api/GetSeries.php?seriesname=breaking+bad&language=english" })
                .done(function complete(result) {
                    var resp = result.responseXML;
                    if (resp) {
                        var items = resp.querySelectorAll("Series");
                        if (items) {
                            var myTable = document.getElementById("tv3");
                            var imdbURL = "http://www.imdb.com/title/" + items[0].querySelector('IMDB_ID').textContent;
                            myTable.innerHTML = "<tr><a href=" + imdbURL + "><img src='http://thetvdb.com/banners/" + items[0].querySelector('banner').textContent + "'/></a></tr>";
                            myTable.innerHTML += "<tr><h2>" + items[0].querySelector("SeriesName").textContent + "</tr></h2>";
                            myTable.innerHTML += "<tr><td><b>Lang:</b> " + items[0].querySelector("language").textContent + " <b>Name:</b> " + items[0].querySelector("SeriesName").textContent + " <b>First Aired:</b> " + items[0].querySelector("FirstAired").textContent + "</td> </tr>";
                            myTable.innerHTML += "<tr><b>Overview: </b>" + items[0].querySelector("Overview").textContent + " </tr>";
                        } else {
                            //outputArea.innerHTML = "There are no items available at this time";
                        }
                    }
                });
            WinJS.xhr({ url: "http://thetvdb.com/api/GetSeries.php?seriesname=prison+break&language=english" })
                .done(function complete(result) {
                    var resp = result.responseXML;
                    if (resp) {
                        var items = resp.querySelectorAll("Series");
                        if (items) {
                            var myTable = document.getElementById("tv4");
                            var imdbURL = "http://www.imdb.com/title/" + items[0].querySelector('IMDB_ID').textContent;
                            myTable.innerHTML = "<tr><a href=" + imdbURL + "><img src='http://thetvdb.com/banners/" + items[0].querySelector('banner').textContent + "'/></a></tr>";
                            myTable.innerHTML += "<tr><h2>" + items[0].querySelector("SeriesName").textContent + "</tr></h2>";
                            myTable.innerHTML += "<tr><td><b>Lang:</b> " + items[0].querySelector("language").textContent + " <b>Name:</b> " + items[0].querySelector("SeriesName").textContent + " <b>First Aired:</b> " + items[0].querySelector("FirstAired").textContent + "</td> </tr>";
                            myTable.innerHTML += "<tr><b>Overview: </b>" + items[0].querySelector("Overview").textContent + " </tr>";
                        } else {
                            //outputArea.innerHTML = "There are no items available at this time";
                        }
                    }
                });
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
