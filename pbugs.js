var pbugs = function() {
    return {

        ui: {},
        iWidth: 0,
        iHeight: 0,

        init: function() {
            this.ui = this.loadDOM([
                'main'
            ]);
            var that = this;
            var img = document.createElement('img');
            img.onload = function(event) {
                that.iWidth = event.currentTarget.naturalWidth;    
                that.iHeight = event.currentTarget.naturalHeight;    
                that.run();
            }
            img.src = 'lagoon.jpg';
            this.ui.img = img;
            this.ui.main.appendChild(img);
        },

        run: function() {
            var canvas = document.createElement('canvas');
            this.ui.main.appendChild(canvas);
            this.ui.canvas = canvas;
            canvas.width = this.iWidth;
            canvas.height = this.iHeight;
            var context = this.ui.canvas.getContext('2d');
            context.drawImage(this.ui.img, 0, 0, this.iWidth, this.iHeight);
            this.ui.img.style.display = 'none';
            var pixel = context.getImageData(0, 0, 1, 1);
            console.log(pixel.data);
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
