
//============================== behaviore of mainlist =========================================
// 加载列表中的提示条
// 参数：类型（more、nomore、loading、nodata、clear）
MainList = function (isMobile) {
    
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
