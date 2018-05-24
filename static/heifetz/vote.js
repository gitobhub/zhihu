//$("body").css("overflow","auto")
var dataState = JSON.parse($("#data").attr("data-state"))
var questionData = JSON.parse($("div[data-zop-question]").attr("data-zop-question"))
var authorFollowButtons = []
//handle author card in answer page 
if (dataState.page == "answer" && (user == null || dataState.answers[0].author.id != user.id)) {
    var ret = parseFollowMemberButton(dataState.answers[0].author)
    $div = $('<div class="MemberButtonGroup AnswerAuthor-buttons">' + '<button class="Button FollowButton Button--primary ' + 
    ret["button_color"] + '" type="button">' + 
    ret["button_content"] + '</button><button class="Button Button--grey Button--withIcon Button--withLabel" type="button"><span style="display: inline-flex; align-items: center;">​<svg xmlns="http://www.w3.org/2000/svg" class="Zi Zi--Comments Button-zi" fill="currentColor" viewbox="0 0 24 24" width="1.2em" height="1.2em"><path fill-rule="evenodd" d="M 11 2 c 5.571 0 9 4.335 9 8 c 0 6 -6.475 9.764 -11.481 8.022 c -0.315 -0.07 -0.379 -0.124 -0.78 0.078 c -1.455 0.54 -2.413 0.921 -3.525 1.122 c -0.483 0.087 -0.916 -0.25 -0.588 -0.581 c 0 0 0.677 -0.417 0.842 -1.904 c 0.064 -0.351 -0.14 -0.879 -0.454 -1.171 A 8.833 8.833 0 0 1 2 10 c 0 -3.87 3.394 -8 9 -8 Z m 10.14 9.628 c 0.758 0.988 0.86 2.009 0.86 3.15 c 0 1.195 -0.619 3.11 -1.368 3.938 c -0.209 0.23 -0.354 0.467 -0.308 0.722 c 0.12 1.073 0.614 1.501 0.614 1.501 c 0.237 0.239 -0.188 0.562 -0.537 0.5 c -0.803 -0.146 -1.495 -0.42 -2.546 -0.811 c -0.29 -0.146 -0.336 -0.106 -0.563 -0.057 c -2.043 0.711 -4.398 0.475 -6.083 -0.927 c 5.965 -0.524 8.727 -3.03 9.93 -8.016 Z" /></svg></span>发私信</button></div>')    
    $(".Card.AnswerAuthor").children().eq(3).append($div)
}

function handleAjaxResponse(xhr) {
    if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText)
        //if (resp.success === true) {
            return true
        //} 
    } else if (xhr.status === 403) {
        var resp = JSON.parse(xhr.responseText)
        if (resp.message == "not authorized") {
            window.location.href = "/signin"
            return false
        }
    }    
    return false
}

function createSiginCard() {
    $("body").append($('<div><div><span><div class="Modal-wrapper"><div class="Modal-backdrop"></div><div class="Modal Modal--default signFlowModal" tabindex="0"><div class="Modal-inner"><div class="Modal-content"><div class="Card SignContainer-content"><div class="SignFlowHeader"><svg viewBox="0 0 200 91" class="Icon ZhihuLogo Icon--logo" width="98" height="45.9375" aria-hidden="true" style="height: 45.9375px; width: 98px;"><title></title><g><path d="M53.29 80.035l7.32.002 2.41 8.24 13.128-8.24h15.477v-67.98H53.29v67.978zm7.79-60.598h22.756v53.22h-8.73l-8.718 5.473-1.587-5.46-3.72-.012v-53.22zM46.818 43.162h-16.35c.545-8.467.687-16.12.687-22.955h15.987s.615-7.05-2.68-6.97H16.807c1.09-4.1 2.46-8.332 4.1-12.708 0 0-7.523 0-10.085 6.74-1.06 2.78-4.128 13.48-9.592 24.41 1.84-.2 7.927-.37 11.512-6.94.66-1.84.785-2.08 1.605-4.54h9.02c0 3.28-.374 20.9-.526 22.95H6.51c-3.67 0-4.863 7.38-4.863 7.38H22.14C20.765 66.11 13.385 79.24 0 89.62c6.403 1.828 12.784-.29 15.937-3.094 0 0 7.182-6.53 11.12-21.64L43.92 85.18s2.473-8.402-.388-12.496c-2.37-2.788-8.768-10.33-11.496-13.064l-4.57 3.627c1.363-4.368 2.183-8.61 2.46-12.71H49.19s-.027-7.38-2.372-7.38zm128.752-.502c6.51-8.013 14.054-18.302 14.054-18.302s-5.827-4.625-8.556-1.27c-1.874 2.548-11.51 15.063-11.51 15.063l6.012 4.51zm-46.903-18.462c-2.814-2.577-8.096.667-8.096.667s12.35 17.2 12.85 17.953l6.08-4.29s-8.02-11.752-10.83-14.33zM199.99 46.5c-6.18 0-40.908.292-40.953.292v-31.56c1.503 0 3.882-.124 7.14-.376 12.773-.753 21.914-1.25 27.427-1.504 0 0 3.817-8.496-.185-10.45-.96-.37-7.24 1.43-7.24 1.43s-51.63 5.153-72.61 5.64c.5 2.756 2.38 5.336 4.93 6.11 4.16 1.087 7.09.53 15.36.277 7.76-.5 13.65-.76 17.66-.76v31.19h-41.71s.88 6.97 7.97 7.14h33.73v22.16c0 4.364-3.498 6.87-7.65 6.6-4.4.034-8.15-.36-13.027-.566.623 1.24 1.977 4.496 6.035 6.824 3.087 1.502 5.054 2.053 8.13 2.053 9.237 0 14.27-5.4 14.027-14.16V53.93h38.235c3.026 0 2.72-7.432 2.72-7.432z" fill-rule="evenodd"></path></g></svg><div class="SignFlowHeader-slogen">登录知乎，发现更大的世界</div></div><div class="SignContainer-inner"><div class="Login-content"><form novalidate="" class="SignFlow" data-za-detail-view-path-module="SignInForm" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:null}}"><div class="SignFlow-account"><div class="SignFlow-supportedCountriesSelectContainer"></div><div class="SignFlowInput SignFlow-accountInputContainer"><div class="SignFlow-accountInput Input-wrapper"><input name="username" type="text" class="Input" placeholder="手机号或邮箱" value=""></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div></div><div class="SignFlow-password"><div class="SignFlowInput"><div class="Input-wrapper"><input name="password" type="password" class="Input" placeholder="密码" value=""></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div><button tabindex="-1" type="button" class="Button SignFlow-switchPassword Button--plain"><svg width="24" height="20" viewBox="0 0 24 24" class="Icon SignFlow-switchPasswordIcon Icon--inconspicuous" aria-hidden="true" style="vertical-align: middle; height: 20px; width: 24px;"><title></title><g><title>Inconspicuous</title><path d="M17.007 11.504c0 .65-.13 1.26-.36 1.83l3 3.073S23 14.136 23 11.504C23 8.008 17.255 4 11.995 4c-1.4 0-2.741.25-3.982.701l2.161 2.16c.57-.23 1.18-.36 1.831-.36a5.004 5.004 0 0 1 5.002 5.003zM2.57 4.342l2.067 2.075C3.499 7.258 1 9.119 1 11.504c0 3.336 5.79 7.503 11.005 7.503 1.55 0 3.031-.3 4.382-.84l.42.42 2.125 2.118s.782.571 1.314 0-.074-1.305-.074-1.305L3.955 3.183s-.76-.742-1.385-.19c-.626.554 0 1.35 0 1.35zm4.963 4.96l1.55 1.552c-.05.21-.08.43-.08.65 0 1.66 1.341 3.001 3.002 3.001.22 0 .44-.03.65-.08l1.551 1.551c-.67.33-1.41.53-2.2.53a5.004 5.004 0 0 1-5.003-5.002c0-.79.2-1.53.53-2.201zm4.312-.78l3.151 3.152.02-.16c0-1.66-1.34-3.001-3.001-3.001l-.17.01z" fill-rule="evenodd"></path></g></svg></button></div><div class="Captcha SignFlow-captchaContainer" style="width: 0px; height: 0px; opacity: 0; overflow: hidden; margin: 0px; padding: 0px; border: 0px;"><div><div class="Captcha-chineseOperator"><span class="Captcha-info">请点击图中倒立的文字</span><button type="button" class="Button Captcha-chineseRefreshButton Button--plain"><svg class="Zi Zi--Refresh" fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M20 12.878C20 17.358 16.411 21 12 21s-8-3.643-8-8.122c0-4.044 3.032-7.51 6.954-8.038.034-1.185.012-1.049.012-1.049-.013-.728.461-1.003 1.057-.615l3.311 2.158c.598.39.596 1.026 0 1.418l-3.31 2.181c-.598.393-1.08.12-1.079-.606 0 0 .006-.606-.003-1.157-2.689.51-4.675 2.9-4.675 5.708 0 3.21 2.572 5.822 5.733 5.822 3.163 0 5.733-2.612 5.733-5.822 0-.633.51-1.148 1.134-1.148.625 0 1.133.515 1.133 1.148" fill-rule="evenodd"></path></svg></button></div><div class="Captcha-chineseContainer"><img data-tooltip="看不清楚？换一张" class="Captcha-chineseImg" src="data:image/jpg;base64,null" alt="图形验证码"></div></div></div><div class="Login-options"><button type="button" class="Button Login-switchType Button--plain">手机验证码登录</button><button type="button" class="Button Login-cannotLogin Button--plain">忘记密码？</button></div><button type="submit" class="Button SignFlow-submitButton Button--primary Button--blue">登录</button><div class="Login-footer"><span class="Login-qrcode"><button type="button" class="Button Button--plain">二维码登录</button></span><span class="Login-footerSeparate Login-qrcodeSeparate"> · </span><span class="Login-aboardPhone"><button type="button" class="Button Button--plain">海外手机登录</button></span><span class="Login-footerSeparate"> · </span><span class="Login-socialLogin"><button type="button" class="Button Login-socialButtonEntrance Button--plain">社交帐号登录</button><span class="Login-socialButtonGroup Login-socialButtonGroup--hidden"><button disabled="" type="button" class="Button Login-socialButton Button--plain"><svg viewBox="0 0 20 19" class="Icon Login-socialIcon Icon--wechat" width="18" height="17" aria-hidden="true" style="height: 17px; width: 18px;"><title></title><g><path fill-rule="evenodd" d="M.224 18.667s4.24-1.825 4.788-2.056C13.03 20.14 20 14.715 20 8.9 20 3.984 15.523 0 10 0S0 3.984 0 8.898c0 1.86.64 3.585 1.737 5.013-.274.834-1.513 4.757-1.513 4.757zM6.167 8.96c.69 0 1.25-.57 1.25-1.27 0-.703-.56-1.272-1.25-1.272s-1.25.57-1.25 1.27c0 .703.56 1.272 1.25 1.272zm7.583 0c.69 0 1.25-.57 1.25-1.27 0-.703-.56-1.272-1.25-1.272s-1.25.57-1.25 1.27c0 .703.56 1.272 1.25 1.272z"></path></g></svg></button><button disabled="" type="button" class="Button Login-socialButton Button--plain"><svg viewBox="0 0 22 18" class="Icon Login-socialIcon Icon--weibo" width="20" height="16" aria-hidden="true" style="height: 16px; width: 20px;"><title></title><g><g fill-rule="evenodd">     <path d="M14.518.06s-.87.644.03 1.71c0 0 6.287-1.19 5.69 6.33 0 0 1.05 1.13 1.674-.31 0 .002 1.44-8.584-7.394-7.73zM4.883 13.17s.038 2.584 3.326 2.584c3.657 0 3.683-2.98 3.683-2.98S12.1 9.67 8.687 9.61c-3.863-.07-3.804 3.56-3.804 3.56zM7.41 14.21c-.668 0-1.214-.447-1.214-.998 0-.55.543-.998 1.215-.998.67 0 1.213.447 1.213.998 0 .55-.54.998-1.212.998z"></path>     <path d="M4.317 4.52C-2.603 10.353.873 14.85.873 14.85c.57 1.01 3.382 3.1 8.596 3.1 5.21 0 9.314-3.628 9.314-6.44 0-2.813-2.918-2.714-2.918-2.714 1.04-1.554.19-2.65.19-2.65-1.684-2.118-5.404-.16-5.407-.158.772-1.717.11-2.797.11-2.797C8.932.66 4.317 4.52 4.317 4.52zm10.448 7.79s-.467 4.16-6.447 4.16c-5.745 0-5.82-3.322-5.842-3.712 0 0-.073-4.423 6.58-4.654 5.94-.204 5.71 4.207 5.71 4.207zM18.65 7.045s1.018-4.37-3.864-3.818c0 0-.628.58.09 1.346 0 0 2.602-.58 2.397 2.598 0 0 .715.885 1.376-.125z"></path>   </g></g></svg></button><button disabled="" type="button" class="Button Login-socialButton Button--plain"><svg width="17" height="19" viewBox="0 0 18 20" xmlns="http://www.w3.org/2000/svg" class="Icon Login-socialIcon Icon--qq" aria-hidden="true" style="height: 19px; width: 17px;"><title></title><g><title>QQ</title><path d="M9.003 0c-2.265 0-6.29 1.364-6.29 7.325V8.52S.55 12.96.55 15.474c0 .665.17 1.025.28 1.025.115 0 .903-.485 1.75-2.073 0 0-.18 2.197 1.903 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29 0 2.24.425 6.287.687 6.287 0 0-.688-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.11 0 .283-.36.283-1.026 0-2.514-2.166-6.954-2.166-6.954V7.325C15.29 1.365 11.268 0 9.003 0z" fill-rule="evenodd"></path></g></svg></button></span></span></div></form></div><div class="SignContainer-switch">没有帐号？<span>注册</span></div><div class="SignFlowHomepage-qrImage SignFlowHomepage-qrImageHidden"><div></div></div></div></div></div></div><button aria-label="关闭" type="button" class="Button Modal-closeButton Button--plain"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></button></div></div></span></div></div>'))
    createSignflowEvent("card")
}

function clickFollowQuestionButton($this, qid) {
    if (user == null) {
        createSiginCard()
        return
    }

    drawElementsWhenFollowQuestion($this, qid)
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        var res = handleAjaxResponse(xhr)
        if (res === false) {
            drawElementsWhenFollowQuestion($this, qid)
        }
    }
    if ($this.hasClass("Button--blue")) {
        xhr.open("delete", "/api/questions/" + qid + "/followers", true)
    } else if ($this.hasClass("Button--grey")) {
        xhr.open("post", "/api/questions/" + qid + "/followers", true)
    }
    xhr.send()
}

function clickFollowMemberButton($this, member) {
    if (user == null) {
        createSiginCard()
        return
    }

    drawElementsWhenFollowMember($this, member)
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        var res = handleAjaxResponse(xhr)
        if (res === false) {
            drawElementsWhenFollowMember($this, member)
        }
    }
    if ($this.hasClass("Button--blue")) {
        xhr.open("delete", "/api/members/" + member.url_token + "/followers", true)
    } else if ($this.hasClass
        ("Button--grey")) {
        xhr.open("post", "/api/members/" + member.url_token + "/followers", true)
    }
    xhr.send()
}

function clickUpvote(b) {
    if (user == null) {
        createSiginCard()
        return
    }

    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        var res = handleAjaxResponse(xhr)
        if (res === false) {
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
    if (user == null) {
        createSiginCard()
        return
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var res = handleAjaxResponse(xhr)
        if (res === false) {
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
            if (resp.data.length > 0) {
                $(".Topbar.CommentTopbar").after($('<div class="CommentList"></div>'))
            }
            for (; i < resp.data.length; i++) { 
                var button
                if (resp.data[i].author.id == user) {
                    button = '<button type="button" class="Button Button--plain"><svg viewBox="0 0 18 20" class="Icon Icon--trash Icon--left" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M13.464 2s.05-2-1.48-2H6C4.193 0 4.464 2 4.464 2H1.752c-2.57 0-2.09 3.5 0 3.5l1.213 13.027S2.965 20 4.475 20h8.987c1.502 0 1.502-1.473 1.502-1.473l1.2-13.027c2.34 0 2.563-3.5 0-3.5h-2.7zM5.936 16.5l-.58-9h1.8v9h-1.22zm4.824 0v-9h1.8l-.61 9h-1.19z"></path></g></svg>删除</button>'
                } else {
                    button = '<button type="button" class="Button CommentItem-hoverBtn Button--plain"><svg viewBox="0 0 22 16" class="Icon Icon--reply Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M21.96 13.22c-1.687-3.552-5.13-8.062-11.637-8.65-.54-.053-1.376-.436-1.376-1.56V.677c0-.52-.635-.915-1.116-.52L.47 6.67C.18 6.947 0 7.334 0 7.763c0 .376.14.722.37.987 0 0 6.99 6.818 7.442 7.114.453.295 1.136.124 1.135-.5V13c.027-.814.703-1.466 1.532-1.466 1.185-.14 7.596-.077 10.33 2.396 0 0 .395.257.535.257.892 0 .614-.967.614-.967z"></path></g></svg>回复</button><button type="button" class="Button CommentItem-hoverBtn Button--plain"><svg viewBox="0 0 18 20" class="Icon Icon--report Icon--left" width="11" height="16" aria-hidden="true" style="height: 16px; width: 11px;"><title></title><g><path d="M16.947 1.13c-.633.135-3.927.638-5.697.384-3.133-.45-4.776-2.54-9.95-.888C.305 1.04.025 1.664.025 2.646L0 18.807c0 .3.1.54.304.718.195.202.438.304.73.304.275 0 .52-.102.73-.304.202-.18.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V1.964c0-.6-.42-.972-1.053-.835z"></path></g></svg>举报</button>' 
                }
                var isLiked = ""
                if (resp.data[i].is_liked == true) {
                    isLiked = "is-liked"
                }
                $("div.CommentList").append($('<div class="CommentItem"><div><div class="CommentItem-meta"><span class="UserLink CommentItem-avatar"><div class="Popover"><div id="Popover-16289-49101-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-16289-49101-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/' + 
                resp.data[i].author.url_token + '"><img class="Avatar UserLink-avatar" width="24" height="24" src="' + 
                resp.data[i].author.avatar_url + '" alt="' + 
                resp.data[i].author.name + '"></a></div></div></span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/' + 
                resp.data[i].author.url_token + '">' + 
                resp.data[i].author.name + '</a></span><span class="CommentItem-time">' + 
                resp.data[i].date_created + '</span></div><div class="RichText CommentItem-content">' + 
                resp.data[i].content + '</div><div class="CommentItem-footer"><button type="button" class="Button CommentItem-likeBtn ' + 
                isLiked + ' Button--plain"><svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--like Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>' + 
                resp.data[i].like_count + '</button>' + 
                button + '</div></div></div><div></div>'))
                var data = resp.data[i].author
                createCommentsAvatarEvent(data, i)
                createLikeCommentEvent(resp.data[i].id, i)
                if (resp.data[i].author.id == user) {
                    createDeleteCommentEvent(resp.data[i].id, i)
                }
            }       
        }
        if (i == 0) {
            $(".Topbar.CommentTopbar").after($('<div class="Comments-empty"><div class="EmptyState"><div class="EmptyState-inner"><svg xmlns="http://www.w3.org/2000/svg" width="150" height="120" viewbox="0 0 150 120" class="EmptyState-image"><title></title><g><g fill="none" fill-rule="evenodd"><path fill="#EBEEF5" fill-rule="nonzero" d="M106.807 78h8.19A3.004 3.004 0 0 0 118 74.998V34.002A3 3 0 0 0 114.997 31H61.003A3.004 3.004 0 0 0 58 34.002V36h-3v-1.998A6.004 6.004 0 0 1 61.003 28h53.994A6 6 0 0 1 121 34.002v40.996A6.004 6.004 0 0 1 114.997 81h-5.372l-.375 6.004c-.138 2.207-1.514 2.732-3.074 1.172L99 81h-5v-3h6.243l6.178 6.178.388-6.178zM44.824 95.176c-1.56 1.56-2.936 1.035-3.074-1.172L41.312 87H37a6 6 0 0 1-6-6.006V45.006A6.01 6.01 0 0 1 37 39h48a6 6 0 0 1 6 6.006v35.988A6.01 6.01 0 0 1 85 87H53l-8.176 8.176zm-.245-3.998L51.755 84H85c1.65 0 3-1.35 3-3.006V45.006A3 3 0 0 0 85 42H37c-1.65 0-3 1.35-3 3.006v35.988A3 3 0 0 0 37 84h7.13l.45 7.178z"></path><path fill="#F7F8FA" d="M94 49h9.494a1.5 1.5 0 1 1 0 3H94v-3zm0 9h9.494a1.5 1.5 0 1 1 0 3H94v-3zm-50 6.5c0-.828.68-1.5 1.505-1.5h30.99a1.5 1.5 0 1 1 0 3h-30.99A1.5 1.5 0 0 1 44 64.5zm0-14.503c0-.55.453-.997.997-.997h6.006c.55 0 .997.453.997.997v6.006c0 .55-.453.997-.997.997h-6.006c-.55 0-.997-.453-.997-.997v-6.006zM44 73.5c0-.828.68-1.5 1.505-1.5h30.99a1.5 1.5 0 1 1 0 3h-30.99A1.5 1.5 0 0 1 44 73.5z"></path></g></g></svg>还没有评论</div></div></div>'))
        }
    }
    xhr.open("get", "/api/questions/" + qid + "/comments", true);
    xhr.send(); 

    var s = ""
    if ($(".QuestionHeader-Comment").find($("span")).get(0).nextSibling.nodeValue == "添加评论") {
        s = '还没有评论'
    } else {
        s = "<span>" + $(".QuestionHeader-Comment").find($("span")).get(1).firstChild.nodeValue + "</span> 条评论"
    }
    var div = document.createElement("div")
    div.innerHTML = '<div><span><div class="Modal-wrapper"><div class="Modal-backdrop"></div><div class="Modal Modal--fullPage" tabindex="0"><div class="Modal-inner"><div class="Modal-content Modal-content--spread"><div class="Comments-container"><div class="Comments Comments--withEditor"><div class="Topbar CommentTopbar"><div class="Topbar-title"><h2 class="CommentTopbar-title">' + 
    s + '</h2></div><div class="Topbar-options"></div></div><div class="Comments-footer CommentEditor--normal CommentEditor--active"><div class="CommentEditor-input Input-wrapper Input-wrapper--spread Input-wrapper--large Input-wrapper--noPadding is-focus"><div class="Input Editable Editable--focus"><div class="Dropzone RichText" style="min-height: 198px;"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-c2oci">写下你的评论...</div></div><div class="DraftEditor-editorContainer"><div class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" tabindex="0" style="outline: none; white-space: pre-wrap; word-wrap: break-word;" aria-describedby="placeholder-c2oci"><div data-contents="true"><div class="Editable-unstyled" data-block="true" data-editor="c2oci" data-offset-key="gjjj-0-0"><div data-offset-key="gjjj-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="gjjj-0-0"><br data-text="true"></span></div></div></div></div></div></div></div><input multiple="" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"><div></div></div></div><button type="button" class="Button CommentEditor-singleButton Button--primary Button--blue" disabled>评论</button></div></div></div></div></div><button aria-label="关闭" type="button" class="Button Modal-closeButton Button--plain"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></button></div></div></span></div>'
    document.getElementsByTagName("body").item(0).appendChild(div);

    var closeButton = document.getElementsByClassName("Modal-closeButton");
    closeButton[0].addEventListener("click", function() {
        clickListCloseButton(div);
    }, false);

    $(".Button.CommentEditor-singleButton.Button--primary.Button--blue").on("click", function() {
        clickSendComment()
    })

    $(".notranslate.public-DraftEditor-content").on("focus", function() {
        $(".Comments-footer").addClass("CommentEditor--active")
        $(".CommentEditor-input").addClass("is-focus")
        $(".Input.Editable").addClass("Editable--focus")
    })
    $(".notranslate.public-DraftEditor-content").on("blur", function() {
        setTimeout(function(){
            $(".Comments-footer").removeClass("CommentEditor--active")
            $(".CommentEditor-input").removeClass("is-focus")
            $(".Input.Editable").removeClass("Editable--focus")
        },500)
    })
    // $(".notranslate.public-DraftEditor-content").on("textInput", function() {
    //     $(".notranslate.public-DraftEditor-content").attr("aria-describedby") = "placeholder-1lrhc"
    // })
    $(".notranslate.public-DraftEditor-content").on("keydown", function(e) {
        if(event.keyCode==8) {//keycode为8表示退格键            
            //alert($('span[data-offset-key="gjjj-0-0"]').text())
            if ($('span[data-offset-key="gjjj-0-0"]').text().length == 1) {
                $(".Button.CommentEditor-singleButton.Button--primary.Button--blue").attr("disabled", true)
                $('.DraftEditor-root').prepend($('<div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-asf8r">写下你的评论...</div></div>'))
            }
            
            if ($(".Editable-unstyled").find("span[data-offset-key='gjjj-0-0']").text().length == 1) {
                //e.preventDefault()
                $(".Editable-unstyled").find("span[data-offset-key='gjjj-0-0']").append($('<br data-text="true">'))
                
            }
            else if ($(".Editable-unstyled").find("span[data-offset-key='gjjj-0-0']:last").text().length == 0) {
                // alert($(".Editable-unstyled").length)
                 if ($("span[data-offset-key='gjjj-0-0']").length == 2) {
                    $(".Button.CommentEditor-singleButton.Button--primary.Button--blue").attr("disabled", true)
                    $('.DraftEditor-root').prepend($('<div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-asf8r">写下你的评论...</div></div>'))     
                 } else if ($("span[data-offset-key='gjjj-0-0']").length == 1) {
                     e.preventDefault()
                 }
            }
        }
        else {
            $(".public-DraftEditorPlaceholder-root").remove()
            $(".Button.CommentEditor-singleButton.Button--primary.Button--blue").removeAttr("disabled")
        }
    })
}

function clickSendComment() {
    if (user == null) {
        createSiginCard()
        return
    }

    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText)
            //clear input field
            $(".Editable-unstyled:last").find("span[data-offset-key='gjjj-0-0']").html('<br data-text="true">')
            //show comment sent
            if ($(".Topbar.CommentTopbar").next().hasClass("Comments-empty")) {
                $(".Topbar.CommentTopbar").next().remove()
                $(".Topbar.CommentTopbar").after($('<div class="CommentList"></div>'))
            }
            $("div.CommentList").prepend($('<div class="CommentItem"><div><div class="CommentItem-meta"><span class="UserLink CommentItem-avatar"><div class="Popover"><div id="Popover-16289-49101-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-16289-49101-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/' + 
            resp.author.url_token + '"><img class="Avatar UserLink-avatar" width="24" height="24" src="' + 
            resp.author.avatar_url + '" alt="' + 
            resp.author.name + '"></a></div></div></span><span class="UserLink"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="//www.zhihu.com/people/' + 
            resp.author.url_token + '">' + 
            resp.author.name + '</a></span><span class="CommentItem-time">' + 
            resp.date_created + '</span></div><div class="RichText CommentItem-content">' + 
            resp.content + '</div><div class="CommentItem-footer"><button type="button" class="Button CommentItem-likeBtn Button--plain"><svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--like Icon--left" width="13" height="16" aria-hidden="true" style="height: 16px; width: 13px;"><title></title><g><path d="M.718 7.024c-.718 0-.718.63-.718.63l.996 9.693c0 .703.718.65.718.65h1.45c.916 0 .847-.65.847-.65V7.793c-.09-.88-.853-.79-.846-.79l-2.446.02zm11.727-.05S13.2 5.396 13.6 2.89C13.765.03 11.55-.6 10.565.53c-1.014 1.232 0 2.056-4.45 5.83C5.336 6.965 5 8.01 5 8.997v6.998c-.016 1.104.49 2 1.99 2h7.586c2.097 0 2.86-1.416 2.86-1.416s2.178-5.402 2.346-5.91c1.047-3.516-1.95-3.704-1.95-3.704l-5.387.007z"></path></g></svg>赞</button><button type="button" class="Button Button--plain"><svg viewBox="0 0 18 20" class="Icon Icon--trash Icon--left" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M13.464 2s.05-2-1.48-2H6C4.193 0 4.464 2 4.464 2H1.752c-2.57 0-2.09 3.5 0 3.5l1.213 13.027S2.965 20 4.475 20h8.987c1.502 0 1.502-1.473 1.502-1.473l1.2-13.027c2.34 0 2.563-3.5 0-3.5h-2.7zM5.936 16.5l-.58-9h1.8v9h-1.22zm4.824 0v-9h1.8l-.61 9h-1.19z"></path></g></svg>删除</button></div></div></div><div></div>'))
            createCommentsAvatarEvent(resp.author, 0)
            if (resp.author.id == user) {
                createDeleteCommentEvent(resp.id, 0)
            }
            //add comment count
            if ($(".QuestionHeader-Comment").find($("span")).get(0).nextSibling.nodeValue == "添加评论") {
                $(".QuestionHeader-Comment").find($("span")).get(0).nextSibling.nodeValue = " 条评论"
                $(".QuestionHeader-Comment").find($("span")).after($("<span>1</span>"))
            } else {
                $(".QuestionHeader-Comment").find($("span")).get(1).firstChild.nodeValue++
            }
            if ($("h2.CommentTopbar-title").text() == "还没有评论") {
                $("h2.CommentTopbar-title").text(" 条评论")
                $("h2.CommentTopbar-title").prepend($("<span>1</span>"))
            } else {
                $("h2.CommentTopbar-title").children().get(0).firstChild.nodeValue++
            }
            //notify comment done
            $("body").append($('<div><div><span><div class="AppHeader-notification Notification Notification-white Notification-leave-active"><div class="Notification-textSection Notification-textSection--withoutButton">评论发布成功！</div></div></span></div></div>'))
            setTimeout(function() {
                $("div.AppHeader-notification.Notification.Notification-white:last").parent().parent().parent().remove()
            }, 1000)
            //if sent, dont't update comments next time
            //XXX: vsar sentMyComment = true
            return
        } else if (xhr.status === 403) {
            var resp = xhr.responseText()
            if (resp.message == "not authorized") {
                window.location.href = "/signin"
                return
            }
        }
    }
    xhr.open("post", "/api/questions/" + questionData.id + "/comments", true)
    var content =""
    for (i = 0; i < $(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr").length; i++) {
        content += '<p>'+$(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr").eq(i).text()+'</p>'  
    }
    xhr.send('{"content":"' + content + '"}')
}

function clickDeleteComment(id, i) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        if (xhr.status === 204) {
            $("div.CommentItem").eq(i).remove()
            $("h2.CommentTopbar-title").find($("span")).get(0).firstChild.nodeValue--
            if ($("h2.CommentTopbar-title").find($("span")).get(0).firstChild.nodeValue == 0) {
                $("h2.CommentTopbar-title").html("还没有评论")
                $(".Topbar.CommentTopbar").after($('<div class="Comments-empty"><div class="EmptyState"><div class="EmptyState-inner"><svg xmlns="http://www.w3.org/2000/svg" width="150" height="120" viewbox="0 0 150 120" class="EmptyState-image"><title></title><g><g fill="none" fill-rule="evenodd"><path fill="#EBEEF5" fill-rule="nonzero" d="M106.807 78h8.19A3.004 3.004 0 0 0 118 74.998V34.002A3 3 0 0 0 114.997 31H61.003A3.004 3.004 0 0 0 58 34.002V36h-3v-1.998A6.004 6.004 0 0 1 61.003 28h53.994A6 6 0 0 1 121 34.002v40.996A6.004 6.004 0 0 1 114.997 81h-5.372l-.375 6.004c-.138 2.207-1.514 2.732-3.074 1.172L99 81h-5v-3h6.243l6.178 6.178.388-6.178zM44.824 95.176c-1.56 1.56-2.936 1.035-3.074-1.172L41.312 87H37a6 6 0 0 1-6-6.006V45.006A6.01 6.01 0 0 1 37 39h48a6 6 0 0 1 6 6.006v35.988A6.01 6.01 0 0 1 85 87H53l-8.176 8.176zm-.245-3.998L51.755 84H85c1.65 0 3-1.35 3-3.006V45.006A3 3 0 0 0 85 42H37c-1.65 0-3 1.35-3 3.006v35.988A3 3 0 0 0 37 84h7.13l.45 7.178z"></path><path fill="#F7F8FA" d="M94 49h9.494a1.5 1.5 0 1 1 0 3H94v-3zm0 9h9.494a1.5 1.5 0 1 1 0 3H94v-3zm-50 6.5c0-.828.68-1.5 1.505-1.5h30.99a1.5 1.5 0 1 1 0 3h-30.99A1.5 1.5 0 0 1 44 64.5zm0-14.503c0-.55.453-.997.997-.997h6.006c.55 0 .997.453.997.997v6.006c0 .55-.453.997-.997.997h-6.006c-.55 0-.997-.453-.997-.997v-6.006zM44 73.5c0-.828.68-1.5 1.505-1.5h30.99a1.5 1.5 0 1 1 0 3h-30.99A1.5 1.5 0 0 1 44 73.5z"></path></g></g></svg>还没有评论</div></div></div>'))
                $("div.CommentList").remove()
            }
            $(".QuestionHeader-Comment").find($("span")).get(1).firstChild.nodeValue--
            if ($(".QuestionHeader-Comment").find($("span")).get(1).firstChild.nodeValue == 0) {
                $(".QuestionHeader-Comment").find($("span")).eq(0).siblings().remove()
                $(".QuestionHeader-Comment").find($("span")).get(0).nextSibling.nodeValue = ""
                $(".QuestionHeader-Comment").find($("span")).eq(0).after("添加评论")
            }
        }
    }
    xhr.open("delete", "/api/questions/" + questionData.id + "/comments/" + id, true)
    xhr.send()
}

function clickLikeComment(id, i) {
    if (user == null) {
        createSiginCard()
        return
    }

    var xhr = new XMLHttpRequest()
    if ($("div.CommentItem-footer").eq(i).children().eq(0).hasClass("is-liked")) {
        xhr.onload = function() {
            if (xhr.status === 200) {
                $("div.CommentItem-footer").eq(i).children().eq(0).removeClass("is-liked")
                $("div.CommentItem-footer").eq(i).children().eq(0).children().get(0).nextSibling.nodeValue--           
                if ($("div.CommentItem-footer").eq(i).children().eq(0).children().get(0).nextSibling.nodeValue == 0) {
                    $("div.CommentItem-footer").eq(i).children().eq(0).children().get(0).nextSibling.nodeValue = "赞"
                }
            }
        }
        xhr.open("delete", "/api/questions/" + questionData.id + "/comments/" + id + "/actions/like", true)
    } else {
        xhr.onload = function() {
            if (xhr.status === 200) {
                $("div.CommentItem-footer").eq(i).children().eq(0).addClass("is-liked")
                if ($("div.CommentItem-footer").eq(i).children().eq(0).children().get(0).nextSibling.nodeValue == "赞") {//
                    $("div.CommentItem-footer").eq(i).children().eq(0).children().get(0).nextSibling.nodeValue = 1
                } else {
                    $("div.CommentItem-footer").eq(i).children().eq(0).children().get(0).nextSibling.nodeValue++            
                }
            }
        }
        xhr.open("post", "/api/questions/" + questionData.id + "/comments/" + id + "/actions/like", true)
    }
    xhr.send()
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
            var $voterListContent = $(".VoterList-content")
            for (i = 0; i < resp.data.length; i++) {   
                var ContentItemExtraFollowButton = "";
                if (resp.data[i].id != user.id) {
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
    if (dataState.page == "answer" &&  member.id == dataState.answers[0].author.id) {
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

function createLikeCommentEvent(id, i) {
    $("div.CommentItem-footer").eq(i).children().eq(0).on("click", function() {
        clickLikeComment(id, i)
    })
}

function createDeleteCommentEvent(id, i) {
    $("div.CommentItem-footer").eq(i).children().eq(1).on("click", function() {
        clickDeleteComment(id, i)
    })
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

function createCommentsAvatarEvent(data, i) {
    $("div.Modal-wrapper").find($("img.Avatar.UserLink-avatar")).eq(i).on("mouseover", function(e) {
        handleMouseOverUserEvent(e, data, i)
    })
    $("div.Modal-wrapper").find($("img.Avatar.UserLink-avatar")).eq(i).on("mouseout", function(e) {     
        handleMouseOutUserEvent(e)
    })
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
    var top 
    var left = $target.offset().left;
    if (e.target.className == "UserLink-link") {
        top = $target.offset().top + 25
    } else {
        top = $target.offset().top + parseInt($target.attr("width"))
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
    if (user.id != data.id) {
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
        if ($("div.VoterList").length > 0) {
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
    createUpvoteEvent(button)
    createDownvoteEvent(button)
    
    button.$contentItemMeta.on("click", function(){
        clickVoterList(button.answerId, $(this).find("button.Button.Button--plain").find("span").get(0).firstChild.nodeValue);
    });   
    //author avatar clickover event
    createMouseOverAnswerAuthorEvent(i)
}

function createUpvoteEvent(button){
    button.upButton.addEventListener("click", function(){
        clickUpvote(button);
    }, false);                      
}

function createDownvoteEvent(button) {
    button.downButton.addEventListener("click", function(){
        clickDownvote(button);
    }, false);
}

function createMouseOverAnswerAuthorEvent(i) {
    $answerItems.eq(i).on("mouseover", ".UserLink-link", function(e) {
        handleMouseOverUserEvent(e, dataState.answers[i].author, i)
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
if (dataState.page == "answer") {
    authorFollowButtons[0] = $(".Button.FollowButton.Button--primary").eq(1)
    $(".Button.FollowButton.Button--primary").eq(1).on("click", function() {  
        answerAuthorFollowButtonClicked = true
        clickFollowMemberButton($(this), dataState.answers[0].author)
        answerAuthorFollowButtonClicked = false
    })
}
//question comments
$(".QuestionHeader-Comment").children().eq(0).on("click", function() {
    clickQuestionComments(questionData.id)
})

var addAnswerClicked = false
$("div.QuestionButtonGroup").children().eq(1).on("click", function() {
    if (user == null) {
        createSiginCard()
        return
    }
    if ($(this).text() == "撤销删除") {//restore answer
        var xhr = new XMLHttpRequest()
        xhr.onload = function() {
            var res = handleAjaxResponse(xhr)
            if (res === false) {
                return
            }
            window.location.href = "/question/" + dataState.question.id + "/answer/" + dataState.question.visitor_answer_id
        }
        xhr.open("post", "/api/answers/" + dataState.question.visitor_answer_id + "/actions/restore")
        xhr.send()
    } else if ($(this).text() == "写回答") {//add answer
        if (addAnswerClicked === true) {
            return
        }
        createAnswerEditorEvent()  
        addAnswerClicked = true
    }
})

$("button.QuestionAnswers-answerButton.Button--spread").on("click", function() {
    if (user == null) {
        createSiginCard()
        return
    }
    if ($(this).text() == "撤销删除") {//restore answer
        var xhr = new XMLHttpRequest()
        xhr.onload = function() {
            var res = handleAjaxResponse(xhr)
            if (res === false) {
                return
            }
            window.location.href = "/question/" + dataState.question.id + "/answer/" + dataState.question.visitor_answer_id
        }
        xhr.open("post", "/api/answers/" + dataState.question.visitor_answer_id + "/actions/restore")
        xhr.send()
    } else if ($(this).text() == "写回答") {//add answer
        $("html,body").animate({scrollTop:$("div.Question-mainColumn").offset().top},500)
        if (addAnswerClicked === true) {
            return
        }
        createAnswerEditorEvent()    
        addAnswerClicked = true   
    }
})
//'<a type="button" class="Button QuestionAnswers-answerButton Button--blue Button--spread" href="/question/21102350/answer/400270420"><svg class="Zi Zi--Preview QuestionButton-icon" fill="currentColor" viewBox="0 0 24 24" width="17" height="17"><path d="M19.49 14.362l-2.03-1.83 1.116-1.137a1.352 1.352 0 0 1 1.921-.009c.535.535.54 1.4.01 1.94l-1.016 1.036zm-4.883 4.935a2.3 2.3 0 0 1-1.12.63l-1.136.264c-.29.058-.668-.105-.56-.56l.27-1.158a2.3 2.3 0 0 1 .599-1.09l3.809-3.84 2.03 1.829-3.892 3.925zM4.06 5H19.94C20.526 5 21 5.448 21 6s-.474 1-1.059 1H4.06C3.474 7 3 6.552 3 6s.474-1 1.059-1zM4 11h9a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h4a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" fill-rule="evenodd"></path></svg>查看回答</a>'
//'<button type="button" class="Button QuestionAnswers-answerButton Button--blue Button--spread"><svg class="Zi Zi--Undo QuestionButton-icon" fill="currentColor" viewBox="0 0 24 24" width="17" height="17"><path d="M12 9h.009c4.65-.014 8.642 5.096 8.705 9.629 0 .36-.303.461-.592 0-1.474-2.544-3.878-3.862-7.03-3.862h-1.084L12 17.583a.7.7 0 0 1-1.125.556l-7.16-5.478a.7.7 0 0 1-.009-1.105l7.16-5.66a.7.7 0 0 1 1.134.55V9z"></path></svg>撤销删除</button>'
function createAnswerEditorEvent() {
    if (user == null) {
        createSiginCard()
        return
    }
    $("div.Question-mainColumn").prepend($('<div class="QuestionAnswers-statusWrapper"><div class="Card QuestionAnswers-answerAdd"><a name="draft"></a><div class="AnswerAdd"><div class="AnswerAdd-header"><div class="AuthorInfo AnswerAdd-info" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><meta itemprop="name" content="' + 
    user.name + '"><meta itemprop="image" content="' + 
    user.avatar_url + '"><meta itemprop="url" content="https://www.zhihu.com/people/' + 
    user.url_token + '"><meta itemprop="zhihu:followerCount"><span class="UserLink AuthorInfo-avatarWrapper"><img class="Avatar AuthorInfo-avatar" width="38" height="38" src="' + 
    user.avatar_url + '" alt="' + 
    user.name + '"></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name">' + 
    user.name + '</span></div><div class="AuthorInfo-detail"><div class="AuthorInfo-badge"><button type="button" class="Button ModifyButton AnswerAdd-topicBiosButton Button--link"><svg viewBox="0 0 12 12" class="Icon ModifyButton-icon Icon--modify" width="12" height="16" aria-hidden="true" style="height: 16px; width: 12px;"><title></title><g><path d="M.423 10.32L0 12l1.667-.474 1.55-.44-2.4-2.33-.394 1.564zM10.153.233c-.327-.318-.85-.31-1.17.018l-.793.817 2.49 2.414.792-.814c.318-.328.312-.852-.017-1.17l-1.3-1.263zM3.84 10.536L1.35 8.122l6.265-6.46 2.49 2.414-6.265 6.46z" fill-rule="evenodd"></path></g></svg>编辑话题经验</button></div></div></div></div><button type="button" class="Button AnswerAdd-toggleAnonymous Button--plain">使用匿名身份回答</button></div><form class="AnswerForm" novalidate="" data-za-detail-view-path-module="AnswerEditView" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Answer&quot;,&quot;parent_token&quot;:&quot;23326075&quot;,&quot;author_member_hash_id&quot;:&quot;752703f243346089cf30e031bb117e9e&quot;}}}"><div class=""><div class=""><div class="AnswerForm-editor AnswerForm-container Input-wrapper Input-wrapper--spread Input-wrapper--large Input-wrapper--noPadding"><div class="Input Editable"><div><div class="Editable-toolbar Sticky" style=""><button aria-label="粗体" data-tooltip="粗体 (Ctrl+B)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--FormatBold" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M9 17.025V13h4.418c1.19 0 2.415.562 2.415 2.012s-1.608 2.013-2.9 2.013H9zM9 7h4.336c1 0 1.814.888 1.814 2 0 .89-.814 2-1.814 2H9V7zm8.192 1.899a3.893 3.893 0 0 0-3.888-3.889S9.334 5 8.167 5C7 5 7 6.167 7 6.167v11.666C7 19 8.167 19 8.167 19l5.572.01c2.333 0 4.231-1.86 4.231-4.148a4.122 4.122 0 0 0-1.77-3.372 3.873 3.873 0 0 0 .992-2.591z" fill-rule="evenodd"></path></svg></button><button aria-label="斜体" data-tooltip="斜体 (Ctrl+I)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--FormatItalic" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M15.751 5h-5.502a.751.751 0 0 0-.749.75c0 .417.336.75.749.75H12l-2 11H8.249a.751.751 0 0 0-.749.75c0 .417.336.75.749.75h5.502a.751.751 0 0 0 .749-.75.748.748 0 0 0-.749-.75H12l2-11h1.751a.751.751 0 0 0 .749-.75.748.748 0 0 0-.749-.75" fill-rule="evenodd"></path></svg></button><span class="Editable-toolbar-separator"></span><button aria-label="标题" data-tooltip="标题 (Ctrl+Alt+1)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--FormatHeader" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M7 6.007C7 5.45 7.444 5 8 5c.552 0 1 .45 1 1.007v11.986C9 18.55 8.556 19 8 19c-.552 0-1-.45-1-1.007V6.007zm8 0C15 5.45 15.444 5 16 5c.552 0 1 .45 1 1.007v11.986C17 18.55 16.556 19 16 19c-.552 0-1-.45-1-1.007V6.007zM9 11h6v2H9v-2z" fill-rule="evenodd"></path></svg></button><button aria-label="引用块" data-tooltip="引用块 (Ctrl+Shift+U)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--FormatBlockquote" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M17.975 12.209c.504.454.822 1.05.952 1.792.061.35.055.715-.022 1.096-.075.379-.209.718-.4 1.018-.465.73-1.155 1.175-2.07 1.337-.874.153-1.684-.06-2.432-.638a3.6 3.6 0 0 1-.916-1.043 3.92 3.92 0 0 1-.506-1.336c-.172-.98-.03-2.026.425-3.142.455-1.116 1.155-2.118 2.1-3.007.8-.757 1.456-1.182 1.97-1.273a.72.72 0 0 1 .544.104.656.656 0 0 1 .286.452c.054.31-.095.601-.45.877-.856.67-1.455 1.27-1.796 1.798-.323.513-.467.873-.43 1.079.034.196.21.287.524.274l.191-.001.249-.029a2.436 2.436 0 0 1 1.781.642zm-7.51 0c.504.454.821 1.05.951 1.792.062.35.056.715-.02 1.096-.077.379-.21.718-.401 1.018-.465.73-1.155 1.175-2.07 1.337-.874.153-1.684-.06-2.432-.638a3.6 3.6 0 0 1-.916-1.043 3.92 3.92 0 0 1-.506-1.336c-.172-.98-.03-2.026.424-3.142.455-1.116 1.156-2.118 2.101-3.007.8-.757 1.456-1.182 1.97-1.273a.72.72 0 0 1 .544.104.656.656 0 0 1 .285.452c.055.31-.094.601-.45.877-.855.67-1.454 1.27-1.796 1.798-.322.513-.466.873-.43 1.079.034.196.21.287.525.274l.191-.001.248-.029a2.436 2.436 0 0 1 1.782.642z" fill-rule="evenodd"></path></svg></button><button aria-label="代码块" data-tooltip="代码块 (Ctrl+Alt+C)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--FormatCode" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M19.718 11.559a.961.961 0 0 1 .007 1.352l-2.201 2.033-1.319 1.219a.937.937 0 0 1-1.33-.005.961.961 0 0 1-.001-1.345l2.813-2.576-2.804-2.568a.96.96 0 0 1-.008-1.352.963.963 0 0 1 1.337 0l2.475 2.289 1.031.953zm-7.462-5.567a1.001 1.001 0 0 1 1.16-.818c.544.096.907.616.81 1.165l-2.082 11.804a1.001 1.001 0 0 1-1.16.818 1.003 1.003 0 0 1-.81-1.165l2.082-11.804zM9.123 8.316a.96.96 0 0 1 0 1.345l-2.812 2.575 2.806 2.569a.962.962 0 0 1 .006 1.35.935.935 0 0 1-1.337 0l-2.093-1.934-1.412-1.305a.961.961 0 0 1-.007-1.352l2.833-2.62.685-.634c.345-.35.976-.354 1.331.006z" fill-rule="evenodd"></path></svg></button><button aria-label="有序列表" data-tooltip="有序列表 (Ctrl+Shift+7)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--InsertOrderedList" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M9 6.5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 6.5zM5.884 7.893v-2.09h-.643L5.402 5h1.285v2.893h-.803zm.898 3.83l-.393.395h.862v.733H5v-.482l1.057-.892c.371-.312.461-.434.463-.566.003-.202-.135-.368-.396-.368-.289 0-.418.206-.418.43H5c0-.642.482-1.073 1.125-1.073s1.125.457 1.125.945c0 .307-.106.516-.468.877zM9 11.5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01a.995.995 0 0 1-.995-1zm0 5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01a.995.995 0 0 1-.995-1zm-1.759.624c0 .14-.025.27-.076.388a.902.902 0 0 1-.217.309 1.017 1.017 0 0 1-.336.205c-.13.05-.275.074-.437.074-.166 0-.32-.027-.462-.08a1.166 1.166 0 0 1-.367-.217 1.062 1.062 0 0 1-.246-.318.914.914 0 0 1-.1-.38v-.055h.765v.054a.343.343 0 0 0 .367.352c.117 0 .207-.03.27-.09.062-.06.093-.152.093-.277 0-.117-.039-.206-.117-.268a.506.506 0 0 0-.32-.091h-.14v-.516h.144c.117 0 .205-.03.264-.09a.31.31 0 0 0 .087-.226.27.27 0 0 0-.087-.209.332.332 0 0 0-.233-.08c-.107 0-.185.027-.236.08a.275.275 0 0 0-.076.197v.055h-.695v-.055a.915.915 0 0 1 .295-.644c.178-.161.436-.242.775-.242.14 0 .27.021.39.064s.224.102.312.176a.802.802 0 0 1 .207.262c.05.1.075.206.075.318 0 .258-.116.46-.348.605v.008a.625.625 0 0 1 .193.119.777.777 0 0 1 .256.572z" fill-rule="evenodd"></path></svg></button><button aria-label="无序列表" data-tooltip="无序列表 (Ctrl+Shift+8)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain">' + 
    '<svg class="Zi Zi--InsertUnorderedList" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M9 7c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 7zM6 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-6c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 12zm0 5c0-.552.456-1 .995-1h8.01c.55 0 .995.444.995 1 0 .552-.456 1-.995 1h-8.01A.995.995 0 0 1 9 17z" fill-rule="evenodd"></path></svg></button><span class="Editable-toolbar-separator"></span><button aria-label="插入链接" data-tooltip="插入链接 (Ctrl+K)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--InsertLink" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M6.77 17.23c-.905-.904-.94-2.333-.08-3.193l3.059-3.06-1.192-1.19-3.059 3.058c-1.489 1.489-1.427 3.954.138 5.519s4.03 1.627 5.519.138l3.059-3.059-1.192-1.192-3.059 3.06c-.86.86-2.289.824-3.193-.08zm3.016-8.673l1.192 1.192 3.059-3.06c.86-.86 2.289-.824 3.193.08.905.905.94 2.334.08 3.194l-3.059 3.06 1.192 1.19 3.059-3.058c1.489-1.489 1.427-3.954-.138-5.519s-4.03-1.627-5.519-.138L9.786 8.557zm-1.023 6.68c.33.33.863.343 1.177.029l5.34-5.34c.314-.314.3-.846-.03-1.176-.33-.33-.862-.344-1.176-.03l-5.34 5.34c-.314.314-.3.846.03 1.177z" fill-rule="evenodd"></path></svg></button><button aria-label="上传图片" data-tooltip="上传图片" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--InsertImage" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M21 17.444C21 18.3 20.1 19 19 19H5c-1.1 0-2-.7-2-1.556V6.556C3 5.7 3.9 5 5 5h14c1.1 0 2 .7 2 1.556v10.888zm-9.437-3.919a.5.5 0 0 1-.862.013l-1.26-2.065a.5.5 0 0 0-.861.012l-2.153 3.767a.5.5 0 0 0 .435.748h10.292a.5.5 0 0 0 .438-.741L14.573 9.78a.5.5 0 0 0-.872-.006l-2.138 3.75z" fill-rule="evenodd"></path></svg></button><button aria-label="上传视频" data-tooltip="上传视频" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--InsertVideo" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M10.546 15c-.466.273-.86.053-.86-.5V9.505c0-.565.385-.778.86-.501l4.278 2.497c.466.272.475.726 0 1.003L10.546 15zM5 5S3 5 3 7v10s0 2 2.002 2H19c2 0 2-2 2-2V7c0-2-2-2-2-2H5z" fill-rule="evenodd"></path></svg></button><button aria-label="插入公式" data-tooltip="插入公式 (Ctrl+Shift+E)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--InsertFormula" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M9.033 16.182l3.083-4.133a.885.885 0 0 0 .003-1.12L9.033 6.817h7.985c.606-.03.982-.362.982-.92C18 5.34 17.611 5 17.018 5H6.922a.93.93 0 0 0-.83.509.882.882 0 0 0 .109.946L10 11.5l-3.782 5.037c-.29.289-.246.743-.122.974.172.316.455.489.799.489v-.211l.029.21h10.094c.501 0 .982-.32.982-.909 0-.59-.483-.857-.982-.908H9.033z" fill-rule="evenodd"></path></svg></button><button aria-label="插入分割线" data-tooltip="插入分割线 (Ctrl+Shift+S)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--InsertDivider" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M4 7c0-.552.445-1 1-1h14c.552 0 1 .444 1 1 0 .552-.445 1-1 1H5c-.552 0-1-.444-1-1zm0 5a1 1 0 0 1 1.01-1h1.98a1 1 0 1 1 0 2H5.01C4.451 13 4 12.556 4 12zm6 0a1 1 0 0 1 1.01-1h1.98a1 1 0 1 1 0 2h-1.98c-.558 0-1.01-.444-1.01-1zm6 0a1 1 0 0 1 1.01-1h1.98a1 1 0 1 1 0 2h-1.98c-.558 0-1.01-.444-1.01-1zM4 17c0-.552.445-1 1-1h14c.552 0 1 .444 1 1 0 .552-.445 1-1 1H5c-.552 0-1-.444-1-1z" fill-rule="evenodd"></path></svg></button><span class="Editable-toolbar-separator"></span><button aria-label="清除格式" data-tooltip="清除格式 (Ctrl+\)" data-tooltip-position="bottom" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--FormatClear" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M9.864 12.83l1.641 1.642-1.171 2.874a1.693 1.693 0 0 1-1.585 1.055.782.782 0 0 1-.716-1.077l1.83-4.494zM11.5 8.811L12.24 7H9.69l-2-2h10.672a1 1 0 1 1 0 2h-3.813l-1.406 3.452L11.5 8.811zM5.293 6.845a1 1 0 0 1 1.414 0l10.046 10.046a1 1 0 0 1-1.414 1.414L5.293 8.26a1 1 0 0 1 0-1.415z" fill-rule="evenodd"></path></svg></button><div class="Popover Editable-toolbarMenu"><button aria-label="更多" data-tooltip="更多" data-tooltip-position="bottom" id="Popover-68981-65134-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-68981-65134-content" type="button" class="Button Editable-control Button--plain"><svg class="Zi Zi--Dots" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M5 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill-rule="evenodd"></path></svg></button></div><span class="Editable-toolbar-separator"></span><button data-tooltip-position="bottom" type="button" class="Button AnswerForm-enterFullscreenButton Editable-control Button--plain"><svg class="Zi Zi--FullscreenEnter" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M20.227 3a.777.777 0 0 1 .773.773V8.67c-.062.432-.404.774-.801.772-.453-.003-.799-.347-.801-.772V5.758a2194.05 2194.05 0 0 0-4.584 4.583c-.975.983-2.136-.177-1.158-1.155 0 0 3.148-3.166 4.582-4.584h-2.93c-.496 0-.77-.413-.773-.801-.003-.462.339-.804.774-.801h4.918zM9.187 13.659c.974-.983 2.135.177 1.155 1.155 0 0-3.147 3.166-4.581 4.584h2.93c.494 0 .77.413.772.801.004.462-.338.804-.773.801H3.772A.776.776 0 0 1 3 20.229v-4.9c.062-.432.404-.774.801-.772.453.003.799.347.801.772v2.913c1.14-1.134 3.794-3.789 4.584-4.583z" fill-rule="evenodd"></path></svg><span>全屏模式</span></button></div></div><div class="Dropzone RichText ztext" style="min-height: 118px;"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-5vam6">写回答...</div></div><div class="DraftEditor-editorContainer"><div aria-describedby="placeholder-5vam6" class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" tabindex="0" style="outline: none; white-space: pre-wrap; word-wrap: break-word;"><div data-contents="true"><div class="Editable-unstyled" data-block="true" data-editor="5vam6" data-offset-key="21jok-0-0"><div data-offset-key="21jok-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="21jok-0-0"><br data-text="true"></span></div></div></div></div></div></div></div><input multiple="" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" style="display: none;"><div></div></div></div></div><div><div class="Sticky AnswerForm-footer is-bottom"><div class="AnswerForm-footerContent AnswerForm-container"><div class="AnswerForm-status"></div><div class="AnswerForm-footerRight"><div class="Popover"><button type="button" id="Popover-68807-72499-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover-68807-72499-content" class="Button Button--plain"><svg viewBox="0 0 20 20" class="Icon Icon--setting Icon--left" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path></g></svg>设置</button></div><button type="button" class="Button AnswerForm-submit Button--primary Button--blue">提交回答</button></div></div></div></div></div><input type="file" accept="image/png,image/jpeg" style="display: none;"></form></div></div></div>'))
    $(".notranslate.public-DraftEditor-content").focus()
    //handle input box
    var placeholderAdding = false
    $(".notranslate.public-DraftEditor-content").on("keydown", function(e) {
        if(event.keyCode==8) {//keycode为8表示退格键            
            //alert($('span[data-offset-key="21jok-0-0"]').text())
            if ($('span[data-offset-key="21jok-0-0"]').text().length == 1) {
                $('.DraftEditor-root').prepend($('<div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-asf8r">写回答...</div></div>'))
                placeholderAdding = true
            }
            
            if ($("span[data-offset-key='21jok-0-0']").text().length == 1) {
                //e.preventDefault()
                $("span[data-offset-key='21jok-0-0']").append($('<br data-text="true">'))
                
            }
            else if ($("span[data-offset-key='21jok-0-0']:last").text().length == 0) {
                // alert($(".Editable-unstyled").length)
                 if ($("span[data-offset-key='21jok-0-0']").length == 2) {
                    $('.DraftEditor-root').prepend($('<div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-asf8r">写回答...</div></div>'))     
                 } else if ($("span[data-offset-key='21jok-0-0']").length == 1) {
                     e.preventDefault()
                 }
            }
        }
    })
    $("span[data-offset-key='21jok-0-0']").bind("DOMNodeInserted", function(){
        if (placeholderAdding == false) {
            $(".public-DraftEditorPlaceholder-root").remove()
        }
        placeholderAdding = false
    })
    //commit answer
    $("button.AnswerForm-submit").on("click", function() {
        if (user == null) {
            createSiginCard()
            return
        }

        var xhr = new XMLHttpRequest()
        xhr.onload = function() {
            var res = handleAjaxResponse(xhr)
            if (res === false) {
                return
            }
            var resp = JSON.parse(xhr.responseText)
            window.location.href = "/question/" + dataState.question.id + "/answer/" + resp.id
        }
        xhr.open("post", "/api/questions/" + dataState.question.id + "/answers", true)
        var content =""
        for (i = 0; i < $(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr").length; i++) {
            content += '<p>'+$(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr").eq(i).text()+'</p>'  
        }
        xhr.send('{"content":"' + content +'"}')
    })
}

//answer setting
$(".Popover.ContentItem-action").find($("button")).on("click", function(e) {
    var $this = $(this)
    if ($this.attr("aria-expanded") == "false") {
        var top = $this.offset().top + 20
        var left = $this.offset().left - 60
        $("body").append('<div><div><span><div class="Popover-content Popover-content--bottom Popover-content--arrowed" id="Popover-63535-73096-content" aria-labelledby="Popover-63535-73096-toggle" style="left: ' + 
        left + 'px; top:' + top + 'px;"><span class="Popover-arrow Popover-arrow--bottom" style="left: 81px; top: 0px;"></span><div class="Menu AnswerItem-selfMenu"><button type="button" class="Button Menu-item AnswerItem-selectMenuItem Button--plain">允许任何人评论</button><button type="button" class="Button Menu-item is-selected AnswerItem-selectMenuItem Button--plain"><svg viewBox="0 0 12 9" class="Icon Button-icon Icon--check" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title><g><path d="M10.896 1.802L4.5 8.182c-.198.197-.467.293-.746.293h-.002c-.28 0-.55-.097-.747-.296L.307 5.472c-.41-.413-.41-1.077.004-1.488.414-.41 1.082-.407 1.494.006l1.952 1.966L9.403.31c.412-.413 1.08-.413 1.492 0 .413.41.413 1.08 0 1.492z"></path></g></svg>关闭评论</button><li class="Menu-divider"></li><button type="button" class="Button Menu-item AnswerItem-selectMenuItem Button--plain">删除</button></div></div></span></div></div>')
        $this.attr("aria-expanded","true")
        //hide setting card clicking other place
        $(document).one("click", function() {
            $("div.Popover-content.Popover-content--bottom.Popover-content--arrowed").parent().parent().parent().remove()
            $this.attr("aria-expanded","false")    
        })
        //delete answer
        $("div.Menu.AnswerItem-selfMenu").find($("button")).eq(2).on("click", function() {
            $("body").append('<div><div><span><div class="Modal-wrapper"><div class="Modal-backdrop"></div><div class="Modal Modal--default ConfirmModal" tabindex="0"><div class="Modal-inner"><h3 class="Modal-title">你确定要删除自己的答案吗？</h3><div class="Modal-subtitle">答案内容不会被永久删除，你还可以撤消本次删除操作。</div><div class="Modal-content"><div class="ModalButtonGroup ModalButtonGroup--vertical"><button type="button" class="Button Button--primary Button--blue">确认</button><button type="button" class="Button">取消</button></div></div></div></div></div></span></div></div>')
            //confirm delete action
            $("div.Modal-wrapper:last").find("button").eq(0).on("click", function() {
                var xhr = new XMLHttpRequest()
                xhr.onload = function() {
                    var res = handleAjaxResponse(xhr)
                    if (res === false) {
                        return
                    }
                    $("div.Modal-wrapper:last").parent().parent().parent().remove()
                    $this.parents("div.List-item").append('<div class="AnswerItem-deleted" data-za-detail-view-path-module="AnswerItem" data-za-extra-module="{&quot;card&quot;:{&quot;has_image&quot;:false,&quot;has_video&quot;:false,&quot;content&quot;:{&quot;type&quot;:&quot;Answer&quot;,&quot;token&quot;:&quot;399228308&quot;,&quot;upvote_num&quot;:0,&quot;comment_num&quot;:0,&quot;publish_timestamp&quot;:null,&quot;parent_token&quot;:&quot;61098126&quot;,&quot;author_member_hash_id&quot;:&quot;752703f243346089cf30e031bb117e9e&quot;}}}">你已经删除了该问题的回答，如果需要修改，请先 &nbsp;<a>撤销删除</a></div>')
                    $this.parents("div.List-item").find(".AnswerItem-deleted").find("a").on("click", function() {
                        var xhr = new XMLHttpRequest()
                        xhr.onload = function() {
                            var res = handleAjaxResponse(xhr)
                            if (res === false) {
                                return
                            }
                            window.location.href = "/question/" + dataState.question.id + "/answer/" + dataState.question.visitor_answer_id
                        }
                        xhr.open("post", "/api/answers/" + dataState.question.visitor_answer_id + "/actions/restore")
                        xhr.send()
                    })
                    $this.parents("div.List-item").children().eq(0).remove()
                    $("div.QuestionButtonGroup").children().eq(1).html('<svg class="Zi Zi--Undo QuestionButton-icon" fill="currentColor" viewBox="0 0 24 24" width="17" height="17"><path d="M12 9h.009c4.65-.014 8.642 5.096 8.705 9.629 0 .36-.303.461-.592 0-1.474-2.544-3.878-3.862-7.03-3.862h-1.084L12 17.583a.7.7 0 0 1-1.125.556l-7.16-5.478a.7.7 0 0 1-.009-1.105l7.16-5.66a.7.7 0 0 1 1.134.55V9z"></path></svg>撤销删除')
                    $(".Button.QuestionAnswers-answerButton.Button--spread").parent().html('<button type="button" class="Button QuestionAnswers-answerButton Button--blue Button--spread"><svg class="Zi Zi--Undo QuestionButton-icon" fill="currentColor" viewBox="0 0 24 24" width="17" height="17"><path d="M12 9h.009c4.65-.014 8.642 5.096 8.705 9.629 0 .36-.303.461-.592 0-1.474-2.544-3.878-3.862-7.03-3.862h-1.084L12 17.583a.7.7 0 0 1-1.125.556l-7.16-5.478a.7.7 0 0 1-.009-1.105l7.16-5.66a.7.7 0 0 1 1.134.55V9z"></path></svg>撤销删除</button>')
                    $(".Button.QuestionAnswers-answerButton.Button--spread").on("click", function() {
                        var xhr = new XMLHttpRequest()
                        xhr.onload = function() {
                            var res = handleAjaxResponse(xhr)
                            if (res === false) {
                                return
                            }
                            window.location.href = "/question/" + dataState.question.id + "/answer/" + dataState.question.visitor_answer_id
                        }
                        xhr.open("post", "/api/answers/" + dataState.question.visitor_answer_id + "/actions/restore")
                        xhr.send()
                    })
                    
                }
                var aid = $this.parents("div.ContentItem.AnswerItem").attr("name")
                xhr.open("delete", "/api/answers/" + aid)
                xhr.send()
            })
            //cancel delete action
            $("div.Modal-wrapper:last").find("button").eq(1).on("click", function() {
                $("div.Modal-wrapper:last").parent().parent().parent().remove()
            })
            e.stopPropagation()
        })
        e.stopPropagation()
    }
})