var bug = function() {
    return {

        x: 0,
        y: 0,
        r: 0,
        g: 0,
        b: 0,

        // r, g, b, R, G, B (low: r, g, b; high: R, G, B)
        // 1, 2, 3, 4 (up, right, down, left)
        dna: [],
        
        create: function(x, y) {
            var baby = bug();
            baby.x = x;
            baby.y = y;
            baby.r = 25;
            baby.g = 25;
            baby.b = 25;
            var base = 'rgbRGB1234';
            var chromLength = Math.random() * 10;
            for (var i = 0; i < chromLength; i++) {
                var pos = base.length * Math.random();
                baby.dna.push(base.substring(pos, pos + 1));
            } 
            return baby;
        },

        tick: function(data, width) {
            var dnaLength = this.dna.length;
            for (var d = 0; d < dnaLength; d++) {
            }
            this.moveUp();
            var xy = (this.y * width + this.x) * 4;
            data[xy] = 0; 
            return this.die();
         },

        die: function() {
            this.r--;
            this.g--;
            this.b--;
            return !(this.r <= 0 || this.g <= 0 || this.b <= 0);
        },

        eat: function() {
        }, 

        moveUp: function() {
            if (this.y > 0) {
                this.y--;
            }
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
            for (var i = 0; i < 100; i++) {
                var x = Math.floor(Math.random() * this.iWidth);
                var y = Math.floor(Math.random() * this.iHeight); 
                var b = bug().create(x, y);
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
//            for (var x = 0; x < this.iWidth; x++) {
//                for (var y = 0; y < this.iHeight; y++) {
//                    var index = (y * this.iWidth + x) * 4;
//                    data[index] += this.rnd();
//                    data[index + 1] += this.rnd();
//                    data[index + 2] += this.rnd();
//                }
//            }
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
