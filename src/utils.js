/**
 * Created by liangwensen on 2/17/16.
 */

import {
    toInteger
} from 'zero-lang/number';
import sprintf from 'zero-fmt/sprintf';

export function getHeaderLevel(header) {
    let tagName = header.tagName;
    return toInteger(tagName.replace(/h/i, ''));
}

export function getHeaderText(header) {
    return header.textContent || header.innerText || header.innerHTML;
}

export function getHeaderSelector(level) {
    let headers = [];
    for (let i = 1; i <= level; i++) {
        headers.push(sprintf('h%d', i));
    }

    return headers.join(',');
}
