var WINDOW_WIDTH = 1024;
var WINDOWS_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

//const endTime = new Date(new Date().setDate(new Date().getDate() + 1));
var curShowTimeSeconds = 0;

var balls = [];
// noinspection JSUnusedGlobalSymbols
const colors = ['#33B5E5', '#0099cc', '#aa66cc', '#9933cc', '#669900', '#ffbb33', '#ff8800', '#ff4444', '#e6e837', '#6bdad5'];

window.onload = function () {

    /* 屏幕自适应 */
    WINDOW_WIDTH = document.body.clientWidth ;
    WINDOWS_HEIGHT = document.body.clientHeight ;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;

    MARGIN_TOP = Math.round(WINDOWS_HEIGHT / 5);


    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOWS_HEIGHT;

    /* 设置要显示的倒计时时间,单位为秒 */
    curShowTimeSeconds = getCurrentShowTimeSeconds();

    /* 绘制动画 */
    setInterval(
        function () {
            render(context);
            update();
        },
        50);
};

function getCurrentShowTimeSeconds() {
    var curTime = new Date();

/*
    注释
    这里是倒计时代码 , 下面是时钟效果
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);*/

    var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

    return ret > 0 ? ret : 0;

}

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    if (nextSeconds !== curSeconds) {
        if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(nextHours / 10));
        }

        if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(nextHours % 10));
        }

        if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(nextMinutes / 10));
        }

        if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(nextMinutes % 10));
        }

        if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds / 10));
        }

        if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();

}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        /* 下边界检测 */
        if (balls[i].y >= WINDOWS_HEIGHT - RADIUS) {
            balls[i].y = WINDOWS_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.618;
        }
    }

    /* 控制小球的数量 */
    var count = 0;
    for (var k = 0; k < balls.length; k++) {
        if (balls[k].x + RADIUS > 0 && balls[k].x - RADIUS < WINDOW_WIDTH)
            balls[count++] = balls[k];
    }
    while (balls.length > count) {
        balls.pop();
    }
}


function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    // color: colors[Math.floor(Math.random() * colors.length)]
                    color: 'rgb(' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ')'
                };

                balls.push(aBall);
            }
        }
    }
}


function render(cxt) {

    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOWS_HEIGHT);

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = curShowTimeSeconds % 60;

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);

    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        cxt.closePath();

        cxt.fill();

    }

}

function renderDigit(x, y, num, ctx) {

    ctx.fillStyle = "rgb(0,102,153)";

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {

                ctx.beginPath();
                ctx.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}