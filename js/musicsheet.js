function initializeMusicSheet() {

    // 点击专辑显示专辑歌曲
    $("#sheet").on("click", ".sheet-cover,.sheet-name", function () {
        var num = parseInt($(this).parent().data("no"));
        // 是用户列表，但是还没有加载数据
        if (musicList[num].item.length === 0 && musicList[num].creatorID) {
            layer.msg('列表读取中...', { icon: 16, shade: 0.01, time: 500 }); // 0代表加载的风格，支持0-2
            // ajax加载数据
            ajaxPlayList(musicList[num].id, num, loadList);
            return true;
        }
        loadList(num);
    });

    // 点击同步云音乐
    $("#sheet").on("click", ".login-in", function () {
        layer.prompt(
            {
                title: '请输入您的网易云 UID',
                // value: '',  // 默认值
                btn: ['确定', '取消', '帮助'],
                btn3: function (index, layero) {
                    layer.open({
                        title: '如何获取您的网易云UID？'
                        , shade: 0.6 //遮罩透明度
                        , anim: 0 //0-6的动画形式，-1不开启
                        , content:
                            '1、首先<a href="http://music.163.com/" target="_blank">点我(http://music.163.com/)</a>打开网易云音乐官网<br>' +
                            '2、然后点击页面右上角的“登录”，登录您的账号<br>' +
                            '3、点击您的头像，进入个人中心<br>' +
                            '4、此时<span style="color:red">浏览器地址栏</span> <span style="color: green">/user/home?id=</span> 后面的<span style="color:red">数字</span>就是您的网易云 UID'
                    });
                }
            },
            function (val, index) {   // 输入后的回调函数
                if (isNaN(val)) {
                    layer.msg('uid 只能是数字', { anim: 6 });
                    return false;
                }
                layer.close(index);     // 关闭输入框
                ajaxUserList(val);
            });
    });

    // 刷新用户列表
    $("#sheet").on("click", ".login-refresh", function () {
        playerSavedata('ulist', '');
        layer.msg('刷新歌单');
        clearUserlist();
    });

    // 退出登录
    $("#sheet").on("click", ".login-out", function () {
        playerSavedata('uid', '');
        playerSavedata('ulist', '');
        layer.msg('已退出');
        clearUserlist();
    });
}
