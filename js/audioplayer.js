function AudioPlayer(){
    rem.audio = $('<audio></audio>').appendTo('body');
    // 应用初始音量
    rem.audio[0].volume = 0;

    window.addEventListener("feedback-current-volume", function(e) {
        rem.audio[0].volume = e.currentVolume;
    });

    var queryVolumeEvent = new Event("query-volume");
    window.dispatchEvent(queryVolumeEvent)
  
    // 绑定歌曲进度变化事件
    rem.audio[0].addEventListener('timeupdate', this.updateProgress.bind(this));   // 更新进度
    rem.audio[0].addEventListener('play', this.audioPlay.bind(this)); // 开始播放了
    rem.audio[0].addEventListener('pause', this.audioPause.bind(this));   // 暂停
    $(rem.audio[0]).on('ended', this.autoNextMusic.bind(this));   // 播放结束
    rem.audio[0].addEventListener('error', this.audioErr.bind(this));   // 播放器错误处理
}

AudioPlayer.prototype= {

}
