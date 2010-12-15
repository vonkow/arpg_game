var d45 = 0.785398163;
function hero() {
	this.base = new rw.Ent('hero','hero.d1l',32,32);
	this.heading = 'd';
	this.ani = 1;
	this.count = 0;
	this.update = function(X1, Y1, X2, Y2) {
		var moving = false,
			tempHead = '';
		if (rw.key('da')) {
			this.base.move(0,1);
			moving = true;
			tempHead = 'd';
		} else if (rw.key('ua')) {
			this.base.move(0,-1);
			moving = true;
			tempHead = 'u';
		}
		if (rw.key('la')) {
			this.base.move(-1,0);
			moving = true;
			tempHead += 'l';
		} else if (rw.key('ra')) {
			this.base.move(1,0);
			moving = true;
			tempHead += 'r';
		}
		if (moving) {
			this.heading = tempHead;
			(this.count<5) ? this.count++ : (this.count=0,(this.ani==1) ? this.ani=2 : this.ani=1);
			this.base.changeSprite('hero.'+this.heading+this.ani+'l');
		}
		if (rw.key('x')) {
			var lp = [];
			switch (this.heading) {
				case 'u':
					lp = ['ud', 0, -1, 0, -32];
					break;
				case 'ur':
					lp = ['urdl', d45, -d45, 32, -32];
					break;
				case 'r':
					lp = ['lr', 1, 0, 32, 0];
					break;
				case 'dr':
					lp = ['uldr', d45, d45, 32, 32];
					break;
				case 'd':
					lp = ['ud', 0, 1, 0, 32];
					break;
				case 'dl':
					lp = ['urdl', -d45, d45, -32, 32];
					break;
				case 'l':
					lp = ['lr', -1, 0, -32, 0];
					break;
				case 'ul':
					lp = ['uldr', -1, -1, -32, -32];
					break;
			};
			rw.newEnt(new laser(lp[0], lp[1], lp[2], X1+lp[3], Y1+lp[4]));
		}
	}
}

var lascount = 0;
function laser(dir, x, y, posX, posY) {
	this.base = new rw.Ent('laser'+lascount++, 'laser.'+dir, 32, 32);
	this.countdown = 50;
	this.update = function() {
		if (this.countdown>0) {
			this.countdown--;
			this.base.move(x,y);
		} else {
			return false;
		}
	};
	this.init = function() {
		this.base.display(posX,posY);
	};
}

rw.init(512, 512, 'gamearea')
.loadSprites({
	hero: {
		src: 'sprites/commander.png',
		u1l: [32, 32, 0, 0],
		u2l: [32, 32, 0, 32],
		ur1l: [32, 32, 32, 0],
		ur2l: [32, 32, 32, 32],
		r1l: [32, 32, 64, 0],
		r2l: [32, 32, 64, 32],
		dr1l: [32, 32, 96, 0],
		dr2l: [32, 32, 96, 32],
		d1l: [32, 32, 128, 0],
		d2l: [32, 32, 128, 32],
		dl1l: [32, 32, 160, 0],
		dl2l: [32, 32, 160, 32],
		l1l: [32, 32, 192, 0],
		l2l: [32, 32, 192, 32],
		ul1l: [32, 32, 224, 0],
		ul2l: [32, 32, 224, 32],
		u1g: [32, 32, 0, 64],
		u2g: [32, 32, 0, 96],
		ur1g: [32, 32, 32, 64],
		ur2g: [32, 32, 32, 96],
		r1g: [32, 32, 64, 64],
		r2g: [32, 32, 64, 96],
		dr1g: [32, 32, 96, 64],
		dr2g: [32, 32, 96, 96],
		d1g: [32, 32, 128, 64],
		d2g: [32, 32, 128, 96],
		dl1g: [32, 32, 160, 64],
		dl2g: [32, 32, 160, 96],
		l1g: [32, 32, 192, 64],
		l2g: [32, 32, 192, 96],
		ul1g: [32, 32, 224, 64],
		ul2g: [32, 32, 224, 96]
	},
	laser: {
		src: 'sprites/laser.png',
		ud: [32, 32, 0, 0],
		urdl: [32, 32, 32, 0],
		lr: [32, 32, 64, 0],
		uldr: [32, 32, 96, 0]
	}
}, function(){
	rw.newEnt(new hero()).base.display(240,240,240).end()
	.start();
})
