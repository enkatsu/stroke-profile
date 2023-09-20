// const profilie = `
// 私は遠藤勝也です。
// `.replace(/\r?\n/g, '');
const profilie = `
遠藤勝也です。
2016年に明星大学の情報学部を卒業しました。
尼岡研究室出身です。
武富さんとは同期で、菊池さんの一つ上の代にあたります。
普段は週四でWebプログラマをしています。
残りの日は作品制作や、研究活動をしています。
よろしくお願いします。
`.replace(/\r?\n/g, '');
let words = [];
let currentIndex = 0;
let wordIndex = 0;
let movedCount = 0;
let currentPosition = null;
let totalDist = 0.0;

function setup() {
    // speech(profilie);
    createCanvas(windowWidth, windowHeight);
    kuromoji.builder({ dicPath: './assets/dict/' }).build(function (err, tokenizer) {
        const tokens = tokenizer.tokenize(profilie);
        print(tokens)
        words = tokens.map(token => token.surface_form);
        print(words)
    });
    background(220);
    textFont('Sawarabi Mincho');
}

function draw() {
}

function mousePressed() {
    currentPosition = createVector(mouseX, mouseY);
}

function mouseReleased() {
    currentPosition = null;
}

function mouseDragged() {
    const d = dist(currentPosition.x, currentPosition.y, mouseX, mouseY);
    if (d > 20) {
        totalDist += d;
        push();
        translate(mouseX, mouseY);
        const angle = createVector(0, 10)
            .angleBetween(createVector(mouseX, mouseY)
            .sub(currentPosition));
        rotate(angle);
        print(angle);
        text(profilie[currentIndex], 0, 0);
        pop();
        currentPosition = createVector(mouseX, mouseY);
        currentIndex++;
        if (currentIndex >= profilie.length) {
            currentIndex = 0;
        }

        movedCount++;
        if (words[wordIndex].length <= movedCount) {
            const minLength = 30;
            const maxLength = 50;
            const l = constrain(totalDist / words[wordIndex].length, minLength, maxLength)
            const rate = map(l, minLength, maxLength, 1.0, 2.0);
            const pitch = map(mouseY, 0, height, 2.0, 0.0);
            speech(words[wordIndex], rate, pitch, 1.0);
            wordIndex++;
            if (wordIndex >= words.length) {
                wordIndex = 0;
            }
            movedCount = 0;
            totalDist = 0;
        }
    }
}

/**
 * @param {*} text 
 * @param {*} rate 速度 0.1 - 10 初期値1 (倍速なら2, 半分の倍速なら0.5)
 * @param {*} pitch 高さ 0 - 2 初期値1
 * @param {*} volume 音量 0 - 1 初期値1
 */
function speech(text, rate = 1.0, pitch = 1.0, volume = 1.0) {
    const uttr = new SpeechSynthesisUtterance();
    uttr.text = text;
    // uttr.lang = 'en-US';
    uttr.lang = 'ja-JP';
    uttr.rate = rate;
    uttr.pitch = pitch;
    uttr.volume = volume;
    speechSynthesis.speak(uttr);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
