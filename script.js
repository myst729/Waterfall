(function() {

    var container = document.getElementById('container'),
        noticeBar = document.getElementById('notice'),
        checkFlag = true,
        gapHeight = 15,
        gapWidth = 15,
        colWidth = 220,
        colArray = [],
        colCount = Math.floor((document.body.offsetWidth + gapWidth) / (colWidth + gapWidth)),
        delayer,
        noticer;

    var addEvent = function(element, type, handler) {
        if(element.addEventListener) {
            addEvent = function(element, type, handler) {
                element.addEventListener(type, handler, false);
            };
        } else if(element.attachEvent) {
            var e = window.event;
            addEvent = function(element, type, handler) {
                element.attachEvent('on' + type, handler);
            };
        } else {
            addEvent = function(element, type, handler) {
                element['on' + type] = handler;
            };
        }
        addEvent(element, type, handler);
    };

    var getMinVal = function(arr) {
        return Math.min.apply(Math, arr);
    };

    var getMaxVal = function(arr) {
        return Math.max.apply(Math, arr);
    };

    var getMinKey = function(arr) {
        var key = 0, min = arr[0];
        for(var i = 1, len = arr.length; i < len; i++) {
            if(arr[i] < min) {
                key = i;
                min = arr[i];
            }
        }
        return key;
    };

    var getMaxKey = function(arr) {
        var key = 0, max = arr[0];
        for(var i = 1, len = arr.length; i < len; i++) {
            if(arr[i] > max) {
                key = i;
                max = arr[i];
            }
        }
        return key;
    };

    var userAction = function(e) {
        clearTimeout(noticer);
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.tagName == 'SPAN') {
            noticeBar.innerHTML = (target.className == 'like' ? 'Liked ' : 'Marked ') + '<strong>' + target.parentNode.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML + '</strong>';
            noticeBar.className = 'on';
            noticer = setTimeout(function() {
                noticeBar.className = 'off';
            }, 2000);
        }
    };

    var adjustCells = function(nodes) {
        var colIndex, 
            colHeight;
        for(var j = 0, k = nodes.length; j < k; j++) {
            colIndex = getMinKey(colArray);
            colHeight = colArray[colIndex];
            nodes[j].style.left = colIndex * (colWidth + gapWidth) + 'px';
            nodes[j].style.top = colHeight + 'px';
            colArray[colIndex] = colHeight + gapHeight + nodes[j].offsetHeight;
            nodes[j].className = 'cell ready';
        }
        container.style.height = getMaxVal(colArray) + 'px';
        checkFlag = true;
        loadCheck();
    };

    var appendCells = function(num) {
        // Fetch JSON string via Ajax
        /*
        var request = new XMLHttpRequest(),
            fragment = document.createDocumentFragment(),
            cells = [],
            data;
        request.open('GET', 'json.php?n=' + num, true);
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                data = JSON.parse(request.responseText);
                for(var j = 0, k = data.length; j < k; j++) {
                    var cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.innerHTML = '<p><a href="#"><img src="img/' + data[j].s + '.jpg" height="' + data[j].h + '" width="190" /></a></p><h2><a href="#">' + data[j].s + '.jpg</a></h2><span class="like">Like!</span><span class="mark">Mark!</span>';
                    cells.push(cell);
                    fragment.appendChild(cell);
                }
                container.appendChild(fragment);
                adjustCells(cells);
            }
        };
        request.send(null);
        */

        // Fake, only for GH demo
        var fragment = document.createDocumentFragment(),
            cells = [],
            data = [],
            size = [286, 143, 270, 143, 190, 285, 152, 275, 285, 285, 128, 281, 242, 339, 236, 157, 286, 259, 267, 137, 253, 127, 190, 190, 225, 269, 264, 272, 126, 265, 287, 269, 125, 285, 190, 314, 141, 119, 274, 274, 285, 126, 279, 143, 266, 279, 600, 276, 285, 182, 143, 287, 126, 190, 285, 143, 241, 166, 240, 190];
        for(var i = 0; i < num; i++) {
            var key = Math.floor(Math.random() * 60);
            data[i] = {
                s: key + 1,
                h: size[key]
            };
        }
        for(var j = 0, k = data.length; j < k; j++) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerHTML = '<p><a href="#"><img src="img/' + data[j].s + '.jpg" height="' + data[j].h + '" width="190" /></a></p><h2><a href="#">' + data[j].s + '.jpg</a></h2><span class="like">Like!</span><span class="mark">Mark!</span>';
            cells.push(cell);
            fragment.appendChild(cell);
        }
        container.appendChild(fragment);
        adjustCells(cells);
    };

    var reflowCheck = function() {
        colCount = Math.floor((document.body.offsetWidth + gapWidth) / (colWidth + gapWidth));
        if(colArray.length != colCount) {
            colArray = [];
            container.style.width = (colCount * (colWidth + gapWidth) - gapWidth) + 'px';
            for(var i = 0; i < colCount; i++) {
                colArray.push(gapHeight);
            }
            adjustCells(container.childNodes);
        } else {
            loadCheck();
        }
    };

    var loadCheck = function() {
        if(checkFlag && (window.innerHeight || document.documentElement.clientHeight) + (document.documentElement.scrollTop || document.body.scrollTop) > getMinVal(colArray)) {
            checkFlag = false;
            appendCells(colCount);
        }
    };

    var reflowDelay = function() {
        clearTimeout(delayer);
        delayer = setTimeout(reflowCheck, 500);
    };

    var init = function() {
        container.style.width = (colCount * (colWidth + gapWidth) - gapWidth) + 'px';
        for(var i = 0; i < colCount; i++) {
            colArray.push(gapHeight);
        }
        loadCheck();
    };

    addEvent(document, 'click', userAction);
    addEvent(window, 'scroll', loadCheck);
    addEvent(window, 'resize', reflowDelay);
    addEvent(window, 'load', init);

})();