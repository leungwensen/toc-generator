export default function anonymous(data, helper
/**/) {
    data = data || {};helper = helper || {};var _e = helper.escape ? helper.escape : function (s) {return s;};var _s = '<li class="toc-link level' + _e(data.level) + '"><span class="' + _e(data.textClassName) + '" data-unique="' + _e(data.uniqueId) + '">' + _e(data.text) + '</span></li>';return _s;
};
