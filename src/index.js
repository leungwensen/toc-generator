/**
 * Created by liangwensen on 2/17/16.
 */

import win from 'zero-lang/global';

import Toc from './toc';
import utils from './utils';

import {
    extend
} from 'zero-lang/object';

let main = extend({
    Toc,
    generate(element, options) {
        return new Toc(element, options);
    }
}, utils);

win.tg = win.tocGenerator = main;

export default main;
