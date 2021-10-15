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

// 清空当前显示的列表
function clearDislist() {
   rem.sheetList.clearDislist();
}
