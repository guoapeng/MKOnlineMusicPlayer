function initializeControlPanel() {
    
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
}