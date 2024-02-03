
const STAGE_WIDTH = 16, STAGE_HEIGHT = 16;
const BLOCK_SIZE = 20;
let stage = "0".repeat(STAGE_WIDTH * STAGE_HEIGHT);
let curBlocks = createRandomBlocks();

window.onload = () => {
    let context = canvas.getContext("2d");
    canvas.width = STAGE_WIDTH * BLOCK_SIZE;
    canvas.height = STAGE_HEIGHT * BLOCK_SIZE;

    document.onkeydown = e => {
        let nextBlocks = curBlocks;
        if( e.keyCode == 40 ) {
            nextBlocks = curBlocks.map(p => [p[0], p[1] + 1]);
        } else if( e.keyCode == 37 ) {
            nextBlocks = curBlocks.map(p => [p[0] - 1, p[1]]);
        } else if( e.keyCode == 39 ) {
            nextBlocks = curBlocks.map(p => [p[0] + 1, p[1]]);
        } else if( e.keyCode == 38 ) {
            nextBlocks = createRotatedBlocks(curBlocks);
        }

        if( !isCrash(nextBlocks) && !isEscape(nextBlocks) ) {
            curBlocks = nextBlocks;
        } else if( e.keyCode == 40 ) {
            if( isOver(curBlocks) ) {
                location.reload();
            }
            curBlocks.map((p, i) => i < 1? "" : addStackedBlock(p[0], p[1]));
            curBlocks = createRandomBlocks();
        }

        update(context);
    };

    setInterval(() => document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 40})), 1000);
}

function update(context) {
    for( let i = 0; i < STAGE_WIDTH * STAGE_HEIGHT; i += STAGE_WIDTH ) {
        if( !stage.substr(i, STAGE_WIDTH).includes(0) ) {
            stage = "0".repeat(STAGE_WIDTH) + stage.slice(0, i) + stage.slice(i + STAGE_WIDTH);
        }
    }

    [...stage].map((s, i) => drawBlock(context, i % STAGE_WIDTH, i / STAGE_WIDTH | 0, s == 0? "#111" : "orange"));
    curBlocks.map((p, i) => i < 1? "" : drawBlock(context, p[0], p[1], "gold"));
}

function createRandomBlocks() {
    let r = Math.random() * 7;
    let m = STAGE_WIDTH / 2 | 0;
    if( r < 1 ) {
        return [[0.5 + m, -1.5], [0 + m, -2], [1 + m, -2], [0 + m, -1], [1 + m, -1]];
    } else if( r < 2 ) {
        return [[0.5 + m, -2.5], [0 + m, -4], [0 + m, -3], [0 + m, -2], [0 + m, -1]];
    } else if( r < 3 ) {
        return [[1 + m, -2], [0 + m, -2], [1 + m, -2], [1 + m, -1], [2 + m, -1]];
    } else if( r < 4 ) {
        return [[1 + m, -2], [1 + m, -2], [2 + m, -2], [0 + m, -1], [1 + m, -1]];
    } else if( r < 5 ) {
        return [[1 + m, -2], [0 + m, -2], [1 + m, -2], [2 + m, -2], [2 + m, -1]];
    } else if( r < 6 ) {
        return [[1 + m, -2], [0 + m, -2], [1 + m, -2], [2 + m, -2], [0 + m, -1]];
    } else {
        return [[1 + m, -2], [0 + m, -1], [1 + m, -1], [2 + m, -1], [1 + m, -2]];
    }
}

function createRotatedBlocks(blocks) {
    return [...blocks].map((p, i) => i < 1? p : [-p[1] + blocks[0][1] + blocks[0][0], p[0] - blocks[0][0] + blocks[0][1]]);
}

function addStackedBlock(x, y) {
    stage = stage.slice(0, x + y * STAGE_WIDTH) + "1" + stage.slice(x + y * STAGE_WIDTH + 1);
}

function isOver(blocks) {
    return !!blocks.filter(p => p[1] < 0).length;
}

function isEscape(blocks) {
    return !!blocks.filter(p => p[0] < 0 || p[0] >= STAGE_WIDTH || p[1] >= STAGE_HEIGHT).length;
}

function isCrash(blocks) {
    return !!blocks.filter(p => stage[p[0] + p[1] * STAGE_WIDTH] == 1).length;
}

function drawBlock(context, x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}