function BackgroundManager() {
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
   