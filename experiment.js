function canvasNoise(w, h, pixelRatio, alpha, element) {
    var cvs = document.createElement('canvas');
    var ct = cvs.getContext('2d');

    var rw = w * pixelRatio;
    var rh = h * pixelRatio;
    cvs.width = rw;
    cvs.height = rh;

    alpha *= pixelRatio;


    for (var j=0; j<rh; j++) { // rows
        for (var i=0; i<rw; i++) { // columns
            var n = Math.round(Math.random() * 255);
            n = Math.round(Math.random()) * 255;
            var a = Math.random();
            ct.fillStyle = 'rgba(' + n + ',' + n + ',' + n + ',' + a + ')';
            ct.globalAlpha = alpha;
            ct.fillRect(i, j, 1, 1);
        }
    }

    var data = cvs.toDataURL();
    var el = document.getElementById(element);
    el.style.backgroundImage = 'url(' + data + ')';
    el.style.backgroundSize = '' + w + 'px ' + h + 'px';

}



var menuState = 1;
var menuAnimating = false;
var menuCounter = 0;

var experiment;
var line = [
    new LinePoint('M', 1, 25, 20, 20), new LinePoint('L', 99, 25, 80, 80),
    new LinePoint('M', 1, 50, 50, 50), new LinePoint('L', 99, 50, 50, 50),
    new LinePoint('M', 1, 75, 20, 80), new LinePoint('L', 99, 75, 80, 20)
];

// DOM Elements //
var menuIcon, svg, path, menuList;

var baseUrl = 'http://whitevinyldesign.com/experiments/';
var experiments = [
    {
        title: 'Flow',
        url: 'flow',
        description: "Flow generates marbled paint flow textures in realtime. Rendered in Canvas, it uses Perlin noise to generate the form and color patterns. This was adapted from a texture generating library I'd been working on."
    },
    {
        title: 'Crush',
        url: 'crush',
        description: "Crush generates glitchy patterns in Canvas, by creating a Perlin noise heightmap, and mapping the height data back into itself. The reduced feedback creates rectangular shapes."
    },
    {
        title: 'Wave',
        url: 'wave',
        description: "Wave creates the effect of motion on the surface of a dark and slightly gooey liquid, in a pseudo-3D style. Rendered in 2D Canvas, it uses Perlin noise to displace and tint a map of triangles."
    },
    /*{
        title: 'Warp',
        url: 'warp',
        description: "Warp takes the image data of a photo and distorts it in realtime. The shape and movement of the distortion use Perlin noise, and the distortion is rendered using an array of drawn lines rendered in Canvas."
    },*/
    {
        title: 'Walk',
        url: 'walk',
        description: "Walk paints soft colorful abstract gradient shapes in realtime. Movement and color shifting is generated with perlin noise, and rounded lines are rendered in Canvas."
    }
];


// INIT //
function setupExperiment() {

    experiment = new Experiment();
}

function Experiment(){

}

Experiment.prototype.update = function() {

    if (menuAnimating) {
        // loop through line points, animate them & update the svg path string //
        var l = line.length;
        var d = '';
        for (var i=0; i<l; i++) {
            line[i].update();
            d += line[i].print();
        }
        path.setAttribute('d',d);

        // turn animation off after a while to save processing //
        menuCounter --;
        if (menuCounter < 1) menuAnimating = false;
    }
};


function LinePoint(type, x1, y1, x2, y2) {
    this.type = type;
    this.x = [x1,x1,x2];
    this.y = [y1,y1,y2];
}
LinePoint.prototype.update = function() {
    // index zero is the co-ords we're animating //
    // index 1 is hamburger state, index 2 is X state //
    this.x[0] = lerp(this.x[0],this.x[menuState],30);
    this.y[0] = lerp(this.y[0],this.y[menuState],30);
};
LinePoint.prototype.print = function() {
    // return a string of this point //
    return '' + this.type + '' + this.x[0] + ' ' + this.y[0];
};
