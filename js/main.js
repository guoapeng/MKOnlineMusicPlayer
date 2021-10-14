/**************************************************
 * MKOnlinePlayer v2.4
 * 封装函数及UI交互模块
 * 编写：mengkun(https://mkblog.cn)
 * 时间：2018-3-11
 *************************************************/
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

$(function () {
    if (mkPlayer.debug) {
        console.warn('播放器调试模式已开启，正常使用时请在 js/player.js 中按说明关闭调试模式');
    }
    rem.isMobile = device.isMobile();      // 判断是否是移动设备
    rem.webTitle = document.title;      // 记录页面原本的标题
    rem.errCount = 0;                   // 连续播放失败的歌曲数归零
    rem.controlPanel = new ControlPanel();
    rem.controlPanel.initProgress();     // 初始化音量条、进度条（进度条初始化要在 Audio 前，别问我为什么……）
    rem.controlPanel.initAudio();    // 初始化 audio 标签，事件绑定

    rem.mainList = new MainList(rem.isMobile);
    rem.sheetList = new SheetList(rem.isMobile);
    
    rem.mainList.init();
    rem.sheetList.initializeMusicSheet();
    rem.controlPanel.initializeControlPanel();
    rem.controlPanel.initBg();
    // 初始化播放列表
    rem.sheetList.initList();
});

function initPlayerCover() {
    // 图片加载失败处理
    $('img').error(function () {
        $(this).attr('src', 'images/player_cover.png');
    });

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

// 下载正在播放的这首歌
function thisDownload(obj) {
    ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], download);
}

// 分享正在播放的这首歌
function thisShare(obj) {
    ajaxUrl(musicList[$(obj).data("list")].item[$(obj).data("index")], ajaxShare);
}

// 下载歌曲
// 参数：包含歌曲信息的数组
function download(music) {
    if (music.url == 'err' || music.url == "" || music.url == null) {
        layer.msg('这首歌不支持下载');
        return;
    }
    openDownloadDialog(music.url, music.name + ' - ' + music.artist);
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 * http://www.cnblogs.com/liuxianan/p/js-download.html
 */
function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.target = "_blank";
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

// 获取外链的ajax回调函数
// 参数：包含音乐信息的数组
function ajaxShare(music) {
    if (music.url == 'err' || music.url == "" || music.url == null) {
        layer.msg('这首歌不支持外链获取');
        return;
    }

    var tmpHtml = '<p>' + music.artist + ' - ' + music.name + ' 的外链地址为：</p>' +
        '<input class="share-url" onmouseover="this.focus();this.select()" value="' + music.url + '">' +
        '<p class="share-tips">* 获取到的音乐外链有效期较短，请按需使用。</p>';

    layer.open({
        title: '歌曲外链分享'
        , content: tmpHtml
    });
}

// 改变右侧封面图像
// 新的图像地址
function changeCover(music) {
    var img = music.pic;    // 获取歌曲封面
    var animate = false, imgload = false;

    if (!img) {  // 封面为空
        ajaxPic(music, changeCover);    // 获取歌曲封面图
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


// 向列表中载入某个播放列表
function loadList(list) {
    if (musicList[list].isloading === true) {
        layer.msg('列表读取中...', { icon: 16, shade: 0.01, time: 500 });
        return true;
    }

    rem.dislist = list;     // 记录当前显示的列表

    dataBox("list");    // 在主界面显示出播放列表

    // 调试信息输出
    if (mkPlayer.debug) {
        if (musicList[list].id) {
            console.log('加载播放列表 ' + list + ' - ' + musicList[list].name + '\n' +
                'id: ' + musicList[list].id + ',\n' +
                'name: "' + musicList[list].name + '",\n' +
                'cover: "' + musicList[list].cover + '",\n' +
                'item: []');
        } else {
            console.log('加载播放列表 ' + list + ' - ' + musicList[list].name);
        }
    }

    rem.mainList.clearMainList(); // 清空列表中原有的元素
    //TODO: remove this method
    rem.mainList.addListhead();      // 向列表中加入列表头

    if (musicList[list].item.length == 0) {
        rem.mainList.displayNomore(); // 列表中没有数据
    } else {

        // 逐项添加数据
        for (var i = 0; i < musicList[list].item.length; i++) {
            var tmpMusic = musicList[list].item[i];

            rem.mainList.addItem(i + 1, tmpMusic.name, tmpMusic.artist, tmpMusic.album);

            // 音乐链接均有有效期限制,重新显示列表时清空处理
            if (list == 1 || list == 2) tmpMusic.url = "";
        }

        // 列表加载完成后的处理
        if (list == 1 || list == 2) {    // 历史记录和正在播放列表允许清空
            rem.mainList.displayClearBtn(); // 清空列表
        }

        if (rem.playlist === undefined) {    // 未曾播放过
            if (mkPlayer.autoplay == true) pause();  // 设置了自动播放，则自动播放
        } else {
            refreshList();  // 刷新列表，添加正在播放样式
        }

        listToTop();    // 播放列表滚动到顶部
    }
}

// 播放列表滚动到顶部
function listToTop() {
    if (rem.isMobile) {
        $("#main-list").animate({ scrollTop: 0 }, 200);
    } else {
        $("#main-list").mCustomScrollbar("scrollTo", 0, "top");
    }
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

// 在 ajax 获取了音乐的信息后再进行更新
// 参数：要进行更新的音乐
function updateMinfo(music) {
    // 不含有 id 的歌曲无法更新
    if (!music.id) return false;

    // 循环查找播放列表并更新信息
    for (var i = 0; i < musicList.length; i++) {
        for (var j = 0; j < musicList[i].item.length; j++) {
            // ID 对上了，那就更新信息
            if (musicList[i].item[j].id == music.id && musicList[i].item[j].source == music.source) {
                musicList[i].item[j] == music;  // 更新音乐信息
                j = musicList[i].item.length;   // 一个列表中只找一首，找到了就跳出
            }
        }
    }
}

// 刷新当前显示的列表，如果有正在播放则添加样式
function refreshList() {
    // 还没播放过，不用对比了
    if (rem.playlist === undefined) return true;

    $(".list-playing").removeClass("list-playing");        // 移除其它的正在播放

    if (rem.paused !== true) {   // 没有暂停
        for (var i = 0; i < musicList[rem.dislist].item.length; i++) {
            // 与正在播放的歌曲 id 相同
            if ((musicList[rem.dislist].item[i].id !== undefined) &&
                (musicList[rem.dislist].item[i].id == musicList[1].item[rem.playid].id) &&
                (musicList[rem.dislist].item[i].source == musicList[1].item[rem.playid].source)) {
                $(".list-item[data-no='" + i + "']").addClass("list-playing");  // 添加正在播放样式

                return true;    // 一般列表中只有一首，找到了赶紧跳出
            }
        }
    }

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

// 将当前歌曲加入播放历史
// 参数：要添加的音乐
function addHis(music) {
    if (rem.playlist == 2) return true;  // 在播放“播放记录”列表则不作改变

    if (musicList[2].item.length > 300) musicList[2].item.length = 299; // 限定播放历史最多是 300 首

    if (music.id !== undefined && music.id !== '') {
        // 检查历史数据中是否有这首歌，如果有则提至前面
        for (var i = 0; i < musicList[2].item.length; i++) {
            if (musicList[2].item[i].id == music.id && musicList[2].item[i].source == music.source) {
                musicList[2].item.splice(i, 1); // 先删除相同的
                i = musicList[2].item.length;   // 找到了，跳出循环
            }
        }
    }

    // 再放到第一位
    musicList[2].item.unshift(music);

    playerSavedata('his', musicList[2].item);  // 保存播放历史列表
}

// 清空用户的同步列表
function clearUserlist() {
    if (!rem.uid) return false;

    // 查找用户歌单起点
    for (var i = 1; i < musicList.length; i++) {
        if (musicList[i].creatorID !== undefined && musicList[i].creatorID == rem.uid) break;    // 找到了就退出
    }

    // 删除记忆数组
    musicList.splice(i, musicList.length - i); // 先删除相同的
    musicList.length = i;

    // 刷新列表显示
    rem.sheetList.clearSheet();
    rem.sheetList.initList();
}

// 清空当前显示的列表
function clearDislist() {
    musicList[rem.dislist].item.length = 0;  // 清空内容
    if (rem.dislist == 1) {  // 正在播放列表
        playerSavedata('playing', '');  // 清空本地记录
        $(".sheet-item[data-no='1'] .sheet-cover").attr('src', 'images/player_cover.png');    // 恢复正在播放的封面
    } else if (rem.dislist == 2) {   // 播放记录
        playerSavedata('his', '');  // 清空本地记录
    }
    layer.msg('列表已被清空');
    dataBox("sheet");    // 在主界面显示出音乐专辑
}

// 刷新播放列表，为正在播放的项添加正在播放中的标识
function refreshSheet() {
    // 调试信息输出
    if (mkPlayer.debug) {
        console.log("开始播放列表 " + musicList[rem.playlist].name + " 中的歌曲");
    }

    $(".sheet-playing").removeClass("sheet-playing");        // 移除其它的正在播放

    $(".sheet-item[data-no='" + rem.playlist + "']").addClass("sheet-playing"); // 添加样式
}

// 播放器本地存储信息
// 参数：键值、数据
function playerSavedata(key, data) {
    key = 'mkPlayer2_' + key;    // 添加前缀，防止串用
    data = JSON.stringify(data);
    // 存储，IE6~7 不支持HTML5本地存储
    if (window.localStorage) {
        localStorage.setItem(key, data);
    }
}

// 播放器读取本地存储信息
// 参数：键值
// 返回：数据
function playerReaddata(key) {
    if (!window.localStorage) return '';
    key = 'mkPlayer2_' + key;
    return JSON.parse(localStorage.getItem(key));
}
