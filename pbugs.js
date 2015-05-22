var pbugs = function() {
    return {

        ui: {},
        iWidth: 0,
        iHeight: 0,
        context: null,

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

        imgLoaded: function(event) {
            this.iWidth = event.currentTarget.naturalWidth;    
            this.iHeight = event.currentTarget.naturalHeight;    
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

        tick: function() {
            var imageData = this.context.getImageData(0, 0, this.iWidth, this.iHeight);
            var data = imageData.data;
            for (var x = 0; x < this.iWidth; x++) {
                for (var y = 0; y < this.iHeight; y++) {
                    var index = (y * this.iWidth + x) * 4;
                    data[index] += this.rnd();
                    data[++index] += this.rnd();
                    data[++index] += this.rnd();
                }
            }
            this.context.putImageData(imageData, 0, 0);
        },

        rnd: function() {
            if (Math.random() >= .5) {
                return 10;
            }
            return -10;
        },

        loop: function(t) {
            requestAnimationFrame(this.loop.bind(this));
            this.tick();
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
