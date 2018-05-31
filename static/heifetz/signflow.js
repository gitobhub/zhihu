function createSignflowEvent(type) {
    //switch signup or signin
    $("div.SignContainer-switch").one("click", function() {
        if ($("div.SignContainer-inner").children().eq(0).hasClass("Login-content")) {
            $("div.SignFlowHeader-slogen").text("          注册知乎，发现更大的世界")
            $("div.Login-content").attr("class", "Register-content")
            $("div.Register-content").html('<form novalidate><div class="SignFlow-fullname"><div class="SignFlow-supportedCountriesSelectContainer"></div><div class="SignFlowInput SignFlow-fullnameInputContainer"> <div class="SignFlow-fullnameInput Input-wrapper"> <input type="text" value="" name="fullname" class="Input" placeholder="姓名" /> </div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div></div><div class="SignFlow-account"><div class="SignFlow-supportedCountriesSelectContainer"></div><div class="SignFlowInput SignFlow-accountInputContainer"><div class="SignFlow-accountInput Input-wrapper"><input type="text" value="" name="username" class="Input" placeholder="邮箱"></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div></div><div class="SignFlow-password"><div class="SignFlowInput"><div class="Input-wrapper"><input type="password" value="" name="password" class="Input" placeholder="密码（不少于6位）"></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div><button class="Button SignFlow-switchPassword Button--plain" tabindex="-1" type="button"><svg width="24" height="20" viewbox="0 0 24 24" class="Icon SignFlow-switchPasswordIcon Icon--inconspicuous" style="vertical-align:middle;height:20px;width:24px" aria-hidden="true"><title></title><g><title>Inconspicuous</title><path d="M17.007 11.504c0 .65-.13 1.26-.36 1.83l3 3.073S23 14.136 23 11.504C23 8.008 17.255 4 11.995 4c-1.4 0-2.741.25-3.982.701l2.161 2.16c.57-.23 1.18-.36 1.831-.36a5.004 5.004 0 0 1 5.002 5.003zM2.57 4.342l2.067 2.075C3.499 7.258 1 9.119 1 11.504c0 3.336 5.79 7.503 11.005 7.503 1.55 0 3.031-.3 4.382-.84l.42.42 2.125 2.118s.782.571 1.314 0-.074-1.305-.074-1.305L3.955 3.183s-.76-.742-1.385-.19c-.626.554 0 1.35 0 1.35zm4.963 4.96l1.55 1.552c-.05.21-.08.43-.08.65 0 1.66 1.341 3.001 3.002 3.001.22 0 .44-.03.65-.08l1.551 1.551c-.67.33-1.41.53-2.2.53a5.004 5.004 0 0 1-5.003-5.002c0-.79.2-1.53.53-2.201zm4.312-.78l3.151 3.152.02-.16c0-1.66-1.34-3.001-3.001-3.001l-.17.01z" fill-rule="evenodd"></path></g></svg></button></div><div class="Captcha SignFlow-captchaContainer" style="width:0;height:0;opacity:0;overflow:hidden;margin:0;padding:0;border:0"><div><div class="SignFlowInput"><div class="Input-wrapper"><input type="text" value="" name="captcha" tabindex="-1" class="Input" placeholder="验证码"></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div><span class="Captcha-englishImage"><div class="Captcha-englishContainer"><img data-tooltip="看不清楚？换一张" class="Captcha-englishImg" src="data:image/jpg;base64,R0lGODdhlgA8AIcAAP7+/gMDA+jo6NfX1/Pz88fHxxYWFicnJ5eXl1hYWGdnZ6enp3Z2djU1NYeH%0Ah0hISLe3t7a2tqqqqsPDwz09PZ6engAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAlgA8AEAI/wABCBxI%0AsKDBgwgTKlzIsKHDhxAjSpxIsaLFhQgaNEgQIIABAwcQEABAsqTJkyhTqjRZYAABCQwKFIAAoKbN%0AmzgBDADAs6dPnw0UBBgqYcEBBgUAKF3KtKnSCAcCIDgQQMEBBhIGANjKFYADAwHCimUgAIDZs2YV%0A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" alt="图形验证码"></div></span></div></div><div class="Register-smsBackUp"><span></span></div><button class="Button SignFlow-submitButton Button--primary Button--blue" type="submit">注册</button></form><div class="Register-footer"><span class="Register-declaration">注册即代表同意<a href="https://www.zhihu.com/terms">《知乎协议》</a><a href="https://www.zhihu.com/terms/privacy">《隐私政策》</a></span></div></div>')
            $(this).html("已有帐号？<span>登录</span>")
            createSignflowEvent(type)
        } else {
            $("div.SignFlowHeader-slogen").text("          登录知乎，发现更大的世界")
            $("div.Register-content").attr("class", "Login-content")
            $("div.Login-content").html('<form novalidate="" class="SignFlow" data-za-detail-view-path-module="SignInForm" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:null}}"><div class="SignFlow-account"><div class="SignFlow-supportedCountriesSelectContainer"></div><div class="SignFlowInput SignFlow-accountInputContainer"><div class="SignFlow-accountInput Input-wrapper"><input type="text" value="" name="username" class="Input" placeholder="邮箱" /></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div></div><div class="SignFlow-password"><div class="SignFlowInput"><div class="Input-wrapper"><input type="password" value="" name="password" class="Input" placeholder="密码" /></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div><button class="Button SignFlow-switchPassword Button--plain" tabindex="-1" type="button"><svg width="24" height="20" viewbox="0 0 24 24" class="Icon SignFlow-switchPasswordIcon Icon--inconspicuous" style="vertical-align:middle;height:20px;width:24px" aria-hidden="true"><title></title><g><title>Inconspicuous</title><path d="M17.007 11.504c0 .65-.13 1.26-.36 1.83l3 3.073S23 14.136 23 11.504C23 8.008 17.255 4 11.995 4c-1.4 0-2.741.25-3.982.701l2.161 2.16c.57-.23 1.18-.36 1.831-.36a5.004 5.004 0 0 1 5.002 5.003zM2.57 4.342l2.067 2.075C3.499 7.258 1 9.119 1 11.504c0 3.336 5.79 7.503 11.005 7.503 1.55 0 3.031-.3 4.382-.84l.42.42 2.125 2.118s.782.571 1.314 0-.074-1.305-.074-1.305L3.955 3.183s-.76-.742-1.385-.19c-.626.554 0 1.35 0 1.35zm4.963 4.96l1.55 1.552c-.05.21-.08.43-.08.65 0 1.66 1.341 3.001 3.002 3.001.22 0 .44-.03.65-.08l1.551 1.551c-.67.33-1.41.53-2.2.53a5.004 5.004 0 0 1-5.003-5.002c0-.79.2-1.53.53-2.201zm4.312-.78l3.151 3.152.02-.16c0-1.66-1.34-3.001-3.001-3.001l-.17.01z" fill-rule="evenodd"></path></g></svg></button></div><div class="Captcha SignFlow-captchaContainer" style="width:0;height:0;opacity:0;overflow:hidden;margin:0;padding:0;border:0"><div><div class="SignFlowInput"><div class="Input-wrapper"><input type="text" value="" name="captcha" tabindex="-1" class="Input" placeholder="验证码" /></div><div class="SignFlowInput-errorMask SignFlowInput-requiredErrorMask SignFlowInput-errorMask--hidden"></div></div><span class="Captcha-englishImage"><div class="Captcha-englishContainer"><img data-tooltip="看不清楚？换一张" class="Captcha-englishImg" src="data:image/jpg;base64,R0lGODdhlgA8AIcAAP7+/gMDA+jo6NfX1/Pz88fHxxYWFicnJ5eXl1hYWGdnZ6enp3Z2djU1NYeH%0Ah0hISLe3t7a2tqqqqsPDwz09PZ6engAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAlgA8AEAI/wABCBxI%0AsKDBgwgTKlzIsKHDhxAjSpxIsaLFhQgaNEgQIIABAwcQEABAsqTJkyhTqjRZYAABCQwKFIAAoKbN%0AmzgBDADAs6dPnw0UBBgqYcEBBgUAKF3KtKnSCAcCIDgQQMEBBhIGANjKFYADAwHCimUgAIDZs2YV%0A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" alt="图形验证码" /></div></span></div></div><div class="Login-options"><button class="Button Login-cannotLogin Button--plain" type="button">忘记密码？</button></div><button class="Button SignFlow-submitButton Button--primary Button--blue" type="submit">登录</button><div class="Login-footer"><span class="Login-socialLogin">·</span></div></form>')
            $(this).html("没有帐号？<span>注册</span>")
            createSignflowEvent(type)
        }
    })
    //show or hide password
    $("div.SignFlow-password").find("button.SignFlow-switchPassword").on("click", function() {
        $(this).prev().children().eq(1).addClass("SignFlowInput-errorMask--hidden")
        $(this).prev().children().eq(1).text("")
        if ($(this).prev().find("input").attr("type") == "password") {
            $(this).prev().find("input").attr("type", "text")
        } else {
            $(this).prev().find("input").attr("type", "password")
        }
    })
    //close signin card
    $("button.Modal-closeButton.Button--plain").on("click", function() {
        $(document.body).css({
            "overflow-x":"auto",
            "overflow-y":"auto"
        })
        $("div.Modal-wrapper:last").parent().parent().parent().remove()
    })    
    //blur on input box
    var signErr = false
    $("div.SignContainer-inner").find("input").on("focus", function() {
        var $this = $(this)
        if ($this.val().length === 0 || signErr === true) {
            $this.parent().addClass("is-focus")
            $this.parent().next().addClass("SignFlowInput-errorMask--hidden")
            $this.parent().next().text("")
        }
        $this.one("blur", function() {
            if ($this.val().length === 0) {
                if ($this.attr("name") == "username") {
                    createInputBoxErrorEvent($this, "请输入邮箱")
                } else if ($this.attr("name") == "password") {
                    createInputBoxErrorEvent($this, "请输入密码")
                } else {
                    createInputBoxErrorEvent($this, "请输入姓名")
                }
            }
        })
    })  
    
    function createInputBoxErrorEvent($this, message) {
        $this.parent().removeClass("is-focus")
        $this.parent().next().removeClass("SignFlowInput-errorMask--hidden")
        $this.parent().next().text(message)
    }
    
    $("div.SignContainer-inner").find("div.SignFlowInput-errorMask").on("click", function() {
        $(this).prev().addClass("is-focus")
        $(this).addClass("SignFlowInput-errorMask--hidden")    
        $(this).text("")
        $(this).prev().children().focus()
    })      
    //submit
    $("div.SignContainer-inner").find("form").on("submit", function(){
        var $this = $(this)
        var inputNull = false
        var $fullnameInput = $("div.SignFlow-fullname").find("input")
        var $accountInput = $("div.SignFlow-account").find("input")
        var $passwordInput = $("div.SignFlow-password").find("input")

        if ($accountInput.val().length === 0) {
            createInputBoxErrorEvent($accountInput, "请输入邮箱")
            inputNull = true
        }
        if ($fullnameInput.length !== 0 && $fullnameInput.val().length === 0) {
            createInputBoxErrorEvent($fullnameInput, "请输入姓名")
            inputNull = true
        }
        if ($passwordInput.val().length === 0) {
            createInputBoxErrorEvent($passwordInput, "请输入密码")
            inputNull = true
        }
        if (inputNull === true) {
            return false
        }

        var url = "/signup"
        if ($this.attr("data-za-detail-view-path-module") == "SignInForm") {
            url = "/signin"
        }
        var options = {
            url : url,
            dataType : "json",//服务器返回的数据类型
            type :  "post",//提交表单的方式
            success : function(data, textStatus, xhr){//提交表单成功后执行的回调函数
                if (xhr.status === 200) {
                    if (data.success === false) {
                        signErr = true
                        switch(data.code) {
                            case 100003:
                            createInputBoxErrorEvent($fullnameInput, data.message)
                            break
                            case 100002:
                            case 100004:
                            createInputBoxErrorEvent($accountInput, data.message)
                            break
                            case 100005:
                            createInputBoxErrorEvent($passwordInput, data.message)
                            break
                        }
                    }
                } else if (xhr.status === 201) {
                    if (type == "card") {
                        window.location.reload()
                    } else if (type == "page") {
                        if (document.referrer == "") {
                            window.location.href = "/"    
                            return
                        }
                        window.location.href = document.referrer
                    }
                }
            },
            error: function(xhr, textStatus) {
                var data = JSON.parse(xhr.responseText)
                if (xhr.status === 401) {
                    signErr = true
                    if (data.code === 100000) {
                        createInputBoxErrorEvent($accountInput, data.message)
                    } else {
                        createInputBoxErrorEvent($passwordInput, data.message)
                    }
                }
            }
        }
        //jquery.form使用方式jvForm是表单的id
        $this.ajaxSubmit(options)
        //$(this).resetForm()
        return false
    })
}
createSignflowEvent("page")