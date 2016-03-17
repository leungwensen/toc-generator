/**
 * Created by liangwensen on 2/17/16.
 */

import win from 'zero-lang/global';

import Toc from './toc';
import generate from './generate';
import utils from './utils';

import {
    extend
} from 'zero-lang/object';

let main = extend({
    Toc,
    generate,
}, utils);

win.tg = win.tocGenerator = main;

export default main;
