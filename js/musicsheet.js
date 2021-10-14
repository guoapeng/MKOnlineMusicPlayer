SheetList = function (isMobile) {
    if (isMobile) {  // 加了滚动条插件和没加滚动条插件所操作的对象是不一样的
        this.listContainer = this.listContainer;
    } else {
        // 滚动条初始化(只在非移动端启用滚动条控件)
        $("#sheet").mCustomScrollbar({
            theme: "minimal",
            advanced: {
                updateOnContentResize: true // 数据更新后自动刷新滚动条
            }
        });

        this.listContainer = $("#sheet .mCSB_container");
    }
}

SheetList.protype = {
    // 添加一个歌单
    // 参数：编号、歌单名字、歌单封面
    addSheet: function (no, name, cover) {
        if (!cover) cover = "images/player_cover.png";
        if (!name) name = "读取中...";

        var html = '<div class="sheet-item" data-no="' + no + '">' +
            '    <img class="sheet-cover" src="' + cover + '">' +
            '    <p class="sheet-name">' + name + '</p>' +
            '</div>';
        this.listContainer.append(html);
    },

    // 歌单列表底部登陆条
    sheetBar: function sheetBar() {
        var barHtml;
        if (playerReaddata('uid')) {
            barHtml = '已同步 ' + rem.uname + ' 的歌单 <span class="login-btn login-refresh">[刷新]</span> <span class="login-btn login-out">[退出]</span>';
        } else {
            barHtml = '我的歌单 <span class="login-btn login-in">[点击同步]</span>';
        }
        barHtml = '<span id="sheet-bar"><div class="clear-fix"></div>' +
            '<div id="user-login" class="sheet-title-bar">' + barHtml +
            '</div></span>';
        this.listContainer.append(barHtml);
    },

    initializeMusicSheet: function () {

        // 点击专辑显示专辑歌曲
        this.listContainer.on("click", ".sheet-cover,.sheet-name", function () {
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
        this.listContainer.on("click", ".login-in", function () {
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
        this.listContainer.on("click", ".login-refresh", function () {
            playerSavedata('ulist', '');
            layer.msg('刷新歌单');
            clearUserlist();
        });

        // 退出登录
        this.listContainer.on("click", ".login-out", function () {
            playerSavedata('uid', '');
            playerSavedata('ulist', '');
            layer.msg('已退出');
            clearUserlist();
        });
    },

    //TODO: refactor the method, too complicated
    //初始化播放列表
    initList: function () {
        // 登陆过，那就读取出用户的歌单，并追加到系统歌单的后面
        if (playerReaddata('uid')) {
            rem.uid = playerReaddata('uid');
            rem.uname = playerReaddata('uname');
            var tmp_ulist = playerReaddata('ulist');    // 读取本地记录的用户歌单

            if (tmp_ulist) musicList.push.apply(musicList, tmp_ulist);   // 追加到系统歌单的后面
        }

        // 显示所有的歌单
        for (var i = 1; i < musicList.length; i++) {

            if (i == 1) {    // 正在播放列表
                // 读取正在播放列表
                var tmp_item = playerReaddata('playing');
                if (tmp_item) {  // 读取到了正在播放列表
                    musicList[1].item = tmp_item;
                    mkPlayer.defaultlist = 1;   // 默认显示正在播放列表
                }

            } else if (i == 2) { // 历史记录列表
                // 读取历史记录
                var tmp_item = playerReaddata('his');
                if (tmp_item) {
                    musicList[2].item = tmp_item;
                }

                // 列表不是用户列表，并且信息为空，需要ajax读取列表
            } else if (!musicList[i].creatorID && (musicList[i].item == undefined || (i > 2 && musicList[i].item.length == 0))) {
                musicList[i].item = [];
                if (musicList[i].id) {   // 列表ID已定义
                    // ajax获取列表信息
                    ajaxPlayList(musicList[i].id, i);
                } else {    // 列表 ID 未定义
                    if (!musicList[i].name) musicList[i].name = '未命名';
                }
            }

            // 在前端显示出来
            rem.sheetList.addSheet(i, musicList[i].name, musicList[i].cover);
        }

        // 登陆了，但歌单又没有，说明是在刷新歌单
        if (playerReaddata('uid') && !tmp_ulist) {
            ajaxUserList(rem.uid);
            return true;
        }

        // 首页显示默认列表
        if (mkPlayer.defaultlist >= musicList.length) mkPlayer.defaultlist = 1;  // 超出范围，显示正在播放列表

        if (musicList[mkPlayer.defaultlist].isloading !== true) loadList(mkPlayer.defaultlist);

        // 显示最后一项登陆条
        this.listContainer.sheetBar();
    },

    // 清空歌单显示
    clearSheet: function () {
        this.listContainer.html('');
    }
}