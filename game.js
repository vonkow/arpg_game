(function() {
	// Load all Resources
	function loadAll(callback) {
		rw.loadSprites({
			map: ['sprites/map.png', 640, 640, 0, 0],
			hero: {
				src: 'sprites/commander.png',
				u1l: [32, 32, 0, 0], u2l: [32, 32, 0, 32],
				ur1l: [32, 32, 32, 0], ur2l: [32, 32, 32, 32],
				r1l: [32, 32, 64, 0], r2l: [32, 32, 64, 32],
				dr1l: [32, 32, 96, 0], dr2l: [32, 32, 96, 32],
				d1l: [32, 32, 128, 0], d2l: [32, 32, 128, 32],
				dl1l: [32, 32, 160, 0], dl2l: [32, 32, 160, 32],
				l1l: [32, 32, 192, 0], l2l: [32, 32, 192, 32],
				ul1l: [32, 32, 224, 0], ul2l: [32, 32, 224, 32],
				u1g: [32, 32, 0, 64], u2g: [32, 32, 0, 96],
				ur1g: [32, 32, 32, 64], ur2g: [32, 32, 32, 96],
				r1g: [32, 32, 64, 64], r2g: [32, 32, 64, 96],
				dr1g: [32, 32, 96, 64], dr2g: [32, 32, 96, 96],
				d1g: [32, 32, 128, 64], d2g: [32, 32, 128, 96],
				dl1g: [32, 32, 160, 64], dl2g: [32, 32, 160, 96],
				l1g: [32, 32, 192, 64], l2g: [32, 32, 192, 96],
				ul1g: [32, 32, 224, 64], ul2g: [32, 32, 224, 96]
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
	var d45 = 0.78;
	
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
				if (rw.key('ra')) moving = ['dr', d45, d45];
				else if (rw.key('la')) moving = ['dl', -d45, d45];
				else moving = ['d', 0, 1];
			} else if (rw.key('ua')) {
				if (rw.key('ra')) moving = ['ur', d45, -d45];
				else if (rw.key('la')) moving = ['ul', -d45, -d45];
				else moving = ['u', 0, -1];
			} else if (rw.key('la')) moving = ['l', -1, 0];
			else if (rw.key('ra')) moving = ['r', 1, 0];
			if (moving) {
				this.heading = moving[0];
				this.base.move(moving[1], moving[2]);
				rw.rules['offset'].pos = [-moving[1], -moving[2]];
				if (this.count<4) this.count++ ;
				else {
					this.count=0;
					(this.ani==1) ? this.ani=2 : this.ani=1;
				};
				this.base.changeSprite('hero.'+this.heading+this.ani+'l');
			} else rw.rules['offset'].pos = [0, 0];
			if (this.lasCount>0) this.lasCount--;
			else {
				if (rw.key('x')) {
					var lp = [
						['u', 'ud', 0, -1, 0, -32], ['ur', 'urdl', d45, -d45, 32, -32],
						['r', 'lr', 1, 0, 32, 0], ['dr', 'uldr', d45, d45, 32, 32],
						['d', 'ud', 0, 1, 0, 32], ['dl', 'urdl', -d45, d45, -32, 32],
						['l', 'lr', -1, 0, -32, 0], ['ul', 'uldr', -1, -1, -32, -32]
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
		this.hitMap = [['hero', ['wu', 'wd', 'wl', 'wr'], 2, 2, 28, 28]];
		this.gotHit = function(by) {
			if (((by=='wl')&&(this.heading.indexOf('l')!=-1))
			|| ((by=='wr')&&(this.heading.indexOf('r')!=-1))) {
				this.base.wipeMove('x');
				rw.rules['offset'].pos[0] = 0;
			} else if (((by=='wu')&&(this.heading.indexOf('u')!=-1))
			|| ((by=='wd')&&(this.heading.indexOf('d')!=-1))) {
				this.base.wipeMove('y');
				this.base.wipeMove('z');
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
			} else return false;
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
	var oset = 0.001;
	// Wall Factory
	function wall(x, y, w, h) {
		this.base = new rw.Ent('wall_'+wallCount++, ' ', w, h);
		this.update = function() {};
		this.hitMap = [
			['wd', ['hero'], 1, 0, w-1, 1],
			['wl', ['hero'], w-1, 1, w, h-1],
			['wu', ['hero'], 1, h-1, w-1, h],
			['wr', ['hero'], 0, 1, 1, h-1]
		];
		this.gotHit = function() {};
		this.init = function() {
			this.base.display(x, y);
		};
	};

	// Start the damn thang
	rw.init(320, 320, 'gamearea')
	.setFPS(50)
	.func(loadAll(function(){
		rw.newEnt({
			base: new rw.Ent('lag','text',150,20),
			text: {
				text: 'Lag: ',
				form: 'fill',
				style: {
					font: '16px sans-serif',
					fill: '#000'
				}
			},
			update: function() {
				this.text.text = 'Lag: '+rw.getLag()+'(ms)';
				this.base.moveTo(1,16);
			}
		}).base.display(1,16,16).end()
		.newEnt(new hero()).base.display(144,144,144).end()
		.newEnt({
			base: new rw.Ent('map', 'map', 640, 640),
			update: function() {}
		}).base.display(0, 0, -32).end()
		.newEnt(new wall(96, 0, 96, 32)).base.end()
		.newEnt(new wall(0, 64, 192, 32)).base.end()
		.newEnt(new wall(0, 272, 176, 128)).base.end()
		.newEnt(new wall(112, 304, 320, 128)).base.end()
		.newEnt(new wall(400, 336, 112, 160)).base.end()
		.newEnt(new wall(544, 336, 96, 160)).base.end()
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
				rw.moveAll(this.pos[0], this.pos[1], this.pos[1]);
			}
		}).start();
	}));
})();
