
// 向列表中载入某个播放列表
function loadList(list) {
    if (musicList[list].isloading === true) {
        layer.msg('列表读取中...', { icon: 16, shade: 0.01, time: 500 });
        return true;
    }

    rem.dislist = list;     // 记录当前显示的列表

    dataBox("list");    // 在主界面显示出播放列表

    // 调试信息输出
    if (mkPlayer.debug) {
        if (musicList[list].id) {
            console.log('加载播放列表 ' + list + ' - ' + musicList[list].name + '\n' +
                'id: ' + musicList[list].id + ',\n' +
                'name: "' + musicList[list].name + '",\n' +
                'cover: "' + musicList[list].cover + '",\n' +
                'item: []');
        } else {
            console.log('加载播放列表 ' + list + ' - ' + musicList[list].name);
        }
    }

    rem.mainList.clearMainList(); // 清空列表中原有的元素
    //TODO: remove this method
    rem.mainList.addListhead();      // 向列表中加入列表头

    if (musicList[list].item.length == 0) {
        rem.mainList.displayNomore(); // 列表中没有数据
    } else {

        // 逐项添加数据
        for (var i = 0; i < musicList[list].item.length; i++) {
            var tmpMusic = musicList[list].item[i];

            rem.mainList.addItem(i + 1, tmpMusic.name, tmpMusic.artist, tmpMusic.album);

            // 音乐链接均有有效期限制,重新显示列表时清空处理
            if (list == 1 || list == 2) tmpMusic.url = "";
        }

        // 列表加载完成后的处理
        if (list == 1 || list == 2) {    // 历史记录和正在播放列表允许清空
            rem.mainList.displayClearBtn(); // 清空列表
        }

        if (rem.playlist === undefined) {    // 未曾播放过
            if (mkPlayer.autoplay == true) pause();  // 设置了自动播放，则自动播放
        } else {
            rem.sheetList.refreshList();  // 刷新列表，添加正在播放样式
        }

        listToTop();    // 播放列表滚动到顶部
    }
}

// 播放列表滚动到顶部
function listToTop() {
    if (rem.isMobile) {
        $("#main-list").animate({ scrollTop: 0 }, 200);
    } else {
        $("#main-list").mCustomScrollbar("scrollTo", 0, "top");
    }
}

//============================== behaviore of mainlist =========================================
// 加载列表中的提示条
// 参数：类型（more、nomore、loading、nodata、clear）
 function MainList(isMobile) {
    
    if (isMobile) {  // 加了滚动条插件和没加滚动条插件所操作的对象是不一样的
        this.listContainer = $("#main-list");
    } else {
        // 滚动条初始化(只在非移动端启用滚动条控件)
        $("#main-list").mCustomScrollbar({
            theme: "minimal",
            advanced: {
                updateOnContentResize: true // 数据更新后自动刷新滚动条
            }
        });

        this.listContainer = $("#main-list .mCSB_container");
    }
}

MainList.prototype = {
    displayMore: function () {
        this.listContainer.append('<div class="list-item text-center list-loadmore list-clickable" title="点击加载更多数据" id="list-foot">点击加载更多...</div>');
    },
    displayNomore: function () {
        this.listContainer.append('<div class="list-item text-center" id="list-foot">全都加载完了</div>');
    },
    displayLoading: function () {
        this.listContainer.append('<div class="list-item text-center" id="list-foot">播放列表加载中...</div>');
    },
    displayNodata: function () {
        this.listContainer.append('<div class="list-item text-center" id="list-foot">可能是个假列表，什么也没有</div>');
    },
    displayClearBtn: function () {
        this.listContainer.append('<div class="list-item text-center list-clickable" id="list-foot" onclick="clearDislist();">清空列表</div>');
    },
    clearMainList: function () {
        this.listContainer.html('');
    },
    addItem: function (no, name, auth, album) {
        // 列表中新增一项
        // 参数：编号、名字、歌手、专辑 
        var html = '<div class="list-item" data-no="' + (no - 1) + '">' +
            '    <span class="list-num">' + no + '</span>' +
            '    <span class="list-mobile-menu"></span>' +
            '    <span class="music-album">' + album + '</span>' +
            '    <span class="auth-name">' + auth + '</span>' +
            '    <span class="music-name">' + name + '</span>' +
            '</div>';
        this.listContainer.append(html);
    },
    addListhead: function () {
        // 向列表中加入列表头
        var html = '<div class="list-item list-head">' +
            '    <span class="music-album">' +
            '        专辑' +
            '    </span>' +
            '    <span class="auth-name">' +
            '        歌手' +
            '    </span>' +
            '    <span class="music-name">' +
            '        歌曲' +
            '    </span>' +
            '</div>';
        this.listContainer.append(html);
    },
    init: function () {
        this.displayLoading(); // 列表加载中
        // 列表项双击播放
        this.listContainer.on("dblclick", ".list-item", function () {
            var num = parseInt($(this).data("no"));
            if (isNaN(num)) return false;
            listClick(num);
        });

        // 移动端列表项单击播放
        this.listContainer.on("click", ".list-item", function () {
            if (rem.isMobile) {
                var num = parseInt($(this).data("no"));
                if (isNaN(num)) return false;
                listClick(num);
            }
        });

        // 小屏幕点击右侧小点查看歌曲详细信息
        this.listContainer.on("click", ".list-mobile-menu", function () {
            var num = parseInt($(this).parent().data("no"));
            musicInfo(rem.dislist, num);
            return false;
        });

        // 列表鼠标移过显示对应的操作按钮
        this.listContainer.on("mousemove", ".list-item", function () {
            var num = parseInt($(this).data("no"));
            if (isNaN(num)) return false;
            // 还没有追加菜单则加上菜单
            if (!$(this).data("loadmenu")) {
                var target = $(this).find(".music-name");
                var html = '<span class="music-name-cult">' +
                    target.html() +
                    '</span>' +
                    '<div class="list-menu" data-no="' + num + '">' +
                    '<span class="list-icon icon-play" data-function="play" title="点击播放这首歌"></span>' +
                    '<span class="list-icon icon-download" data-function="download" title="点击下载这首歌"></span>' +
                    '<span class="list-icon icon-share" data-function="share" title="点击分享这首歌"></span>' +
                    '</div>';
                target.html(html);
                $(this).data("loadmenu", true);
            }
        });

        // 列表中的菜单点击
        this.listContainer.on("click", ".icon-play,.icon-download,.icon-share", function () {
            var num = parseInt($(this).parent().data("no"));
            if (isNaN(num)) return false;
            switch ($(this).data("function")) {
                case "play":    // 播放
                    listClick(num);     // 调用列表点击处理函数
                    break;
                case "download":    // 下载
                    ajaxUrl(musicList[rem.dislist].item[num], download);
                    break;
                case "share":   // 分享
                    // ajax 请求数据
                    ajaxUrl(musicList[rem.dislist].item[num], ajaxShare);
                    break;
            }
            return true;
        });

        // 点击加载更多
        this.listContainer.on("click", ".list-loadmore", function () {
            $(".list-loadmore").removeClass('list-loadmore');
            $(".list-loadmore").html('加载中...');
            ajaxSearch();
        });
    }
}
//============================== end behaviore of mainlist =========================================
