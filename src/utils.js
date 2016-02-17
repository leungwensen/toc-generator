/**
 * Created by liangwensen on 2/17/16.
 */

import {
    toInt
} from 'zero-lang/number';
import sprintf from 'zero-fmt/sprintf';

function getHeaderLevel(header) {
    let tagName = header.tagName;
    return toInt(tagName.replace(/h/i, ''));
}

function getHeaderText(header) {
    return header.textContent || header.innerText || header.innerHTML;
}

function getHeaderSelector(level) {
    let headers = [];
    for (let i = 1; i <= level; i++) {
        headers.push(sprintf('h%d', i));
    }
    return headers.join(',');
}

export default {
    getHeaderLevel,
    getHeaderSelector,
    getHeaderText
}
