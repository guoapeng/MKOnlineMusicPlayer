function AudioPlayer() {
    this.audio = $('<audio></audio>').appendTo('body');
    this.paused = true;
    vp = this;
    rem.audio = this.audio;
    // 应用初始音量
    vp.audio[0].volume = 0;

    window.addEventListener("feedback-current-volume", function (e) {
        vp.audio[0].volume = e.currentVolume;
    });

    window.addEventListener("playAudio", function (e) {
        try {
            this.getAudio().pause();
            this.setSource(e.music.url);
            this.getAudio().play();
            this.getAudio().oncanplay = function () {
                e.music.duration = this.getAudio().duration;
            }.bind(this);

        } catch (e) {
            this.audioErr(); // 调用错误处理函数
            return;
        }
    }.bind(this));

    var queryVolumeEvent = new Event("query-volume");
    window.dispatchEvent(queryVolumeEvent)

    // 绑定歌曲进度变化事件
    // 更新进度
    vp.audio[0].addEventListener('timeupdate', function (e) {
        vp.onTimeUpdate(e, vp.audio[0].currentTime);
    });
    // 开始播放了
    vp.audio[0].addEventListener('play', function (e) {
        var mbPlayEvent = new Event("mb-play");
        window.dispatchEvent(mbPlayEvent)
    });
    // 暂停
    vp.audio[0].addEventListener('pause', function (e) {
        var mbPauseEvent = new Event("mb-pause");
        window.dispatchEvent(mbPauseEvent)
    });
    // 播放结束
    $(vp.audio[0]).on('ended', function (e) {
        var mbEndedEvent = new Event("mb-ended");
        window.dispatchEvent(mbEndedEvent)
    });
    // 播放器错误处理
    vp.audio[0].addEventListener('error', function (e) {
        var mbErrorEvent = new Event("mb-error");
        window.dispatchEvent(mbErrorEvent)
    });

}

AudioPlayer.prototype = {

    pause: function () {
        this.getAudio().pause();
    },

    getAudio: function () {
        return this.audio[0];
    },

    setSource: function (source) {
        this.audio.attr('src', source);
    },

    setVolume: function (newVal) {
        if (this.getAudio() !== undefined) {   // 音频对象已加载则立即改变音量
            this.getAudio().volume = newVal;
        }
    },

    setTime: function (newTime) {
        if (this.getAudio() !== undefined) {   // 音频对象已加载则立即改变音量
            this.getAudio().currentTime = newTime;
        }
    },

    onTimeUpdate: function (e, currentTime) {
         // 暂停状态不管
         if (vp.paused !== false) return true;
         // 同步进度条1112345678910
        var progressUpdateEvent = new Event("mb-progress-update");
        progressUpdateEvent.percent = this.getProgress();
        progressUpdateEvent.currentTime = currentTime;
        window.dispatchEvent(progressUpdateEvent)
    },

    getProgress: function () {
        return this.getAudio().currentTime / this.getAudio().duration;
    },

    getCurrentTime: function () {
        return this.audioContainer.currentTime;
    },
    // 音频错误处理函数
    audioErr: function () {
        // 没播放过，直接跳过
        if (rem.playinglist === undefined) return true;

        if (rem.errCount > 10) { // 连续播放失败的歌曲过多
            layer.msg('似乎出了点问题~播放已停止');
            rem.errCount = 0;
        } else {
            rem.errCount++;     // 记录连续播放失败的歌曲数目
            layer.msg('当前歌曲播放失败，自动播放下一首');
            rem.controlPanel.nextMusic();    // 切换下一首歌
        }
    },
}
