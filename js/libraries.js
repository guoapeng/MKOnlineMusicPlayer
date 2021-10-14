// 展现系统列表中任意首歌的歌曲信息
function musicInfo(list, index) {
    var music = musicList[list].item[index];
    var tempStr = '<span class="info-title">歌名：</span>' + music.name +
        '<br><span class="info-title">歌手：</span>' + music.artist +
        '<br><span class="info-title">专辑：</span>' + music.album;

    if (list == rem.playlist && index == rem.playid) {   // 当前正在播放这首歌，那么还可以顺便获取一下时长。。
        tempStr += '<br><span class="info-title">时长：</span>' + formatTime(rem.audio[0].duration);
    }

    tempStr += '<br><span class="info-title">操作：</span>' +
        '<span class="info-btn" onclick="thisDownload(this)" data-list="' + list + '" data-index="' + index + '">下载</span>' +
        '<span style="margin-left: 10px" class="info-btn" onclick="thisShare(this)" data-list="' + list + '" data-index="' + index + '">外链</span>';

    layer.open({
        type: 0,
        shade: false,
        title: false, //不显示标题
        btn: false,
        content: tempStr
    });

    if (mkPlayer.debug) {
        console.info('id: "' + music.id + '",\n' +
            'name: "' + music.name + '",\n' +
            'artist: "' + music.artist + '",\n' +
            'album: "' + music.album + '",\n' +
            'source: "' + music.source + '",\n' +
            'url_id: "' + music.url_id + '",\n' +
            'pic_id: "' + music.pic_id + '",\n' +
            'lyric_id: "' + music.lyric_id + '",\n' +
            'pic: "' + music.pic + '",\n' +
            'url: ""');
        // 'url: "' + music.url + '"');
    }
}


// 展现搜索弹窗
function searchBox() {
    var tmpHtml = '<form onSubmit="return searchSubmit()"><div id="search-area">' +
        '    <div class="search-group">' +
        '        <input type="text" name="wd" id="search-wd" placeholder="搜索歌手、歌名、专辑" autofocus required>' +
        '        <button class="search-submit" type="submit">搜 索</button>' +
        '    </div>' +
        '    <div class="radio-group" id="music-source">' +
        '       <label><input type="radio" name="source" value="netease" checked=""> 网易云</label>' +
        '       <label><input type="radio" name="source" value="tencent"> QQ</label>' +
        '       <label><input type="radio" name="source" value="xiami"> 虾米</label>' +
        '       <label><input type="radio" name="source" value="kugou"> 酷狗</label>' +
        '       <label><input type="radio" name="source" value="baidu"> 百度</label>' +
        '   </div>' +
        '</div></form>';
    layer.open({
        type: 1,
        shade: false,
        title: false, // 不显示标题
        shade: 0.5,    // 遮罩颜色深度
        shadeClose: true,
        content: tmpHtml,
        cancel: function () {
        }
    });

    // 恢复上一次的输入
    $("#search-wd").focus().val(rem.wd);
    $("#music-source input[name='source'][value='" + rem.source + "']").prop("checked", "checked");
}