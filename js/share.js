function AjaxShare() {

}

AjaxShare.prototype = {
    // 获取外链的ajax回调函数
    // 参数：包含音乐信息的数组
    ajaxShare: function (music) {
        if (music.url == 'err' || music.url == "" || music.url == null) {
            layer.msg('这首歌不支持外链获取');
            return;
        }

        var tmpHtml = String.format('<p>' + '{0}' + ' - ' + '{1}' + ' 的外链地址为：</p>' +
            '<input class="share-url" onmouseover="this.focus();this.select()" value="' + '{2}' + '">' +
            '<p class="share-tips">* 获取到的音乐外链有效期较短，请按需使用。</p>', music.artist, music.name, music.url);

        layer.open({
            title: '歌曲外链分享'
            , content: tmpHtml
        });
    }
}