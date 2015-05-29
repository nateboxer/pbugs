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
            img.src = 'nb.jpg';
            this.ui.img = img;
            this.ui.main.appendChild(img);
        },

        updateStatus: function(msg) {
            this.ui.status.innerHTML = msg;
        },

        initBugs: function() {
            for (var i = 0; i < vars.initPop; i++) {
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
            this.doBugs(data);
            //this.doSun(data);
            this.context.putImageData(imageData, 0, 0);
            return this.bugs.length > 0 && this.bugs.length < 1000000;
        },

        doBugs: function(data) {
            var numBugs = this.bugs.length;
            var livingBugs = [];
            for (var i = 0; i < numBugs; i++) {
                if (this.bugs[i].tick(data, this.iWidth)) {
                    livingBugs.push(this.bugs[i]);
                    var newBug = this.bugs[i].repro();
                    if (newBug) {
                        livingBugs.push(newBug);
                    }
                }    
            }
            this.bugs = livingBugs;
            this.updateStatus( 'Pbugs: ' + this.bugs.length);
        },

        doSun: function(data) {
            for (var s = 0; s < 10; s++) {
                var x = Math.floor(Math.random() * this.iWidth);
                var y = Math.floor(Math.random() * this.iHeight);
                var xy = (y * this.iWidth + x) * 4;
                data[xy] = Math.min(255, data[xy] + 8);
                data[xy + 1] = Math.min(255, data[xy + 1] + 8);
                data[xy + 2] = Math.min(255, data[xy + 2] + 8);
            }
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
