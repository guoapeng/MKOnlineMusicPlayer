function AudioPlayer() {
    this.audio = $('<audio></audio>').appendTo('body');
    vp = this;
    rem.audio = this.audio;
    // 应用初始音量
    vp.audio[0].volume = 0;

    window.addEventListener("feedback-current-volume", function (e) {
        vp.audio[0].volume = e.currentVolume;
    });

    window.addEventListener("mb-start-play", function(e){
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
    vp.audio[0].addEventListener('timeupdate', rem.controlPanel.updateProgress.bind(rem.controlPanel));   // 更新进度
    vp.audio[0].addEventListener('play', rem.controlPanel.audioPlay.bind(rem.controlPanel)); // 开始播放了
    vp.audio[0].addEventListener('pause', rem.controlPanel.audioPause.bind(rem.controlPanel));   // 暂停
    $(vp.audio[0]).on('ended', rem.controlPanel.autoNextMusic.bind(rem.controlPanel));   // 播放结束
    vp.audio[0].addEventListener('error', rem.controlPanel.audioErr.bind(rem.controlPanel));   // 播放器错误处理
}

AudioPlayer.prototype = {

    pause: function() {
        this.getAudio().pause();
    },

    getAudio: function () {
        return this.audio[0];
    },

    setSource: function(source) {
        this.audio.attr('src', source);
    },

    setVolume: function(newVal) {
        if (this.getAudio() !== undefined) {   // 音频对象已加载则立即改变音量
            this.getAudio().volume = newVal;
        }
    },

    setTime: function(newTime) {
        if (this.getAudio() !== undefined) {   // 音频对象已加载则立即改变音量
            this.getAudio().currentTime = newTime;
        }
    },

    getProgress: function() {
       return this.getAudio().currentTime / this.getAudio().duration;
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
}
