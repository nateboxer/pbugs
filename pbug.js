var bug = function() {
    return {

        x: 0,
        y: 0,
        pref: '',
        width: 0,
        height: 0,
        dna: [],
        dnaIndex: 0,
        fat: 0,
 
        create: function(x, y, worldWidth, worldHeight) {
            var baby = bug();
            baby.x = x;
            baby.y = y;
            baby.fat = vars.babyFat;
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
            this.fat -= vars.decaySize;
            return !(this.fat <= 0);
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
                this.fat += vars.feedSize;
                data[xy] -= vars.biteSize;
                data[xy + 1] += vars.wasteSize;
            }
            if (this.likesGreen() && data[xy + 1] > vars.minColor) {
                this.fat += vars.feedSize;
                data[xy + 1] -= vars.biteSize; 
                data[xy + 2] += vars.wasteSize;
            }
            if (this.likesBlue() && data[xy + 2] > vars.minColor) {
                this.fat += vars.feedSize;
                data[xy + 2] -= vars.biteSize;
                data[xy] += vars.wasteSize;
            }
        }

    };
}
