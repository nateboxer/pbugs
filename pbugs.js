var vars = {
    babyFat: 255,
    feedSize: 6,
    wasteSize: 2,
    biteSize: 8, 
    decaySize: 3,
    minColor: 16,
    prefTypes: 'rgb',
    // r, g, b, R, G, B (low: r, g, b; high: R, G, B)
    // 1, 2, 3, 4 (up, right, down, left)
    bases: 'rgbRGB1234'
};

var bug = function() {
    return {

        x: 0,
        y: 0,
        r: 0,
        g: 0,
        b: 0,
        pref: '',
        width: 0,
        height: 0,
        dna: [],
        dnaIndex: 0,
        
        create: function(x, y, worldWidth, worldHeight) {
            var baby = bug();
            baby.x = x;
            baby.y = y;
            baby.r = vars.babyFat;
            baby.g = vars.babyFat;
            baby.b = vars.babyFat;
            baby.width = worldWidth;
            baby.height = worldHeight;
            var chromLength = Math.floor(Math.random() * 16 + 16) * 2;
            for (var i = 0; i < chromLength; i++) {
                var pos = vars.bases.length * Math.random();
                baby.dna.push(vars.bases.substring(pos, pos + 1));
            } 
            var pos = vars.prefTypes.length * Math.random();
            baby.pref = vars.prefTypes.substring(pos, pos + 1); 
            return baby;
        },

        likesRed: function() {
            return this.pref === 'r';
        },

        likesGreen: function() {
            return this.pref === 'g';
        },

        likesBlue: function() {
            return this.pref === 'b';
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
            if (this.likesRed()) {
                this.r -= vars.decaySize;
            }
            if (this.likesGreen()) {
                this.g -= vars.decaySize;
            }
            if (this.likesBlue()) {
                this.b -= vars.decaySize;
            }
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
                this.bite(xy, data);
                return true;
            }
            return false;
        },

        bite: function(xy, data) {
            if (this.likesRed() && data[xy] > vars.minColor) {
                this.r += vars.feedSize;
                data[xy] -= vars.biteSize;
                data[xy + 1] += vars.wasteSize;
            }
            if (this.likesGreen() && data[xy + 1] > vars.minColor) {
                this.g += vars.feedSize;
                data[xy + 1] -= vars.biteSize; 
                data[xy + 2] += vars.wasteSize;
            }
            if (this.likesBlue() && data[xy + 2] > vars.minColor) {
                this.b += vars.feedSize;
                data[xy + 2] -= vars.biteSize;
                data[xy] += vars.wasteSize;
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
                'main', 'hud', 'status'
            ]);
            var that = this;
            var img = document.createElement('img');
            // .bind() only supported by Chrome, sadly
            img.onload = this.imgLoaded.bind(this);
            img.src = 'lagoon.jpg';
            this.ui.img = img;
            this.ui.main.appendChild(img);
        },

        updateStatus: function(msg) {
            this.ui.status.innerHTML = msg;
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
                data[xy] = Math.min(255, data[xy] + 8);
                data[xy + 1] = Math.min(255, data[xy + 1] + 8);
                data[xy + 2] = Math.min(255, data[xy + 2] + 8);
            }

            this.context.putImageData(imageData, 0, 0);
            this.updateStatus( 'Pbugs: ' + this.bugs.length);
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
