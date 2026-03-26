
let standbyHandler : handler
let getreadyHandler : handler
let selectnowHandler : handler

//% color="#C4C80E" icon="\uf11b"
//% block="SimonSays"
//% block.loc.nl="SimonSays"
namespace SimonSays {

    let tminit = 2500
    let tmout = 0
    let tmdelta = 250
    let series : Color[] = []
    let ixseries = 0
    let curColor = Color.None
    let selColor = Color.None
    let points = 0

    export function clearColor() {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }

    export function clearSeries() {
        if (standbyHandler) standbyHandler()
        series = []
        ixseries = 0
        points = 0
        curColor = Color.None
        selColor = Color.None
        clearColor()
    }

    export function showCurrentColor() {
        clearColor()
        if (getreadyHandler) getreadyHandler()
        basic.pause(500)
        switch (curColor) {
            case Color.Red:
                pins.digitalWritePin(DigitalPin.P14, 1)
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
                break;
            case Color.Yellow:
                pins.digitalWritePin(DigitalPin.P14, 1)
                pins.digitalWritePin(DigitalPin.P15, 1)
                pins.digitalWritePin(DigitalPin.P16, 0)
                break;
            case Color.Blue:
                pins.digitalWritePin(DigitalPin.P14, 0)
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 1)
                break;
        }
    }

    export function waitForButton(): Color {
        if (selectnowHandler) selectnowHandler()
        selColor = Color.None
        let tm = control.millis() + (tmout > 100 ? tmout : 100)
        while (tm < control.millis()) {
            if (pins.digitalReadPin(DigitalPin.P0) == 1) {
                while (pins.digitalReadPin(DigitalPin.P16) == 1) pause(1)
                selColor = Color.Red
                break
            } else
                if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                    while (pins.digitalReadPin(DigitalPin.P15) == 1) pause(1)
                    selColor = Color.Yellow
                    break
                } else
                    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
                        while (pins.digitalReadPin(DigitalPin.P14) == 1) pause(1)
                        selColor = Color.Blue
                        break
                    }
            basic.pause(1)
        }
        return selColor
    }

    export function extendSeries() {
        let clr = General.randomInt(0, 2)
        switch (clr) {
            case 0: series.push(Color.Red); break
            case 1: series.push(Color.Yellow); break
            case 2: series.push(Color.Green); break
        }
    }

    export function getSeriesLength(): number {
        return series.length
    }

    export function setFirstColor() {
        ixseries = 0
        curColor = (series.length ? series[0] : Color.None)
    }

    export function setNextColor() {
        ixseries += 1
        curColor = (ixseries >= 0 && ixseries < series.length ?
            series[ixseries] : Color.None)
    }

    export function isSeriesEnd(): boolean {
        return (ixseries >= series.length)
    }

    export function getCurrentIndex(): number {
        return (ixseries >= 0 && ixseries < series.length ? ixseries : -1)
    }

    export function getCurrentColor(): Color {
        return curColor
    }

    export function getSelectedColor(): Color {
        return selColor
    }

    export function isMatchingColor(): boolean {
        return (curColor == selColor)
    }

    export function increasePoints() {
        points += 1
    }

    export function getPoints(): number {
        return points
    }

    export function setInitTimeout(timeout: number) {
        tminit = timeout * 1000
    }

    export function setFirstTimeout(timeout: number) {
        tmout = tminit
    }

    export function setNextTimeout() {
        if (tmout >= tmdelta) tmout -= tmdelta
    }
}
