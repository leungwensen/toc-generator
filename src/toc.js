/**
 * Created by liangwensen on 2/17/16.
 */
import declare from 'zero-oop/declare';
import domConstruct from 'zero-dom/construct';
import domQuery from 'zero-dom/query';
import sprintf from 'zero-fmt/sprintf';
import win from 'zero-lang/global';
import {
    extend
} from 'zero-lang/object';

import {
    getHeaderLevel,
    getHeaderSelector,
    getHeaderText
} from './utils';

const DEFAULT_OPTIONS = {
    anchorIdPrefix: 'tg-',
    uniqueIdSeparator: '-',
    maxDepth: 3
};

const body = win.document.body;

let Toc = declare({
    constructor(element, options) {
        let self = this;
        if (element) {
            element = domQuery.one(element);
        }
        self._srcElement = element || body;
        self._options = extend({}, DEFAULT_OPTIONS, options);
        self.parse()
            .bindEvents();
        return self;
    },
    parse() {
        let self = this;
        self._outerDomNode = ''; // TODO
        return self;
    },
    bindEvents() {
        let self = this;
        return self;
    },
    scrollTo(uniqueId) {
        let self = this;
        let anchorSelector = sprintf('[data-unique="%s"]', uniqueId);
        try {
            let anchorNode = domQuery.one(anchorSelector, self._srcElement);
            if (anchorNode) {
                anchorNode.scrollIntoView(true);
            }
        } catch (e) {
        }
        return self;
    },
    placeAt(container, position) {
        let self = this;
        if (container) {
            container = domQuery.one(container);
        }
        container = container || body;
        position = position || '';
        domConstruct.place(self._outerDomNode, container, position);
        return self;
    },
    destroy() {
        let self = this;
        return self;
    }
});

export default Toc;
