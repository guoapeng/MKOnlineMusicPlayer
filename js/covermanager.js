function CoverManager() {

    window.addEventListener("mb-start-play", function(e){
        this.changeCover(e.music);
    }.bind(this));

}

CoverManager.prototype = {
    // 改变右侧封面图像
    // 新的图像地址
    changeCover: function (music) {
        var img = music.pic;    // 获取歌曲封面
        var animate = false, imgload = false;

        if (!img) {  // 封面为空
            rem.dataFetcher.ajaxPic(music, this.changeCover);    // 获取歌曲封面图
            img == "err";    // 暂时用无图像占个位...
        }

        if (img == "err") {
            img = "images/player_cover.png";
        } else {
            if (mkPlayer.mcoverbg === true && rem.isMobile)      // 移动端封面
            {
                $("#music-cover").load(function () {
                    $("#mobile-blur").css('background-image', 'url("' + img + '")');
                });
            }
            else if (mkPlayer.coverbg === true && !rem.isMobile)     // PC端封面
            {
                $("#music-cover").load(function () {
                    if (animate) {   // 渐变动画也已完成
                        $("#blur-img").backgroundBlur(img);    // 替换图像并淡出
                        $("#blur-img").animate({ opacity: "1" }, 2000); // 背景更换特效
                    } else {
                        imgload = true;     // 告诉下面的函数，图片已准备好
                    }

                });

                // 渐变动画
                $("#blur-img").animate({ opacity: "0.2" }, 1000, function () {
                    if (imgload) {   // 如果图片已经加载好了
                        $("#blur-img").backgroundBlur(img);    // 替换图像并淡出
                        $("#blur-img").animate({ opacity: "1" }, 2000); // 背景更换特效
                    } else {
                        animate = true;     // 等待图像加载完
                    }
                });
            }
        }

        $("#music-cover").attr("src", img);     // 改变右侧封面
        $(".sheet-item[data-no='1'] .sheet-cover").attr('src', img);    // 改变正在播放列表的图像
    }
}