var dataState = JSON.parse($("#data").attr("data-state"))
var questionData = JSON.parse($("div[data-zop-question]").attr("data-zop-question"))
var authorFollowButtons = []
if (user == null|| (dataState.author && dataState.author.id != user)) {
    var ret = parseFollowMemberButton(dataState.author)
    $div = $('<div class="MemberButtonGroup AnswerAuthor-buttons">' + '<button class="Button FollowButton Button--primary ' + 
    ret["button_color"] + '" type="button">' + 
    ret["button_content"] + '</button><button class="Button Button--grey Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">​<svg xmlns="http://www.w3.org/2000/svg" class="Zi Zi--Comments Button-zi" fill="currentColor" viewbox="0 0 24 24" width="1.2em" height="1.2em"><path fill-rule="evenodd" d="M 11 2 c 5.571 0 9 4.335 9 8 c 0 6 -6.475 9.764 -11.481 8.022 c -0.315 -0.07 -0.379 -0.124 -0.78 0.078 c -1.455 0.54 -2.413 0.921 -3.525 1.122 c -0.483 0.087 -0.916 -0.25 -0.588 -0.581 c 0 0 0.677 -0.417 0.842 -1.904 c 0.064 -0.351 -0.14 -0.879 -0.454 -1.171 A 8.833 8.833 0 0 1 2 10 c 0 -3.87 3.394 -8 9 -8 Z m 10.14 9.628 c 0.758 0.988 0.86 2.009 0.86 3.15 c 0 1.195 -0.619 3.11 -1.368 3.938 c -0.209 0.23 -0.354 0.467 -0.308 0.722 c 0.12 1.073 0.614 1.501 0.614 1.501 c 0.237 0.239 -0.188 0.562 -0.537 0.5 c -0.803 -0.146 -1.495 -0.42 -2.546 -0.811 c -0.29 -0.146 -0.336 -0.106 -0.563 -0.057 c -2.043 0.711 -4.398 0.475 -6.083 -0.927 c 5.965 -0.524 8.727 -3.03 9.93 -8.016 Z" /></svg></span>发私信</button></div>')    
    $(".Card.AnswerAuthor").children().eq(3).append($div)
}

function clickFollowQuestionButton($this, qid) {
    drawElementsWhenFollowQuestion($this, qid)
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText)
            if (resp.succeed === true) {
                return
            }
        }
        drawElementsWhenFollowQuestion($this, qid)
    }
    if ($this.hasClass("Button--blue")) {
        xhr.open("delete", "/api/questions/" + qid + "/followers", true)
    } else if ($this.hasClass("Button--grey")) {
        xhr.open("post", "/api/questions/" + qid + "/followers", true)
    }
    xhr.send()
}

function clickFollowMemberButton($this, member) {
    drawElementsWhenFollowMember($this, member)
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText)
            if (resp.succeed === true) {
                return
            }
        }
        drawElementsWhenFollowMember($this, member)
    }
    if ($this.hasClass("Button--blue")) {
        xhr.open("delete", "/api/members/" + member.url_token + "/followers", true)
    } else if ($this.hasClass("Button--grey")) {
        xhr.open("post", "/api/members/" + member.url_token + "/followers", true)
    }
    xhr.send()
}

function clickUpvote(b) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText)
        if (resp.succeed === true) {
        } else {
          b.upRestore();
        }
      } else {
        b.upRestore();
      }
    }
    xhr.open("post", "/api/answers/" + b.answerId + "/voters", true);
    if (!b.upvoted) {
      xhr.send('{\"type\":\"up\"}');
    } else {
      xhr.send('{\"type\":\"neutral\"}');
    }
    b.oldUpvoted=b.upvoted;
    b.oldDownvoted=b.downvoted;
    b.drawUp();
}

function clickDownvote(b) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText);
            if (resp.succeed === true) {

            } else {
                b.downRestore();
            }
        } else {
            b.downRestore();
        }
    }
    xhr.open("post", "/api/answers/" + b.answerId + "/voters", true);
    if (!b.downvoted) {
        xhr.send('{\"type\":\"down\"}');
    } else {
        xhr.send('{\"type\":\"neutral\"}');
    }
    b.oldUpvoted=b.upvoted;
    b.oldDownvoted=b.downvoted;
    b.drawDown();
}

function clickQuestionComments(qid) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var i = 0
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText);
            for (; i < resp.data.length; i++) { 
                $(".Topbar.CommentTopbar").after($('<div class="CommentList"><div class="CommentItem"><div><div class="CommentItem-meta"><span class="UserLink CommentItem-avatar"><div class="Popover"><div id="Popover-16289-49101-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-16289-49101-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/shen-dou-you-hai"><img class="Avatar UserLink-avatar" width="24" height="24" src="https://pic3.zhimg.com/v2-8876dd8722f518ee5a0e254af6f0f9ef_s.jpg" srcset="https://pic3.zhimg.com/v2-8876dd8722f518ee5a0e254af6f0f9ef_xs.jpg 2x" alt="忌糖"></a></div></div></span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/shen-dou-you-hai">忌糖</a></span><span class="CommentItem-time">4 个月前</span></div><div class="RichText CommentItem-content">题主只是问七武海是不是不够了，不是问七武海是不是不够用了也没问七武海为啥不够了，回答都啥群魔乱舞的</div><div class="CommentItem-footer"><button type="button" class="Button CommentItem-likeBtn Button--plain"><svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--like Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>赞</button><button type="button" class="Button CommentItem-hoverBtn Button--plain"><svg viewBox="0 0 22 16" class="Icon Icon--reply Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M21.96 13.22c-1.687-3.552-5.13-8.062-11.637-8.65-.54-.053-1.376-.436-1.376-1.56V.677c0-.52-.635-.915-1.116-.52L.47 6.67C.18 6.947 0 7.334 0 7.763c0 .376.14.722.37.987 0 0 6.99 6.818 7.442 7.114.453.295 1.136.124 1.135-.5V13c.027-.814.703-1.466 1.532-1.466 1.185-.14 7.596-.077 10.33 2.396 0 0 .395.257.535.257.892 0 .614-.967.614-.967z"></path></g></svg>回复</button><button type="button" class="Button CommentItem-hoverBtn Button--plain"><svg viewBox="0 0 18 20" class="Icon Icon--report Icon--left" width="11" height="16" aria-hidden="true" style="height: 16px; width: 11px;"><title></title><g><path d="M16.947 1.13c-.633.135-3.927.638-5.697.384-3.133-.45-4.776-2.54-9.95-.888C.305 1.04.025 1.664.025 2.646L0 18.807c0 .3.1.54.304.718.195.202.438.304.73.304.275 0 .52-.102.73-.304.202-.18.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V1.964c0-.6-.42-.972-1.053-.835z"></path></g></svg>举报</button></div></div></div><div></div></div>'))
            }   
        }
        if (i == 0) {
            $(".Topbar.CommentTopbar").after($('<div class="Comments-empty"><div class="EmptyState"><div class="EmptyState-inner"><svg xmlns="http://www.w3.org/2000/svg" width="150" height="120" viewbox="0 0 150 120" class="EmptyState-image"><title></title><g><g fill="none" fill-rule="evenodd"><path fill="#EBEEF5" fill-rule="nonzero" d="M106.807 78h8.19A3.004 3.004 0 0 0 118 74.998V34.002A3 3 0 0 0 114.997 31H61.003A3.004 3.004 0 0 0 58 34.002V36h-3v-1.998A6.004 6.004 0 0 1 61.003 28h53.994A6 6 0 0 1 121 34.002v40.996A6.004 6.004 0 0 1 114.997 81h-5.372l-.375 6.004c-.138 2.207-1.514 2.732-3.074 1.172L99 81h-5v-3h6.243l6.178 6.178.388-6.178zM44.824 95.176c-1.56 1.56-2.936 1.035-3.074-1.172L41.312 87H37a6 6 0 0 1-6-6.006V45.006A6.01 6.01 0 0 1 37 39h48a6 6 0 0 1 6 6.006v35.988A6.01 6.01 0 0 1 85 87H53l-8.176 8.176zm-.245-3.998L51.755 84H85c1.65 0 3-1.35 3-3.006V45.006A3 3 0 0 0 85 42H37c-1.65 0-3 1.35-3 3.006v35.988A3 3 0 0 0 37 84h7.13l.45 7.178z"></path><path fill="#F7F8FA" d="M94 49h9.494a1.5 1.5 0 1 1 0 3H94v-3zm0 9h9.494a1.5 1.5 0 1 1 0 3H94v-3zm-50 6.5c0-.828.68-1.5 1.505-1.5h30.99a1.5 1.5 0 1 1 0 3h-30.99A1.5 1.5 0 0 1 44 64.5zm0-14.503c0-.55.453-.997.997-.997h6.006c.55 0 .997.453.997.997v6.006c0 .55-.453.997-.997.997h-6.006c-.55 0-.997-.453-.997-.997v-6.006zM44 73.5c0-.828.68-1.5 1.505-1.5h30.99a1.5 1.5 0 1 1 0 3h-30.99A1.5 1.5 0 0 1 44 73.5z"></path></g></g></svg>还没有评论</div></div></div>'))
        }
    }
    xhr.open("get", "/api/questions/" + qid + "/comments", true);
    xhr.send(); 

    var div = document.createElement("div");
    div.innerHTML = '<div><span><div class="Modal-wrapper"><div class="Modal-backdrop"></div><div class="Modal Modal--fullPage" tabindex="0"><div class="Modal-inner"><div class="Modal-content Modal-content--spread"><div class="Comments-container"><div class="Comments Comments--withEditor"><div class="Topbar CommentTopbar"><div class="Topbar-title"><h2 class="CommentTopbar-title">还没有评论</h2></div><div class="Topbar-options"></div></div><div class="Comments-footer CommentEditor--normal CommentEditor--active"><div class="CommentEditor-input Input-wrapper Input-wrapper--spread Input-wrapper--large Input-wrapper--noPadding is-focus"><div class="Input Editable Editable--focus"><div class="Dropzone RichText" style="min-height: 198px;"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-c2oci">写下你的评论...</div></div><div class="DraftEditor-editorContainer"><div class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" tabindex="0" style="outline: none; white-space: pre-wrap; word-wrap: break-word;" aria-describedby="placeholder-c2oci"><div data-contents="true"><div class="Editable-unstyled" data-block="true" data-editor="c2oci" data-offset-key="gjjj-0-0"><div data-offset-key="gjjj-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="gjjj-0-0"><br data-text="true"></span></div></div></div></div></div></div></div><input multiple="" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"><div></div></div></div><button type="button" class="Button CommentEditor-singleButton Button--primary Button--blue" disabled>评论</button></div></div></div></div></div><button aria-label="关闭" type="button" class="Button Modal-closeButton Button--plain"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></button></div></div></span></div>'
    document.getElementsByTagName("body").item(0).appendChild(div);

    var closeButton = document.getElementsByClassName("Modal-closeButton");
    closeButton[0].addEventListener("click", function() {
        clickListCloseButton(div);
    }, false);
    $(".notranslate.public-DraftEditor-content").on("focus", function() {
        $(".Comments-footer").addClass("CommentEditor--active")
        $(".CommentEditor-input").addClass("is-focus")
        $(".Input.Editable").addClass("Editable--focus")
    })
    $(".notranslate.public-DraftEditor-content").on("blur", function() {
        $(".Comments-footer").removeClass("CommentEditor--active")
        $(".CommentEditor-input").removeClass("is-focus")
        $(".Input.Editable").removeClass("Editable--focus")
    })
    // $(".notranslate.public-DraftEditor-content").on("textInput", function() {
    //     alert(1)
    //     $(".notranslate.public-DraftEditor-content").attr("aria-describedby") = "placeholder-1lrhc"
    // })
    $(".notranslate.public-DraftEditor-content").on("keydown", function(e) {
        if(event.keyCode==8) {//keycode为8表示退格键
            if ($("span[data-offset-key]").text() == "") {
                alert(1)
                e.preventDefault()
            }
        }
    })
}

function clickVoterList(aid, voterCount) {
    var list = new Object()
    list.url = "/api/answers/" + aid + "/voters"
    list.memberCount = voterCount
    clickList(list)
}   

function clickQuestionFollowerList(qid, followerCount) {
    var list = new Object()
    list.url = "/api/questions/" + qid + "/followers"
    list.memberCount = followerCount
    clickList(list)
}

function clickList(list) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText);
            // var voterListContent = document.getElementsByClassName("VoterList-content");
            var $voterListContent = $(".VoterList-content");
            for (i = 0; i < resp.data.length; i++) {   
                var ContentItemExtraFollowButton = "";
                if (resp.data[i].id != user) {
                    var ret = parseFollowMemberButton(resp.data[i])
                    ContentItemExtraFollowButton =  '<div class="ContentItem-extra"><button type="button" class="Button FollowButton Button--primary ' + 
                    ret["button_color"] + '">' + 
                    ret["button_content"] + '</button></div>'
                }
                
                $voterListContent.append($('<div class="List-item"><div class="ContentItem" data-za-detail-view-path-module="UserItem" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;User&quot;,&quot;member_hash_id&quot;:&quot;881df29674152d0fe1d704f1cf0b68c2&quot;,&quot;follower_num&quot;:' + 
                resp.data[i].follower_count + '"><div class="ContentItem-main"><div class="ContentItem-image"><span class="UserLink UserItem-avatar"><div class="Popover"><div id="Popover-55861-97196-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-55861-97196-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/' + 
                resp.data[i].url_token + '"><img class="Avatar Avatar--large UserLink-avatar" width="60" height="60" src="' + 
                resp.data[i].avatar_url + '" alt="' +
                resp.data[i].name + '" /></a></div></div></span></div><div class="ContentItem-head"><h2 class="ContentItem-title"><div class="UserItem-title"><span class="UserLink UserItem-name"><div class="Popover"><div id="Popover-55861-86643-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-55861-86643-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/' + 
                resp.data[i].url_token + '">' + 
                resp.data[i].name + '</a></div></div></span></div></h2><div class="ContentItem-meta"><div><div class="ContentItem-status"><span class="ContentItem-statusItem">' + 
                resp.data[i].answer_count + ' 回答</span><span class="ContentItem-statusItem"><span>' + 
                resp.data[i].follower_count + '</span> 关注者</span></div></div></div></div>' + 
                ContentItemExtraFollowButton + '</div></div>'));
                createMouseOverVoterEvent(resp.data[i], i)
                createMouseClickVoterEvent(resp.data[i], i)
            }
        }
    }
    xhr.open("get", list.url, true);
    xhr.send(); 

    var div = document.createElement("div");
    div.innerHTML = '<div><span><div class="Modal-wrapper"><div class="Modal-backdrop"></div><div class=\"Modal Modal--fullPage\" tabindex=\"0\">'+
    '<div class="Modal-inner\"><div class=\"Modal-content Modal-content--spread\"><div class=\"VoterList\"><div class=\"Topbar\">' +
    '<div class="Topbar-title\">' + 
     list.memberCount + ' 人赞同了</div><div class=\"Topbar-options\"></div></div><div class="VoterList-content">'+
    '</div></div></div></div><button aria-label=\"关闭\" type=\"button\" class=\"Button Modal-closeButton Button--plain\">'+
    '<svg class="Zi Zi--Close Modal-closeIcon\" fill=\"currentColor\" viewbox=\"0 0 24 24\" width=\"24\" height=\"24\">'+
    '<path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z\" fill-rule=\"evenodd\"></path>'+
    '</svg></button></div></div></span></div></div>';
    document.getElementsByTagName("body").item(0).appendChild(div);

    var closeButton = document.getElementsByClassName("Modal-closeButton");
    closeButton[0].addEventListener("click", function() {
        clickListCloseButton(div);
    }, false);
    
}

function clickListCloseButton(div) {
    div.innerHTML = "";
    div.parentNode.removeChild(div);
    authorFollowButtons[1] = null
}

function parseFollowMemberButton(data) {
    var buttonColor = "Button--grey";   
    var buttonContent = "已关注"
    if (!data.is_followed) {
        buttonColor = "Button--blue"
        buttonContent = '<span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewbox="0 0 24 24" width="1.2em" height="1.2em"><path d="M13.491 10.488s-.012-5.387 0-5.998c-.037-1.987-3.035-1.987-2.997 0-.038 1.912 0 5.998 0 5.998H4.499c-1.999.01-1.999 3.009 0 3.009s5.995-.01 5.995-.01v5.999c0 2.019 3.006 2.019 2.997 0-.01-2.019 0-5.998 0-5.998s3.996.009 6.004.009c2.008 0 2.008-3-.01-3.009h-5.994z" fill-rule="evenodd"></path></svg></span>关注'
        var gender = ""
        if (data.gender === 0) {
            buttonContent += "她"
        } else if (data.gender === 1) {
            buttonContent += "他"
        }
    }
    return {
        "button_content":buttonContent,
        "button_color":buttonColor
    }
}

function drawElementsWhenFollowQuestion($this, qid) {
    if ($this.hasClass("Button--blue")) {
        $this.removeClass("Button--blue")
        $this.addClass("Button--grey")
        $this.text("已关注")
        $(".QuestionFollowStatus-counts").find(".NumberBoard-itemValue").get(0).firstChild.nodeValue++
    } else if ($this.hasClass("Button--grey")) {
        $this.removeClass("Button--grey")
        $this.addClass("Button--blue")
        $this.text("关注问题")
        $(".QuestionFollowStatus-counts").find(".NumberBoard-itemValue").get(0).firstChild.nodeValue--
    }
}


var answerAuthorFollowButtonClicked = false
function drawElementsWhenFollowMember($this, member) {
    if (dataState.author &&  member.id == dataState.author.id) {
        if (answerAuthorFollowButtonClicked == false) {//don't call twice
            drawFollowMemberButton(authorFollowButtons[0], member.gender)
        }
        if ($this.hasClass("Button--blue")) {
            $("a[data-za-detail-view-element_name='Follower']").find(".NumberBoard-itemValue").get(0).firstChild.nodeValue++
        } else if ($this.hasClass("Button--grey")) {
            $("a[data-za-detail-view-element_name='Follower']").find(".NumberBoard-itemValue").get(0).firstChild.nodeValue--
        }
    }
    drawFollowMemberButton($this, member.gender)
}

function drawFollowMemberButton($this, gender) {
    if ($this.hasClass("Button--blue")) {
        $this.removeClass("Button--blue")
        $this.addClass("Button--grey")
        $this.text("已关注")
    } else if ($this.hasClass("Button--grey")) {
        $this.removeClass("Button--grey")
        $this.addClass("Button--blue")
        var buttonContent = '<span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewbox="0 0 24 24" width="1.2em" height="1.2em"><path d="M13.491 10.488s-.012-5.387 0-5.998c-.037-1.987-3.035-1.987-2.997 0-.038 1.912 0 5.998 0 5.998H4.499c-1.999.01-1.999 3.009 0 3.009s5.995-.01 5.995-.01v5.999c0 2.019 3.006 2.019 2.997 0-.01-2.019 0-5.998 0-5.998s3.996.009 6.004.009c2.008 0 2.008-3-.01-3.009h-5.994z" fill-rule="evenodd"></path></svg></span>关注'
        if (gender == 0) {
            buttonContent += "她"
        } else if (gender == 1) {
            buttonContent += "他"
        }
        $this.html(buttonContent)
    }
}

function createMouseClickVoterEvent(data, i) {
    $(".VoterList-content").children().eq(i).find("button.Button.FollowButton.Button--primary").on("click", function() {
        clickFollowMemberButton($(this), data)
        if ($(this).hasClass("Button--blue")) {
            $(".VoterList-content").children().eq(i).find("span.ContentItem-statusItem").children().get(0).firstChild.nodeValue--
        } else if ($(this).hasClass("Button--grey")) {
            $(".VoterList-content").children().eq(i).find("span.ContentItem-statusItem").children().get(0).firstChild.nodeValue++
        }
    })
}

function createMouseOverVoterEvent(data, i) {
    $(".VoterList-content").children().eq(i).on("mouseover", function(e) {
        handleMouseOverUserEvent(e, data, i)
    });
    $(".VoterList-content").children().eq(i).on("mouseout", function(e) {     
        handleMouseOutUserEvent(e)
    });
}

var avatarTimer = 0;
var linkTimer = 0;
var avatarCardEntered = false;
var linkCardEntered = false;
function handleMouseOverUserEvent(e, data, i) {
    if ($(e.target).hasClass("Avatar")) {
        if (avatarCardEntered) {
            avatarCardEntered = false;
            clearTimeout(avatarTimer);
            avatarTimer = 0
            return;
        }
        if (avatarTimer) {//reset to avoid last hover card's effect
            clearTimeout(avatarTimer);
            avatarTimer = 0
            removeUserHoverCard();
        }
        if (linkTimer !== 0) {
           //alert("removeLink")
           removeUserHoverCard();
            clearTimeout(linkTimer);
            linkTimer = 0
            linkCardEntered = false;
        }
        var hoverCardData = getUserHoverCardData(e, data.url_token)
        
        $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").on("mouseenter", function(e) {
            if (avatarTimer) {
                clearTimeout(avatarTimer);
                avatarTimer = 0
            }
            
        });
        $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").on("mouseleave", function(e) {
            avatarTimer = setTimeout(function() {
                avatarCardEntered = false;
                removeUserHoverCard();
                //alert("CardremoveAvatar")
                avatarTimer = 0
            }, 200);
            avatarCardEntered = true;
        });
        if (hoverCardData == null) {
            return
        }
        showUserHoverCard(e, hoverCardData, i);
    } else if (e.target.className == "UserLink-link") {
        if (linkCardEntered) {
            linkCardEntered = false;
            clearTimeout(linkTimer);
            linkTimer = 0
            return;
        }
        if (linkTimer) {
            clearTimeout(linkTimer);
            linkTimer = 0
            removeUserHoverCard();
        }
        if (avatarTimer !== 0) {
            clearTimeout(avatarTimer);
            avatarTimer = 0
            avatarCardEntered = false;
            removeUserHoverCard();
            //alert("LinkremoveAvatar")
        }
        var hoverCardData = getUserHoverCardData(e, data.url_token)
        
        $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").on("mouseenter", function(e) {
            if (linkTimer) {
                clearTimeout(linkTimer);
                linkTimer = 0
               // //alert("claer linkTimer");
            }
            
        });
        $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").on("mouseleave", function(e) {
            linkTimer = setTimeout(function() {
                linkCardEntered = false;
                //alert("CardremoveLink")
                removeUserHoverCard();
                linkTimer = 0
            }, 200);
            linkCardEntered = true;
        });
        if (hoverCardData == null) {
            return
        }
        showUserHoverCard(e, hoverCardData, i);
    }
}

function handleMouseOutUserEvent(e) {
    if ($(e.target).hasClass("Avatar")) {
        avatarTimer = setTimeout(function() {
            //alert("removeAvatar")
            removeUserHoverCard();
            avatarTimer = 0
        }, 200);
    }
    else if  (e.target.className == "UserLink-link") {
        linkTimer = setTimeout(function() {
            //alert("removeLink")
            removeUserHoverCard();
            linkTimer = 0
        }, 200);
    }
}

function getUserHoverCardData(e, urlToken) {
    var $target = $(e.target);
    var top = $target.offset().top + 60
    var left = $target.offset().left;
    if (e.target.className == "UserLink-link") {
        top = $target.offset().top + 25
    }
    var $div = $('<div><div><span><div class="Popover-content Popover-content--bottom HoverCard-popoverTarget" id="Popover-10042-2046-content" aria-labelledby="Popover-10042-2046-toggle" ' + 
    'style="left: ' + left + 'px; top: ' + top + 'px;"><div class="HoverCard-container" data-za-detail-view-path-module="UserItem" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;User&quot;,&quot;member_hash_id&quot;:&quot;5297e252e5358f431d050c3b562152ec&quot;}}}"><div class="HoverCard-loading" style="left: 30px; top: 0px;"><div class="BounceLoading" style="width: 60px; height: 18px;"><span class="BounceLoading-child" style="top: 6px; left: 0px; width: 6px; height: 6px; animation-duration: 0.8s; animation-delay: 0s;"></span><span class="BounceLoading-child" style="top: 6px; left: 18px; width: 6px; height: 6px; animation-duration: 0.8s; animation-delay: -0.1s;"></span><span class="BounceLoading-child" style="top: 6px; left: 36px; width: 6px; height: 6px; animation-duration: 0.8s; animation-delay: -0.2s;"></span><span class="BounceLoading-child" style="top: 6px; left: 54px; width: 6px; height: 6px; animation-duration: 0.8s; animation-delay: -0.3s;"></span></div></div></div></div></span></div></div>')
    $("body").append($div)
    var data
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText)
            if (data.succeed === false) {
                return null
            }
        } else {
            return null
        }
    }
    xhr.open("get", "/api/members/" + urlToken, false)//FIXME:blocked
    xhr.send()
    return data
}

function removeUserHoverCard() {
    $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").eq(0).parent().parent().parent().remove(); //delete only one
    ////alert("remove");
}

function showUserHoverCard(e, data, i) {
    var hoverCardButtons = ""
    if (user != data.id) {
        var ret = parseFollowMemberButton(data);
        hoverCardButtons = '<div class="MemberButtonGroup ProfileButtonGroup HoverCard-buttons">' +
        '<button type="button" class="Button FollowButton Button--primary ' + ret["button_color"] + '">' + 
        ret["button_content"] + '</button><button type="button" class="Button Button--grey Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Comments Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M11 2c5.571 0 9 4.335 9 8 0 6-6.475 9.764-11.481 8.022-.315-.07-.379-.124-.78.078-1.455.54-2.413.921-3.525 1.122-.483.087-.916-.25-.588-.581 0 0 .677-.417.842-1.904.064-.351-.14-.879-.454-1.171A8.833 8.833 0 0 1 2 10c0-3.87 3.394-8 9-8zm10.14 9.628c.758.988.86 2.009.86 3.15 0 1.195-.619 3.11-1.368 3.938-.209.23-.354.467-.308.722.12 1.073.614 1.501.614 1.501.237.239-.188.562-.537.5-.803-.146-1.495-.42-2.546-.811-.29-.146-.336-.106-.563-.057-2.043.711-4.398.475-6.083-.927 5.965-.524 8.727-3.03 9.93-8.016z" fill-rule="evenodd"></path></svg></span>发私信</button></div>'
    }
    $(".HoverCard-container").eq(0).html('<div class="HoverCard"><div><div class="HoverCard-titleContainer HoverCard-titleContainer--noAvatar"><img class="Avatar Avatar--large HoverCard-avatar" width="68" height="68" src="' +
    data.avatar_url + '"><div class="HoverCard-titleText">' + 
    '<div class="HoverCard-title"><span><a target="_blank" href="https://www.zhihu.com/people/er-gou-80-42">' + 
    data.name + '</a></span></div><div class="HoverCard-subtitle"><span class="RichText">' + 
    data.headline + '</span></div></div></div></div><div class="HoverCard-item"><div class="NumberBoard"><a target="_blank" type="button" class="Button NumberBoard-item Button--plain" href="https://www.zhihu.com/people/' + 
    data.url_token + '/answers"><div class="NumberBoard-itemInner"><div class="NumberBoard-itemName">回答</div><strong class="NumberBoard-itemValue" title="1">' + 
    data.answer_count + '</strong></div></a><a target="_blank" type="button" class="Button NumberBoard-item Button--plain" href="https://www.zhihu.com/people/' + 
    data.url_token + '/posts"><div class="NumberBoard-itemInner">' + 
    '<div class="NumberBoard-itemName">文章</div><strong class="NumberBoard-itemValue" title="0">0</strong></div></a><a target="_blank" type="button" class="Button NumberBoard-item Button--plain" href="https://www.zhihu.com/people/er-gou-80-42/followers"><div class="NumberBoard-itemInner"><div class="NumberBoard-itemName">关注者</div><strong class="NumberBoard-itemValue" title="0">' + 
    data.follower_count + '</strong></div></a></div>' + hoverCardButtons +'</div></div>');

    $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").on("click", "button.Button.FollowButton.Button--primary",function() {
        clickFollowMemberButton($(this), data)
        //change follower count in hover card when clicking follow button in hover card
        if ($(this).hasClass("Button--blue")) {
            $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").find(".NumberBoard-itemValue").get(2).firstChild.nodeValue--
        } else if ($(this).hasClass("Button--grey")) {
            $(".Popover-content.Popover-content--bottom.HoverCard-popoverTarget").find(".NumberBoard-itemValue").get(2).firstChild.nodeValue++
        }
        if ($(".Modal-wrapper")) {
            //change follower count in voterlist when clicking follow button in hover card 
            if ($(this).hasClass("Button--blue")) {
                $(".VoterList-content").children().eq(i).find("span.ContentItem-statusItem").children().get(0).firstChild.nodeValue--
            } else if ($(this).hasClass("Button--grey")) {
                $(".VoterList-content").children().eq(i).find("span.ContentItem-statusItem").children().get(0).firstChild.nodeValue++
            }   
            //change followe button color in voterlist when clicking follow button in hover card
            drawFollowMemberButton($(".VoterList-content").children().eq(i).find("button"), data.gender)
        }
    })
}


var $answerItems = $(".ContentItem.AnswerItem");
var upButtons = document.getElementsByClassName("VoteButton--up");
var downButtons = document.getElementsByClassName("VoteButton--down");
for (i =0; i < $answerItems.length; i++) {
    var button = new Object();
    button.answerId = $answerItems.eq(i).attr("name");
    button.upButton = upButtons[i];
    button.downButton = downButtons[i];
    button.$contentItemMeta = $answerItems.eq(i).find(".ContentItem-meta");
    button.upvoted = false;
    button.downvoted = false;
    button.oldUpvoted = false;
    button.oldDownvoted = false;
    if (button.upButton.classList.contains("is-active")) {
        button.upvoted = true;
    } else if (button.downButton.classList.contains("is-active")) {
        button.downvoted = true;
    }
    button.drawUp = function() {
        if (!this.upvoted) {
            if (this.downvoted) {
                this.downButton.classList.remove("is-active");
                this.downvoted = false;
            }
            this.increaseVotersCount();
        } else {
            this.reduceVotersCount();            
        }
        this.upvoted = !this.upvoted;
    };
    button.drawDown = function() {
        if (!this.downvoted) {
            if (this.upvoted) {
                this.reduceVotersCount();
                this.upvoted = false;
            }
            this.downButton.classList.add("is-active");                      
        } else {
            this.downButton.classList.remove("is-active");
        }
        this.downvoted = !this.downvoted;
    };
    button.upRestore = function() {
        this.upvoted=this.oldUpvoted;
        this.downvoted=this.oldDownvoted;
        if (this.oldUpvoted === true) {
            this.increaseVotersCount();
        } else {
            this.reduceVotersCount();
            if (this.oldDownvoted === true) {
                this.downButton.classList.add("is-active");
            }                  
        }
    };
    button.downRestore = function() {
        this.upvoted=this.oldUpvoted;
        this.downvoted=this.oldDownvoted;
        if (this.oldDownvoted === true) {
            this.downButton.classList.add("is-active");    
        } else {
            this.downButton.classList.remove("is-active");
            if (this.oldUpvoted === true) {
                this.increaseVotersCount();        
            }                  
        }        
    };
    button.increaseVotersCount = function() {
        this.upButton.firstChild.nextSibling.nodeValue++;                
        this.upButton.classList.add("is-active");
        if (this.$contentItemMeta.children().length == 1) {
            var $div = $('<div class="AnswerItem-extraInfo"><span class="Voters"><button class="Button Button--plain" type="button"><span>1</span> 人赞同了该回答</button></span></div>');
            this.$contentItemMeta.append($div);
        } else {
            this.$contentItemMeta.find("button.Button.Button--plain").find("span").get(0).firstChild.nodeValue++;
        }
    };
    button.reduceVotersCount = function() {
        this.upButton.firstChild.nextSibling.textContent--;            
        this.upButton.classList.remove("is-active");
        this.$contentItemMeta.find("button.Button.Button--plain").find("span").get(0).firstChild.nodeValue--;
        if (this.$contentItemMeta.find("button.Button.Button--plain").find("span").get(0).firstChild.nodeValue == 0) {
            this.$contentItemMeta.find(".AnswerItem-extraInfo").remove();
        }
    }
    
    button.upButton.addEventListener("click", function(){
        clickUpvote(button);
    }, false);                      
    button.downButton.addEventListener("click", function(){
        clickDownvote(button);
    }, false);
    button.$contentItemMeta.on("click", function(){
        clickVoterList(button.answerId, $(this).find("button.Button.Button--plain").find("span").get(0).firstChild.nodeValue);
    });   
    //author avatar clickover event
    createMouseOverAnswerAuthorEvent(i)
}

function createMouseOverAnswerAuthorEvent(i) {
    $answerItems.eq(i).on("mouseover", ".UserLink-link", function(e) {
        handleMouseOverUserEvent(e, dataState.author, i)
    })
    $answerItems.eq(i).on("mouseout", ".UserLink-link", function(e) {
        handleMouseOutUserEvent(e)
    })
}

//question's follower list
$(".QuestionFollowStatus-counts").find("button.NumberBoard-item").on("click", function() {
    clickQuestionFollowerList(questionData.id, $(this).find(".NumberBoard-itemValue").get(0).firstChild.nodeValue)
})
//follow question
$(".Button.FollowButton.Button--primary").eq(0).on("click", function() {
    clickFollowQuestionButton($(this), questionData.id)
})
//follow answer page's author
if (dataState.author) {
    authorFollowButtons[0] = $(".Button.FollowButton.Button--primary").eq(1)
    $(".Button.FollowButton.Button--primary").eq(1).on("click", function() {  
        answerAuthorFollowButtonClicked = true
        clickFollowMemberButton($(this), dataState.author)
        answerAuthorFollowButtonClicked = false
    })
}
//question comments
$(".QuestionHeader-Comment").children().eq(0).on("click", function() {
    clickQuestionComments(questionData.id)
})