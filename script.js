var container = document.getElementById('container'),
    checkFlag = true,
    gapHeight = 15,
    gapWidth = 15,
    colWidth = 220,
    colArray = [],
    colCount = Math.floor((document.body.offsetWidth + gapWidth) / (colWidth + gapWidth)),
    delayer;

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

var adjustCells = function(nodes) {
    var colIndex, colHeight;
    Array.prototype.forEach.call(nodes, function(node) {
        colIndex = getMinKey(colArray);
        colHeight = colArray[colIndex];
        node.style.left = colIndex * (colWidth + gapWidth) + 'px';
        node.style.top = colHeight + 'px';
        colArray[colIndex] = colHeight + gapHeight + node.offsetHeight;
        node.className = 'cell ready';
    });
    container.style.height = getMaxVal(colArray) + 'px';
    checkFlag = true;
    loadCheck();
};

var appendCells = function(num) {
    // Fetch JSON string via Ajax
    var request = new XMLHttpRequest(),
        fragment = document.createDocumentFragment(),
        cells = [],
        data;
    request.open('GET', 'json.php?n=' + num, true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            data = JSON.parse(request.responseText);
            data.forEach(function(el) {
                var cell = document.createElement('div');
                cell.className = 'cell';
                cell.innerHTML = '<p><a href="#"><img src="img/'+ el.s +'.jpg" height="'+ el.h +'" width="190" /></a></p><h2><a href="#">'+ el.s +'.jpg</a></h2><span class="like">Like!</span><span class="mark">Mark!</span>';
                cells.push(cell);
                fragment.appendChild(cell);
            });
            container.appendChild(fragment);
            adjustCells(cells);
        }
    };
    request.send(null);

    // Fake, only for GH demo
    /*
    var fragment = document.createDocumentFragment(),
        cells = [],
        data = [];
        size = [286, 143, 270, 143, 190, 285, 152, 275, 285, 285, 128, 281, 242, 339, 236, 157, 286, 259, 267, 137, 253, 127, 190, 190, 225, 269, 264, 272, 126, 265, 287, 269, 125, 285, 190, 314, 141, 119, 274, 274, 285, 126, 279, 143, 266, 279, 600, 276, 285, 182, 143, 287, 126, 190, 285, 143, 241, 166, 240, 190];
    for(var i = 0; i < num; i++) {
        var key = Math.floor(Math.random() * 60);
        data[i] = {
            s: key + 1,
            h: size[key]
        };
    }
    data.forEach(function(el) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerHTML = '<p><a href="#"><img src="img/'+ el.s +'.jpg" height="'+ el.h +'" width="190" /></a></p><h2><a href="#">'+ el.s +'.jpg</a></h2><span class="like">Like!</span><span class="mark">Mark!</span>';
        cells.push(cell);
        fragment.appendChild(cell);
    });
    container.appendChild(fragment);
    adjustCells(cells);
    */
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

window.addEventListener('scroll', loadCheck, false);
window.addEventListener('resize', reflowDelay, false);
window.addEventListener('load', init, false);