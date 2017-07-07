var MY_ID = "";
var API_BASE = "https://discordapp.com/api";

/*May be changed with discord updates*/
var EMOJI_PICKER_PATH = "#app-mount > div > div:nth-child(7)";
/*May be changed with discord updates*/
var LOCAL_STORAGE_MODULE = 1646;

var ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap"><div class="scroller"></div></div>';

var ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">';

var ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>';
var ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>';
var ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>'; // max 10 per row

var servers = [];
var globalSharedEmojis = [];

var SCROLLER_WRAP = null;
var SCROLLER_WRAP_OLD = null;
var SEARCH_INPUT = null;

const REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/;
const CURRENT_SELECTED_CHANNEL_REGEX = /.*\/\d+\/(\d+)/;

function findReact(dom) {
    for (var key in dom) {
        if (key.startsWith("__reactInternalInstance$")) {
            return dom[key];
        }
    }
    return null;
};

function getSelectedMessageId() {
    try {
        return REACTION_POPOUT_REGEX.exec(
            findReact($(".btn-reaction.popout-open").parent().get(0))
            ._currentElement.props.children
            .filter(c => {
                return Object.keys(c.props).indexOf("subscribeTo") != -1;
            })[0].props.subscribeTo)[1];
    } catch (e) {
        return null;
    }
}

function getCurrentSelectedChannel() {
    return CURRENT_SELECTED_CHANNEL_REGEX.exec(window.location.pathname)[1];
}

function addCurrentMessageReaction(emoji) {
    return addMessageReaction(getCurrentSelectedChannel(), getSelectedMessageId(), emoji);
}

function addMessageReaction(channel, message, emoji) {
    $.ajax(API_BASE + "/channels/" + channel + "/messages/" + message + "/reactions/:" + emoji.name + ":" + emoji.id + "/@me", { method: "PUT" });
}


function replaceScroller() {
    SCROLLER_WRAP = buildScrollerWrap();
    SCROLLER_WRAP_OLD = $(EMOJI_PICKER_PATH).find(".scroller-wrap");
    SCROLLER_WRAP_OLD.hide().before(SCROLLER_WRAP);
}

function replaceSearchInput() {
    SEARCH_INPUT = buildSearchInput();
    $(EMOJI_PICKER_PATH).find("input").hide().before(SEARCH_INPUT);
}

function buildSearchInput() {
    var r = $(ELEMENT_SEARCH_INPUT);

    r.on('change keydown keyup paste', function() {
        if (r.val().replace(/\s+/g, '')) {
            SCROLLER_WRAP.find(".scroller").html(" ");
            SCROLLER_WRAP.find(".scroller").append(buildEmojisRows(filterEmojis(r.val())))
        } else {
            buildScrollerWrap();
        }
    });

    return r;
}

function buildSearchResult(query) {
    return buildEmojisRows(filterEmojis(query));
}

function filterEmojis(query) {
    var eL = getEmojisForServer(getCurrentServer());
    var r = [];

    for (var i in eL) {
        if (eL[i].name.indexOf(query) != -1) {
            r.push(eL[i]);
        }
    }

    return r;
}

function getEmojisForServer(server) {
    var e = []

    for (var i in servers) {

        if (!server.canUserSharedEmojis && servers[i].id !== server.id) {
            continue;
        }

        var eL = ((server.id === servers[i].id) ? servers[i].emojis : servers[i].sharedEmojis);
        for (var k in eL) {
            e.push(eL[k]);
        }
    }

    return e;
}

function buildScrollerWrap() {
    var s = SCROLLER_WRAP || $(ELEMENT_SCROLLER_WRAP);
    s.find(".scroller").html(" ");

    var c = getCurrentServer();
    // Append all current server emojis, if any
    if (c.emojis.length > 0)
        s.find(".scroller").append(buildServerSpan(c));

    // Append all other server shared emojis
    if (c.canUserSharedEmojis) {
        for (var i in servers) {
            if (!isCurrentSelectedServer(servers[i]) && servers[i].sharedEmojis.length > 0) {
                s.find(".scroller").append(buildServerSpan(servers[i]));
            }
        }
    }

    return s;
}

function getCurrentServer() {
    for (var i in servers) {
        if (isCurrentSelectedServer(servers[i])) {
            return servers[i]
        }
    }
    // will happen in private messages
    throw "Unknown server selected";
}

function isCurrentSelectedServer(server) {
    var currentServerId = /(\d+)/.exec($(".guild.selected").find(".guild-inner>a").attr("style"))[0];
    return (server.id + "") === currentServerId
}

function buildEmojisRows(eL) {
    var s = $("<span class=\"tl-emoji-list\"></span>");
    var r = $(ELEMENT_SERVER_EMOJI_LIST_ROW);
    var emojiClickHandler = $(".channel-textarea-emoji").hasClass("popout-open") ? putEmojiInTextarea : addCurrentMessageReaction;

    function emojiElement(emoji, cb) {
        return $(ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY)
            .css("background-image", "url(\"" + getEmojiUrl(emoji) + "\")")
            .click(function() {
                console.log("Selected emoji - " + emojiInTextarea(emoji));
            })
            .click(() => { cb(emoji) })
            .hover(function() {
                $(this).addClass("selected");
                if (SEARCH_INPUT) {
                    SEARCH_INPUT.attr("placeholder", emojiInTextarea(emoji));
                }
            }, function() {
                $(this).removeClass("selected");
                if (SEARCH_INPUT) {
                    SEARCH_INPUT.attr("placeholder", "Find the perfect emoji");
                }
            });
    }

    for (var i in eL) {
        // console.log(i, eL);
        if ((i != 0) && (i % 10 == 0)) {
            s.append(r);
            r = $(ELEMENT_SERVER_EMOJI_LIST_ROW);
        }
        r.append(emojiElement(eL[i], emojiClickHandler));
    }
    s.append(r);

    return s;
}

function buildServerSpan(server) {
    var s = $(ELEMENT_SERVER_EMOJI_LIST);
    s.find(".category").html(server.name);

    var r = $(ELEMENT_SERVER_EMOJI_LIST_ROW);
    var eL = isCurrentSelectedServer(server) ? server.emojis : server.sharedEmojis;

    s.append(buildEmojisRows(eL));

    return s;
}

function putEmojiInTextarea(emoji) {
    var textarea = $(".channel-textarea >> textarea");
    textarea.val(textarea.val() + emojiInTextarea(emoji) + " ");
}

function emojiInTextarea(emoji) {
    return emoji.require_colons ? (":" + emoji.name + ":") : emoji.name;
}

function getEmojiUrl(emoji) {
    return "https://cdn.discordapp.com/emojis/" + emoji.id + ".png";
}

// TODO Rewrite all belove using promises
function getServers(cb) {
    $.ajax({
        "async": true,
        "url": API_BASE + "/users/@me/guilds",
        "method": "GET"
    }).done(function(response) {
        cb(response);
    });
}

function getMyId(cb) {
    $.ajax({
        "async": true,
        "url": API_BASE + "/users/@me",
        "method": "GET"
    }).done(function(response) {
        MY_ID = response.id;
        cb(MY_ID);
    });
}

function parseServer(server) {
    $.ajax({
        "async": true,
        "url": API_BASE + "/guilds/" + server.id + "/members/" + MY_ID,
        "method": "GET"
    }).done(function(response) {
        // fill base server info
        // console.log(server.id, response, response.roles);
        var srv = {};
        srv.roles = response.roles;
        srv.id = server.id;
        srv.emojis = [];
        srv.sharedEmojis = [];
        srv.permissions = server.permissions;
        // test if we can use custom emojis on this server
        srv.canUserSharedEmojis = ((srv.permissions & 0x00040000) != 0);

        $.ajax({
            "async": true,
            "url": API_BASE + "/guilds/" + srv.id,
            "method": "GET"
        }).done(function(response) {
            // console.log(response.emojis);
            // now we got detailed info about server. fill emoji and managed emojis.
            // also set name
            srv.name = response.name;

            response.emojis.forEach(function(emoji) {
                // get emoji required roles
                var eR = emoji.roles;
                // no roles required for emoji
                emoji.url = getEmojiUrl(emoji.id);
                if (!eR.length) {
                    srv.emojis.push(emoji);
                    if (emoji.managed) {
                        srv.sharedEmojis.push(emoji);
                    }
                    return;
                }
                for (var i in eR) {
                    //we have required role
                    // console.log(srv.roles, eR, srv.roles.indexOf(eR[i]));
                    if (srv.roles.indexOf(eR[i]) != -1) {
                        srv.emojis.push(emoji);
                        if (emoji.managed) {
                            srv.sharedEmojis.push(emoji);
                        }
                        break;
                    }
                }
            });
            // save server info
            servers.push(srv);
        });
    });
}

function parseServers(serversA, callback) {
    if (serversA) {
        serversA.forEach(parseServer);
    }

    function checkAllServersDone() {
        if (servers.length == serversA.length) {
            if (callback)
                callback();
        } else {
            setTimeout(checkAllServersDone, 100);
        }
    }
    checkAllServersDone();
}

function doGetEmojis() {
    var token = webpackJsonp([], [], [LOCAL_STORAGE_MODULE]).impl.get(webpackJsonp([], [], [0]).TOKEN_KEY);

    servers = [];
    MY_ID = "";
    // common stuff for all requests
    $.ajaxSetup({
        "crossDomain": true,
        // window.token should be set from index.js or whereever before 
        "headers": { "authorization": token }
    });
    getMyId(function() {
        getServers(function(servers) {
            parseServers(servers, function() { console.log("done") });
        });
    });
}

doGetEmojis();

function watchForEmojiPickerChange(listener) {
    var observer = new MutationObserver(function(mutations) {
        if (listener) {
            listener(mutations);
        }
    });
    var config = { childList: true };
    observer.observe($(EMOJI_PICKER_PATH)[0], config);
    return observer;
}

function showOriginalScroller() {
    SCROLLER_WRAP.hide();
    SCROLLER_WRAP_OLD.show();
}

function showCustomScroller() {
    SCROLLER_WRAP.show();
    SCROLLER_WRAP_OLD.hide();
    SCROLLER_WRAP.find(".scroller").scrollTop(0);
}

function addCustomScrollerParts() {
    // console.log("picker opened");
    setTimeout(replaceScroller, 20);
    setTimeout(replaceSearchInput, 20);
    setTimeout(function() {
        var categories = $(EMOJI_PICKER_PATH).find('.categories');
        var categoriesChildren = categories.children();
        var customScroller = ['recent', 'custom'];

        categories.on('click', '.item', function(event) {
            var $this = $(this);

            categoriesChildren.removeClass('selected');

            // this.target.classList.add('selected');
            // Uncaught TypeError: Cannot read property 'classList' of undefined
            $this.addClass("selected");

            customScroller.forEach(function(category) {
                if ($this.hasClass(category)) {
                    showCustomScroller.call(this, event);
                }
            });

            showOriginalScroller.call(this, event);
        });
    }, 20);
    setTimeout(showCustomScroller, 30);
}

var EMOJI_PICKER_OBSERVER = watchForEmojiPickerChange(function(mutations) {
    for (var i in mutations) {
        if (mutations[i].type === "childList") {
            if (mutations[i].addedNodes.length > 0) {
                if ($(EMOJI_PICKER_PATH).find(".emoji-picker").length &&
                    ($(".channel-textarea-emoji").hasClass("popout-open") || $(".btn-reaction.popout-open").length)) {
                    addCustomScrollerParts();
                }
                // replaceScroller();
            } else if (mutations[i].removedNodes.length) {
                // console.log("picker closed");
            }
            break;
        }
    }
});
