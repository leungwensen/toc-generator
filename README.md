# toc-generator

table of content generator.

## install

```
npm install toc-generator --save-dev
```

## usage

```javascript
import tg from 'toc-generator';

let toc = new tg.Toc(element, options);
//let toc = tg.generate(element, options);
/*
 element: optional, default is document.body
 options: optional, default is
 {
    anchorIdPrefix: 'toc-',
    maxDepth: 3,
 }
 */
 
toc.placeAt(container, position);
/*
 container: optional, default is document.body
 position: optional, validate value is one of
 [
    'before',
    'after',
    'replace',
    'only',
    'first',
    'last'
 ]
 */
 
toc.destroy();
/*
 will remove all anchors from element, and remove domNode of toc itself.
 */
```
