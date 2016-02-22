export default function anonymous(data, helper
/**/) {
    data = data || {};helper = helper || {};var _e = helper.escape ? helper.escape : function (s) {return s;};var _s = '<span class="' + _e(data.className) + '" data-unique="' + _e(data.uniqueId) + '">&blacktriangledown;</span>';return _s;
};
