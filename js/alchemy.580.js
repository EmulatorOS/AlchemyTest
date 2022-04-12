
function LibraryBox(a) {
    this.id = a, this.init(), this.initEvents()
}
 
function WorkspaceBox(a, b, c) {
    "string" == typeof a || "number" == typeof a ? (this.id = parseInt(a, 10), this.$el = $(workspace.el.appendChild(this.createElement(b))), this.init(c)) : (this.id = a.getAttribute("data-elementid"), this.$el = $(a), this.changeType(), this.init()), this.initEvents()
}
var game = {
        platform: "web",
        prime: [],
        maxProgress: 0,
        finalElements: [],
        player: {},
        isOnline: !1,
        init: function() {
            game.checkStructure(), game.initProgress(), $(document).trigger("progressInitiated"), game.getFinalElements(), game.checkMaxConnections(), game.onChildCreated(), game.initEvents()
        },
        initProgress: function() {
            var a, b, c, d;
            for (game.history = JSON.parse(storage.getHistory()), game.progress = [], game.hiddenElements = [], game.progressWithoutFinal = [], a = 0, b = game.history.parents.length; a < b; a++)
                for (c = workspace.sex(game.history.parents[a]), d = 0; d < c.length; d++) bases.base[c[d]].hasOwnProperty("hidden") ? game.hiddenElements.push(c[d]) : game.progress.indexOf(c[d]) === -1 && game.prime.indexOf(c[d]) === -1 && (game.progress.push(c[d]), game.checkIfFinal(c[d]) || game.progressWithoutFinal.push(c[d]));
            game.changeProgressCounter()
        },
        resetProgress: function() {
            game.saveOldProgress(game.history.parents, game.history.date), achievements.reset(), storage.resetHistory(), game.initProgress(), update.resetHistory(), workspace.clearSpecified(workspace.$el.find(".element")), library.reload(), $(document).trigger("resetProgress")
        },
        onChildCreated: function() {
            $(document).on("childCreated", function(a, b, c) {
                var d, e;
                for (d = 0; d < b.length; d++) game.checkIfNotAlreadyDone(c) && (e = (new Date).getTime(), game.history.parents.push(c), game.history.date.push(e), $(document).trigger("updateHistory", [c, e]), bases.base[b[d]].hasOwnProperty("hidden") && ($(document).trigger("hiddenElementCreated", [b[d]]), game.hiddenElements.indexOf(b[d]) === -1 && game.hiddenElements.push(b[d]))), game.progress.indexOf(b[d]) !== -1 || game.prime.indexOf(b[d]) !== -1 || bases.base[b[d]].hasOwnProperty("hidden") || (game.progress.push(b[d]), game.checkIfFinal(b[d]) ? game.finalElements.push(b[d]) : game.progressWithoutFinal.push(b[d]), game.changeProgressCounter(), $(document).trigger("newChildCreated", [b[d]]))
            })
        },
        changeProgressCounter: function() {
            var a = game.progress.length + game.prime.length + "/" + game.maxProgress;
            document.getElementById("progress").textContent = a
        },
        checkStructure: function() {
            var a;
            for (a in bases.base) {
                if (bases.base[a].hasOwnProperty("platforms")) {
                    var b = bases.base[a].platforms.join(",");
                    b.indexOf(game.platform) === -1 && (delete bases.base[a], delete bases.names[a])
                }
                bases.base.hasOwnProperty(a) && (bases.base[a].hasOwnProperty("prime") && game.prime.push(parseInt(a, 10)), bases.base[a].hasOwnProperty("hidden") || game.maxProgress++)
            }
        },
        getFinalElements: function() {
            var a, b;
            for (a = 0, b = game.progress.length; a < b; a++) game.checkIfFinal(game.progress[a]) && game.finalElements.indexOf(game.progress[a]) === -1 && game.finalElements.push(game.progress[a])
        },
        checkIfFinal: function(a) {
            var b, c, d, e = Object.keys(bases.base);
            for (b = 0, c = e.length; b < c; b++)
                if (bases.base[e[b]].hasOwnProperty("parents"))
                    for (d = 0; d < bases.base[e[b]].parents.length; d++)
                        if (bases.base[e[b]].parents[d].indexOf(a) !== -1) return !1;
            return !0
        },
        checkMaxConnections: function(a) {
            game.maxConnections = 0;
            var b;
            for (b in bases.base) bases.base[b].hasOwnProperty("parents") && (game.maxConnections += bases.base[b].parents.length)
        },
        checkIfNotAlreadyDone: function(a) {
            for (var b = [Math.min(a[0], a[1]), Math.max(a[0], a[1])], c = 0, d = game.history.parents.length; c < d; ++c)
                if (Math.min(game.history.parents[c][0], game.history.parents[c][1]) === b[0] && Math.max(game.history.parents[c][0], game.history.parents[c][1]) === b[1]) return !1;
            return !0
        },
        initEvents: function() {
            var a = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
            void 0 === a && $("#toggleFullscreen").hide(), $("#toggleFullscreen").on("click", function() {
                game.toggleFullScreen(this)
            })
        },
        toggleFullScreen: function(a) {
            var b = window.document,
                c = b.documentElement,
                d = c.requestFullscreen || c.mozRequestFullScreen || c.webkitRequestFullScreen || c.webkitRequestFullscreen || null,
                e = b.exitFullscreen || b.mozCancelFullScreen || b.webkitExitFullscreen || b.msExitFullscreen || null;
            b.fullscreenElement || b.mozFullScreenElement || b.webkitFullscreenElement ? e.call(b) : d.call(c)
        },
        saveOldProgress: function(a, b) {
            var c = window.storage.getOldHistory();
            Array.prototype.push.apply(c.parents, a), Array.prototype.push.apply(c.date, b);
            var d = 1e3;
            c.parents.length > d && (c.parents.splice(0, c.parents.length - d), c.date.splice(0, c.date.length - d)), window.storage.setOldHistory(c)
        },
        checkHistoryIntegrity: function(a) {
            var b, c, d, e, f = [],
                g = function(a) {
                    return !(!bases.base.hasOwnProperty(a) || !bases.base[a].hasOwnProperty("prime") && f.indexOf(a) === -1)
                };
            for (b = 0, c = a.parents.length; b < c; b++) Array.prototype.push.apply(f, workspace.sex(a.parents[b]));
            for (b = a.parents.length - 1; b >= 0; b--)
                if (!g(a.parents[b][0]) || !g(a.parents[b][1])) {
                    for (console.log(a.parents[b]), d = workspace.sex(a.parents[b]), e = 0; e < d.length; e++) f.splice(f.indexOf(d[e]), 1);
                    a.parents.splice(b, 1), a.date.splice(b, 1)
                } return a
        },
        reportError: function(a, b, c, d, e) {
            var f = {
                msg: a,
                url: b,
                line: c,
                col: d || "",
                stack: e && e.stack ? e.stack : "",
                userAgent: navigator.userAgent,
                time: (new Date).getTime(),
                resolution: screen.width + "x" + screen.height
            };
            return $.ajax({
                type: "POST",
                url: "php/errorReporting.php",
                data: {
                    data: JSON.stringify(f)
                }
            }), !1
        },
        checkOnline: function() {
            $.ajax({
                type: "GET",
                url: "favicon.ico",
                cache: !1,
                success: function(a) {
                    game.isOnline = !0, $(document).trigger("online")
                },
                error: function(a, b, c) {
                    game.isOnline = !1, $(document).trigger("offline")
                }
            })
        }
    },
    bases = {
        imagesLoaded: !1,
        loaded: !1,
        load: function() {
            bases.initEvents(), $.when($.ajax({
                url: "resources/base.580.json",
                type: "GET",
                dataType: "json",
                success: function(a) {
                    bases.base = a
                },
                xhrFields: {
                    onprogress: function(a) {
                        a.lengthComputable && $(document).trigger("baseLoadingProgress", [parseInt(a.loaded / a.total * 100, 10)])
                    }
                }
            }), $.ajax({
                url: localization.getURL("names.580.json"),
                type: "GET",
                dataType: "json",
                success: function(a) {
                    bases.names = a
                },
                xhrFields: {
                    onprogress: function(a) {
                        a.lengthComputable && $(document).trigger("namesLoadingProgress", [parseInt(a.loaded / a.total * 100, 10)])
                    }
                }
            })).done(function() {
                bases.loaded = !0, $(document).trigger("basesLoaded")
            }).fail(function(a) {
                console.log("fail", a)
            }), $.getJSON("resources/images.580.json", function(a) {
                bases.images = a, bases.imagesLoaded = !0, $(document).trigger("imagesLoaded")
            })
        },
        initEvents: function() {
            $(document).on("languageChanged", function() {
                $.getJSON(localization.getURL("names.580.json"), function(a) {
                    bases.names = a, library.reload(), $(document).trigger("namesLoaded")
                })
            })
        }
    },
    loadingScreen = {
        transition: {
            PATH_TIME: .5,
            OPACITY_DELAY: .1,
            OPACITY_TIME: .75,
            PROGRESS_TIME: .3
        },
        progress: 0,
        shownProgress: 0,
        progressList: {
            basesLoaded: {
                value: 20
            },
            namesLoadingProgress: {
                value: 20,
                incremental: !0,
                current: 0
            },
            baseLoadingProgress: {
                value: 20,
                incremental: !0,
                current: 0
            },
            GAPILoaded: {
                value: 25
            },
            notLoggedIn: {
                value: 25
            },
            GAPIclientLoaded: {
                value: 10
            },
            historySynchronized: {
                value: 15
            },
            libraryShowed: {
                value: 10
            },
            offline: {
                value: 25
            }
        },
        list: [],
        init: function() {
            loadingScreen.initEvents(), loadingScreen.el = document.getElementById("loadingScreen"), loadingScreen.$el = $(loadingScreen.el), loadingScreen.playButton = loadingScreen.el.getElementsByClassName("playButton")[0], loadingScreen.progressBar = loadingScreen.el.getElementsByClassName("progressBar")[0], loadingScreen.initPath(), loadingScreen.messages.init(), loadingScreen.changeProgress()
        },
        initPath: function() {
            if (loadingScreen.path = document.querySelector(".playButton path"), loadingScreen.path.style.strokeWidth = 12, loadingScreen.path.getTotalLength) {
                var a = loadingScreen.path.getTotalLength();
                navigator.userAgent.toLowerCase().indexOf("firefox") > -1 && navigator.oscpu.toLowerCase().indexOf("windows nt 6.1") > -1 && (loadingScreen.path.style.strokeDashoffset = Math.round(a / 12) + "px"), loadingScreen.path.style.display = "block", loadingScreen.path.getBoundingClientRect()
            }
        },
        completedAnimation: function() {
            $(".playButtonContainer").one("click", loadingScreen.hide), document.querySelector(".loadingScreen svg rect").style.opacity = 1, loadingScreen.path.style.opacity = 0
        },
        completedLoading: function() {
            window.setTimeout(loadingScreen.completedAnimation, 1e3 * (loadingScreen.transition.PATH_TIME + loadingScreen.transition.OPACITY_DELAY)), window.setTimeout(function() {
                loadingScreen.progressBar.style.opacity = 0, window.setTimeout(function() {
                    loadingScreen.progressBar.innerHTML = 'PL<span style="margin-right: -3px;">A</span>Y', loadingScreen.progressBar.style.opacity = 1
                }, 1e3 * loadingScreen.transition.PROGRESS_TIME)
            }, 320)
        },
        changeProgress: function() {
            if (loadingScreen.shownProgress >= 100) return void loadingScreen.completedLoading();
            if (loadingScreen.progress > loadingScreen.shownProgress) {
                var a = 2;
                loadingScreen.progress - loadingScreen.shownProgress > 20 && loadingScreen.progress < 90 && (a = 2 * Math.floor((loadingScreen.progress - loadingScreen.shownProgress) / 4)), loadingScreen.shownProgress += a, loadingScreen.animateProgress()
            }
            requestAnimationFrame(function() {
                loadingScreen.changeProgress()
            })
        },
        animateProgress: function() {
            if (loadingScreen.progressBar.innerHTML = loadingScreen.shownProgress + "%", loadingScreen.path.getTotalLength) {
                var a = loadingScreen.path.getTotalLength();
                navigator.userAgent.toLowerCase().indexOf("firefox") > -1 && navigator.oscpu.toLowerCase().indexOf("windows nt 6.1") > -1 ? loadingScreen.path.style.strokeDashoffset = Math.round((a - loadingScreen.progress / 100 * a) / 12) + "px" : loadingScreen.path.style.strokeDashoffset = a - loadingScreen.progress / 100 * a
            }
        },
        incrementProgress: function(a) {
            var b = loadingScreen.progress + loadingScreen.progressList[a].value;
            loadingScreen.progress = b >= 100 ? 100 : b
        },
        initEvents: function() {
            for (var a in loadingScreen.progressList) $(document).on(a, function(a, b) {
                loadingScreen.progressList[a.type].hasOwnProperty("incremental") ? loadingScreen.progressList[a.type].current < 100 && (loadingScreen.progress -= Math.round(loadingScreen.progressList[a.type].current / 100 * loadingScreen.progressList[a.type].value), loadingScreen.progress += Math.round(b / 100 * loadingScreen.progressList[a.type].value), loadingScreen.progressList[a.type].current = b) : ("basesLoaded" === a.type ? (loadingScreen.progress += loadingScreen.progressList[a.type].value * (200 - loadingScreen.progressList.namesLoadingProgress.current - loadingScreen.progressList.baseLoadingProgress.current) / 100, loadingScreen.progressList.namesLoadingProgress.current = 100, loadingScreen.progressList.baseLoadingProgress.current = 100) : loadingScreen.incrementProgress(a.type), $(document).off(a.type), loadingScreen.list.push(a.type))
            })
        },
        hide: function() {
            var a = window.getStyleProperty("transform"),
                b = !!window.getStyleProperty("perspective"),
                c = b ? function(a) {
                    return "translate3d(0, " + a + "px, 0)"
                } : function(a, b) {
                    return "translate(0, " + b + "px)"
                },
                d = loadingScreen.el.getElementsByTagName("div")[0];
            d.style[window.getStyleProperty("transition")] = "margin-top 0.75s ease-in", loadingScreen.el.style[window.getStyleProperty("transitionProperty")] = "top, -webkit-transform, -ms-transform, -o-transform, -moz-transform", loadingScreen.el.style[window.getStyleProperty("transitionDuration")] = "0.5s", loadingScreen.el.style[window.getStyleProperty("transitionTimingFunction")] = "ease-in", d.style["margin-top"] = window.innerHeight + "px", window.setTimeout(function() {
                d.style["margin-top"] = $(d).css("margin-top") + "px", void 0 !== a ? loadingScreen.el.style[a] = c(window.innerHeight) : loadingScreen.el.style.top = window.innerHeight + "px", window.setTimeout(function() {
                    loadingScreen.$el.off().remove(), loadingScreen.el = null, loadingScreen.$el = null, loadingScreen.playButton = null, loadingScreen.progressBar = null
                }, 1e3)
            }, 200)
        },
        messages: {
            shown: [],
            list: [
                [{
                    id: "combine"
                }],
                [{
                    id: "longpress"
                }, {
                    id: "signin"
                }],
                [{
                    id: "longpress",
                    P: 3
                }, {
                    id: "signin",
                    P: 3
                }, {
                    id: "newsletter",
                    P: 3
                }, {
                    id: "shareProgress",
                    P: 3
                }, {
                    id: "achievements",
                    P: 3
                }, {
                    id: "leaderboards",
                    P: 3
                }, {
                    id: "finalClear",
                    P: 3
                }, {
                    id: "clone",
                    P: 3
                }, {
                    id: "mixItself",
                    P: 3
                }, {
                    id: "hideFinal",
                    P: 3
                }, {
                    id: "hydrated",
                    P: 1
                }, {
                    id: "salad",
                    P: 1
                }, {
                    id: "cookies",
                    P: 1
                }, {
                    id: "randomMessage",
                    P: 1
                }, {
                    id: "smile",
                    P: 1
                }, {
                    id: "breaks",
                    P: 1
                }, {
                    id: "overcomplicating",
                    P: 1
                }, {
                    id: "science",
                    P: 1
                }]
            ],
            init: function() {
                loadingScreen.messages.el = document.getElementById("loadingScreenMessage"), loadingScreen.messages.shown = storage.getLoadingMessages(), loadingScreen.messages.showing = loadingScreen.messages.choose(), $(document).one("languagePackLoaded", function() {
                    null !== loadingScreen.messages.el && (loadingScreen.messages.el.innerHTML = localization.get("loadingMessage-" + loadingScreen.messages.showing))
                })
            },
            choose: function() {
                var a, b = loadingScreen.messages.getLevel(),
                    c = [];
                for (i = 0; i < loadingScreen.messages.list[b].length; i++) loadingScreen.messages.shown.indexOf(loadingScreen.messages.list[b][i].id) === -1 && c.push(loadingScreen.messages.list[b][i]);
                if (1 === c.length) a = c[0].id;
                else if (loadingScreen.messages.list[b][0].hasOwnProperty("P")) a = loadingScreen.messages.probabilityChoose(b);
                else {
                    var d = Math.floor(Math.random() * c.length);
                    a = c[d].id
                }
                return b !== loadingScreen.messages.list.length - 1 && loadingScreen.messages.save(a), a
            },
            save: function(a) {
                loadingScreen.messages.shown.push(a), storage.updateLoadingMessages(loadingScreen.messages.shown)
            },
            getLevel: function() {
                for (var a = 0; a < loadingScreen.messages.list.length; a++)
                    for (var b = 0; b < loadingScreen.messages.list[a].length; b++)
                        if (loadingScreen.messages.shown.indexOf(loadingScreen.messages.list[a][b].id) === -1) return a
            },
            probabilityChoose: function(a) {
                for (var b = 0, c = 0, d = loadingScreen.messages.list[a].length; c < d; c++) b += loadingScreen.messages.list[a][c].P;
                var e = Math.floor(Math.random() * b),
                    f = -1;
                for (c = 0; c <= e;) f++, c += loadingScreen.messages.list[a][f].P;
                return loadingScreen.messages.list[a][f].id
            }
        }
    },
    settings = {
        def: {
            checkAlreadyCombined: !1,
            markFinalElements: !0,
            hideFinalElements: !1,
            turnOffNotifications: !1,
            saveElementsPositions: !0,
            hideElementsNames: !1,
            nightMode: !1
        },
        init: function() {
            var a = window.storage.getSettings();
            window.settings.data = {}, $.extend(window.settings.data, window.settings.def, a)
        },
        initContent: function() {
            settings.offContent(), $("#settingsCheckAlreadyCombined").prop("checked", window.settings.data.checkAlreadyCombined), $("#settingsMarkFinalElements").prop("checked", window.settings.data.markFinalElements), $("#settingsHideFinalElements").prop("checked", window.settings.data.hideFinalElements), $("#settingsTurnOffNotifications").prop("checked", window.settings.data.turnOffNotifications), $("#settingsTurnOffElementsPositions").prop("checked", !window.settings.data.saveElementsPositions), $("#settingsHideElementNames").prop("checked", window.settings.data.hideElementsNames), $("#settingsNightMode").prop("checked", window.settings.data.nightMode), $("#settingsResetProgress").on("click", function(a) {
                a.preventDefault(), a.stopPropagation();
                var b = confirm(window.localization.get("settings-resetProgressConfirm"));
                b && window.game.resetProgress()
            }), $("#settingsDisconnect").on("mousedown", function(a) {
                a.preventDefault(), a.stopPropagation();
                var b = confirm(window.localization.get("settings-disconnectConfirm"));
                b && window.GoogleAPI.disconnect()
            }), $(document).on("change", "#settingsCheckAlreadyCombined", function() {
                window.settings.data.checkAlreadyCombined = this.checked, $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsMarkFinalElements", function() {
                window.settings.data.markFinalElements = this.checked, window.library.markFinalElements(this.checked), window.settings.data.markFinalElements ? workspace.$el.find(".element").each(function(a, b) {
                    game.finalElements.indexOf(parseInt(b.getAttribute("data-elementId"), 10)) !== -1 && (b.className += " finalElement")
                }) : workspace.$el.find(".finalElement").removeClass("finalElement"), $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsHideFinalElements", function() {
                window.settings.data.hideFinalElements = this.checked, window.settings.data.hideFinalElements ? window.library.refresh() : window.library.reload(), $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsTurnOffNotifications", function() {
                window.settings.data.turnOffNotifications = this.checked, $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsTurnOffElementsPositions", function() {
                window.settings.data.saveElementsPositions = !this.checked, $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsHideElementNames", function() {
                window.settings.data.hideElementsNames = this.checked, workspace.elementsNamesVisibility(), $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsNightMode", function() {
                window.settings.data.nightMode = this.checked, settings.changeNightMode(), $(document).trigger("updateSettings")
            }), $(document).on("change", "#settingsLanguage", function() {
                window.settings.data.language = this.options[this.selectedIndex].value, $(document).trigger("updateSettings"), window.localization.changeLanguage(this.options[this.selectedIndex].value)
            });
            var a = function() {
                var a = $("#loggedInAs");
                a.find("span")[0].textContent = GoogleAPI.player.name, a.show()
            };
            $(document).on("playerLoaded", a), $(document).on("loggedOut", function() {
                $("#loggedInAs").hide()
            }), "undefined" != typeof GoogleAPI.player.name && "" !== GoogleAPI.player.name && a(), $("#settingsLanguage").on("focus", function() {
                "undefined" != typeof iscrollMenu && iscrollMenu.disable()
            }), $("#settingsLanguage").on("change blur click", function() {
                "undefined" != typeof iscrollMenu && iscrollMenu.enable()
            })
        },
        offContent: function() {
            $("#settingsResetProgress").off("click"), $("#settingsDisconnect").off("mousedown"), $("#settingsLanguage").off("focus"), $("#settingsLanguage").off("change blur click"), $(document).off("change", "#settingsCheckAlreadyCombined"), $(document).off("change", "#settingsMarkFinalElements"), $(document).off("change", "#settingsHideFinalElements"), $(document).off("change", "#settingsTurnOffNotifications"), $(document).off("change", "#settingsTurnOffElementsPositions"), $(document).off("change", "#settingsHideElementNames"), $(document).off("change", "#settingsNightMode"), $(document).off("change", "#settingsLanguage"), $(document).off("playerLoaded")
        },
        changeNightMode: function() {
            window.settings.data.nightMode ? document.body.className += " nightMode" : document.body.className = document.body.className.replace(/nightMode/g, "")
        }
    },
    localization = {
        data: {},
        language: "en",
        languages: {
            en: "English",
            es: "Español",
            pt: "Português",
            fr: "Français",
            de: "Deutsch",
            pl: "Polski",
            it: "Italiano",
            nl: "Nederlands",
            no: "Norsk",
            sv: "Svenska"
        },
        characters: {
            en: "abcdefghijklmnopqrstuvwxyz",
            pl: "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż",
            de: "aäbcdefghijklmnoöpqrsßtuüvwxyz",
            fr: "aàâæäbcçdeéèêëfghiîïjklmnoôœöpqrstuùûüvwxyÿz",
            es: "aábcdeéfghiíjklmnñoópqrstuúüvwxyz",
            it: "aàbcdeèéfghiìjklmnoòpqrstuùvwxyz",
            nl: "aäbcdeëèéfghiïĳjklmnoöpqrstuüvwxyz",
            no: "aåæbcdefghijklmnoøpqrstuvwxyz",
            pt: "aáâãábcçdeéêfghiíjklmnoóôõpqrstuúvwxyz",
            sv: "aäåbcdefghijklmnoöpqrstuvwxyz"
        },
        loaded: !1,
        init: function() {
            settings.data.language && localization.setLanguage(settings.data.language), localization.loadResources()
        },
        checkLanguage: function() {
            var a = window.location.hostname,
                b = a.split(".")[a.split(".").length - 1];
            for (var c in localization.domainMap)
                if (localization.domainMap[c].indexOf(b) !== -1) {
                    localization.setLanguage(c);
                    break
                }
        },
        changeLanguage: function(a) {
            a !== localization.language && (localization.setLanguage(a), localization.loadResources(), $(document).trigger("languageChanged"))
        },
        setLanguage: function(a) {
            localization.languages.hasOwnProperty(a) || (a = "en"), localization.language = a, localization.setLanguageFamily(), localization.setRegex()
        },
        setRegex: function() {
            localization.regex = new RegExp("[^" + localization.characters[localization.languageFamily] + " ]", "ig")
        },
        setLanguageFamily: function() {
            localization.languageFamily = localization.language.split("-")
        },
        loadResources: function() {
            $.getJSON(localization.getURL("languagePack.580.json"), function(a) {
                localization.data = a, localization.loaded = !0, $(document).trigger("languagePackLoaded")
            })
        },
        get: function(a) {
            var b = a.split("-");
            return localization.data.hasOwnProperty(b[0]) && localization.data[b[0]].hasOwnProperty(b[1]) ? localization.data[b[0]][b[1]] : ""
        },
        getURL: function(a) {
            return "resources/" + localization.language + "/" + a
        },
        compareLetter: function(a, b) {
            if (a === b) return 0;
            var c = localization.characters[localization.language].indexOf(a.toLowerCase()),
                d = localization.characters[localization.language].indexOf(b.toLowerCase());
            return c < 0 || d < 0 || c === d ? 0 : c < d ? -1 : 1
        },
        compare: function(a, b) {
            a = a.replace(localization.regex, ""), b = b.replace(localization.regex, "");
            for (var c, d = Math.min(a.length, b.length), e = 0; e < d;) {
                if (c = localization.compareLetter(a[e], b[e]), 0 !== c) return c;
                e++
            }
            return a.length < b.length ? -1 : a.length > b.length ? 1 : 0
        }
    },
    loading = {
        modificationDates: {},
        init: function() {
            window.setTimeout(loading.checkIfModified, 15e3)
        },
        checkIfModified: function() {
            for (var a in loading.modificationDates) loading.getModificationDate(a)
        },
        getModificationDate: function(a) {
            var b = new XMLHttpRequest;
            b.open("HEAD", a, !0), b.onreadystatechange = function(c) {
                this.readyState === this.DONE && (200 === this.status ? loading.analyzeModificationDate(a, b.getResponseHeader("Last-Modified")) : (delete loading.modificationDates[a], storage.updateModificationDates()))
            }, b.send()
        },
        getURL: function(a) {
            return game.isOnline && loading.modificationDates.hasOwnProperty(a) ? a + "?t=" + loading.modificationDates[a] : a
        },
        analyzeModificationDate: function(a, b) {
            if (null !== b) {
                var c = loading.convertToMilisecondsDate(b);
                (!loading.modificationDates.hasOwnProperty(a) || loading.modificationDates[a] < c) && (loading.modificationDates[a] = c, storage.updateModificationDates())
            }
        },
        convertToMilisecondsDate: function(a) {
            return a = a.replace("/", " "), a = a.replace("/", " "), a = a.replace("-", " "), a = a.replace("-", " "), new Date(Date.parse(a)).getTime()
        }
    },
    GoogleAPI = {
        player: {
            id: -1,
            name: ""
        },
        apiKey: "AIzaSyBWa6dXP4geUkBPMGx7uEDrUEYqO_C64IA",
        clientId: "313610222031",
        init: function() {
            $(document).on("GAPILoaded", function() {
                gapi.client.setApiKey(GoogleAPI.apiKey), GoogleAPI.checked || window.setTimeout(function() {
                    GoogleAPI.checkLogin(!0)
                }, 1)
            }), GoogleAPI.logged = !1, GoogleAPI.checked = !1, GoogleAPI.accessToken = "", GoogleAPI.$login = $("#login"), GoogleAPI.initEvents()
        },
        initEvents: function() {
            GoogleAPI.$login.on("click", function(a) {
                GoogleAPI.logged || GoogleAPI.checkLogin(!1)
            }), $(document).on("loggedIn", function() {
                GoogleAPI.$login.hide()
            }), $(document).on("loggedOut", function() {
                GoogleAPI.logged = !1, GoogleAPI.player = {}, GoogleAPI.accessToken = null, storage.setAuthUser(-1), GoogleAPI.$login.show()
            }), $(document).on("languagePackLoaded", function() {
                var a = GoogleAPI.logged ? localization.get("login-logout") : localization.get("login-login");
                GoogleAPI.$login.html(a)
            }), $(document).on("online", function() {
                GoogleAPI.$login.show()
            }), $(document).on("offline", function() {
                GoogleAPI.$login.hide()
            }), $(document).on("unauthorized", function() {
                GoogleAPI.checkLogin(!0)
            })
        },
        checkLogin: function(a) {
            gapi.auth.authorize({
                client_id: GoogleAPI.clientId,
                scope: "https://www.googleapis.com/auth/games https://www.googleapis.com/auth/appstate",
                immediate: a,
                authuser: storage.getAuthUser(),
                apppackagename: "com.sometimeswefly.littlealchemy"
            }, GoogleAPI.handleAuth)
        },
        handleAuth: function(a) {
            GoogleAPI.checked = !0, !a || a.error || GoogleAPI.logged ? GoogleAPI.logged ? $(document).trigger("loggedOut") : $(document).trigger("notLoggedIn") : (GoogleAPI.logged = !0, GoogleAPI.accessToken = a.access_token, storage.setAuthUser(a.authuser), GoogleAPI.loadClient(), $(document).trigger("loggedIn"))
        },
        loadClient: function() {
            gapi.client.load("games", "v1", function(a) {
                GoogleAPI.loadPlayer(), $(document).trigger("GAPIclientLoaded")
            })
        },
        loadPlayer: function() {
            var a = gapi.client.games.players.get({
                playerId: "me"
            });
            a.execute(function(a) {
                a.error || (GoogleAPI.player.id = a.playerId, GoogleAPI.player.name = a.displayName, $(document).trigger("playerLoaded"))
            })
        },
        disconnect: function() {
            var a = "https://accounts.google.com/o/oauth2/revoke?token=" + GoogleAPI.accessToken;
            $.ajax({
                type: "GET",
                url: a,
                async: !1,
                contentType: "application/json",
                dataType: "jsonp",
                success: function() {
                    $(document).trigger("loggedOut")
                },
                error: function(a) {}
            })
        }
    },
    gestures = {
        startEvents: ["mousedown", "touchstart", "pointerdown", "MSPointerDown"],
        endEvents: {
            mouseup: "mousedown",
            touchend: "touchstart",
            pointerup: "pointerdown",
            MSPointerUp: "MSPointerDown"
        },
        events: {
            mousedown: ["mousemove", "mouseup"],
            touchstart: ["touchmove", "touchend"],
            pointerdown: ["pointermove", "pointerup"],
            MSPointerDown: ["MSPointerMove", "MSPointerUp"]
        },
        init: function() {
            for (var a = 0; a < gestures.startEvents.length; a++) document.addEventListener(gestures.startEvents[a], function(a) {
                gestures.longPress.down(a)
            }), document.addEventListener(gestures.events[gestures.startEvents[a]][1], function(a) {
                gestures.longPress.up(a)
            })
        },
        longPress: {
            LONGPRESS_TIME: 800,
            WIGGLE_THRESHOLD: 5,
            target: null,
            initPosition: {
                x: -1,
                y: -1
            },
            down: function(a) {
                clearTimeout(gestures.longPress.timer), document.addEventListener(gestures.events[a.type][0], gestures.longPress.move), a = "touchstart" === a.type ? a.changedTouches[0] : a, gestures.longPress.initPosition = {
                    x: a.pageX,
                    y: a.pageY
                }, gestures.longPress.target = a.target, gestures.longPress.timer = setTimeout(function() {
                    var b = document.createEvent("Event");
                    b.initEvent("gesturelongpress", !0, !0), a.target.dispatchEvent(b)
                }, gestures.longPress.LONGPRESS_TIME)
            },
            move: function(a) {
                if (gestures.longPress.initPosition.x !== -1 && gestures.longPress.initPosition.y !== -1) {
                    var b = a.type;
                    a = "touchmove" === a.type ? a.changedTouches[0] : a;
                    var c = gestures.longPress.initPosition,
                        d = Math.sqrt((c.x - a.pageX) * (c.x - a.pageX) + (c.y - a.pageY) * (c.y - a.pageY));
                    (c && d > gestures.longPress.WIGGLE_THRESHOLD || a.target !== gestures.longPress.target) && (clearTimeout(gestures.longPress.timer), gestures.longPress.initPosition = {
                        x: -1,
                        y: -1
                    }, document.removeEventListener(b, gestures.longPress.move))
                }
            },
            up: function(a) {
                clearTimeout(gestures.longPress.timer), document.removeEventListener(gestures.events[gestures.endEvents[a.type]][0], gestures.longPress.move)
            }
        }
    };
window.storage = {
    init: function() {
        window.storage.checkOldVersionHistory(), window.storage.checkHistory(), window.storage.checkSettings(), window.storage.checkAchievements(), window.storage.checkReset(), window.storage.checkOldHistory(), window.loading.modificationDates = window.storage.getModificationDates(), $(document).on("updateHistory", window.storage.updateHistory), $(document).on("updateSettings", window.storage.updateSettings), $(document).on("updateAchievements", window.storage.updateAchievements), $(document).on("updateReset", window.storage.updateReset), $(document).on("progressInitiated", window.storage.checkImportedHistory), $(document).on("notLoggedIn loggedOut", function() {
            window.storage.setReset(-1)
        })
    },
    getHistory: function() {
        return null !== window.localStorage.getItem("progress") ? window.localStorage.getItem("progress") : null
    },
    checkOldVersionHistory: function() {
        if (null !== window.localStorage.getItem("history") && 0 != window.localStorage.getItem("history").length && null === window.localStorage.getItem("progress")) {
            for (var a = JSON.parse(window.localStorage.getItem("history")), b = {
                    parents: [],
                    date: []
                }, c = 0, d = a.parents.length; c < d; c++) b.parents.push([Math.min(a.parents[c][0] + 1, a.parents[c][1] + 1), Math.max(a.parents[c][0] + 1, a.parents[c][1] + 1)]), b.date.push(a.date[c]);
            window.localStorage.setItem("progress", JSON.stringify(b)), bases.base && (game.initProgress(), game.getFinalElements(), library.reload()), localStorage.removeItem("settings"), localStorage.removeItem("history"), localStorage.removeItem("uid"), localStorage.removeItem("timeSpent"), localStorage.removeItem("notification")
        }
    },
    checkImportedHistory: function() {
        if (null !== window.localStorage.getItem("history") && null !== window.localStorage.getItem("progress")) {
            for (var a, b = JSON.parse(window.localStorage.getItem("history")), c = 0, d = b.parents.length; c < d; c++) a = [Math.min(b.parents[c][0] + 1, b.parents[c][1] + 1), Math.max(b.parents[c][0] + 1, b.parents[c][1] + 1)], game.checkIfNotAlreadyDone(a) && (game.history.parents.push(a), game.history.date.push(b.date[c]));
            $(document).trigger("updateHistory"), localStorage.removeItem("history"), bases.base && (game.initProgress(), game.getFinalElements(), "undefined" != typeof library.el && null !== library.el && library.reload())
        }
    },
    checkHistory: function() {
        if (null === window.localStorage.getItem("progress") || 0 === window.localStorage.getItem("progress").length) {
            var a = {
                parents: [],
                date: []
            };
            window.localStorage.setItem("progress", JSON.stringify(a))
        }
    },
    updateHistory: function() {
        window.localStorage.setItem("progress", JSON.stringify(window.game.history))
    },
    resetHistory: function() {
        storage.updateReset(), window.localStorage.removeItem("progress"), window.storage.checkHistory()
    },
    checkSettings: function() {
        null !== window.localStorage.getItem("settings") && 0 !== window.localStorage.getItem("settings").length || window.localStorage.setItem("settings", JSON.stringify(window.settings.def))
    },
    getSettings: function() {
        return null !== window.localStorage.getItem("settings") ? JSON.parse(window.localStorage.getItem("settings")) : null
    },
    updateSettings: function() {
        window.localStorage.setItem("settings", JSON.stringify(window.settings.data))
    },
    checkTime: function() {
        null === window.localStorage.getItem("timeSpent") && window.localStorage.setItem("timeSpent", 0)
    },
    updateTime: function(a) {
        window.localStorage.setItem("timeSpent", a)
    },
    updateModificationDates: function() {
        window.localStorage.setItem("modificationDates", JSON.stringify(loading.modificationDates))
    },
    getModificationDates: function() {
        return null !== window.localStorage.getItem("modificationDates") ? JSON.parse(window.localStorage.getItem("modificationDates")) : {}
    },
    checkAchievements: function() {
        null !== window.localStorage.getItem("achievements") && 0 !== window.localStorage.getItem("achievements").length || window.localStorage.setItem("achievements", JSON.stringify([]))
    },
    getAchievements: function() {
        return null !== window.localStorage.getItem("achievements") ? JSON.parse(window.localStorage.getItem("achievements")) : []
    },
    updateAchievements: function() {
        window.localStorage.setItem("achievements", JSON.stringify(window.achievements.earnedList))
    },
    checkReset: function() {
        null !== window.localStorage.getItem("reset") && 0 !== window.localStorage.getItem("reset").length || window.localStorage.setItem("reset", -1)
    },
    getReset: function() {
        return parseInt(window.localStorage.getItem("reset"), 10)
    },
    setReset: function(a) {
        window.localStorage.setItem("reset", a)
    },
    updateReset: function() {
        GoogleAPI.logged && window.localStorage.setItem("reset", (new Date).getTime())
    },
    getName: function() {
        return window.localStorage.getItem("name")
    },
    setName: function(a) {
        window.localStorage.setItem("name", a)
    },
    checkOldHistory: function() {
        if (null === window.localStorage.getItem("progressBeforeReset") || 0 === window.localStorage.getItem("progressBeforeReset").length) {
            var a = {
                parents: [],
                date: []
            };
            window.localStorage.setItem("progressBeforeReset", JSON.stringify(a))
        }
    },
    setOldHistory: function(a) {
        window.localStorage.setItem("progressBeforeReset", JSON.stringify(a))
    },
    getOldHistory: function() {
        return null !== window.localStorage.getItem("progressBeforeReset") ? JSON.parse(window.localStorage.getItem("progressBeforeReset")) : {}
    },
    getElementPositions: function() {
        return null !== window.localStorage.getItem("elementPositions") && window.localStorage.getItem("elementPositions").length > 0 ? JSON.parse(window.localStorage.getItem("elementPositions")) : []
    },
    setElementPositions: function(a) {
        window.localStorage.setItem("elementPositions", JSON.stringify(a))
    },
    getNotifications: function() {
        return null !== window.localStorage.getItem("notifications") ? JSON.parse(window.localStorage.getItem("notifications")) : []
    },
    updateNotifications: function() {
        window.localStorage.setItem("notifications", JSON.stringify(window.notifications.shown))
    },
    getLoadingMessages: function() {
        return null !== window.localStorage.getItem("loadingMessages") ? JSON.parse(window.localStorage.getItem("loadingMessages")) : []
    },
    updateLoadingMessages: function(a) {
        window.localStorage.setItem("loadingMessages", JSON.stringify(a))
    },
    getAuthUser: function() {
        return null !== window.localStorage.getItem("authuser") ? window.localStorage.getItem("authuser") : -1
    },
    setAuthUser: function(a) {
        window.localStorage.setItem("authuser", a)
    }
};
var search = {
        init: function() {
            search.activeLetter = null, search.activeCategory = null, search.$alphabet = $("#alphabet"), search.initAlphabet(), search.initSearchBar(), search.initEvents()
        },
        initAlphabet: function() {
            search.$alphabet.on("click", "li", function() {
                var a = $(this);
                if (search.activeLetter = a.text().toLowerCase(), null === search.activeCategory) search.scrollToLetter(search.activeLetter);
                else {
                    var b = library.showCategory(search.activeCategory);
                    library.show(b), search.scrollToLetter(search.activeLetter, b)
                }
                $(document).trigger("alphabetSearchOccured", [search.activeLetter])
            })
        },
        initEvents: function() {
            $(document).on("searchAlphabethClick", function(a) {
                search.$alphabet.is(":visible") ? (search.$alphabet.hide(), search.activeLetter = null,
                    null === search.activeCategory ? (library.refresh(), iscrollLibrary.scrollTo(0, 0, 500)) : library.show(library.showCategory(search.activeCategory))) : (el.show(), iscrollAlphabeth.refresh()), iscrollAlphabeth.refresh()
            })
        },
        initSearchBar: function() {
            var a = document.getElementById("searchBar"),
                b = function() {
                    $(document).trigger("searchOccured"), "text" === a.type && (a.value = "", a.type = "hidden", library.refresh())
                };
            $(document).keydown(function(b) {
                if (menu.$el.is(":visible") || 0 != $(":focus").length && $(":focus")[0] !== a && "INPUT" === $(":focus")[0].tagName || (b.keyCode >= 65 && b.keyCode <= 90 || 32 == b.keyCode) && (!b.ctrlKey || b.ctrlKey && b.altKey) && (a.type = "text", a.focus(), "undefined" != typeof iscrollLibrary ? iscrollLibrary.scrollTo(0, 0, 300) : initIScroll()), 8 === b.keyCode) {
                    var c = !1,
                        d = b.srcElement || b.target;
                    c = ("INPUT" !== d.tagName.toUpperCase() || "TEXT" !== d.type.toUpperCase() && "PASSWORD" !== d.type.toUpperCase() && "FILE" !== d.type.toUpperCase()) && "TEXTAREA" !== d.tagName.toUpperCase() || (d.readonly || d.disabled), c && b.preventDefault()
                }
            }), a.onkeyup = function(c) {
                "text" !== a.type || 0 !== a.value.length && 27 !== c.keyCode ? library.show(library.showPhrase(a.value.toLowerCase())) : (c.preventDefault(), b())
            }, a.onfocus = function() {
                library.show(library.showPhrase(a.value.toLowerCase()))
            }, a.onblur = b, $(document).on("libraryBoxDraggingStart workspaceBoxDraggingStart", b)
        },
        scrollToLetter: function(a, b) {
            if ("undefined" == typeof iscrollLibrary && initIScroll(), "undefined" != typeof iscrollLibrary && iscrollLibrary.maxScrollY < 0) {
                var c = Math.max(-library.elementOuterHeight * search.getNoElementsBefore(a, b), iscrollLibrary.maxScrollY);
                iscrollLibrary.scrollTo(0, c, 500)
            }
        },
        getNoElementsBefore: function(a, b) {
            for (var c = library.sortedProgress, d = 0, e = c.length; d < e;) {
                if (localization.compareLetter(a, bases.names[c[d]][0]) <= 0) return d;
                d++
            }
            return d - 1
        }
    },
    templates = {
        list: {
            elementInfo: null,
            notification: null,
            achievements: null,
            leaderboards: null,
            achievement: null,
            getName: null
        },
        init: function() {
            templates.load(), $(document).on("languageChanged", function() {
                templates.load()
            })
        },
        load: function() {
            var a = localization.getURL("templates.html");
            $.get(loading.getURL(a), function(b, c, d) {
                loading.analyzeModificationDate(a, d.getResponseHeader("Last-Modified"));
                for (var e in templates.list) templates.list[e] = $(b).filter("#" + e + "Template").html()
            })
        }
    },
    update = {
        types: {
            history: {
                slot: 0,
                lastSaveVersion: "",
                data: function() {
                    var a = {
                        parents: game.history.parents,
                        date: game.history.date,
                        reset: storage.getReset()
                    };
                    return JSON.stringify(a)
                },
                merge: function() {},
                "synchronized": !1
            },
            settings: {
                slot: 1,
                lastSaveVersion: "",
                data: function() {
                    return JSON.stringify(settings.data)
                },
                merge: function() {},
                "synchronized": !1
            },
            achievements: {
                slot: 2,
                lastSaveVersion: "",
                merge: function() {}
            }
        },
        path: "appstate/v1/states/",
        init: function() {
            update.types.history.merge = update.mergeHistoryData, $(document).on("loggedIn", function() {
                GoogleAPI.logged && update.synchronize("history")
            }), $(document).on("loggedOut", function() {
                update.types.history["synchronized"] = !1
            }), $(document).on("progressInitiated", function() {
                GoogleAPI.logged && update.synchronize("history")
            }), $(document).on("updateHistory", function(a, b, c) {
                GoogleAPI.logged && update.save("history")
            })
        },
        resetHistory: function() {
            0 === game.history.parents.length && GoogleAPI.logged && update.save("history")
        },
        synchronize: function(a) {
            update.types[a]["synchronized"] || update.load(a, function() {
                update.types[a]["synchronized"] = !0, update.save(a)
            })
        },
        load: function(a, b) {
            gapi.client.request({
                path: update.path + update.types[a].slot,
                method: "get",
                callback: function(c, d) {
                    var e = JSON.parse(d);
                    404 == e.gapiRequest.data.status ? (update.types[a].lastSaveVersion = c.currentStateVersion, update.save(a)) : 401 == e.gapiRequest.data.status ? $(document).trigger("unauthorized") : "appstate#getResponse" == c.kind && c.hasOwnProperty("data") && (update.types[a].lastSaveVersion = c.currentStateVersion, update.types[a].merge(JSON.parse(c.data))), null != b && b()
                }
            })
        },
        save: function(a, b) {
            var c = {};
            "" != update.types[a].lastSaveVersion && (c.currentStateVersion = update.types[a].lastSaveVersion), gapi.client.request({
                path: update.path + update.types[a].slot,
                params: c,
                body: {
                    kind: "appstate#updateRequest",
                    data: update.types[a].data()
                },
                method: "put",
                callback: function(c, d) {
                    var e = JSON.parse(d);
                    409 == e.gapiRequest.data.status ? update.load(a, function() {
                        update.save(a)
                    }) : 401 == e.gapiRequest.data.status ? $(document).trigger("unauthorized") : "appstate#writeResult" == c.kind && (c.hasOwnProperty("error") || (update.types[a].lastSaveVersion = c.currentStateVersion, null != b && b()))
                }
            })
        },
        mergeHistoryData: function(a) {
            var b = function() {
                    if (a.reset !== -1) {
                        for (var b = [], d = [], e = game.history.parents.length - 1; e >= 0; e--) parseInt(game.history.date[e], 10) < a.reset && (b.push(game.history.parents.splice(e, 1)[0]), d.push(game.history.date.splice(e, 1)[0]), c = !0);
                        c && game.saveOldProgress(b, d), a.reset > storage.getReset() && storage.setReset(a.reset)
                    }
                },
                c = !1;
            if (a.parents.length > 0)
                if (game.history && 0 === game.history.parents.length) storage.setReset(a.reset), delete a.reset, game.history = a, c = !0;
                else {
                    for (var d = 0, e = a.parents.length; d < e; d++) game.checkIfNotAlreadyDone(a.parents[d]) && (game.history.parents.push(a.parents[d]), game.history.date.push(a.date[d]), c = !0);
                    b()
                }
            else b();
            c && (game.history = game.checkHistoryIntegrity(game.history), storage.updateHistory(), game.initProgress(), workspace.clearSpecified(workspace.$el.find(".element")), library.reload()), $(document).trigger("historySynchronized")
        }
    },
    library = {
        loadingImage: "iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAMAAAArDjJDAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAACAgIAAAADAwMCAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAD////MzMwAAADk5ORdXV3a2tp0dHQICAj8/Pzw8PD19fXq6uoXFxfe3t5sbGzR0dHOzs7i4uJCQkLAwMA1NTVNTU0mJiawsLCYmJiKioqjo6NhYWHZ2dl+fn5XV1fT09PRrWOXAAAAEHRSTlMAYTbBS9Uk++MDdRapmQyK8ORcjAAAAdBJREFUWMPt1l2WojAQhuEoguBffyltEwFBEWlttfe/vJm7HGhNhXA1Z3wWkMMbQijx9vbPGgfUFY6FjznlxbataCgSHkYk0XWkmfAwoS90nWgkPKxiuqFtS2rut1khpWhRcST8xDXazirxPAx0Qds3TYSXD1qjbaeWwsu0RteZkmF9xpdf4ZIydKVq4bFSoir89kMrn75vGIMKl2qH37RaePSd8cytf+HE9HEfNN+X4hmdB3376IznClp5XlbDCxemb2DhijbAy8L5sD5D0qhfn8ZLedir74bXtn0KR3TCa2WfP1iQa1g0YY++AjYPiob1GXeaDewzmth57tjC7kqR59zhP4WEOdJPmxR17Nx3lDZ718IZlSilzUGv6cOpr0Eq7Xaop4IX0eNvn90nLjR26bujlAyduRTGDXaSk6FSCd93xV4aAwpntMdBsrTDqBXXps8iM8Mk08e6m2HS0qdNn7WQe4dBbvqYwjpktqrCWro4YsMc+OkPjtLFHgUxT3XG2nGpG7NU0DjvVRWzY78uJe+gU+6MjqnA7uDyUA92wA3oBJ0d7TKNUsXc9zxX6pqCoy/K4UqOQlLVxq5SFI8FL5ksQjW1ChejRLy9/cf+ADN8f5lRBqTtAAAAAElFTkSuQmCC",
        init: function() {
            library.elContainter = document.createDocumentFragment(), library.el = document.getElementById("library"), library.outerLibrary = document.getElementById("outerLibrary"), library.$el = $(library.el), library.$outerLibrary = $(library.outerLibrary), library.droppable = new Droppable(library.outerLibrary, {
                tolerance: "touch"
            }), library.$outerLibrary.on("droppableDrop", function(a, b) {
                "workspaceBox" === b.element.getAttribute("data-elementtype") ? workspace.del(b.$element.data("ptr")) : $(b.helper).off().data("ptr", null).remove()
            }), $(document).on("newChildCreated", function(a, b) {
                library.addOne(b)
            }), $(document).on("imagesLoaded", library.reloadImages), library.mode = "normal", library.sortMode = "alphabetically";
            var a = 5,
                b = window.setTimeout(function() {
                    library.addAll(), loadingScreen.list.indexOf("historySynchronized") === -1 && loadingScreen.list.indexOf("notLoggedIn") === -1 && loadingScreen.incrementProgress("notLoggedIn"), $(document).off("historySynchronized notLoggedIn")
                }, 1e3 * a);
            $(document).on("historySynchronized notLoggedIn", function(a) {
                library.addAll(), $(document).off("historySynchronized notLoggedIn"), window.clearTimeout(b)
            }), $(window).on("orientationchange resize", function(a) {
                $(".droppable").trigger("resized")
            }), $(window).one("load", function() {
                library.droppable._getPosition(), library.droppable._getSize()
            }), $(document).one("iscrollInitiated", library.initOnScrollAction)
        },
        initOnScrollAction: function() {
            var a = $("#libraryOverlay"),
                b = null;
            iscrollLibrary.on("scrollStart", function() {
                null !== b && (window.clearTimeout(b), b = null), a[0].style.zIndex = 150
            }), iscrollLibrary.on("scrollEnd", function() {
                b = window.setTimeout(function() {
                    a[0].style.zIndex = "auto", b = null
                }, 75)
            }), a.on(gestures.startEvents.join(" "), function(a) {
                if (!iscrollLibrary.isInTransition) return !1;
                pos = iscrollLibrary.getComputedPosition(), iscrollLibrary._translate(Math.round(pos.x), Math.round(pos.y)), iscrollLibrary._execEvent("scrollEnd"), iscrollLibrary.isInTransition = !1;
                var b, c = Math.floor((a.offsetY + -1 * iscrollLibrary.y) / library.elementOuterHeight);
                b = settings.data.hideFinalElements && library.el.children.length !== game.progressWithoutFinal.length + game.prime.length ? library.el.querySelector('.element[data-elementid="' + library.sortedProgress[c] + '"]') : library.el.children[c], $(b).data("ptr").draggable.dragStart(a, a)
            })
        },
        add: function(a) {
            new LibraryBox(a)
        },
        addOne: function(a) {
            library.elContainter = document.createDocumentFragment();
            var b = settings.data.hideFinalElements ? game.progressWithoutFinal : game.progress,
                c = library.sort(game.prime.concat(b), !0);
            library.sortedProgress = c;
            var d = c.indexOf(a);
            if (!library.checkIfHideFinal(a))
                if (library.add(a), 0 === d) library.$el.prepend(library.elContainter);
                else if (d !== -1) {
                var e = c[d - 1];
                $('#library > .element[data-elementId="' + e + '"]').after(library.elContainter)
            }
            var f = settings.data.hideFinalElements ? game.progressWithoutFinal.length + game.prime.length : game.progress.length + game.prime.length;
            library.refreshIscroll(f)
        },
        addAll: function() {
            var a, b;
            library.clear();
            var c = settings.data.hideFinalElements ? game.progressWithoutFinal : game.progress,
                d = library.sort(game.prime.concat(c), !0);
            for (library.sortedProgress = d, a = 0, b = d.length; a < b; a++) library.add(d[a]);
            library.el.appendChild(library.elContainter), library.elementOuterHeight = library.$el.find(".element").outerHeight(), library.refreshIscroll(d.length), $(document).trigger("libraryShowed")
        },
        clear: function() {
            for (var a, b, c = library.el.getElementsByClassName("element"), d = 0, e = c.length; d < e; d++) a = $(c[d]), b = a.data("ptr"), b.draggable && b.draggable.destroy(), b.draggable = null, a.find("img").off(), a.data("ptr", null).off();
            library.el.innerHTML = ""
        },
        hideAll: function() {
            for (var a, b, c = library.el.getElementsByClassName("element"), a = 0, b = c.length; a < b; a++) c[a].style.display = "none"
        },
        reload: function() {
            library.clear(), library.addAll()
        },
        refresh: function() {
            library.show()
        },
        show: function(a) {
            var b, c, d, e, f, g, h = library.el.getElementsByClassName("element"),
                i = a || game.prime.concat(game.progress);
            for (i = library.sort(i, !0), f = i.length, "undefined" == typeof a && (library.sortedProgress = []), g = 0, b = 0, c = h.length; b < c; b++) d = h[b].getAttribute("data-elementId"), e = i.indexOf(parseInt(d, 10)), !library.checkIfHideFinal(parseInt(d, 10)) && e > -1 ? (h[b].style.display = "block", i.splice(e, 1), "undefined" == typeof a && library.sortedProgress.push(d), g++) : h[b].style.display = "none";
            library.refreshIscroll(g), $(document).trigger("libraryShowed")
        },
        reloadImages: function() {
            var a, b, c, d = library.el.getElementsByClassName("element"),
                e = function(a) {
                    var b = $(this);
                    b.data("ptr").draggable.changeHandles("img"), b.off("dragEnd", e)
                };
            for (a = 0, b = d.length; a < b; a++) d[a].firstChild.nextSibling.src = "data:image/png;base64," + bases.images[d[a].getAttribute("data-elementId")];
            for (a = 0, b = d.length; a < b; a++) d[a].firstChild.parentNode.removeChild(d[a].firstChild), d[a].firstChild.style.display = "block", c = $(d[a]).data("ptr").draggable, c.isDragging ? $(d[a]).on("dragEnd", e) : c.changeHandles("img")
        },
        markFinalElements: function() {
            var a, b, c;
            if (window.settings.data.markFinalElements && !window.settings.data.hideFinalElements)
                for (c = game.finalElements, a = 0, b = c.length; a < b; a++) library.el.querySelector('.element[data-elementid="' + c[a] + '"]').className += " finalElement";
            else
                for (c = library.el.getElementsByClassName("finalElement"); c.length > 0;) c[0].className = c[0].className.replace(/\bfinalElement\b/, "")
        },
        showLetter: function(a) {
            var b, c, d = [],
                e = game.prime.concat(game.progress);
            for (b = 0, c = e.length; b < c; b++) bases.names[e[b]][0] === a && d.push(e[b]);
            return d
        },
        showCategory: function(a) {
            var b, c, d, e = [],
                f = game.prime.concat(game.progress);
            for (b = 0, c = f.length; b < c; b++)
                if (bases.base[f[b]].tags)
                    for (d = 0; d < bases.base[f[b]].tags.length; d++) bases.base[f[b]].tags[d] === a && e.push(parseInt(f[b], 10));
            return e
        },
        showLetterAndCategory: function(a, b) {
            var c, d, e = [];
            for (b = library.showCategory(b), c = 0, d = b.length; c < d; c++) bases.names[b[c]][0] === a && e.push(b[c]);
            return e
        },
        showPhrase: function(a) {
            for (var b, c, d = [], e = "[]{}'/\\()?<>+.*^$", f = game.prime.concat(game.progress), b = 0; b < e.length; b++) a = a.split(e[b]).join("");
            var g = new RegExp(a);
            for (b = 0, c = f.length; b < c; b++) g.test(bases.names[f[b]].toLowerCase()) && d.push(f[b]);
            return d
        },
        sort: function(a, b) {
            var c = a || game.prime.concat(game.progress),
                d = [];
            return "alphabetically" === library.sortMode ? d = library.sortAlphabetically(c) : "time" === library.sortMode && (d = library.sortByTime(c)), b ? d : void library.show(d)
        },
        sortAlphabetically: function(a) {
            var b, c, d, e = {},
                f = [],
                g = [];
            for (b = 0, c = a.length; b < c; b++) d = bases.names[a[b]] + "_" + a[b], e[d] = a[b], f.push(d);
            for ("en" !== localization.language ? f.sort(localization.compare) : f.sort(), b = 0, c = f.length; b < c; b++) g.push(e[f[b]]);
            return g
        },
        sortByTime: function(a) {
            var b, c, d = {},
                e = [],
                f = [];
            for (b = 0, c = game.history.parents.length; b < c; b++) {
                var g = workspace.sex(game.history.parents[b]);
                d[game.history.date[b]] = g, e.push(game.history.date[b])
            }
            for (e.sort(), b = 0, c = e.length; b < c; b++) f = $.merge(f, d[e[b]]);
            return f
        },
        checkIfHideFinal: function(a) {
            return !!settings.data.hideFinalElements && game.finalElements.indexOf(a) !== -1
        },
        refreshIscroll: function(a) {
            if (iscrollLibrary) {
                var b = library.$outerLibrary.outerHeight() + 1;
                b < a * library.elementOuterHeight ? iscrollLibrary.refresh(!0, a * library.elementOuterHeight + 50) : iscrollLibrary.refresh(!0, b)
            }
        }
    };
window.addEventListener("orientationChange", library.refreshIScroll, !1), LibraryBox.prototype.createElement = function(a) {
    var b = document.createElement("div");
    b.setAttribute("class", "element"), b.setAttribute("data-elementType", "libraryBox"), b.setAttribute("data-elementId", this.id), b.style.display = a ? "none" : b.style.display, game.finalElements.indexOf(this.id) !== -1 && settings.data.markFinalElements && (b.className += " finalElement");
    var c, d;
    bases.imagesLoaded ? (c = document.createElement("img"), c.style.opacity = 0, c.src = "data:image/png;base64," + bases.images[this.id], c.alt = bases.names[this.id], c.onload = function() {
        this.style.opacity = 1, c.onload = null
    }) : a ? (c = document.createElement("img"), c.src = "data:image/png;base64," + library.loadingImage, c.alt = bases.names[this.id]) : (c = document.createElement("img"), c.style.display = "none", c.alt = bases.names[this.id], d = document.createElement("span"), d.className += " elementLoadingImage");
    var e = document.createElement("div");
    return e.setAttribute("class", "elementName"), e.textContent = bases.names[this.id], d && b.appendChild(d), b.appendChild(c), b.appendChild(e), b
}, LibraryBox.prototype.init = function() {
    this.$el = $(library.elContainter.appendChild(this.createElement())), this.$el.data("ptr", this), this.initDraggable()
}, LibraryBox.prototype.initDraggable = function() {
    var a = this;
    this.draggable = new Draggable(this.$el[0], {
        zIndex: 1e3,
        initialZIndex: 100,
        handle: bases.imagesLoaded ? "img" : "span, img",
        helper: function() {
            return document.getElementById("workspace").appendChild(a.createElement(!0))
        }
    }), this.$el.on("dragStart", function(b) {
        $(document).trigger("libraryBoxDraggingStart", [a.id]), iscrollLibrary && iscrollLibrary.disable()
    }), this.$el.on("dragEnd", function(a, b) {
        b.isOver || (new WorkspaceBox(b.helper), $(document).trigger("elementDropped")), iscrollLibrary && (iscrollLibrary.initiated = !1, iscrollLibrary.enable())
    })
}, LibraryBox.prototype.initEvents = function() {
    var a = this,
        b = a.$el.find("img");
    b.on("mousedown", function(b) {
        3 === b.which && $(document).trigger("showElementInfo", [b, a])
    }), b.on("gesturelongpress", function(b) {
        $(document).trigger("showElementInfo", [b, a])
    })
};
var workspace = {
    init: function() {
        workspace.el = document.getElementById("workspace"), workspace.$el = $(workspace.el), workspace.loadFromStorage(), $("#clearWorkspace").on("click", workspace.clear), $(document).on("cloneWorkspaceBox", function(a, b, c) {
            workspace.clone(b, c)
        }), $(document).on("imagesLoaded", function() {
            workspace.reloadImages()
        }), $(document).on("namesLoaded", workspace.reloadNames), $(document).on("draggableDroppedFix", function(a, b) {
            new WorkspaceBox(b.helper)
        }), window.addEventListener("orientationchange", workspace.recalculateElements, !1), window.addEventListener("resize", workspace.hideUnderLibrary, !1), window.addEventListener("beforeunload", workspace.save, !1)
    },
    add: function(a, b, c) {
        return new WorkspaceBox(a, b, c)
    },
    clone: function(a, b) {
        var c = new WorkspaceBox(b.id, b.$el.position()),
            d = document.createEvent("MouseEvents");
        d.initMouseEvent("mousedown", !0, !0, window, 1, a.pageX, a.pageY, a.pageX, a.pageY, !1, !1, !1, !1, 0, null), c.$el[0].dispatchEvent(d), c.droppable.startListeningToDrag(b.draggable)
    },
    clear: function() {
        settings.data.markFinalElements && workspace.$el.find(".finalElement").length > 0 ? elements = workspace.$el.find(".finalElement") : elements = workspace.$el.find(".element"), workspace.clearSpecified(elements), $(document).trigger("workspaceCleared")
    },
    clearSpecified: function(a) {
        for (var b, c, d = 0, e = a.length; d < e; d++) b = $(a[d]), c = b.data("ptr"), c && (c.droppable && c.droppable.destroy(), c.draggable && c.draggable.destroy(), c.draggable = null, c.droppable = null), b.find("img").off(), b.data("ptr", null).off().remove()
    },
    del: function(a) {
        a.$el[0].style.display = "none", $(document).off(gestures.startEvents.join(" ")), $(a.$el).off(gestures.startEvents.join(" ")), a.droppable && a.droppable.destroy(), a.draggable && a.draggable.destroy(), a.draggable = null, a.droppable = null, a.$el.find("img").off(), a.$el.data("ptr", null).off().remove(), a = null
    },
    reloadImages: function() {
        for (var a, b = workspace.el.getElementsByClassName("element"), c = 0; c < b.length; c++) a = b[c].firstChild, a.src = "data:image/png;base64," + bases.images[b[c].getAttribute("data-elementId")]
    },
    reloadNames: function() {
        for (var a, b, c = workspace.el.getElementsByClassName("element"), d = 0; d < c.length; d++) a = $(c[d]), b = a.find("div"), b[0].innerHTML = bases.names[a.attr("data-elementId")]
    },
    sex: function(a) {
        var b, c, d, e, f = [],
            g = Object.keys(bases.base);
        for (b = 0, c = g.length; b < c; b++)
            for (e = workspace.ifSex(a, g[b]), d = 0; d < e; d++) f.push(parseInt(g[b], 10));
        return f
    },
    ifSex: function(a, b) {
        var c, d = 0;
        if (bases.base[b].hasOwnProperty("parents"))
            for (c = 0; c < bases.base[b].parents.length; c++) Math.min(a[0], a[1]) === Math.min(bases.base[b].parents[c][0], bases.base[b].parents[c][1]) && Math.max(a[0], a[1]) === Math.max(bases.base[b].parents[c][0], bases.base[b].parents[c][1]) && (d += 1);
        return d
    },
    calculateOffspringPosition: function(a, b, c) {
        var d, e = function(c) {
                var d = (a[0].top - a[1].top) / (a[0].left - a[1].left),
                    e = .35 * b,
                    f = {
                        x: (a[0].left + a[1].left) / 2,
                        y: (a[0].top + a[1].top) / 2
                    },
                    g = f.x + Math.cos(Math.atan(-1 / d)) * c * e,
                    h = f.y + Math.sin(Math.atan(-1 / d)) * c * e;
                return {
                    top: h,
                    left: g
                }
            },
            f = [],
            g = Math.floor(c / 2);
        for (d = -g; d <= g; d++)(0 !== d || c % 2) && f.push(e(d));
        return f
    },
    alreadyCombined: function(a) {
        return !!settings.data.checkAlreadyCombined && !game.checkIfNotAlreadyDone(a)
    },
    hideUnderLibrary: function() {
        for (var a = workspace.$el.find(".element"), b = workspace.$el.width() - $("#side").width(), c = $(".element").width(), d = 0; d < a.length; d++) {
            var e = $(a[d]);
            e.offset().left + c / 2 > b ? (a[d].style.visibility = "hidden", e.data("ptr").droppable.enabled = !1) : "hidden" === a[d].style.visibility && (a[d].style.visibility = "visible", e.data("ptr").droppable.enabled = !0)
        }
    },
    recalculateElements: function() {
        for (var a, b = workspace.$el.find(".element"), c = workspace.$el.width(), d = $(".element").width(), a = 0; a < b.length; a++) {
            var e = $(b.get(a));
            e.offset().left + d > c && workspace.del(e.data("ptr"))
        }
    },
    save: function() {
        if (settings.data.saveElementsPositions) {
            var a = stats.getElementsPositions();
            storage.setElementPositions(a)
        }
    },
    loadFromStorage: function() {
        if (settings.data.saveElementsPositions) {
            var a = storage.getElementPositions();
            if (null !== a)
                for (var b = 0, c = a.length; b < c; b++) game.progress.indexOf(a[b].id) === -1 && game.prime.indexOf(a[b].id) === -1 || workspace.add(a[b].id, a[b].position)
        }
    },
    elementsNamesVisibility: function() {
        for (var a, b = workspace.$el.find(".element"), c = null, d = 0, e = b.length; d < e; d++) a = $(b[d]), c = a.data("ptr"), settings.data.hideElementsNames ? (c.hideElementName(), a.find(".elementName")[0].style.opacity = 0) : (c.removeHideElementName(), a.find(".elementName")[0].style.opacity = 1)
    }
};
WorkspaceBox.prototype.createElement = function(a) {
    var b = document.createElement("div");
    b.setAttribute("class", "element"), b.setAttribute("data-elementType", "workspaceBox"), b.setAttribute("data-elementId", this.id), b.style.cssText = "position: absolute; left:" + a.left + "px; top:" + a.top + "px;";
    var c = document.createElement("img");
    c.style.opacity = 0, bases.imagesLoaded ? c.src = "data:image/png;base64," + bases.images[this.id] : c.src = "data:image/png;base64," + library.loadingImage, c.alt = bases.names[this.id], c.onload = function() {
        this.style.opacity = 1, c.onload = null
    };
    var d = document.createElement("div");
    return d.setAttribute("class", "elementName"), d.textContent = bases.names[this.id], settings.data.hideElementsNames && (d.style.opacity = 0), b.appendChild(c), b.appendChild(d), b
}, WorkspaceBox.prototype.changeType = function() {
    this.$el[0].setAttribute("data-elementType", "workspaceBox"), settings.data.hideElementsNames && (this.$el.find(".elementName")[0].style.opacity = 0)
}, WorkspaceBox.prototype.init = function(a) {
    this.$el.data("ptr", this), game.finalElements.indexOf(this.id) !== -1 && settings.data.markFinalElements && (this.$el[0].className += " finalElement"), this.$el[0].style.zIndex = a ? a : "100", bases.base[this.id].hasOwnProperty("hidden") && (this.$el[0].className += " hiddenElement"), this.initDraggable(), this.initDroppable(), settings.data.hideElementsNames && this.hideElementName()
}, WorkspaceBox.prototype.initDraggable = function() {
    var a = this;
    this.draggable = new Draggable(this.$el[0], {
        handle: "img",
        zIndex: 1e3,
        initialZIndex: 100
    }), this.$el.on("dragStart", function(b) {
        settings.data.hideElementsNames && (a.$el.find(".elementName")[0].style.opacity = 1, a.removeHideElementName()), $(document).trigger("workspaceBoxDraggingStart"), a.$el[0].parentNode.appendChild(a.$el[0])
    }), this.$el.on("dragEnd", function(b, c) {
        var d = c.size.width / 2,
            e = c.size.height / 2;
        return c.position.left < -d || c.position.left > workspace.$el.width() + d || c.position.top < -e || c.position.top > workspace.$el.height() - e ? void workspace.del(a) : (settings.data.hideElementsNames && (a.hideElementName(), a.$el.find(".elementName")[0].style.opacity = 0), void $(document).trigger("elementDropped"))
    })
}, WorkspaceBox.prototype.initDroppable = function() {
    var a = this;
    this.droppable = new Droppable(this.$el[0], {
        acceptOne: !0
    }), this.$el.on("droppableOver", function(b, c) {
        a.onOver()
    }), this.$el.on("droppableOut", function(b, c) {
        a.onOut()
    }), this.$el.on("droppableDrop", function(b, c) {
        a.onOut();
        var d = c.element.getAttribute("data-elementid"),
            e = [Math.min(d, a.id), Math.max(d, a.id)],
            f = workspace.sex(e);
        if (f.length > 0 && !workspace.alreadyCombined(e)) {
            var g = workspace.calculateOffspringPosition([{
                left: c.position.x,
                top: c.position.y
            }, a.$el.position()], a.$el.width(), f.length);
            for (i = 0; i < f.length; i++) game.checkIfFinal(f[i]) && game.finalElements.push(f[i]), workspace.add(f[i], g[i]);
            workspace.del(a), "workspaceBox" === c.element.getAttribute("data-elementType") ? workspace.del($(c.element).data("ptr")) : $(c.helper).off().remove(), $(document).trigger("childCreated", [f, e])
        } else "libraryBox" === c.element.getAttribute("data-elementType") ? (new WorkspaceBox(c.helper), workspace.alreadyCombined(e) || $(document).trigger("childCreationFail", [e])) : workspace.alreadyCombined(e) || $(document).trigger("childCreationFail", [e])
    })
}, WorkspaceBox.prototype.hideElementName = function() {
    for (var a = workspace.el.getElementsByClassName("elementName"), b = 0; b < a.length; b++) a[b].className = a[b].className.replace(" noTransition", "");
    var c = this;
    this.$el.on("mouseenter", function() {
        settings.data.hideElementsNames && (c.$el.find(".elementName")[0].style.opacity = 1)
    }), this.$el.on("mouseleave", function() {
        settings.data.hideElementsNames && (c.$el.find(".elementName")[0].style.opacity = 0)
    })
}, WorkspaceBox.prototype.removeHideElementName = function() {
    this.$el.off("mouseenter"), this.$el.off("mouseleave");
    for (var a = workspace.el.getElementsByClassName("elementName"), b = 0; b < a.length; b++) a[b].className += " noTransition"
}, WorkspaceBox.prototype.onOver = function() {
    this.$el[0].style.opacity = .5, settings.data.hideElementsNames && (this.$el.find(".elementName")[0].style.opacity = 1)
}, WorkspaceBox.prototype.onOut = function() {
    this.$el[0].style.opacity = 1, settings.data.hideElementsNames && (this.$el.find(".elementName")[0].style.opacity = 0)
}, WorkspaceBox.prototype.onSex = function() {}, WorkspaceBox.prototype.onAlreadyCombined = function() {}, WorkspaceBox.prototype.initEvents = function() {
    var a = this,
        b = this.$el.find("img");
    b.dblclick(function(a) {
        a.preventDefault()
    });
    var c = 1e3,
        d = 0,
        e = null,
        f = null;
    b.on(gestures.startEvents.join(" "), function(g) {
        if (!("mousedown" === g.type && 1 !== g.which || null !== f && f !== a)) {
            if (f = a, clearTimeout(e), e = setTimeout(function() {
                    d = 0, f = null
                }, c), 1 === d) return void b.on(gestures.events[g.type][0], function(c) {
                1 === d && (d = 0, f = null, b.off(gestures.events[g.type][0]), $(document).trigger("cloneWorkspaceBox", [c, a]))
            });
            b.on(gestures.events[g.type][0], function(a) {
                d = 0, f = null, clearTimeout(e), b.off(a.type)
            }), b.on(gestures.events[g.type][1], function() {
                b.off(gestures.events[g.type][0])
            }), $(document).on(gestures.startEvents.join(" "), function(a) {
                a.target !== b[0] && (d = 0, f = null, clearTimeout(e), $(document).off(gestures.startEvents.join(" ")))
            }), d++
        }
    }), b.on("mousedown", function(b) {
        3 === b.which && $(document).trigger("showElementInfo", [b, a])
    }), b.on("gesturelongpress", function(b) {
        $(document).trigger("showElementInfo", [b, a])
    })
};
var iscrollLibrary, iscrollAlphabeth;
loadingScreen.init(), $(document).ready(function() {
    game.checkOnline(), gestures.init(), settings.init(), localization.init(), bases.load(), storage.init(), templates.init(), update.init(), GoogleAPI.init(), $(document).on("basesLoaded", function() {
        game.init(), search.init(), workspace.init(), library.init(), "undefined" != typeof IScroll ? window.initIScroll() : $(document).one("IScrollLoaded", window.initIScroll), loading.init()
    }), window.onresize = function() {
        "undefined" != typeof iscrollAlphabeth && "undefined" != typeof iscrollLibrary && (iscrollAlphabeth.refresh(), iscrollLibrary.refresh()), library.elementOuterHeight = $("#library > .element").outerHeight()
    }
}), window.onerror = game.reportError, GAPILoaded = function() {
    $(document).trigger("GAPILoaded")
}, document.addEventListener("touchmove", function(a) {
    a.preventDefault()
}, !1), document.oncontextmenu = function(a) {
    return !1
};
var initIScroll = function() {
    iscrollLibrary = new IScroll("#outerLibrary", {
        mouseWheel: !0
    }), iscrollLibrary.refresh(), iscrollLibrary.on("scrollStart", function() {
        $(document).trigger("libraryScrollStart")
    }), iscrollAlphabeth = new IScroll("#alphabet", {
        mouseWheel: !0,
        click: !0
    }), $(document).trigger("iscrollInitiated")
};
window.addEventListener("orientationchange", function() {
    document.body.scrollTop = 0
}, !1);
