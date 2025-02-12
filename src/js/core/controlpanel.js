function ControlPanel(dataSaver) {

    this.dataSaver = dataSaver;
     
    var that = this;

    window.addEventListener("adjusttimeByPercent", function (e) {
        that.mBcallback(e.percent);
    });

    window.addEventListener("vb-adjusttime", function (e) {
        that.vBcallback(e.adjustToTime);
    });

    $("#music-info").on("click", function () {
        if (rem.playid === undefined) {
            layer.msg('请先播放歌曲');
            return false;
        }
        Utils.musicInfo(rem.playlist, rem.playid);
    });
    // 播放、暂停按钮的处理
    $(".btn-play").on("click", function () {
        that.pause();
    });
    // 循环顺序的处理
    $(".btn-order").on("click", function () {
        that.orderChange();
    });
    // 上一首歌
    $(".btn-prev").on("click", function () {
        that.prevMusic();
    });
    // 下一首
    $(".btn-next").on("click", function () {
        that.nextMusic();
    });
}

ControlPanel.prototype = {
    // 音量条变动回调函数
    // 参数：新的值
    vBcallback: function (newVal) {

        rem.audioPlayer.setVolume(newVal); // 音频对象已加载则立即改变音量

        if (newVal === 0 && !$(".btn-quiet").is('.btn-state-quiet')) {
            $(".btn-quiet").addClass("btn-state-quiet");
        } 

        this.dataSaver.savedata('volume', newVal); // 存储音量信息
    },

    // 音乐进度条拖动回调函数
    mBcallback: function (newVal) {
        var newTime = (rem.audioPlayer.getAudio().duration * newVal).toFixed(4);
        // 应用新的进度
        rem.audioPlayer.setTime(newTime);
        refreshLyric(newTime);  // 强制滚动歌词到当前进度
    },

    initBg: function () {
        if ((mkPlayer.coverbg === true && !rem.isMobile) || (mkPlayer.mcoverbg === true && rem.isMobile)) { // 开启了封面背景
            if (rem.isMobile) {  // 移动端采用另一种模糊方案
                $('#blur-img').html('<div class="blured-img" id="mobile-blur"></div><div class="blur-mask mobile-mask"></div>');
            } else {
                // 背景图片初始化
                $('#blur-img').backgroundBlur({
                    // imageURL : '', // URL to the image that will be used for blurring
                    blurAmount: 50, // 模糊度
                    imageClass: 'blured-img', // 背景区应用样式
                    overlayClass: 'blur-mask', // 覆盖背景区class，可用于遮罩或额外的效果
                    // duration: 0, // 图片淡出时间
                    endOpacity: 1 // 图像最终的不透明度
                });
            }
            $('.blur-mask').fadeIn(1000);   // 遮罩层淡出
        }
    },
    // 选择要显示哪个数据区
    // 参数：要显示的数据区（list、sheet、player）
    dataBox: function (choose) {
        $('.btn-box .active').removeClass('active');
        switch (choose) {
            case "list":    // 显示播放列表
                if ($(".btn[data-action='player']").css('display') !== 'none') {
                    $("#player").hide();
                } else if ($("#player").css('display') == 'none') {
                    $("#player").fadeIn();
                }
                $("#main-list").fadeIn();
                $("#sheet").fadeOut();
                if (rem.dislist == CONST.PLAYING_LIST_ID || rem.dislist == rem.playlist) {  // 正在播放
                    $(".btn[data-action='playing']").addClass('active');
                } else if (rem.dislist == CONST.SEARCH_RESULT_LIST_ID) {  // 搜索
                    $(".btn[data-action='search']").addClass('active');
                }
                break;
            case "sheet":   // 显示专辑
                if ($(".btn[data-action='player']").css('display') !== 'none') {
                    $("#player").hide();
                } else if ($("#player").css('display') == 'none') {
                    $("#player").fadeIn();
                }
                $("#sheet").fadeIn();
                $("#main-list").fadeOut();
                $(".btn[data-action='sheet']").addClass('active');
                break;
            case "player":  // 显示播放器
                $("#player").fadeIn();
                $("#sheet").fadeOut();
                $("#main-list").fadeOut();
                $(".btn[data-action='player']").addClass('active');
                break;
        }
    },

    // 播放
    audioPlay: function () {
        rem.paused = false;     // 更新状态（未暂停）
        rem.sheetList.refreshList();      // 刷新状态，显示播放的波浪
        $(".btn-play").addClass("btn-state-paused");        // 恢复暂停

        if ((mkPlayer.dotshine === true && !rem.isMobile) || (mkPlayer.mdotshine === true && rem.isMobile)) {
            $("#music-progress .mkpgb-dot").addClass("dot-move");   // 小点闪烁效果
        }

        var music = musicList[rem.playlist].item[rem.playid];   // 获取当前播放的歌曲信息
        var msg = " 正在播放: " + music.name + " - " + music.artist;  // 改变浏览器标题

        // 清除定时器
        if (rem.titflash !== undefined) {
            clearInterval(rem.titflash);
        }
        // 标题滚动
        this.titleFlash(msg);
    },

    // 标题滚动
    titleFlash: function (msg) {
        // 截取字符
        var tit = function () {
            msg = msg.substring(1, msg.length) + msg.substring(0, 1);
            document.title = msg;
        };
        // 设置定时间 300ms滚动
        rem.titflash = setInterval(function () { tit() }, 300);
    },
    // 循环顺序
    orderChange: function () {
        var orderDiv = $(".btn-order");
        orderDiv.removeClass();
        switch (rem.order) {
            case 1:     // 单曲循环 -> 列表循环
                orderDiv.addClass("player-btn btn-order btn-order-list");
                orderDiv.attr("title", "列表循环");
                layer.msg("列表循环");
                rem.order = 2;
                break;

            case 3:     // 随机播放 -> 单曲循环
                orderDiv.addClass("player-btn btn-order btn-order-single");
                orderDiv.attr("title", "单曲循环");
                layer.msg("单曲循环");
                rem.order = 1;
                break;

            // case 2:
            default:    // 列表循环(其它) -> 随机播放
                orderDiv.addClass("player-btn btn-order btn-order-random");
                orderDiv.attr("title", "随机播放");
                layer.msg("随机播放");
                rem.order = 3;
        }
    },
    // 暂停
    audioPause: function () {
        rem.paused = true;      // 更新状态（已暂停）

        $(".list-playing").removeClass("list-playing");        // 移除其它的正在播放

        $(".btn-play").removeClass("btn-state-paused");     // 取消暂停

        $("#music-progress .dot-move").removeClass("dot-move");   // 小点闪烁效果

        // 清除定时器
        if (rem.titflash !== undefined) {
            clearInterval(rem.titflash);
        }
        document.title = rem.webTitle;    // 改变浏览器标题
    },

    // 自动播放时的下一首歌
    autoNextMusic: function () {
        if (rem.order && rem.order === 1) {
            this.playList(rem.playid);
        } else {
            this.nextMusic();
        }
    },
    // 歌曲时间变动回调函数
    updateProgress: function () {
        // 暂停状态不管
        if (rem.paused !== false) return true;
        // 同步进度条1112345678910
        var progressUpdateEvent = new Event("mb-progress-update");
        progressUpdateEvent.percent = rem.audioPlayer.getProgress();
        window.dispatchEvent(progressUpdateEvent)
        // 同步歌词显示	
        scrollLyric(rem.audioPlayer.getAudio().currentTime);
    },

    // 播放正在播放列表中的歌曲
    // 参数：歌曲在列表中的ID
    playList: function (id) {
        // 第一次播放
        if (rem.playlist === undefined) {
            this.pause();
            return true;
        }
        // 没有歌曲，跳出
        if (playingMusicList.item.length <= 0) return true;

        // ID 范围限定
        if (id >= playingMusicList.item.length) id = 0;
        if (id < 0) id = playingMusicList.item.length - 1;

        // 记录正在播放的歌曲在正在播放列表中的 id
        rem.playid = id;

        // 如果链接为空，则 ajax 获取数据后再播放
        if (playingMusicList.item[id].url === null || playingMusicList.item[id].url === "") {
            rem.dataFetcher.ajaxUrl(playingMusicList.item[id], this.play);
        } else {
            this.play(playingMusicList.item[id]);
        }
    },

    // 播放下一首歌
    nextMusic: function () {
        switch (rem.order ? rem.order : 1) {
            case 1, 2:
                rem.controlPanel.playList(rem.playid + 1);
                break;
            case 3:
                if (playingMusicList && playingMusicList.item.length) {
                    var id = parseInt(Math.random() * playingMusicList.item.length);
                    rem.controlPanel.playList(id);
                }
                break;
            default:
                rem.controlPanel.playList(rem.playid + 1);
                break;
        }
    },

    // 播放音乐
    // 参数：要播放的音乐数组
    play: function (music) {
        // 调试信息输出
        if (mkPlayer.debug) {
            console.log('开始播放 - ' + music.name);

            console.info('id: "' + music.id + '",\n' +
                'name: "' + music.name + '",\n' +
                'artist: "' + music.artist + '",\n' +
                'album: "' + music.album + '",\n' +
                'source: "' + music.source + '",\n' +
                'url_id: "' + music.url_id + '",\n' +
                'pic_id: "' + music.pic_id + '",\n' +
                'lyric_id: "' + music.lyric_id + '",\n' +
                'pic: "' + music.pic + '",\n' +
                'url: "' + music.url + '"');
        }

        // 遇到错误播放下一首歌
        if (music.url == "err") {
            this.audioErr(); // 调用错误处理函数
            return false;
        }

        addHistory(music, this.dataSaver);  // 添加到播放历史

        // 如果当前主界面显示的是播放历史，那么还需要刷新列表显示
        if (rem.dislist == CONST.PLAYED_HISTORY_LIST_ID && rem.playlist !== CONST.PLAYED_HISTORY_LIST_ID) {
            rem.playList.loadList(2);
        } else {
            rem.sheetList.refreshList();  // 更新列表显示
        }

        rem.errCount = 0;   // 连续播放失败的歌曲数归零
        var startPlayEvent = new Event("playAudio");
        startPlayEvent.music = music;
        window.dispatchEvent(startPlayEvent)
        rem.dataFetcher.ajaxLyric(music, lyricCallback);     // ajax加载歌词
    },

    // 点击暂停按钮的事件
    pause: function () {
        if (rem.paused === false) {  // 之前是播放状态
            rem.audioPlayer.getAudio().pause();  // 暂停
        } else {
            // 第一次点播放
            if (rem.playlist === undefined) {
                rem.playlist = rem.dislist;

                playingMusicList.item = musicList[rem.playlist].item; // 更新正在播放列表中音乐

                // 正在播放 列表项已发生变更，进行保存
                this.dataSaver.savedata('playing', playingMusicList.item);   // 保存正在播放列表

                rem.playList.listClick(0);
            }
            rem.audioPlayer.getAudio().play();
        }
    },

    // 音频错误处理函数
    audioErr: function () {
        // 没播放过，直接跳过
        if (rem.playlist === undefined) return true;

        if (rem.errCount > 10) { // 连续播放失败的歌曲过多
            layer.msg('似乎出了点问题~播放已停止');
            rem.errCount = 0;
        } else {
            rem.errCount++;     // 记录连续播放失败的歌曲数目
            layer.msg('当前歌曲播放失败，自动播放下一首');
            rem.controlPanel.nextMusic();    // 切换下一首歌
        }
    },

    // 播放上一首歌
    prevMusic: function () {
        this.playList(rem.playid - 1);
    },

    // 下载正在播放的这首歌
    downloadThis: function (obj) {
        rem.dataFetcher.ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], rem.downloader.download);
    },

    // 分享正在播放的这首歌
    shareThis: function (obj) {
        rem.dataFetcher.ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], rem.ajaxShare.ajaxShare);
    }

}
