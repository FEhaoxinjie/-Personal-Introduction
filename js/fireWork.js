let RENDERER = {
    LEAF_INTERVAL_RANGE : {min : 100, max : 200},
    FIREWORK_INTERVAL_RANGE : {min : 20, max : 200},
    SKY_COLOR : 'hsla(210, 60%, %luminance%, 0.2)',
    STAR_COUNT : 100,

    init : function(){
        this.setParameters();
        this.reconstructMethod();
        this.createStars();
        this.render();
    },
    setParameters : function(){
        this.jQuerycontainer = jQuery('#fireWorks');
        this.width = this.jQuerycontainer.width();
        this.height = this.jQuerycontainer.height();
        console.log(this.width);
        console.log(this.height);
        this.distance = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
        this.contextFireworks = jQuery('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.jQuerycontainer).get(0).getContext('2d');
        this.contextTwigs = jQuery('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.jQuerycontainer).get(0).getContext('2d');

        this.stars = [];
        this.fireworks = [new FIREWORK(this.width, this.height, this)];

        this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0;
        this.fireworkInterval = this.maxFireworkInterval;
    },
    reconstructMethod : function(){
        this.render = this.render.bind(this);
    },
    getRandomValue : function(range){
        return range.min + (range.max - range.min) * Math.random();
    },
    createStars : function(){
        for(let i = 0, length = this.STAR_COUNT; i < length; i++){
            this.stars.push(new STAR(this.width, this.height, this.contextTwigs, this));
        }
    },
    render : function(){
        requestAnimationFrame(this.render);
        let maxOpacity = 0,
            contextTwigs = this.contextTwigs,
            contextFireworks = this.contextFireworks;

        for(let i = this.fireworks.length - 1; i >= 0; i--){
            maxOpacity = Math.max(maxOpacity, this.fireworks[i].getOpacity());
        }
        contextTwigs.clearRect(0, 0, this.width, this.height);
        contextFireworks.fillStyle = this.SKY_COLOR.replace('%luminance', 5 + maxOpacity * 15);
        contextFireworks.fillRect(0, 0, this.width, this.height);

        for(let i = this.fireworks.length - 1; i >= 0; i--){
            if(!this.fireworks[i].render(contextFireworks)){
                this.fireworks.splice(i, 1);
            }
        }
        for(let i = this.stars.length - 1; i >= 0; i--){
            this.stars[i].render(contextTwigs);
        }

        if(--this.fireworkInterval === 0){
            this.fireworks.push(new FIREWORK(this.width, this.height, this));
            this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0;
            this.fireworkInterval = this.maxFireworkInterval;
        }
    }
};

let STAR = function(width, height, context, renderer){
    this.width = width;
    this.height = height;
    this.renderer = renderer;
    this.init(context);
};
STAR.prototype = {
    RADIUS_RANGE : {min : 1, max : 4},
    COUNT_RANGE : {min : 100, max : 1000},
    DELTA_THETA : Math.PI / 30,
    DELTA_PHI : Math.PI / 50000,

    init : function(context){
        this.x = this.renderer.getRandomValue({min : 0, max : this.width});
        this.y = this.renderer.getRandomValue({min : 0, max : this.height});
        this.radius = this.renderer.getRandomValue(this.RADIUS_RANGE);
        this.maxCount = this.renderer.getRandomValue(this.COUNT_RANGE) | 0;
        this.count = this.maxCount;
        this.theta = 0;
        this.phi = 0;

        this.gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        this.gradient.addColorStop(0, 'hsla(220, 80%, 100%, 1)');
        this.gradient.addColorStop(0.1, 'hsla(220, 80%, 80%, 1)');
        this.gradient.addColorStop(0.25, 'hsla(220, 80%, 50%, 1)');
        this.gradient.addColorStop(1, 'hsla(220, 80%, 30%, 0)');
    },
    render : function(context){
        context.save();
        context.globalAlpha = Math.abs(Math.cos(this.theta));
        context.translate(this.width / 2, this.height / 2);
        context.rotate(this.phi);
        context.translate(this.x - this.width / 2, this.y - this.height / 2);
        context.beginPath();
        context.fillStyle = this.gradient;
        context.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();

        if(--this.count === 0){
            this.theta = Math.PI;
            this.count = this.maxCount;
        }
        if(this.theta > 0){
            this.theta -= this.DELTA_THETA;
        }
        this.phi += this.DELTA_PHI;
        this.phi %= Math.PI / 2;
    }
};
let FIREWORK = function(width, height, renderer){
    this.width = width;
    this.height = height;
    this.renderer = renderer;
    this.init();
};
FIREWORK.prototype = {
    COLOR : 'hsl(%hue, 80%, 60%)',
    PARTICLE_COUNT : 300,
    DELTA_OPACITY : 0.01,
    RADIUS : 2,
    VELOCITY : -3,
    WAIT_COUNT_RANGE : {min : 30, max : 60},
    THRESHOLD : 50,
    DELTA_THETA : Math.PI / 10,
    GRAVITY : 0.002,

    init : function(){
        this.setParameters();
        this.createParticles();
    },
    setParameters : function(){
        let hue = 256 * Math.random() | 0;

        this.x = this.renderer.getRandomValue({min : this.width / 8, max : this.width * 7 / 8});
        this.y = this.renderer.getRandomValue({min : this.height / 4, max : this.height / 2});
        this.x0 = this.x;
        this.y0 = this.height + this.RADIUS;
        this.color = this.COLOR.replace('%hue', hue);
        this.status = 0;
        this.theta = 0;
        this.waitCount = this.renderer.getRandomValue(this.WAIT_COUNT_RANGE);
        this.opacity = 1;
        this.velocity = this.VELOCITY;
        this.particles = [];
    },
    createParticles : function(){
        for(let i = 0, length = this.PARTICLE_COUNT; i < length; i++){
            this.particles.push(new PARTICLE(this.x, this.y, this.renderer));
        }
    },
    getOpacity : function(){
        return this.status === 2 ? this.opacity : 0;
    },
    render : function(context){
        switch(this.status){
            case 0:
                context.save();
                context.fillStyle = this.color;
                context.globalCompositeOperation = 'lighter';
                context.globalAlpha = (this.y0 - this.y) <= this.THRESHOLD ? ((this.y0 - this.y) / this.THRESHOLD) : 1;
                context.translate(this.x0 + Math.sin(this.theta) / 2, this.y0);
                context.scale(0.8, 2.4);
                context.beginPath();
                context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false);
                context.fill();
                context.restore();

                this.y0 += this.velocity;

                if(this.y0 <= this.y){
                    this.status = 1;
                }
                this.theta += this.DELTA_THETA;
                this.theta %= Math.PI * 2;
                this.velocity += this.GRAVITY;
                return true;
            case 1:
                if(--this.waitCount <= 0){
                    this.status = 2;
                }
                return true;
            case 2:
                context.save();
                context.globalCompositeOperation = 'lighter';
                context.globalAlpha = this.opacity;
                context.fillStyle = this.color;

                for(let i = 0, length = this.particles.length; i < length; i++){
                    this.particles[i].render(context, this.opacity);
                }
                context.restore();
                this.opacity -= this.DELTA_OPACITY;
                return this.opacity > 0;
        }
    }
};
let PARTICLE = function(x, y, renderer){
    this.x = x;
    this.y = y;
    this.renderer = renderer;
    this.init();
};
PARTICLE.prototype = {
    RADIUS : 1.5,
    VELOCITY_RANGE : {min : 0, max : 3},
    GRAVITY : 0.02,
    FRICTION : 0.98,

    init : function(){
        let radian = Math.PI * 2 * Math.random(),
            velocity = this.renderer.getRandomValue(this.VELOCITY_RANGE),
            rate = Math.random();

        this.vx = velocity * Math.cos(radian) * rate;
        this.vy = velocity * Math.sin(radian) * rate;
    },
    render : function(context, opacity){
        context.beginPath();
        context.arc(this.x, this.y, this.RADIUS, 0, Math.PI * 2, false);
        context.fill();

        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.GRAVITY;
        this.vx *= this.FRICTION;
        this.vy *= this.FRICTION;
    }
};