(function() {
	// Load all Resources
	function loadAll(callback) {
		rw.loadSprites({
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
		}, callback);
	};

	// Sin/Cos of 1px @ 45deg
	var d45 = 0.785398163;
	
	// Hero factory
	function hero() {
		this.base = new rw.Ent('hero','hero.d1l',32,32);
		this.heading = 'd';
		this.ani = 1;
		this.count = 0;
		this.lasCount = 0;
		this.update = function(X1, Y1, X2, Y2) {
			var moving = false;
			if (rw.key('da')) {
				moving = true;
				if (rw.key('ra')) {
					this.heading = 'dr';
					this.base.move(d45, d45);
					rw.rules['offset'].pos = [-d45, -d45];
				} else if (rw.key('la')) {
					this.heading = 'dl';
					this.base.move(-d45, d45);
					rw.rules['offset'].pos = [d45, -d45];
				} else {
					this.heading = 'd';
					this.base.move(0,1);
					rw.rules['offset'].pos = [0, -1];
				}
			} else if (rw.key('ua')) {
				moving = true;
				if (rw.key('ra')) {
					this.heading = 'ur';
					this.base.move(d45, -d45);
					rw.rules['offset'].pos = [-d45, d45];
				} else if (rw.key('la')) {
					this.heading = 'ul';
					this.base.move(-d45, -d45);
					rw.rules['offset'].pos = [d45, d45];
				} else {
					this.heading = 'u';
					this.base.move(0,-1);
					rw.rules['offset'].pos = [0, 1];
				}
			} else if (rw.key('la')) {
				moving = true;
				this.heading = 'l';
				this.base.move(-1,0);
				rw.rules['offset'].pos = [1, 0];
			} else if (rw.key('ra')) {
				moving = true;
				this.heading = 'r';
				this.base.move(1,0);
				rw.rules['offset'].pos = [-1, 0];
			} else {
				rw.rules['offset'].pos = [0, 0];
			};
			if (moving) {
				(this.count<4) ? this.count++ : (this.count=0,(this.ani==1) ? this.ani=2 : this.ani=1);
				this.base.changeSprite('hero.'+this.heading+this.ani+'l');
			}
			if (this.lasCount>0) {
				this.lasCount--;
			} else {
				if (rw.key('x')) {
					var lp = [
						['u', 'ud', 0, -1, 0, -32],
						['ur', 'urdl', d45, -d45, 32, -32],
						['r', 'lr', 1, 0, 32, 0],
						['dr', 'uldr', d45, d45, 32, 32],
						['d', 'ud', 0, 1, 0, 32],
						['dl', 'urdl', -d45, d45, -32, 32],
						['l', 'lr', -1, 0, -32, 0],
						['ul', 'uldr', -1, -1, -32, -32]
					];
					for (var x=0, len=lp.length, head=this.heading; x<len; x++) {
						if (head==lp[x][0]) {
							rw.newEnt(new laser(lp[x][1], lp[x][2], lp[x][3], X1+lp[x][4], Y1+lp[x][5]));
							this.lasCount = 5;
						};
					};
				}
			}
		}
		this.hitMap = [['hero', ['wu', 'wd', 'wl', 'wr'], 4, 4, 24, 24]];
		this.gotHit = function(by) {
			if (((by=='wl')&&(this.heading.indexOf('l')!=-1))||((by=='wr')&&(this.heading.indexOf('r')!=-1))) {
				this.base.wipeMove('x');
				rw.rules['offset'].pos[0] = 0;
			} else if (((by=='wu')&&(this.heading.indexOf('u')!=-1))||((by=='wd')&&(this.heading.indexOf('d')!=-1))) {
				this.base.wipeMove('y');
				rw.rules['offset'].pos[1] = 0;
			}
		}
	}

	// Laser Count
	var lascount = 0;
	// Laser Factory
	function laser(dir, x, y, posX, posY) {
		this.base = new rw.Ent('laser'+lascount++, 'laser.'+dir, 32, 32);
		this.countdown = 50;
		this.update = function() {
			if (this.countdown>0) {
				this.countdown--;
				this.base.move(x*5,y*5);
			} else {
				return false;
			}
		};
		this.hitMap = [['las', ['test'], 12, 12, 8, 8]];
		this.gotHit = function(by) {
			if (by=='test') return false;
		};
		this.init = function() {
			this.base.display(posX,posY);
		};
	}

	// Wall Count
	var wallCount = 0;
	// Wall Factory
	function wall(x, y, w, h) {
		this.base = new rw.Ent('wall_'+wallCount++, ' ', w, h);
		this.update = function() {};
		this.hitMap = [
			['wd', ['hero'], 0, 0, w, 0, 50, 50],
			['wl', ['hero'], w, 0, w, h, 50, 50],
			['wu', ['hero'], 0, h, w, h, 50, 50],
			['wr', ['hero'], 0, 0, 0, h, 50, 50]
		];
		this.gotHit = function() {};
		this.init = function() {
			this.base.display(x, y);
		}
	}

	// Start the damn thang
	rw.init(512, 512, 'gamearea')
	.setFPS(50)
	.func(loadAll(function(){
		rw.newEnt(new hero()).base.display(240,240,240).end()
		.newEnt(new wall(300, 200, 100, 100)).base.end()
		.newEnt({
			base: new rw.Ent('test', 'hero.d1g', 32, 32),
			update: function() {},
			hitMap: [['test', ['las'], 0, 0, 32, 32]],
			gotHit: function() {}
		}).base.display(300, 200).end()
		.newRule('offset', {
			base: new rw.Rule('true', 2),
			pos: [0,0],
			rule: function() {
				rw.moveAll(this.pos[0], this.pos[1]);
			}
		}).start();
	}))
})();
