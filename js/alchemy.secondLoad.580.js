function ElementInfoBox(a,b,c,d){this.id=a,this.init(b,c),this.initEvents(d)}var sharing={url:"http://littlealchemy.com/share/",initiated:!1,types:{element:{data:function(a){return sharing.hashData({type:"element",elementId:a,elementName:bases.names[a]})}},progress:{data:function(){return sharing.hashData({type:"progress",progress:game.progress.length+game.prime.length})}},screenshot:{data:function(a){return sharing.hashData({type:"screenshot",screenshot:a})}}},initElement:function(a){var b=a.find(".shareButton");b[0].href=sharing.getUrl("element",b[0].getAttribute("data-elementid"))},initProgress:function(){var a=document.getElementById("progressShareButton");a.href=sharing.getUrl("progress"),$(document).on("newChildCreated",function(){a.href=sharing.getUrl("progress")})},init:function(){return!sharing.initiated&&(sharing.initiated=!0,$("#getScreenshot").on("click",sharing.getScreenshot),$("#screenshotIcon").on("click",function(){$("#screenshotLinks").hide(),$("#screenshotWaitText").show(),html2canvas(document.body,{onrendered:function(a){sharing.uploadScreenshot(a.toDataURL().replace("data:image/png;base64,",""))}})}),game.progress&&sharing.initProgress(),void $(document).on("progressInitiated resetProgress",sharing.initProgress))},getScreenshot:function(){$("#panel").hide(),$("#screenshotLinks").hide(),$("#screenshotWaitText").show(),html2canvas(document.body,{onrendered:function(a){$("#panel").show();var b=a.toDataURL();sharing.uploadScreenshot(b.replace("data:image/png;base64,",""))}})},uploadScreenshot:function(a){$.ajax({method:"POST",url:"php/uploadScreenshot.php",data:{image:a}}).done(function(a){var b=JSON.parse(a);sharing.showScreenshotUrls(b.data.link)}).fail(function(a,b,c){console.log(b,c)})},showScreenshotUrls:function(a){$("#screenshotWaitText").hide(),$("#screenshotLinks").show(),$("#screenshotUrl").attr("href",a);var b=document.getElementById("screenshotSharingButton");b.href=sharing.getUrl("screenshot",a),b.style.display="block",iscrollMenu.refresh()},getUrl:function(a,b){return sharing.url+a[0]+"/s/"+sharing.types[a].data(b)},hashData:function(a){return window.btoa(encodeURIComponent(JSON.stringify(a)))}};sharing.init();var elementInfo={constants:{WIDTH:235,DISTANCE_TO_ELEMENT:10,TIME_TO_FADE_OUT:5e3,FADE_OUT_TIME:1500},init:function(){$(document).on("showElementInfo",function(a,b,c){var d,e="libraryBox"===c.$el.attr("data-elementType"),f=c.$el.offset(),g={width:c.$el.outerWidth(),height:c.$el.outerHeight()},h={width:$("#workspace").outerWidth(),height:$("#workspace").outerHeight()},i={},j=$(".elementInfoBox[data-elementId="+c.id+"]");for(d=0;d<j.length;d++)if($(j[d]).data("parent")===c.$el){var k=$(j[d]);return k.stop().css("opacity","1"),setTimeout(function(){k.fadeOut(elementInfo.constants.FADE_OUT_TIME,function(){k.off().remove()})},elementInfo.constants.TIME_TO_FADE_OUT),!1}var l=new ElementInfoBox(c.id,b,c.$el,e);i.top=f.top-l.height-elementInfo.constants.DISTANCE_TO_ELEMENT,i.left=f.left-l.width-elementInfo.constants.DISTANCE_TO_ELEMENT,i.left<0&&(i.left=0),i.top<0&&(i.top=f.top+g.height+elementInfo.constants.DISTANCE_TO_ELEMENT),i.top+l.height>h.height&&(f.top>h.height-f.top-g.height?i.top=0:i.top=h.height-l.height),"libraryBox"===c.$el.attr("data-elementType")&&(i.left=f.left),i.left+l.width>h.width&&(i.left=h.width-l.width),l.$el.css({width:l.width-l.paddingLR+"px","z-index":"1000",top:i.top+"px",left:i.left+"px"}),iscrollLibrary&&(iscrollLibrary.initiated=!1)}),$(document).on("libraryBoxDraggingStart",function(a){$(".elementInfoBox").off().remove()}),$(document).on("workspaceBoxDraggingStart",function(a){$(".elementInfoBox").off().remove()})},getElementInfoData:function(a){var b,c=0,d=[],e=!1;if(bases.base[a].hasOwnProperty("parents"))for(c=bases.base[a].parents.length,b=0;b<bases.base[a].parents.length;b++)game.checkIfNotAlreadyDone(bases.base[a].parents[b])||(c--,d.push({names:[bases.names[bases.base[a].parents[b][0]],bases.names[bases.base[a].parents[b][1]]],id:[bases.base[a].parents[b][0],bases.base[a].parents[b][1]]}));return 0==d.length&&(d=localization.get("elementInfo-itIsAsItIs")),GoogleAPI.logged&&(e=!0),{id:a,name:bases.names[a],parents:d,combinationsLeft:c,loggedIn:e}}};ElementInfoBox.prototype.init=function(a,b){var c=this,d=document.createElement("div");d.setAttribute("class","elementInfoBox"),d.setAttribute("data-elementId",this.id),this.$el=$(document.getElementById("workspace").appendChild(d)),this.$el.data("parent",b),this.$el.html(templateEngine(templates.list.elementInfo,elementInfo.getElementInfoData(this.id))),this.height=this.$el.outerHeight(),this.width=elementInfo.constants.WIDTH,this.paddingLR=parseInt(this.$el.css("padding-left"))+parseInt(this.$el.css("padding-right")),"mousedown"!==a.type?$(a.target).on("touchend pointerup MSPointerUp",function(){c.timer=setTimeout(function(){c.fadeOut()},elementInfo.constants.TIME_TO_FADE_OUT)}):this.timer=setTimeout(function(){c.fadeOut()},elementInfo.constants.TIME_TO_FADE_OUT),sharing.initElement(this.$el)},ElementInfoBox.prototype.initEvents=function(a){var b=this;a&&$(document).one("libraryScrollStart",function(){window.clearTimeout(b.timer),null!==b.$el&&b.$el.hide().off().remove()});var c=function(a){"mousedown"===a.type&&1!==a.which||"elementInfoBox"!==a.target.className&&"elementInfoBox"!==a.target.parentNode.className&&(window.clearTimeout(b.timer),null!==b.$el&&b.$el.hide().off().remove(),$(document).off(gestures.startEvents.join(" "),c))};$(document).on(gestures.startEvents.join(" "),c);var d=gestures.startEvents.join(" ").replace("mousedown","");this.$el.find(".close").on("click "+d,function(){window.clearTimeout(b.timer),b.$el.hide().off().remove()}),this.$el.on("mouseenter",function(){window.clearTimeout(b.timer),b.$el.stop().css("opacity","1")}),this.$el.on("mouseleave",function(){b.timer=setTimeout(function(){b.fadeOut()},elementInfo.constants.TIME_TO_FADE_OUT)}),this.$el.on(d,function(a){window.clearTimeout(b.timer),b.$el.stop().css("opacity","1.0"),b.$el.on(gestures.events[a.type][1],function(a){b.timer=setTimeout(function(){b.$el.fadeOut(elementInfo.constants.FADE_OUT_TIME,function(){b.$el.off().remove(),b.$el=null})},elementInfo.constants.TIME_TO_FADE_OUT)})})},ElementInfoBox.prototype.fadeOut=function(){var a=this;null!==a.$el&&a.$el.fadeOut(elementInfo.constants.FADE_OUT_TIME,function(){null!==a.$el&&a.$el.off().remove(),a.$el=null})},elementInfo.init();var broadcast={DISPLAY_TIME:20,currentIndex:0,timer:{timer:null,start:0,remaining:0},init:function(){broadcast.$el=$("#broadcast"),broadcast.$controls=broadcast.$el.find(".controls"),broadcast.$content=broadcast.$el.find(".content"),broadcast.loadResources(),broadcast.initEvents(),broadcast.$controls.hide(),broadcast.onresize()},initEvents:function(){broadcast.$el.on("mouseenter",function(){broadcast.timer.remaining-=(new Date).getTime()-broadcast.timer.start,clearTimeout(broadcast.timer.timer)}),broadcast.$el.on("mouseleave",function(){broadcast.timer.timer=setTimeout(broadcast.showNext,broadcast.timer.remaining),broadcast.timer.start=(new Date).getTime()}),$(document).on("languageChanged",broadcast.loadResources),$(window).on("resize",broadcast.onresize)},show:function(){broadcast.$content.empty().append(broadcast.data[broadcast.currentIndex]),broadcast.timer.timer=setTimeout(broadcast.showNext,1e3*broadcast.DISPLAY_TIME),broadcast.timer.start=(new Date).getTime(),broadcast.timer.remaining=1e3*broadcast.DISPLAY_TIME},showNext:function(){broadcast.currentIndex+=1,broadcast.currentIndex==broadcast.data.length&&(broadcast.currentIndex=0),broadcast.show()},showPrev:function(){broadcast.currentIndex-=1,broadcast.currentIndex==-1&&(broadcast.currentIndex=broadcast.data.length-1),broadcast.show()},loadResources:function(){$.getJSON(localization.getURL("broadcast.580.json"),function(a){broadcast.data=a.data,null!==broadcast.timer.timer&&window.clearTimeout(broadcast.timer.timer),broadcast.show()})},onresize:function(){broadcast.$el.css("max-width",$("#toggleFullscreen").offset().right-broadcast.$el.offset().right-10)}};broadcast.init();var notifications={shown:[],DISPLAY_TIME:10,PRIORITY_ALWAYS_SHOW:5,init:function(){notifications.queue=[],notifications.waiting=[],notifications.toShow=[],notifications.alreadyShowing="",notifications.waitingTimer=null,notifications.$box=$("#notificationBox"),notifications.$boxContent=notifications.$box.find(".content"),notifications.loadTemplates(),notifications.loadData(),$(document).one("progressInitiated",notifications.loadData),$(document).on("statsDataUpdated",function(){notifications.checkConditions(),notifications.queue.length>0&&notifications.prepareToShow(),notifications.toShow.length>0&&notifications.showOnBoard()}),notifications.initEvents()},loadData:function(){"undefined"!=typeof notificationsData&&"undefined"==typeof notifications.data&&(notifications.data=notificationsData)},initEvents:function(){$(document).on("languageChanged",function(){notifications.loadTemplates()}),$(document).on("achievementEarned",function(a,b){var c=localization.get("achievements-"+b);notifications.showSpecified(templates.list.achievement,{title:c.title,description:c.earned})}),notifications.$box.find(".close").on("click",function(){notifications.hideOnBoard()})},checkConditions:function(){notifications.queue=[];for(var a in notifications.data)notifications.data[a].hasOwnProperty("isGroup")?notifications.checkGroup(a):notifications.data[a].check()&&notifications.queue.push({name:a,priority:notifications.data[a].priority})},checkGroup:function(a){if(notifications.alreadyShowing===a)return!1;if(notifications.data[a].hasOwnProperty("isBlocked")&&notifications.data[a].isBlocked())return!1;for(var b=0;b<notifications.waiting.length;b++)if(notifications.waiting[b].group===a)return!1;for(var c in notifications.data[a].list)if(notifications.data[a].check(notifications.data[a].list[c])&&(notifications.queue.push({group:a,name:c,priority:notifications.data[a].priority}),notifications.data[a].hasOwnProperty("isBlocked")&&(notifications.data[a].blocker=c),notifications.data[a].hasOwnProperty("selfBlocking")))break},prepareToShow:function(){if(notifications.queue.sort(function(a,b){return a.priority>b.priority?1:a.priority<b.priority?-1:0}),notifications.prepareQueue(),notifications.queue.length>0){i=0;do notifications.waiting.unshift(notifications.queue[i]),notifications.waiting[0].timestamp=(new Date).getTime(),i++;while(notifications.queue[i]&&notifications.queue[i].priority>notifications.PRIORITY_ALWAYS_SHOW)}notifications.checkWaiting()},prepareQueue:function(){notifications.queue=notifications.queue.filter(function(a,b){return notifications.queue.indexOf(a)==b});var a,b,c,d;for(b=0;b<notifications.queue.length;)if(notifications.queue[b].hasOwnProperty("group"))b++;else{for(a=notifications.queue[b].name,d=[],c=b+1;c<notifications.queue.length;c++)a!==notifications.queue[c].name&&notifications.data[a].blocker.indexOf(notifications.queue[c].name)==-1||d.push(c);for(c=0;c<notifications.toShow.length;c++)if(a===notifications.toShow[c].name||notifications.data[a].blocker.indexOf(notifications.toShow[c].name)!=-1){d.push(b);break}for(notifications.alreadyShowing!==a&&notifications.data[a].blocker.indexOf(notifications.alreadyShowing)==-1||d.push(b),d=d.filter(function(a,b){return d.indexOf(a)==b}),d.indexOf(b)===-1&&b++,c=d.length-1;c>=0;c--)notifications.queue.splice(d[c],1)}},checkWaiting:function(){for(var a,b=function(a){return!isNaN(parseFloat(a))&&isFinite(a)},c=[],d=(new Date).getTime(),e=0;e<notifications.waiting.length;e++)if(a=notifications.waiting[e].hasOwnProperty("group")?notifications.waiting[e].group:notifications.waiting[e].name,notifications.data[a].hasOwnProperty("delay"))if(b(notifications.data[a].delay))d>=notifications.waiting[e].timestamp+1e3*notifications.data[a].delay&&(notifications.toShow.push(notifications.waiting[e]),c.push(e));else{var f=notifications.data[a].delay(notifications.waiting[e]);f&&!b(f)?(notifications.toShow.push(notifications.waiting[e]),c.push(e)):b(f)&&(notifications.waiting[e].timestamp=d)}else notifications.toShow.push(notifications.waiting[e]),c.push(e);for(var g=c.length-1;g>=0;g--)notifications.waiting.splice(c[g],1);0===notifications.waiting.length?(window.clearInterval(notifications.waitingTimer),notifications.waitingTimer=null):notifications.setCheckingWaiting(),notifications.toShow.length>0&&notifications.showOnBoard()},setCheckingWaiting:function(){null===notifications.waitingTimer&&(notifications.waitingTimer=window.setInterval(notifications.checkWaiting,1e3))},showOnBoard:function(){""!==notifications.alreadyShowing||settings.data.turnOffNotifications||(notifications.showNext(),notifications.$box.removeClass("hide").addClass("show"),notifications.data.hasOwnProperty(notifications.alreadyShowing)&&notifications.data[notifications.alreadyShowing].hasOwnProperty("onShow")&&notifications.data[notifications.alreadyShowing].onShow())},showNext:function(){if(notifications.toShow.length>0){notifications.$boxContent.empty();var a,b,c,d=notifications.toShow.shift();notifications.alreadyShowing=d.hasOwnProperty("group")?d.group:d.name,d.hasOwnProperty("group")?(a=notifications.templates[notifications.data[d.group].template],b=notifications.data[d.group].passData(notifications.data[d.group].list[d.name]),c=notifications.data[d.group].hasOwnProperty("duration")?notifications.data[d.group].duration:notifications.DISPLAY_TIME):(a=notifications.data[d.name].hasOwnProperty("template")?notifications.templates[notifications.data[d.name].template]:notifications.templates[d.name],notifications.data[d.name].hasOwnProperty("passData")&&(b=notifications.data[d.name].passData()),c=notifications.data[d.name].hasOwnProperty("duration")?notifications.data[d.name].duration:notifications.DISPLAY_TIME),notifications.$boxContent.append(templateEngine(a,b)),notifications.boxTimer=setTimeout(notifications.showNextCallback,1e3*c),d.hasOwnProperty("group")?notifications.data[d.group].hasOwnProperty("once")&&notifications.shown.indexOf(d.group+"."+d.name)===-1&&notifications.shown.push(d.group+"."+d.name):notifications.data[d.name].hasOwnProperty("once")&&notifications.shown.indexOf(d.name)===-1&&(notifications.shown.push(d.name),delete notifications.data[d.name]),storage.updateNotifications()}},showNextCallback:function(){var a=!!window.getStyleProperty("transition"),b=function(){notifications.toShow.length>0?(notifications.showNext(),notifications.$box.removeClass("hide").addClass("show")):notifications.hideOnBoard(),notifications.$box.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",b)};notifications.$box.removeClass("show").addClass("hide"),notifications.data.hasOwnProperty(notifications.alreadyShowing)&&notifications.data[notifications.alreadyShowing].hasOwnProperty("onHide")&&notifications.data[notifications.alreadyShowing].onHide(),a?notifications.$box.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",b):b()},showSpecified:function(a,b,c){var d=c||notifications.DISPLAY_TIME;notifications.$boxContent.empty().append(templateEngine(a,b)),notifications.$box.removeClass("hide").addClass("show"),notifications.boxTimer=setTimeout(notifications.hideOnBoard,1e3*d)},hideOnBoard:function(){notifications.$box.is(":visible")&&(notifications.$box.removeClass("show").addClass("hide"),notifications.$boxContent.empty(),notifications.toShow=[],notifications.alreadyShowing="",clearTimeout(notifications.boxTimer))},loadTemplates:function(){notifications.templates={};var a=localization.getURL("notifications.html");$.get(loading.getURL(a),function(b,c,d){loading.analyzeModificationDate(a,d.getResponseHeader("Last-Modified"));var e=$(b);for(var f in notifications.data)notifications.templates.hasOwnProperty(f)||(notifications.data[f].hasOwnProperty("template")?notifications.templates[notifications.data[f].template]=e.filter("#"+notifications.data[f].template).html():notifications.templates[f]=e.filter("#"+f).html())}).then(function(){$(document).trigger("notificationsLoaded")})},removeAlreadyShown:function(){notifications.shown=storage.getNotifications();for(var a=0;a<notifications.shown.length;a++)notifications.shown[a].indexOf(".")!==-1?delete notifications.data[notifications.shown[a].split(".")[0]].list[notifications.shown[a].split(".")[1]]:delete notifications.data[notifications.shown[a]]}};notifications.init();var leaderboard={boardIDs:{progress:"CgkIz_OApZAJEAIQAQ",connections:"CgkIz_OApZAJEAIQBg"},scores:{},init:function(){$(document).on("newChildCreated",function(){GoogleAPI.logged&&leaderboard.submitScore("progress",game.progress.length+game.prime.length)}),$(document).on("updateHistory",function(){GoogleAPI.logged&&leaderboard.submitScore("connections",game.history.parents.length)}),$(document).on("leaderboardsTabShown",function(){document.getElementById("leaderboard").style.display="none",document.getElementById("leaderboardWaitText").style.display="block",leaderboard.getScores("progress",function(){$("#leaderboard").html(templateEngine(templates.list.leaderboards,leaderboard.scores.progress)),document.getElementById("leaderboard").style.display="block",document.getElementById("leaderboardWaitText").style.display="none",window.setTimeout(function(){menu.refreshIScroll()},100)},"SOCIAL")})},submitScore:function(a,b){if("undefined"==typeof gapi.client.games)return!1;var c=gapi.client.games.scores.submit({leaderboardId:leaderboard.boardIDs[a],score:b});c.execute(function(a){})},submitMultipleScores:function(a){var b={kind:"games#playerScoreSubmissionList",scores:[]};for(var c in a)leaderboard.boardIDs.hasOwnProperty(c)&&b.scores.push({kind:"games#scoreSubmission",leaderboardId:leaderboard.boardIDs[c],score:a[c]});var d=gapi.client.games.scores.submitMultiple(b);d.execute(function(a){})},getScores:function(a,b,c){var d=c||"PUBLIC";if(GoogleAPI.logged&&leaderboard.boardIDs.hasOwnProperty(a)){var e=gapi.client.games.scores.list({collection:d,leaderboardId:leaderboard.boardIDs[a],timeSpan:"ALL_TIME"});e.execute(function(c){c.hasOwnProperty("error")?401===c.code&&$(document).trigger("unauthorized"):(leaderboard.parseResponse(a,c),b&&b())})}},showScores:function(a,b){var c=b||"PUBLIC";leaderboard.getScores(a,function(){$("#leaderboard").html(templateEngine(templates.list.leaderboards,{players:leaderboard.scores[a].list}))},c)},parseResponse:function(a,b){if(leaderboard.scores[a]={},b.hasOwnProperty("playerScore")?leaderboard.scores[a].player={id:b.playerScore.player.playerId,name:b.playerScore.player.displayName,avatar:b.playerScore.player.avatarImageUrl,score:b.playerScore.scoreValue,rank:b.playerScore.scoreRank,timeStamp:b.playerScore.writeTimestampMillis}:leaderboard.scores[a].player={id:-1},b.hasOwnProperty("items")){leaderboard.scores[a].list=[];for(var c=0,d=b.items.length;c<d;c++)leaderboard.scores[a].list.push({id:b.items[c].player.playerId,name:b.items[c].player.displayName,avatar:b.items[c].player.hasOwnProperty("avatarImageUrl")?b.items[c].player.avatarImageUrl:"img/achievement-earned-placeholder.png",score:b.items[c].scoreValue,rank:b.items[c].scoreRank,timeStamp:b.items[c].writeTimestampMillis})}}};leaderboard.init();var achievements={earnedList:[],playerList:{},init:function(){achievements.earnedList=storage.getAchievements(),achievements.loadData(),achievements.checked=!1,bases&&bases.loaded&&"undefined"!=typeof achievements.data?(achievements.initialCheck(),achievements.initConditionsEvents()):$(document).one("progressInitiated",function(){achievements.loadData(),achievements.initialCheck(),achievements.initConditionsEvents()}),$(document).on("achievementsTabShown",function(){$("#achievementsList").html(templateEngine(templates.list.achievements,{achievements:achievements.getDataToShow()}))}),$(document).on("GAPIclientLoaded loggedIn",function(){GoogleAPI.logged&&!achievements.checked&&gapi.client.games&&(achievements.getPlayerList(),achievements.initConditionsEvents())}),$(document).on("loggedOut",function(){achievements.checked=!1}),$(document).on("historySynchronized",function(){"undefined"!=typeof achievements.data&&achievements.initialCheck()})},checkEarnedIntegrity:function(){for(var a=!1,b=achievements.earnedList.length-1;b>=0;b--){for(var c=0;c<achievements.data.length;c++)if(achievements.earnedList[b]===achievements.data[c].id){a=!0;break}a||achievements.earnedList.splice(b,1)}},loadData:function(){"undefined"!=typeof achievementsData&&"undefined"==typeof achievements.data&&(achievements.data=achievementsData,achievements.checkEarnedIntegrity())},initialCheck:function(){for(var a=0,b=achievements.data.length;a<b;a++)achievements.earnedList.indexOf(achievements.data[a].id)===-1&&achievements.data[a].hasOwnProperty("initCheck")&&achievements.data[a].initCheck()&&achievements.earnedList.push(achievements.data[a].id);$(document).trigger("updateAchievements")},initConditionsEvents:function(){for(var a=0,b=achievements.data.length;a<b;a++)!function(a){achievements.earnedList.indexOf(achievements.data[a].id)==-1&&$(document).on(achievements.data[a].events,function b(c,d){achievements.earnedList.indexOf(achievements.data[a].id)==-1&&(achievements.data[a].hasOwnProperty("check")&&!achievements.data[a].check(d)||(achievements.earn(achievements.data[a].id,{trigger:!0}),$(document).off(achievements.data[a].events,b)))})}(a)},earn:function(a,b){achievements.earnedList.push(a),achievements.unlock(achievements.getById(a).gapiId),$(document).trigger("updateAchievements"),$(document).trigger("achievementEarned",[a])},getByGapiId:function(a){for(var b=0;b<achievements.data.length;b++)if(a===achievements.data[b].gapiId)return achievements.data[b]},getById:function(a){for(var b=0;b<achievements.data.length;b++)if(a===achievements.data[b].id)return achievements.data[b]},getDataToShow:function(){for(var a,b,c={},d=[],e=0,f=achievements.data.length;e<f;e++)c=localization.get("achievements-"+achievements.data[e].id),b=achievements.earnedList.indexOf(achievements.data[e].id)!==-1,a=b?achievements.data[e].imageEarned:achievements.data[e].imageNotEarned,d.push({title:c.title,description:c.description,earned:b,image:a});return d},synchronize:function(){for(var a in achievements.playerList)"UNLOCKED"===achievements.playerList[a].achievementState&&achievements.earnedList.indexOf(achievements.getByGapiId(a).id)==-1&&achievements.earnedList.push(achievements.getByGapiId(a).id);$(document).trigger("updateAchievements");for(var a,b,c=0;c<achievements.earnedList.length;c++)b=achievements.getById(achievements.earnedList[c]),b&&b.hasOwnProperty("gapiId")&&(a=b.gapiId,a&&"UNLOCKED"!==achievements.playerList[a].achievementState&&achievements.unlock(a))},unlock:function(a){GoogleAPI.logged&&gapi.client.games&&(a.hasOwnProperty("incremental")?achievements.incrementRequest(a):achievements.unlockRequest(a))},unlockRequest:function(a){var b=gapi.client.games.achievements.unlock({achievementId:a});b.execute(function(a){})},incrementRequest:function(a){var b=gapi.client.games.achievements.increment({achievementId:a,stepsToIncrement:1});b.execute(function(b){achievements.playerList[a].currentSteps=b.currentSteps,b.newlyUnlocked&&(achievements.playerList[a].achievementState="UNLOCKED")})},getPlayerList:function(){var a=gapi.client.games.achievements.list({playerId:"me"});a.execute(function(a){if("games#playerAchievementListResponse"===a.kind&&a.hasOwnProperty("items")){for(var b=0,c=a.items.length;b<c;b++)delete a.items[b].kind,delete a.items[b].formattedCurrentStepsString,achievements.playerList[a.items[b].id]=a.items[b];achievements.synchronize(),achievements.checked=!0}})},reset:function(){achievements.earnedList=[],$(document).trigger("updateAchievements")}};achievements.init();
