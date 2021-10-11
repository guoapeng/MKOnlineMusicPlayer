
//============================== behaviore of mainlist =========================================
// 加载列表中的提示条
// 参数：类型（more、nomore、loading、nodata、clear）
MainList = function (listContainer) {
    this.listContainer = listContainer;
}

MainList.prototype = {
    displayMore: function () {
        this.listContainer.append('<div class="list-item text-center list-loadmore list-clickable" title="点击加载更多数据" id="list-foot">点击加载更多...</div>');
    },
    displayNomore: function () {
        this.listContainer.append('<div class="list-item text-center" id="list-foot">全都加载完了</div>');
    },
    displayLoading: function () {
        this.listContainer.append('<div class="list-item text-center" id="list-foot">播放列表加载中...</div>');
    },
    displayNodata: function () {
        this.listContainer.append('<div class="list-item text-center" id="list-foot">可能是个假列表，什么也没有</div>');
    },
    displayClearBtn: function () {
        this.listContainer.append('<div class="list-item text-center list-clickable" id="list-foot" onclick="clearDislist();">清空列表</div>');
    },
    clearMainList: function () {
        this.listContainer.html('');
    },
    addItem: function (no, name, auth, album) {
        // 列表中新增一项
        // 参数：编号、名字、歌手、专辑 
        var html = '<div class="list-item" data-no="' + (no - 1) + '">' +
            '    <span class="list-num">' + no + '</span>' +
            '    <span class="list-mobile-menu"></span>' +
            '    <span class="music-album">' + album + '</span>' +
            '    <span class="auth-name">' + auth + '</span>' +
            '    <span class="music-name">' + name + '</span>' +
            '</div>';
            this.listContainer.append(html);
    },
    addListhead: function () {
        // 向列表中加入列表头
        var html = '<div class="list-item list-head">' +
            '    <span class="music-album">' +
            '        专辑' +
            '    </span>' +
            '    <span class="auth-name">' +
            '        歌手' +
            '    </span>' +
            '    <span class="music-name">' +
            '        歌曲' +
            '    </span>' +
            '</div>';
        this.listContainer.append(html);
    }
}
//============================== end behaviore of mainlist =========================================
