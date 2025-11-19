import { card } from "./card.js"

let canvas = document.getElementById("canvas")
let pencil = canvas.getContext("2d")

let cardNum = 0

let cards = []
let shuffledArr = []
let pairs = []
let selection = []
let pause = false
let pairNum = 0
let solved = 0
let won = false

let colors = ['#E4080A', '#FE9900', '#FFDE59', '#7DDA58', '#5DE2E7', '#0765f1', '#CC6CE7', '#FE209D']

let bgVal = false

// sourced from ChristopheD on stack overflow
// also i forgot we made shuffleArray in the toolbox LOL
// also realizing there was multiple things i made
// manually instead of using the toolbox. oopsies!
function shuffle(array) {
    let currentIndex = array.length;


    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
    return array
}

function genCards() {
    let excludedColors = []
    let colorpair = null
    let input = document.getElementById("cardinput").value
    cards = []
    pairNum = 0
    solved = 0
    won = false

    if ((!isNaN(parseFloat(input)) && isFinite(input)) && (input % 2 == 0)) {

        if (input > 16) {input = 16} else if (input < 6) {input = 6}
        cardNum = input

        // this is complex to a stupid degree omg
        for (let i = 0; i < cardNum; i++) {
            if (i % 2 == 0) {
                while (excludedColors.includes(colorpair) || colorpair == null) {
                    colorpair = Math.floor(Math.random() * 8)
                }
                pairNum+=1
                excludedColors.push(colorpair)
            }
            cards.push(new card(canvas, pencil, colors[colorpair], pairNum))
        }

        shuffledArr = shuffle([...cards])
        console.log(shuffledArr)
    }
}

function backgroundOverlay() {
    if (!won) {
        if (bgVal == 'correct') {
            pencil.fillStyle = '#bfffb2'
            pencil.fillRect(0, 0, canvas.width, canvas.height)
        } else if (bgVal == 'incorrect') {
            pencil.fillStyle = '#ffb2b2'
            pencil.fillRect(0, 0, canvas.width, canvas.height)
        }
    } else {
        pencil.fillStyle = '#bfffb2'
        pencil.fillRect(0, 0, canvas.width, canvas.height)
        pencil.font = "48px serif"
        pencil.fillStyle = "#000"
        let textWidth = pencil.measureText("you win !! 🤑🤑").width;
        pencil.fillText("you win !! 🤑🤑",canvas.width*0.5-textWidth*0.5,canvas.height*0.5+12)
    }
}

function gameLoop() {
    let db = false
    let processed = cardNum

    pencil.clearRect(0, 0, canvas.width, canvas.height)
    backgroundOverlay()

    if (cardNum >= 6) {processed = cardNum/2}

    let x = (canvas.width-50)/(processed+1)
    //i dont know why this gets me equal seperation on the Y axis but whatever man
    let y = (canvas.height-75) / 4
    let newx = x
    let newy = y
    // pencil.fillRect(487.5,287.5,25,25)
    if (shuffledArr != null) {
        for (let i of shuffledArr) {
            i.generate(newx,newy)
            newx+=x
            if (shuffledArr.indexOf(i)+1 >= (processed) && (db == false)) {
                newy+=newy*2
                newx=x
                db = true
            }
        }
    }
}

// horrendus code may god smite me from the heavens for this
function cardClick(event) {
    if (pause == false) {
        for (let i of shuffledArr) {
            let idkanymore = i.flip(event)
            if (typeof idkanymore === 'number') {
                pairs.push(idkanymore)
                selection.push(i)
            }
        }

        if (pairs.length >= 2) {
            if (new Set(pairs).size === 1) {
                pairs = []
                selection = []
                solved+=1
                if (solved == pairNum) {
                    won = true
                } else {
                    bgVal = 'correct'
                    setTimeout(function () {bgVal = false, pause = false}, 1250)
                }
            } else {
                let [first, second] = selection
                pairs = []
                selection = []
                pause = true
                bgVal = 'incorrect'
                setTimeout(function () {first.flip(event, true), second.flip(event, true), bgVal = false}, 1250)
                setTimeout(function () {pause = false}, 1750)
            }
        }
    }
}

canvas.addEventListener("click", cardClick)
document.getElementById("start").addEventListener("click", genCards)
setInterval(gameLoop, 50)