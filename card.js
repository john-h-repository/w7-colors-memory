export class card {
    canvas
    pencil
    cardnum
    color = 'darkgrey'
    colorStoke = 'grey'
    colorFlipped
    x = 0
    y = 0
    width = 50
    height = 75
    flipped = false
    pairNum = 0

    constructor(canvas, pencil, color, pairNum) {
        this.pencil = pencil
        this.canvas = canvas
        this.colorFlipped = color
        this.pairNum = pairNum
    }

    generate(x,y) {
        this.x = x
        this.y = y
        
        // this stupid GODDAMN beginpath() was the source of like 30+ minutes of
        // troubleshooting trying to figure out why flip() would flip cards only when
        // you clicked the very last card in the layout. wtf even is javascript dude
        this.pencil.beginPath()
        this.pencil.fillStyle = this.color
        this.pencil.rect(this.x,this.y,this.width,this.height)
        this.pencil.fill()
        this.pencil.strokeStyle = this.colorStoke
        this.pencil.lineWidth = 10
        this.pencil.stroke()
    }

    flip(event, force) {
        let offsetX = event.offsetX
        let offsetY = event.offsetY
        // console.log(this.x)
        if (((offsetX >= this.x && offsetX <= this.x+this.width) && (offsetY >= this.y && offsetY <= this.y+this.height)) || force == true) {
            if (this.flipped == false) {
                this.color = this.colorFlipped
                this.colorStoke = this.LightenDarkenColor(this.colorFlipped, -75)
                this.flipped = true
                return this.pairNum
            } else if (force == true) {
                this.color = 'darkgrey'
                this.colorStoke = 'grey'
                this.flipped = false
            }
        }
    }

    // sourced from Pimp Trizkit on stack overflow
    LightenDarkenColor(col,amt) {
        var usePound = false
        if ( col[0] == "#" ) {
            col = col.slice(1)
            usePound = true
        }

        var num = parseInt(col,16)

        var r = (num >> 16) + amt

        if ( r > 255 ) r = 255
        else if  (r < 0) r = 0

        var b = ((num >> 8) & 0x00FF) + amt

        if ( b > 255 ) b = 255
        else if  (b < 0) b = 0
        
        var g = (num & 0x0000FF) + amt

        if ( g > 255 ) g = 255
        else if  ( g < 0 ) g = 0

        let string = "000000" + (g | (b << 8) | (r << 16)).toString(16)
        return (usePound?"#":"") + string.substr(string.length-6)
    }
}