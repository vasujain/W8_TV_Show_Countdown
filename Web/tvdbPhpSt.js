String.prototype.score = function (l, d) {
    d = d || 0;
    if (l.length == 0) {
        return 0.9
    }
    if (l.length > this.length) {
        return 0
    }
    for (var g = l.length; g > 0; g--) {
        var n = l.substring(0, g);
        var h = this.indexOf(n);
        if (h < 0) {
            continue
        }
        if (h + l.length > this.length + d) {
            continue
        }
        var m = this.substring(h + n.length);
        var f = null;
        if (g >= l.length) {
            f = ""
        } else {
            f = l.substring(g)
        }
        var e = m.score(f, d + h);
        if (e > 0) {
            var a = this.length - m.length;
            if (h != 0) {
                var b = 0;
                var k = this.charCodeAt(h - 1);
                if (k == 32 || k == 9) {
                    for (var b = (h - 2); b >= 0; b--) {
                        k = this.charCodeAt(b);
                        a -= ((k == 32 || k == 9) ? 1 : 0.15)
                    }
                } else {
                    a -= h
                }
            }
            a += e * m.length;
            a /= this.length;
            return a
        }
    }
    return 0
};
function object(b) {
    var a = function () {
    };
    a.prototype = b;
    return new a()
}
var QuickSelect;
(function (a) {
    QuickSelect = function (u, j) {
        var r = this;
        u = a(u);
        u.attr("autocomplete", "off");
        r.options = j;
        r.AllItems = {};
        var e = false, q = -1, g = false, n, w, l, p = false, k, h;
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            if (Number(RegExp.$1) <= 7) {
                p = true
            }
        }
        k = a('<div class="' + j.resultsClass + '" style="display:block;position:absolute;z-index:9999;"></div>').hide();
        h = a("<iframe />");
        h.css({border:"none", position:"absolute"});
        if (j.width > 0) {
            k.css("width", j.width);
            h.css("width", j.width)
        }
        a("body").append(k);
        k.hide();
        if (p) {
            a("body").append(h)
        }
        r.getLabel = function (x) {
            return x.label || (typeof(x) === "string" ? x : x[0]) || ""
        };
        var d = function (x) {
            return x.values || (x.value ? [x.value] : (typeof(x) === "string" ? [x] : x)) || []
        };
        var o = function (y) {
            var z = a("li", k);
            if (!z) {
                return
            }
            if (typeof(y) === "number") {
                q = q + y
            } else {
                q = z.index(y)
            }
            if (q < 0) {
                q = 0
            } else {
                if (q >= z.size()) {
                    q = z.size() - 1
                }
            }
            z.removeClass(j.selectedClass);
            a(z[q]).addClass(j.selectedClass);
            if (j.autoFill && r.last_keyCode != 8) {
                u.val(w + a(z[q]).text().substring(w.length));
                var B = w.length, A = u.val().length, C = u.get(0);
                if (C.createTextRange) {
                    var x = C.createTextRange();
                    x.collapse(true);
                    x.moveStart("character", B);
                    x.moveEnd("character", A);
                    x.select()
                } else {
                    if (C.setSelectionRange) {
                        C.setSelectionRange(B, A)
                    } else {
                        if (C.selectionStart) {
                            C.selectionStart = B;
                            C.selectionEnd = A
                        }
                    }
                }
                C.focus()
            }
        };
        var v = function () {
            if (l) {
                clearTimeout(l)
            }
            u.removeClass(j.loadingClass);
            if (k.is(":visible")) {
                k.hide()
            }
            if (h.is(":visible")) {
                h.hide()
            }
            q = -1
        };
        r.selectItem = function (x, A) {
            if (!x) {
                x = document.createElement("li");
                x.item = ""
            }
            var z = r.getLabel(x.item), y = d(x.item);
            u.lastSelected = z;
            u.val(z);
            w = z;
            k.empty();
            a(j.additionalFields).each(function (C, B) {
                a(B).val(y[C + 1]).change()
            });
            if (!A) {
                v()
            }
            if (j.onItemSelect) {
                setTimeout(function () {
                    j.onItemSelect(x)
                }, 1)
            }
            return true
        };
        var f = function () {
            var x = a("li." + j.selectedClass, k).get(0);
            if (x) {
                return r.selectItem(x)
            } else {
                if (j.exactMatch) {
                    u.val("");
                    a(j.additionalFields).each(function (z, y) {
                        a(y).val("")
                    })
                }
                return false
            }
        };
        var t = function (F, y) {
            var G;
            k.empty();
            if (j.extraOption) {
                G = j.extraOption.constructor === Function ? j.extraOption.apply(r, [y]) : j.extraOption
            }
            if (!g) {
                return v()
            }
            if (!G && (F === null || F.length === 0)) {
                if (j.noResultsDefault) {
                    F = [j.noResultsDefault]
                } else {
                    return v()
                }
            }
            var E = document.createElement("ul"), A = F.length, B = function () {
                o(this)
            }, D = function () {
            }, z = function (H) {
                H.preventDefault();
                H.stopPropagation();
                r.selectItem(this)
            };
            k.append(E);
            if (j.maxVisibleItems > 0 && j.maxVisibleItems < A) {
                A = j.maxVisibleItems
            }
            var x = function (I) {
                var H = document.createElement("li");
                k.append(H);
                a(H).text(j.formatItem ? j.formatItem(I, C, A) : r.getLabel(I));
                H.item = I;
                if (I.className) {
                    H.className = I.className
                }
                E.appendChild(H);
                a(H).hover(B, D).click(z)
            };
            for (var C = 0; C < A; C++) {
                x(F[C])
            }
            if (G) {
                x(G)
            }
            u.removeClass(j.loadingClass);
            return true
        };
        var b = function (x, y) {
            j.finderFunction.apply(r, [x, function (z) {
                t(j.matchMethod.apply(r, [x, z]), x);
                y()
            }])
        };
        var m = function () {
            var z = u.offset(), y = (j.width > 0 ? j.width : u.width()), x = a("li", k);
            k.css({width:parseInt(y, 10) + "px", top:z.top + u.height() + 5 + "px", left:z.left + "px"});
            if (p) {
                h.css({width:parseInt(y, 10) - 2 + "px", top:z.top + u.height() + 6 + "px", left:z.left + 1 + "px", height:k.height() - 2 + "px"}).show()
            }
            k.show();
            if (j.autoSelectFirst || (j.selectSingleMatch && x.length == 1)) {
                o(x.get(0))
            }
        };
        var s = function () {
            if (n >= 9 && n <= 45) {
                return
            }
            var x = u.val();
            if (x == w) {
                return
            }
            w = x;
            if (x.length >= j.minChars) {
                u.addClass(j.loadingClass);
                b(x, m)
            } else {
                if (x.length === 0 && (j.onBlank ? j.onBlank() : true)) {
                    a(j.additionalFields).each(function (z, y) {
                        y.value = ""
                    })
                }
                u.removeClass(j.loadingClass);
                k.hide();
                h.hide()
            }
        };
        r.refresh = function () {
            var x = u.val();
            if (x.length >= j.minChars) {
                u.addClass(j.loadingClass);
                b(x, m)
            }
        };
        k.mousedown(function (x) {
            if (x.srcElement) {
                e = x.srcElement.tagName != "DIV"
            }
            x.preventDefault()
        });
        u.keydown(function (x) {
            n = x.keyCode;
            switch (x.keyCode) {
                case 38:
                    x.preventDefault();
                    o(-1);
                    break;
                case 40:
                    x.preventDefault();
                    if (!k.is(":visible")) {
                        m();
                        o(0)
                    } else {
                        o(1)
                    }
                    break;
                case 13:
                    if (f()) {
                        x.preventDefault();
                        u.select()
                    }
                    break;
                case 9:
                    break;
                case 27:
                    if (j.blurOnEsc) {
                        if (j.clearOnEsc && u.val() != "") {
                            u.val("")
                        } else {
                            u.blur()
                        }
                    } else {
                        if (j.clearOnEsc) {
                            u.val("")
                        } else {
                            if (q > -1 && j.exactMatch && u.val() != a(a("li", k).get(q)).text()) {
                                q = -1
                            }
                            a("li", k).removeClass(j.selectedClass);
                            v();
                            x.preventDefault()
                        }
                    }
                    break;
                default:
                    if (l) {
                        clearTimeout(l)
                    }
                    l = setTimeout(s, j.delay);
                    break
            }
        }).focus(function () {
            g = true
        }).blur(function (x) {
            g = false;
            if (l) {
                clearTimeout(l)
            }
            if (j.clearOnBlur) {
                u.val("");
                l = setTimeout(function () {
                    v();
                    if (j.exactMatch && u.val() != u.lastSelected) {
                        r.selectItem(null, true)
                    }
                }, 100)
            } else {
                l = setTimeout(function () {
                    if (q > -1) {
                        f()
                    }
                    v();
                    if (j.exactMatch && u.val() != u.lastSelected) {
                        r.selectItem(null, true)
                    }
                }, 150)
            }
            return true
        })
    };
    QuickSelect.matchers = {quicksilver:function (h, g) {
        var f, b, d = this;
        f = (d.options.matchCase ? h : h.toLowerCase());
        d.AllItems[f] = [];
        var e = h.slice(1, 2).toLowerCase();
        var j = h.slice(1, 2).toUpperCase();
        a.each(g, function (k, l) {
            b = (d.options.matchCase ? d.getLabel(l) : d.getLabel(l).toLowerCase());
            if (b.score(f) > 0.1) {
                d.AllItems[f].push(l)
            }
        });
        return d.AllItems[f].sort(function (m, k) {
            var l = (d.options.matchCase ? d.getLabel(m) : d.getLabel(m).toLowerCase());
            var n = (d.options.matchCase ? d.getLabel(k) : d.getLabel(k).toLowerCase());
            l = l.score(f);
            n = n.score(f);
            return(l > n ? -1 : (n > l ? 1 : 0))
        })
    }, quicksilver_with_first_match:function (g, f) {
        var e, b, d = this;
        e = (d.options.matchCase ? g : g.toLowerCase());
        d.AllItems[e] = [];
        a.each(f, function (h, j) {
            b = (d.options.matchCase ? d.getLabel(j) : d.getLabel(j).toLowerCase());
            if (e.charAt(0) === b.charAt(0)) {
                if (b.score(e) > 0) {
                    d.AllItems[e].push(j)
                }
            }
        });
        return d.AllItems[e].sort(function (k, h) {
            var j = (d.options.matchCase ? d.getLabel(k) : d.getLabel(k).toLowerCase());
            var l = (d.options.matchCase ? d.getLabel(h) : d.getLabel(h).toLowerCase());
            j = j.score(e);
            l = l.score(e);
            return(j > l ? -1 : (l > j ? 1 : 0))
        })
    }, contains:function (h, g) {
        var f, b, d = this;
        f = (d.options.matchCase ? h : h.toLowerCase());
        d.AllItems[f] = [];
        for (var e = 0; e < g.length; e++) {
            b = (d.options.matchCase ? d.getLabel(g[e]) : d.getLabel(g[e]).toLowerCase());
            if (b.indexOf(f) > -1) {
                d.AllItems[f].push(g[e])
            }
        }
        return d.AllItems[f].sort(function (m, j) {
            var l = (d.options.matchCase ? d.getLabel(m) : d.getLabel(m).toLowerCase());
            var n = (d.options.matchCase ? d.getLabel(j) : d.getLabel(j).toLowerCase());
            var o = l.indexOf(f);
            var o = l ? l.indexOf(f) : "";
            var k = n.indexOf(f);
            return(o > k ? -1 : (o < k ? 1 : (l > n ? -1 : (n > l ? 1 : 0))))
        })
    }, startsWith:function (h, g) {
        var f, b, d = this;
        f = (d.options.matchCase ? h : h.toLowerCase());
        d.AllItems[f] = [];
        for (var e = 0; e < g.length; e++) {
            b = (d.options.matchCase ? d.getLabel(g[e]) : d.getLabel(g[e]).toLowerCase());
            if (b.indexOf(f) === 0) {
                d.AllItems[f].push(g[e])
            }
        }
        return d.AllItems[f].sort(function (l, j) {
            var k = (d.options.matchCase ? d.getLabel(l) : d.getLabel(l).toLowerCase());
            var m = (d.options.matchCase ? d.getLabel(j) : d.getLabel(j).toLowerCase());
            return(k > m ? -1 : (m > k ? 1 : 0))
        })
    }};
    QuickSelect.finders = {data:function (b, d) {
        d(this.options.data)
    }, data_for_quicksilver:function (e, g) {
        var b = [], d = e.slice(0, 1);
        a.each(this.options.data, function (f, h) {
            var j = h[0].split(" ");
            a.each(j, function (k, l) {
                if (l.slice(0, 1).toLowerCase() == d) {
                    b.push(h)
                }
            })
        });
        g(b)
    }, ajax:function (e, f) {
        var b = this.options.ajax + "?q=" + encodeURI(e);
        for (var d in this.options.ajaxParams) {
            if (this.options.ajaxParams.hasOwnProperty(d)) {
                b += "&" + d + "=" + encodeURI(this.options.ajaxParams[d])
            }
        }
        a.getJSON(b, f)
    }};
    a.fn.quickselect = function (b, d) {
        if (b == "refresh" && a(this).data("quickselect")) {
            return a(this).data("quickselect").refresh()
        }
        if (b == "instance" && a(this).data("quickselect")) {
            return a(this).data("quickselect")
        }
        b = b || {};
        b.data = (typeof(b.data) === "object" && b.data.constructor == Array) ? b.data : undefined;
        b.ajaxParams = b.ajaxParams || {};
        b.delay = b.delay || 400;
        if (!b.delay) {
            b.delay = (!b.ajax ? 400 : 10)
        }
        b.minChars = b.minChars || 1;
        b.cssFlavor = b.cssFlavor || "quickselect";
        b.inputClass = b.inputClass || b.cssFlavor + "_input";
        b.loadingClass = b.loadingClass || b.cssFlavor + "_loading";
        b.resultsClass = b.resultsClass || b.cssFlavor + "_results";
        b.selectedClass = b.selectedClass || b.cssFlavor + "_selected";
        b.finderFunction = b.finderFunction || QuickSelect.finders[!b.data ? "ajax" : ("data")];
        b.matchMethod = b.matchMethod || QuickSelect.matchers[(typeof("".score) === "function" && "l".score("l") == 1 ? "quicksilver" : "contains")];
        if (b.matchMethod === "quicksilver" && b.finderFunction === "data") {
            b.finderFunction = "data_for_quicksilver"
        }
        if (b.matchMethod === "quicksilver" || b.matchMethod === "contains" || b.matchMethod === "startsWith") {
            b.matchMethod = QuickSelect.matchers[b.matchMethod]
        }
        if (b.finderFunction === "data" || b.finderFunction === "ajax") {
            b.finderFunction = QuickSelect.finders[b.finderFunction]
        }
        if (b.matchCase === undefined) {
            b.matchCase = false
        }
        if (b.exactMatch === undefined) {
            b.exactMatch = false
        }
        if (b.autoSelectFirst === undefined) {
            b.autoSelectFirst = true
        }
        if (b.selectSingleMatch === undefined) {
            b.selectSingleMatch = true
        }
        if (b.additionalFields === undefined) {
            b.additionalFields = a("nothing")
        }
        b.maxVisibleItems = b.maxVisibleItems || -1;
        if (b.autoFill === undefined || b.matchMethod != "startsWith") {
            b.autoFill = false
        }
        b.width = parseInt(b.width, 10) || 0;
        return this.each(function () {
            var n = this, p = object(b);
            if (n.tagName == "INPUT") {
                var l = new QuickSelect(n, p);
                a(n).data("quickselect", l)
            } else {
                if (n.tagName == "SELECT") {
                    p.delay = p.delay || 10;
                    p.finderFunction = "data";
                    var e = n.name, f = n.id, k = n.className, o = a(n).attr("accesskey"), h = a(n).attr("tabindex"), j = a("option:selected", n).get(0);
                    p.data = [];
                    a("option", n).each(function (q, r) {
                        p.data.push({label:a(r).text(), values:[r.value, r.value], className:r.className})
                    });
                    var m = a("<input type='text' class='" + k + "' id='" + f + "_quickselect' accesskey='" + o + "' tabindex='" + h + "' />");
                    if (j) {
                        m.val(a(j).text())
                    }
                    var g = a("<input type='hidden' id='" + f + "' name='" + n.name + "' />");
                    if (j) {
                        g.val(j.value)
                    }
                    p.additionalFields = g;
                    a(n).after(m).after(g).remove();
                    m.quickselect(p)
                }
            }
        })
    }
})(jQuery);
var localTime = new Date();
var timeDiff = serverTime.getTime() - localTime.getTime();
var timestamp = [];
var episode = [];
var nextEpisode = -1;
function getEpoch() {
    var a = new Date();
    serverEpoch = a.getTime() + timeDiff;
    return serverEpoch
}
function updateCountdown(h) {
    var g = new Date(h);
    var j = new Date(getEpoch());
    var e = j.getTime();
    var k = g.getTime();
    var b = Math.floor(((k - e) / (60 * 60 * 24)) / 1000);
    var a = Math.floor(((k - e) / (60 * 60)) / 1000) - (b * 24);
    var f = Math.floor(((k - e) / (60)) / 1000) - (b * 24 * 60) - (a * 60);
    var d = Math.floor(((k - e)) / 1000) - (b * 24 * 60 * 60) - (a * 60 * 60) - (f * 60);
    countDownStr = "";
    if (b > 0) {
        countDownStr += b + "d "
    }
    if (a > 0 || b > 0) {
        countDownStr += a + "h "
    }
    if (f > 0 || a > 0 || b > 0) {
        countDownStr += f + "m "
    }
    if (d > -1) {
        countDownStr += d + "s"
    }
    if (b == 0 && a == 0 && f == 0 && d == 0) {
        document.getElementById("countdown").innerHTML = "Now!"
    } else {
        document.getElementById("countdown").innerHTML = countDownStr
    }
}
function prefixZero(a) {
    if (a < 10) {
        return"0" + a
    } else {
        return a
    }
}
function updateTime() {
    var a = new Date();
    if (document.getElementById("current_date") != null) {
        document.getElementById("current_date").innerHTML = a.getFullYear() + "-" + prefixZero((a.getMonth() + 1)) + "-" + prefixZero(a.getDate()) + " " + prefixZero(a.getHours()) + ":" + prefixZero(a.getMinutes()) + " (local time)"
    }
    if (a.getSeconds() == 1) {
        updateAgenda(false)
    }
    setTimeout("updateTime()", 1000)
}
function getDiff(e) {
    var f = new Date(e);
    var a = new Date(getEpoch());
    var d = a.getTime();
    var b = f.getTime();
    return(b - d)
}
function findAndUpdateNextEpisode() {
    var b = false;
    for (var a = 0; a < episode.length; a++) {
        if (getDiff(timestamp[a]) > 0) {
            b = true;
            nextEpisode = a;
            break
        }
    }
    if (b) {
        updateCountdown(timestamp[a])
    } else {
        if (document.getElementById("countdown") != null) {
            document.getElementById("countdown").style.visibility = "hidden";
            document.getElementById("countdown_prefix").style.visibility = "hidden"
        }
    }
    setTimeout("findAndUpdateNextEpisode()", 1000)
}


function getTimeLeftString(e) {
    var f = new Date(e);
    var a = new Date(getEpoch());
    var d = a.getTime();
    var b = f.getTime();
    if ((b - d) < 0) {
        diff = Math.abs(b - d)
    } else {
        diff = (b - d)
    }

    daysLeft = Math.floor((diff / (60 * 60 * 24)) / 1000);
    hoursLeft = Math.floor((diff / (60 * 60)) / 1000) - (daysLeft * 24);
    minutesLeft = Math.floor((diff / (60)) / 1000) - (daysLeft * 24 * 60) - (hoursLeft * 60);
    secondsLeft = Math.floor(diff / 1000) - (daysLeft * 24 * 60 * 60) - (hoursLeft * 60 * 60) - (minutesLeft * 60);
    countDownStr = "";

    if (daysLeft > 0) {
        if ((b - d) > 0) {
            countDownStr += "<strong>" + daysLeft + "</strong>"
        }
        else {
            countDownStr += daysLeft
        }
        if (daysLeft == 1) {
            countDownStr += " day "
        }
        else {
            countDownStr += " days "
        }
    }

    if ((b - d) < 0) {
        detailedDaysRange = 2
    }
    else {
        detailedDaysRange = 3
    }
    airs_today = false;

    if (a.getFullYear() == f.getFullYear() && a.getMonth() == f.getMonth() && a.getDate() == f.getDate()) {
        airs_today = true
    }
    if (daysLeft == 0 && hoursLeft > 0 && ((b - d) > 0)) {
        countDownStr += "<strong>" + hoursLeft + "h</strong> "
    }
    else {
        if ((hoursLeft > 0 || daysLeft > 0) && daysLeft < detailedDaysRange) {
            countDownStr += hoursLeft + "h "
        }
    }

    if (daysLeft == 0 && hoursLeft == 0 && ((b - d) > 0)) {
        countDownStr += "<strong>" + minutesLeft + "m</strong>"
    }
    else {
        if (daysLeft == 0 && hoursLeft == 0 && minutesLeft < 10) {
            countDownStr += minutesLeft + "m"
        }
        else {
            if ((minutesLeft > 0 || hoursLeft > 0 || daysLeft > 0) && daysLeft < detailedDaysRange) {
                countDownStr += prefixZero(minutesLeft) + "m"
            }
        }
    }

    if ((b - d) > 0) {
        if (daysLeft < 1) {
            if (airs_today) {
                return countDownStr + " to go"
            } else {
                return countDownStr + " to go"
            }
        } else {
            return countDownStr + " to go"
        }
    }
    else {
        return countDownStr + " ago"
    }
}

function updateAgenda(b) {
    for (var a = 0; a < episode.length; a++) {
        if (document.getElementById(episode[a]) != null) {
            timeLeftStr = getTimeLeftString(timestamp[a])
            if (timeLeftStr != "") {
                document.getElementById(episode[a]).innerHTML = timeLeftStr
            }
        }
    }
    if (b) {
        setTimeout("updateAgenda()", 30000)
    }
}

function roundToNearestQuarter(a) {
    newEpoch = Math.round(a / (15000 * 60)) * (15000 * 60);
    return(newEpoch)
}
function updateAirtimes() {
    var b = new Array(7);
    b[0] = "Sun";
    b[1] = "Mon";
    b[2] = "Tue";
    b[3] = "Wed";
    b[4] = "Thu";
    b[5] = "Fri";
    b[6] = "Sat";
    for (var a = 0; a < episode.length; a++) {
        if (document.getElementById("c" + episode[a]) != null) {
            var d = new Date(timestamp[a]);
            episode_airtime = new Date(roundToNearestQuarter(d.getTime() - timeDiff));
            document.getElementById("c" + episode[a]).innerHTML = b[episode_airtime.getDay()] + " " + episode_airtime.getFullYear() + "-" + prefixZero(episode_airtime.getMonth() + 1) + "-" + prefixZero(episode_airtime.getDate()) + "&nbsp;&nbsp;" + prefixZero(episode_airtime.getHours()) + ":" + prefixZero(episode_airtime.getMinutes())
        }
    }
}
var searchItems = [];
var c = 0;
for (var i = 0; i < shows.length; i++) {
    if (shows[i][0] != "") {
        searchItems[c] = [shows[i][0], shows[i][1]];
        c++
    }
}
$(document).ready(function () {
    updateTime();
    updateAgenda(true);
    updateAirtimes();
    if (document.getElementById("countdown") != null) {
        findAndUpdateNextEpisode()
    }
    var h = "";
    var b;
    var a;
    var k;
    var g;
    var l;
    var d;
    var e;
    var o;
    var m = 0;
    var n = 1;
    var j = (shows.length / 4);
    for (var f = 0; f < shows.length; f++) {
        a = shows[f][0];
        b = shows[f][1];
        nameSEO = shows[f][2];
        g = shows[f][3];
        l = shows[f][4];
        d = parseInt(shows[f][5]);
        o = shows_selected[f];
        if (a != "") {
            h = "";
            h += "<div" + (o == 1 ? " class='focus'" : "") + ">";
            h += '<input onclick="h(this)" type="checkbox" name="c' + b + '" class="sic" value="1"' + (o == 1 ? ' checked="checked"' : "") + " />";
            h += '<a class="' + (l == 0 ? "" : "h") + (g > -7 ? " b" : "") + '" href="/s/' + nameSEO + '">' + a;
            if (d != "" && d < 90) {
                h += "&nbsp;<span class='new'></span>"
            }
            h += "</a></div>";
            $("#list" + n).append(h)
        }
        m++;
        if (m > j) {
            n += 1;
            m = 0
        }
        if (a == "") {
            continue
        }
        $("#listmenu").append('<li><a href="/s/' + nameSEO + '">' + a + "</a></li>")
    }
    $("#find_show").quickselect({maxItemsToShow:10, matchMethod:"quicksilver", clearOnBlur:true, onItemSelect:function (q) {
        var p = $(q).text();
        for (var s = 0; s < shows.length; s++) {
            var r = shows[s][0];
            if (r == p) {
                var t = shows[s][2];
                window.location.href = "/s/" + t
            }
        }
    }, data:searchItems})
});
/**
 * Created with JetBrains PhpStorm.
 * User: Vasu
 * Date: 7/28/12
 * Time: 11:11 PM
 * To change this template use File | Settings | File Templates.
 */
