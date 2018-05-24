function createSignflowEvent(type) {
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
        $("div.Modal-wrapper:last").parent().parent().parent().remove()
    })    
    //blur on input box
    $("div.Login-content").find("input").on("focus", function() {
        var $this = $(this)
        $this.parent().addClass("is-focus")
        $this.parent().next().addClass("SignFlowInput-errorMask--hidden")
        $this.parent().next().text("")
        $this.one("blur", function() {
            if ($this.val().length !== 0) {
                return
            }
            $this.parent().removeClass("is-focus")
            $this.parent().next().removeClass("SignFlowInput-errorMask--hidden")
            if ($this.attr("name") == "password") {
                $this.parent().next().text("请输入密码")
            } else {
                $this.parent().next().text("请输入手机号或邮箱")
            }
        })
    })      
    $("div.Login-content").find("div.SignFlowInput-errorMask").on("click", function() {
        $(this).prev().addClass("is-focus")
        $(this).addClass("SignFlowInput-errorMask--hidden")    
        $(this).text("")
        $(this).prev().children().focus()
    })      
    //submit
    $("div.Login-content").find("form").on("submit", function(){
        var options = {
            url : "/signin",
            dataType : "json",//服务器返回的数据类型
            type :  "post",//提交表单的方式
            success : function(data){//提交表单成功后执行的回调函数
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
        }
        //jquery.form使用方式jvForm是表单的id
        $(this).ajaxSubmit(options)
        //$(this).resetForm()
        return false
    })
}
createSignflowEvent("page")