 function ControlPanel () {

}

ControlPanel.prototype = {
    initializeControlPanel: function () {

        $("#music-info").click(function () {
            if (rem.playid === undefined) {
                layer.msg('请先播放歌曲');
                return false;
            }

            musicInfo(rem.playlist, rem.playid);
        });
        // 播放、暂停按钮的处理
        $(".btn-play").click(function () {
            pause();
        });

        // 循环顺序的处理
        $(".btn-order").click(function () {
            orderChange();
        });
        // 上一首歌
        $(".btn-prev").click(function () {
            prevMusic();
        });

        // 下一首
        $(".btn-next").click(function () {
            nextMusic();
        });

        // 静音按钮点击事件
        $(".btn-quiet").click(function () {
            var oldVol;     // 之前的音量值
            if ($(this).is('.btn-state-quiet')) {
                oldVol = $(this).data("volume");
                oldVol = oldVol ? oldVol : (rem.isMobile ? 1 : mkPlayer.volume);  // 没找到记录的音量，则重置为默认音量
                $(this).removeClass("btn-state-quiet");     // 取消静音
            } else {
                oldVol = volume_bar.percent;
                $(this).addClass("btn-state-quiet");        // 开启静音
                $(this).data("volume", oldVol); // 记录当前音量值
                oldVol = 0;
            }
            playerSavedata('volume', oldVol); // 存储音量信息
            volume_bar.goto(oldVol);    // 刷新音量显示
            if (rem.audio[0] !== undefined) rem.audio[0].volume = oldVol;  // 应用音量
        });
    },

    // 下面是进度条处理
    initProgress: function () {
        // 初始化播放进度条
        music_bar = new mkpgb("#music-progress", 0, mBcallback);
        music_bar.lock(true);   // 未播放时锁定不让拖动
        // 初始化音量设定
        var tmp_vol = playerReaddata('volume');
        tmp_vol = (tmp_vol != null) ? tmp_vol : (rem.isMobile ? 1 : mkPlayer.volume);
        if (tmp_vol < 0) tmp_vol = 0;    // 范围限定
        if (tmp_vol > 1) tmp_vol = 1;
        if (tmp_vol == 0) $(".btn-quiet").addClass("btn-state-quiet"); // 添加静音样式
        volume_bar = new mkpgb("#volume-progress", tmp_vol, vBcallback);
    },

    // 初始化 Audio
    initAudio: function () {
        rem.audio = $('<audio></audio>').appendTo('body');

        // 应用初始音量
        rem.audio[0].volume = volume_bar.percent;
        // 绑定歌曲进度变化事件
        rem.audio[0].addEventListener('timeupdate', updateProgress);   // 更新进度
        rem.audio[0].addEventListener('play', audioPlay); // 开始播放了
        rem.audio[0].addEventListener('pause', audioPause);   // 暂停
        $(rem.audio[0]).on('ended', autoNextMusic);   // 播放结束
        rem.audio[0].addEventListener('error', audioErr);   // 播放器错误处理
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
    }

}

// 下载正在播放的这首歌
function thisDownload(obj) {
    ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], download);
}

// 分享正在播放的这首歌
function thisShare(obj) {
    ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], ajaxShare);
}


// 选择要显示哪个数据区
// 参数：要显示的数据区（list、sheet、player）
function dataBox(choose) {
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
            if (rem.dislist == 1 || rem.dislist == rem.playlist) {  // 正在播放
                $(".btn[data-action='playing']").addClass('active');
            } else if (rem.dislist == 0) {  // 搜索
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
}
