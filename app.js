var Square = function () {
    this.marker = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };

    /**
     * jednostki, nie piksele
     */
    this.x = 0;
    this.y = 0;
};

var Grammar = function (width, height, squareSize) {
    this.field = {
        width: width,
        height: height,
        squareSize: squareSize
    };

    this.squares = [];
};

Grammar.prototype = {
    init: function (x, y) {
        x = x || 0;
        y = y || 0;
        var _square = this.newSquare(x, y);
    },

    _clone: function(obj)
    {
        var copy;

        if (null == obj || "object" != typeof obj) return obj;

        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this._clone(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this._clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    clone: function(g)
    {
        this.squares = [];

        for (var i in g.squares)
        {
            var obj = g.squares[i];
            this.squares.push(this._clone(obj));
        }
    },

    newChild: function(dna)
    {
        this.squares = [];
        for (var i = 0; i < dna.length; i++)
        {
            if (dna[i])
            {
                var obj = new Square();
                var _modx = Math.floor(this.field.width / this.field.squareSize);
                var _mody = Math.floor(this.field.height / this.field.squareSize);
                obj.x = Math.floor(i % _modx);
                obj.y = Math.floor(i / _mody);

                this.squares.push(obj);
            }
        }
        for (var i in this.squares)
        {
            this.refreshMarkers( this.squares[i] );
        }
    },

    newSquare: function (x, y) {
        var newSquare = new Square();
        newSquare.x = x;
        newSquare.y = y;
        this.refreshMarkers(newSquare);
        this.squares.push(newSquare);
        return newSquare;
    },
    newTempSquare: function (x, y) {
        var newSquare = new Square();
        newSquare.x = x;
        newSquare.y = y;
        return newSquare;
    },
    addLeft: function (square) {
        if (this.isCollisionByParent(square, 'left'))
            return false;

        this.newSquare(square.x - 1, square.y);
        square.marker.left = false;
        return true;
    },
    addRight: function (square) {
        if (this.isCollisionByParent(square, 'right'))
            return false;

        this.newSquare(square.x + 1, square.y);
        square.marker.right = false;
    },
    addTop: function (square) {
        if (this.isCollisionByParent(square, 'top'))
            return false;

        this.newSquare(square.x, square.y - 1);
        square.marker.top = false;
    },
    addBottom: function (square) {
        if (this.isCollisionByParent(square, 'bottom'))
            return false;

        this.newSquare(square.x, square.y + 1);
        square.marker.bottom = false;
    },

    refreshMarkers: function (square) {
        square.marker.left = this.isAllowMarkerLeft(square);
        square.marker.top = this.isAllowMarkerTop(square);
        square.marker.right = this.isAllowMarkerRight(square);
        square.marker.bottom = this.isAllowMarkerBottom(square);
    },

    isInBordersByElement: function (parentSquare, direction) {
        switch (direction) {
            case 'left':
                return 0 <= ((parentSquare.x) * this.field.squareSize);
                break;
            case 'right':
                return this.field.width >= (parentSquare.x * this.field.squareSize);
                break;
            case 'top':
                return 0 <= ((parentSquare.y) * this.field.squareSize);
                break;
            case 'bottom':
                return this.field.height >= (parentSquare.y * this.field.squareSize);
                break;
        }
        throw 'No valid direction!';

    },

    isInBorders: function (parentSquare, direction) {
        switch (direction) {
            case 'left':
                //console.log(parentSquare, parentSquare.x-1, ((parentSquare.x - 1) * this.field.squareSize));
                return 0 <= ((parentSquare.x - 1) * this.field.squareSize);
                break;
            case 'right':
                return this.field.width >= ((parentSquare.x + 1) * this.field.squareSize);
                break;
            case 'top':
                return 0 <= ((parentSquare.y - 1) * this.field.squareSize);
                break;
            case 'bottom':
                return this.field.height >= ((parentSquare.y + 1) * this.field.squareSize);
                break;
        }
        throw 'No valid direction!';
    },

    isCollision: function (x, y) {
        for (var i = 0; i < this.squares.length; i++) {
            if (this.squares[i].x == x && this.squares[i].y == y) return true;
        }
        return false;
    },

    isCollisionByParent: function (parentSquare, direction) {
        switch (direction) {
            case 'left':
                return this.isCollision(parentSquare.x - 1, parentSquare.y);
                break;
            case 'right':
                return this.isCollision(parentSquare.x + 1, parentSquare.y);
                break;
            case 'top':
                return this.isCollision(parentSquare.x, parentSquare.y - 1);
                break;
            case 'bottom':
                return this.isCollision(parentSquare.x, parentSquare.y + 1);
                break;
        }
        throw 'No valid direction!';
    },

    /**
     * warunki dla markerow danym kwadracie
     */
    isAllowMarkerLeft: function (square) {
        if (!this.isInBorders(square, 'left') || this.isCollisionByParent(square, 'left'))
            return false;
        return true;
    },
    isAllowMarkerRight: function (square) {
        if (!this.isInBorders(square, 'right') || this.isCollisionByParent(square, 'right'))
            return false;
        return true;
    },
    isAllowMarkerTop: function (square) {
        if (!this.isInBorders(square, 'top') || this.isCollisionByParent(square, 'top'))
            return false;
        return true;
    },
    isAllowMarkerBottom: function (square) {
        if (!this.isInBorders(square, 'bottom') || this.isCollisionByParent(square, 'bottom'))
            return false;
        return true;
    },
    isAllowLeft: function (square) {
        if (!this.isInBordersByElement(square, 'left') || this.isCollision(square.x, square.y))
            return false;
        return true;
    },
    isAllowRight: function (square) {
        if (!this.isInBordersByElement(square, 'right') || this.isCollision(square.x, square.y))
            return false;
        return true;
    },
    isAllowBottom: function (square) {
        if (!this.isInBordersByElement(square, 'bottom') || this.isCollision(square.x, square.y))
            return false;
        return true;
    },
    isAllowTop: function (square) {
        if (!this.isInBordersByElement(square, 'top') || this.isCollision(square.x, square.y))
            return false;
        return true;
    },


    getElement: function (i) {
        return this.squares[i];
    },

    getElementInfo: function (i) {
        if (i instanceof Square) {
            s = i;
        } else {
            s = this.squares[i];
        }

        var attr = {};
        attr.x = s.x * this.field.squareSize;
        attr.y = s.y * this.field.squareSize;
        attr.width = this.field.squareSize;
        attr.height = this.field.squareSize;
        attr.class = (i instanceof Square) ? 'temp' : '';
        attr.index = (i instanceof Square) ? 0 : i;
        attr.style = (i instanceof Square) ? 'fill:red;' : '';
        return attr;
    },

    getElements: function () {
        var self = this;
        return {
            attrs: {
                x: function (s) {
                    return s.x;
                },
                y: function (s) {
                    return s.y;
                },
                width: function (s) {
                    return s.width;
                },
                height: function (s) {
                    return s.height;
                },
                style: function (s) {
                    return s.style;
                },
                index: function (s) {
                    return s.i;
                },
                class: function (s) {
                    return s.class;
                }
            },
            data: function () {
                var t = [];
                for (var i in self.squares) {
                    t.push(self.getElementInfo(i));
                }
                return t;
            },
            add: [{
                name: 'top',
                fn: 'addTop',
                cond: self.isAllowTop,
                el: function (old) {
                    return self.newTempSquare(old.x, old.y - 1)
                }
            }, {
                name: 'left',
                fn: 'addLeft',
                cond: self.isAllowLeft,
                el: function (old) {
                    return self.newTempSquare(old.x - 1, old.y)
                }
            }, {
                name: 'right',
                fn: 'addRight',
                cond: self.isAllowRight,
                el: function (old) {
                    return self.newTempSquare(old.x + 1, old.y)
                }
            }, {
                name: 'bottom',
                fn: 'addBottom',
                cond: self.isAllowBottom,
                el: function (old) {
                    return self.newTempSquare(old.x, old.y + 1)
                }
            }]
        };
    },

    addNewElement: function (old, fn) {
        switch (fn) {
            case 'addTop':
                this.addTop(old);
                break;
            case 'addBottom':
                this.addBottom(old);
                break;
            case 'addLeft':
                this.addLeft(old);
                break;
            case 'addRight':
                this.addRight(old);
                break;
        }
    },

    addNewRandom: function () {
        var _squares = [];
        for (var i = 0; i < this.squares.length; i++) {
            var s = this.squares[i];

            if (this.isAllowMarkerLeft(s)) {
                _squares.push({
                    fn: 'addLeft',
                    el: s
                });
            }

            if (this.isAllowMarkerTop(s)) {
                _squares.push({
                    fn: 'addTop',
                    el: s
                });
            }

            if (this.isAllowMarkerRight(s)) {
                _squares.push({
                    fn: 'addRight',
                    el: s
                });
            }

            if (this.isAllowMarkerBottom(s)) {
                _squares.push({
                    fn: 'addBottom',
                    el: s
                });
            }
        }
        return _squares;
    },

    calculateSymmetry: function() {
        var halfWidth = Math.round(this.field.width/this.field.squareSize/2);
        var halfHeight = Math.round(this.field.height/this.field.squareSize/2);
        var vertical = {top: 0, bottom: 0, calc: 0};
        var horizontal = {left: 0, right: 0, calc: 0};
        var _count = this.squares.length;

        for (var i in this.squares)
        {
            var square = this.squares[i];
            if ( square.x >= halfWidth )
            {
                horizontal.right++;
            } else {
                horizontal.left++;
            }

            if ( square.y >= halfHeight ) {
                vertical.bottom++;
            } else {
                vertical.top++;
            }
        }
        horizontal.calc = Math.abs(horizontal.left - horizontal.right);
        horizontal.calc = 1 - (horizontal.calc / _count);
        vertical.calc = Math.abs(vertical.top - vertical.bottom);
        vertical.calc = 1 - (vertical.calc / _count);
        //console.log(horizontal, vertical);
        return {
            horizontal: horizontal.calc,
            vertical: vertical.calc
        }
    }
};


var DG3 = function (width, height, grammar) {
    this._width = width;
    this._height = height;

    this.grammar = grammar;
    this.wrapper;
    this.group;
    this.ready = false;
};
DG3.prototype = {
    init: function () {
        var self = this;
        this.wrapper = d3
            .select("body")
            .append("svg")
            .attr("width", this._width)
            .attr("height", this._height);

        this.group = this.wrapper.append("g")
            .attr("class", "poly");

        /*d3
         .select("body")
         .append("button")
         .text('Ocena')
         .on('click', function(){
         self.calculateAesthetics();
         })
         ;*/
    },

    getRandomNumber: function (rangeStart, rangeEnd) {
        return Math.round(Math.random() * (rangeEnd - rangeStart)) + rangeStart;
    },

    random: function (rangeStart, rangeEnd, delay) {
        var _count = this.getRandomNumber(rangeStart, rangeEnd);
        var self = this;
        //console.log('Generate ', _count);
        delay = delay || 0;

        var $counter = 1;
        for (var i = 0; i < _count; i++) {
            setTimeout(function () {
                var _els = self.grammar.addNewRandom();
                var randIndex = self.getRandomNumber(0, _els.length - 1);
                //randIndex = self.getRandomNumber(randIndex, _els.length-1);

                var el = _els[randIndex];
                self.grammar.addNewElement(el.el, el.fn);
                self.refresh();

                if ($counter == _count) {
                    self.ready = true;
                    console.log('Ready ;)');
                }
                $counter++;
            }, delay * i);
        }
    },

    removeAll: function () {
        this.group
            .selectAll("rect")
            .remove();
        this.wrapper
            .selectAll("rect")
            .remove();
    },

    selectAll: function () {
        return this.group.selectAll('rect');
    },

    getData: function () {
        return this.grammar.getElements().data();
    },

    getAttrs: function () {
        return this.grammar.getElements().attrs;
    },

    getAddOptions: function () {
        return this.grammar.getElements().add;
    },

    refresh: function () {
        var self = this;
        this.removeAll();

        var rect = this.selectAll()
            .data(this.getData())
            .enter()
            .append("rect");

        for (var k in this.getAttrs()) {
            rect.attr(k, this.getAttrs()[k]);
        }

        rect.on("click", function (s) {
            self.onClick(s);
        });
    },

    onClick: function (s) {
        this.refresh();
        var self = this;
        var i = parseInt(s.index);
        var old = this.grammar.getElement(i);

        for (var i = 0; i < this.getAddOptions().length; i++) {
            var opt = this.getAddOptions()[i];

            if (opt.cond.call(this.grammar, opt.el(old))) {
                var tmp = this.wrapper.append('rect');
                for (var k in this.getAttrs()) {
                    tmp.attr(k, this.grammar.getElementInfo(opt.el(old))[k]);
                }

                tmp.attr('fn', opt.fn);
                tmp.on('click', function () {
                    var fn = d3.select(this).attr('fn');
                    //console.log(fn);
                    (function (old, fn) {
                        //console.log(old, fn);
                        self.grammar.addNewElement(old, fn);
                        self.refresh();
                    })(old, fn)
                });
            }
        }
    },

    calculateAesthetics: function() {
        var tmp = this.grammar.calculateSymmetry();
        var aes = tmp.horizontal + tmp.vertical;
        aes /= 2;
        //alert('Ocena: '+ aes);
        return aes;
    }

};

var Genetics = function(bodySize)
{
    var g = [];
    var	o = [];
    var size = 0;

    var squareSize = 20;

    this._bodySize_ = bodySize;

    this.newElement = function()
    {
        var fieldSize = this._bodySize_ * squareSize;
        var center = Math.floor(this._bodySize_/2);
        var r1 = Math.floor( squareSize*squareSize/10 );
        var r2 = Math.floor( squareSize*squareSize/90 );
        var i = size; size++;

        g[i] = new Grammar(fieldSize, fieldSize, squareSize);
        g[i].init(center, center);
        o[i] = new DG3(fieldSize, fieldSize, g[i]);
        o[i].init();
        o[i].random(r1, r2, 100);
    };

    this.cloneByElement = function(parentIndex)
    {
        var fieldSize = this._bodySize_ * squareSize;
        var center = Math.floor(this._bodySize_/2);
        var r1 = Math.floor( squareSize*squareSize/10 );
        var r2 = Math.floor( squareSize*squareSize/90 );
        var i = size; size++;
        var self = this;

        var $wait = setInterval(function()
        {
            if (!o[parentIndex].ready) return;

            clearInterval($wait);
            g[i] = new Grammar(fieldSize, fieldSize, squareSize);
            g[i].clone( g[parentIndex] );
            o[i] = new DG3(fieldSize, fieldSize, g[i]);
            o[i].init();
            o[i].refresh();
            o[i].ready = true;
            var a = self.calculateAesthetics(i);
            console.log(a);
        }, 50);
    };

    this.newChild = function(dna)
    {
        var fieldSize = this._bodySize_ * squareSize;
        var center = Math.floor(this._bodySize_/2);
        var r1 = Math.floor( squareSize*squareSize/10 );
        var r2 = Math.floor( squareSize*squareSize/90 );
        var i = size; size++;

        g[i] = new Grammar(fieldSize, fieldSize, squareSize);
        g[i].newChild(dna);
        o[i] = new DG3(fieldSize, fieldSize, g[i]);
        o[i].init();
        o[i].refresh();
        o[i].ready = true;
    };

    this.calculateAesthetics = function(i)
    {
        return o[i].calculateAesthetics();
    };

    this.mutation = function(i)
    {
        this.$wait(i, function(index)
        {
            o[index].random(1, 5, 100);
        });
    };

    this.getDNA = function(index)
    {
        var size = this._bodySize_ * this._bodySize_;
        var grid = [];

        for (var i = 0; i < size; i++)
        {
            grid.push(false);
        }

        for (var s in g[index].squares)
        {
            var square = g[index].squares[s];
            var gridIndex = square.y * this._bodySize_ + square.x;

            grid[gridIndex] = true;
        }
        return grid;
    };

    this.procreation = function(a, b)
    {
        var self = this;

        gen.$waitAll([a, b], function()
        {
            var aDNA = self.getDNA(a);
            var bDNA = self.getDNA(b);
            var tmpDNA = [];

            for(var _i = 0; _i < aDNA.length; _i++)
            {
                tmpDNA.push(aDNA[_i] & bDNA[_i]);
            }
            for(var _i = 0; _i < tmpDNA.length; _i++)
            {
                if (tmpDNA[_i])
                {
                    var _tmp = tmpDNA[_i - 1] || tmpDNA[_i + 1] || tmpDNA[_i - this._bodySize_] || tmpDNA[_i + this._bodySize_];

                    tmpDNA[_i] = _tmp;
                }
            }
            self.newChild(tmpDNA);
        });
    };

    this.$wait = function(i, callback)
    {
        var $wait = setInterval(function()
        {
            if (o[i] == undefined || !o[i].ready) return;
            clearInterval($wait);
            callback(i);
        }, 100);
    };

    this.$waitAll = function(ii, callback)
    {
        var $wait = setInterval(function()
        {
            for (var _i = 0; _i < ii.length; _i++) {
                if (o[ii[_i]] == undefined || !o[ii[_i]].ready) return;
            }
            clearInterval($wait);
            callback();
        }, 100);
    };

    this.input1;
    this.input2;

    var self = this;
    (function()
    {
        /*self.input1 = d3
         .select("#menu")
         .append("input");
         self.input2 = d3
         .select("#menu")
         .append("input");*/
        d3
            .select("#menu")
            .append("button")
            .text('Prokreacja')
            .on('click', function(){
                //      	var a = parseInt(self.input1.property("value"));
                //        var b = parseInt(self.input2.property("value"));
                var aes = [];
                var aesSort = [];
                for (var _i in o)
                {
                    if (o.hasOwnProperty(_i))
                    {
                        var nr = _i / 1000;
                        aes.push(o[_i].calculateAesthetics() + nr );
                        aesSort.push(o[_i].calculateAesthetics() + nr);
                    }
                }
                aesSort = aesSort.sort().reverse();
                var a = aes.indexOf(aesSort[0]);
                var b = aes.indexOf(aesSort[1]);

                if (g[a] != undefined && g[b] != undefined)
                {
                    console.log(a, b);
                    var _size = g.length;
                    self.procreation(a, b);
                    self.mutation(_size);

                    setTimeout(function(){
                        window.scrollTo(0,document.body.scrollHeight);
                    }, 100);
                }
            });
    })();
};

var gen = new Genetics(8);
gen.newElement();
gen.newElement();
//g.cloneByElement(0);
//g.mutation(1);
//gen.procreation(0, 1);
