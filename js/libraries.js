// 判断是否是移动设备
var device = {
    Android: function () {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    isMobile: function () {
        return (device.Android() || device.BlackBerry() || device.iOS() || device.Windows());
    }
};

String.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

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
        '<span class="info-btn" onclick="rem.controlPanel.downloadThis(this)" data-list="' + list + '" data-index="' + index + '">下载</span>' +
        '<span style="margin-left: 10px" class="info-btn" onclick="rem.controlPanel.shareThis(this)" data-list="' + list + '" data-index="' + index + '">外链</span>';

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

// 搜索提交
function searchSubmit() {
    var wd = $("#search-wd").val();
    if (!wd) {
        layer.msg('搜索内容不能为空', { anim: 6, offset: 't' });
        $("#search-wd").focus();
        return false;
    }
    rem.source = $("#music-source input[name='source']:checked").val();

    layer.closeAll('page');     // 关闭搜索框

    rem.loadPage = 1;   // 已加载页数复位
    rem.wd = wd;    // 搜索词
    ajaxSearch();   // 加载搜索结果
    return false;
}


// 将时间格式化为 00:00 的格式
// 参数：原始时间
function formatTime(time) {
    var hour, minute, second;
    hour = String(parseInt(time / 3600, 10));
    if (hour.length == 1) hour = '0' + hour;

    minute = String(parseInt((time % 3600) / 60, 10));
    if (minute.length == 1) minute = '0' + minute;

    second = String(parseInt(time % 60, 10));
    if (second.length == 1) second = '0' + second;

    if (hour > 0) {
        return hour + ":" + minute + ":" + second;
    } else {
        return minute + ":" + second;
    }
}

// url编码
// 输入参数：待编码的字符串
function urlEncode(String) {
    return encodeURIComponent(String).replace(/'/g, "%27").replace(/"/g, "%22");
}
