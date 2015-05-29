var bug = function() {
    return {

        width: 0,
        height: 0,
        x: 0,
        y: 0,
        fat: 0,
        age: 0,

        // DNA
        pref: '',
        babyFat: 0,
        biteSize: 0,
        feedSize: 0,
        maxAge: 0,
        minColor: 0,
 
        create: function(x, y, worldWidth, worldHeight) {
            var baby = bug();
            
            // DNA
            baby.babyFat = Math.floor(Math.random() * 64) + 4;
            baby.biteSize = Math.floor(Math.random() * vars.maxBite) + 4;
            var pos = vars.prefTypes.length * Math.random();
            baby.pref = vars.prefTypes.substring(pos, pos + 1); 
            baby.maxAge = Math.floor(Math.random() * vars.maxAge) + 4;
            baby.minColor = Math.floor(Math.random() * 128) + vars.minColor;

            baby.fat = Math.floor(baby.babyFat * vars.babyCostRatio);  
            baby.feedSize = baby.biteSize - (baby.biteSize * vars.wasteRatio);
            baby.x = x;
            baby.y = y;
            baby.width = worldWidth;
            baby.height = worldHeight;

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
            this.bite(data);
            return this.die();
        },

        repro: function(data) {
            var baby = null;
            if (this.fat >= this.babyFat) {
                this.fat -= this.babyFat;
                baby = bug(); 
                baby.width = this.width;
                baby.height = this.height;
                baby.x = this.x;
                baby.y = this.y;
                if (Math.random() < 0.5) {
                    baby.x += Math.floor(Math.random() * 3 - 1);
                } else {
                    baby.y += Math.floor(Math.random() * 3 - 1);
                }
                if (baby.x >= this.width || baby.x < 0) {
                    baby.x = this.x;
                }
                if (baby.y < 0 || baby.y >= this.width) {
                    baby.y = this.y;
                }
                baby.fat = Math.floor(this.babyFat * vars.babyCostRatio);  
                baby.pref = this.pref;
                if (Math.random() < vars.mRate) {
                    var pos = vars.prefTypes.length * Math.random();
                    baby.pref = vars.prefTypes.substring(pos, pos + 1); 
                }
                baby.biteSize = this.biteSize;
                if (Math.random() < vars.mRate) {
                    baby.biteSize = Math.floor(Math.random() * vars.maxBite) + 4;
                }
                baby.feedSize = baby.biteSize - (baby.biteSize * vars.wasteRatio);
                baby.maxAge = this.maxAge;
                if (Math.random < vars.mRate) {
                    baby.maxAge = Math.floor(Math.random() * vars.maxAge) + 4;
                }
                baby.minColor = this.minColor;
                if (Math.random() < vars.colorMRate) {
                    baby.minColor = Math.floor(Math.random() * 128) + vars.minColor;
                }
            }
            return baby;
        },

        bite: function(data) {
            var xy = (this.y * this.width + this.x) * 4;
            if (this.likesRed() && data[xy] > this.minColor) {
                this.fat += this.feedSize;
                data[xy] -= this.biteSize;
            }
            if (this.likesGreen() && data[xy + 1] > this.minColor) {
                this.fat += this.feedSize;
                data[xy + 1] -= this.biteSize; 
            }
            if (this.likesBlue() && data[xy + 2] > this.minColor) {
                this.fat += this.feedSize;
                data[xy + 2] -= this.biteSize;
            }
        },

        die: function() {
            this.age++;
            this.fat -= vars.decayRate;
            return this.fat > 0 && this.age < this.maxAge;
        },

    };
}
