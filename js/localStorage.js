
function DataSaver() {

}

DataSaver.prototype = {

    // 播放器本地存储信息
    // 参数：键值、数据
    playerSavedata: function (key, data) {
        key = 'mkPlayer2_' + key;    // 添加前缀，防止串用
        data = JSON.stringify(data);
        // 存储，IE6~7 不支持HTML5本地存储
        if (window.localStorage) {
            localStorage.setItem(key, data);
        }
    },
    // 播放器读取本地存储信息
    // 参数：键值
    // 返回：数据
    playerReaddata: function (key) {
        if (!window.localStorage) return '';
        key = 'mkPlayer2_' + key;
        return JSON.parse(localStorage.getItem(key));
    }

}
