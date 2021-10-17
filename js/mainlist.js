// 加载列表中的提示条
// 参数：类型（more、nomore、loading、nodata、clear）
function MainList(isMobile) {

    if (isMobile) {  // 加了滚动条插件和没加滚动条插件所操作的对象是不一样的
        this.isMobile = true;
        this.listContainer = $("#main-list");
    } else {
        this.isMobile = false;
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
        this.appendContent(CONST.MSG_CLICK_TO_LOAD_MORE);
    },

    displayNomore: function () {
        this.appendContent(CONST.MSG_FINISHED_LOADING);
    },

    displayLoading: function () {
        this.appendContent(CONST.MSG_PLAYLIST_IS_LOADING);
    },
    
    displayNodata: function () {
        this.appendContent(CONST.MSG_NOTHING_TO_LOAD);
    },

    displayClearBtn: function () {
        this.appendContent(CONST.MSG_EMPTY_PLAYING_LIST);
    },

    clearMainList: function () {
        this.listContainer.html('');
    },

    appendContent: function(content) {
        this.listContainer.append(content);
    },

    addItem: function (no, name, auth, album) {
        // 列表中新增一项
        // 参数：编号、名字、歌手、专辑 
        this.appendContent(String.format(CONST.TEMPLATE_MAIN_LIST_ITEM, no - 1, no, album, auth, name));
    },
    
    createListHeader: function () {
        // 向列表中加入列表头
        this.appendContent(CONST.PL_PLAYLIST_HEAD);
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
            if (this.isMobile) {
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
                target.html(String.format(CONST.TEMPLATE_MUSIC_NAME_CULT, target.html(), num));
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
    },

    // 播放列表滚动到顶部
    listToTop: function () {
        if (this.isMobile) {
            this.listContainer.animate({ scrollTop: 0 }, 200);
        } else {
            this.listContainer.mCustomScrollbar("scrollTo", 0, "top");
        }
    },

    // 向列表中载入某个播放列表
    loadList: function (list) {
        if (musicList[list].isloading === true) {
            layer.msg('列表读取中...', { icon: 16, shade: 0.01, time: 500 });
            return true;
        }

        rem.dislist = list;     // 记录当前显示的列表
        rem.controlPanel.dataBox("list");    // 在主界面显示出播放列表

        // 调试信息输出
        if (mkPlayer.debug) {
            if (musicList[list].id) {
                    console.log(String.format('加载播放列表 {0} - {1}\n' +
                    'id: {2},\n' +
                    'name: "{1}",\n' +
                    'cover: "{3}",\n' +
                    'item: []', list, musicList[list].name, musicList[list].id, musicList[list].cover));
            } else {
                console.log(String.format('加载播放列表 {0} - {1}',list, musicList[list].name));
            }
        }

        this.clearMainList(); // 清空列表中原有的元素
        //TODO: remove this method
        this.createListHeader();      // 向列表中加入列表头

        if (musicList[list].item.length == 0) {
            this.displayNomore(); // 列表中没有数据
        } else {
            // 逐项添加数据
            for (var i = 0; i < musicList[list].item.length; i++) {
                var tmpMusic = musicList[list].item[i];

                this.addItem(i + 1, tmpMusic.name, tmpMusic.artist, tmpMusic.album);

                // 音乐链接均有有效期限制,重新显示列表时清空处理
                //TODO: check why need to clear url
                //if (list == CONST.PLAYING_LIST_ID || list == CONST.PLAYED_HISTORY_LIST_ID) tmpMusic.url = "";
            }

            // 列表加载完成后的处理
            if (list == CONST.PLAYING_LIST_ID || list == CONST.PLAYED_HISTORY_LIST_ID) {    // 历史记录和正在播放列表允许清空
                this.displayClearBtn(); // 清空列表
            }

            if (rem.playlist === undefined) {    // 未曾播放过
                if (mkPlayer.autoplay == true) pause();  // 设置了自动播放，则自动播放
            } else {
                rem.sheetList.refreshList();  // 刷新列表，添加正在播放样式
            }
            this.listToTop();    // 播放列表滚动到顶部
        }
    }
}
