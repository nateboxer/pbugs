var bug = function() {
    return {

        x: 0,
        y: 0,
        r: 0,
        g: 0,
        b: 0,
        width: 0,
        height: 0,

        // r, g, b, R, G, B (low: r, g, b; high: R, G, B)
        // 1, 2, 3, 4 (up, right, down, left)
        dna: [],
        dnaIndex: 0,
        
        create: function(x, y, worldWidth, worldHeight) {
            var baby = bug();
            baby.x = x;
            baby.y = y;
            baby.r = 255;
            baby.g = 255;
            baby.b = 255;
            baby.width = worldWidth;
            baby.height = worldHeight;
            var base = 'rgbRGB1234';
            var chromLength = Math.floor(Math.random() * 8 + 8) * 2;
            for (var i = 0; i < chromLength; i++) {
                var pos = base.length * Math.random();
                baby.dna.push(base.substring(pos, pos + 1));
            } 
            return baby;
        },

        tick: function(data) {
            var dnaLength = this.dna.length;
            var didMove = false;
            for (var d = this.dnaIndex; d < dnaLength; d++) {
                switch (this.dna[d]) {
                    case '1':
                        didMove = this.move(0, -1, data);
                        break;
                    case '2':
                        didMove = this.move(1, 0, data);
                        break;
                    case '3':
                        didMove = this.move(0, 1, data);
                        break;
                    case '4':
                        didMove = this.move(-1, 0, data);
                        break;
                }
                if (didMove) {
                    break;
                }
            }
            this.dnaIndex += 2;
            if (this.dnaIndex >= dnaLength - 1) {
                this.dnaIndex = 0;
            }
            return this.die();
        },

        die: function() {
            this.r -= 16;
            this.g -= 16;
            this.b -= 16;
            return !(this.r <= 0 || this.g <= 0 || this.b <= 0);
        },

        eat: function() {
        }, 

        move: function(dx, dy, data) {
            var nx = this.x + dx;
            var ny = this.y + dy;
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                this.x = nx;
                this.y = ny;
                var xy = (this.y * this.width + this.x) * 4;
                if (data[xy] > 128) {
                    this.r += 16;
                    data[xy] -= 16;
                }
                if (data[xy + 1] > 128) {
                    this.g += 16;
                    data[xy + 1] -= 16;
                }
                if (data[xy + 2] > 128) {
                    this.b += 16;
                    data[xy + 2] -= 16;
                }
                return true;
            }
            return false;
        }

    };
}

var pbugs = function() {
    return {

        ui: {},
        iWidth: 0,
        iHeight: 0,
        context: null,
        bugs: [],

        init: function() {
            this.ui = this.loadDOM([
                'main'
            ]);
            var that = this;
            var img = document.createElement('img');
            img.onload = this.imgLoaded.bind(this);
            img.src = 'lagoon.jpg';
            this.ui.img = img;
            this.ui.main.appendChild(img);
        },

        initBugs: function() {
            for (var i = 0; i < 1000; i++) {
                var x = Math.floor(Math.random() * this.iWidth);
                var y = Math.floor(Math.random() * this.iHeight); 
                var b = bug().create(x, y, this.iWidth, this.iHeight);
                this.bugs.push(b);
            }
        },

        imgLoaded: function(event) {
            this.iWidth = event.currentTarget.naturalWidth;    
            this.iHeight = event.currentTarget.naturalHeight;    
            this.initBugs();
            this.run();
        },

        run: function() {
            var canvas = document.createElement('canvas');
            this.ui.main.appendChild(canvas);
            this.ui.canvas = canvas;
            canvas.width = this.iWidth;
            canvas.height = this.iHeight;
            this.context = this.ui.canvas.getContext('2d');
            this.context.drawImage(this.ui.img, 0, 0, this.iWidth, this.iHeight);
            this.ui.img.style.display = 'none';
            requestAnimationFrame(this.loop.bind(this));
        },

        // optimize with http://jsfiddle.net/andrewjbaker/Fnx2w/
        tick: function() {
            var imageData = this.context.getImageData(0, 0, this.iWidth, this.iHeight);
            var data = imageData.data;

            var numBugs = this.bugs.length;
            var livingBugs = [];
            for (var i = 0; i < numBugs; i++) {
                if (this.bugs[i].tick(data, this.iWidth)) {
                    livingBugs.push(this.bugs[i]);
                }    
            }
            this.bugs = livingBugs;

            for (var s = 0; s < 10; s++) {
                var x = Math.floor(Math.random() * this.iWidth);
                var y = Math.floor(Math.random() * this.iHeight);
                var xy = (y * this.iWidth + x) * 4;
                data[xy] += 16;
                data[xy + 1] += 16;
                data[xy + 2] += 16;
            }

            this.context.putImageData(imageData, 0, 0);
            return this.bugs.length > 0;
        },

        loop: function(t) {
            if (this.tick()) {
                requestAnimationFrame(this.loop.bind(this));
            } else {
                console.log('They\'re all dead, Dave');
            }
        },

        loadDOM: function(elements) {
            lookups = {};
            for (var i = 0; i < elements.length; i++) {
                lookups[elements[i]] = document.getElementById(elements[i]);
            }
            return lookups;
        }

    };
}
pbugs().init();
console.log('[pixel bugs ready for food]');
