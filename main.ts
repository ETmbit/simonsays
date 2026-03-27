/*
File:      github.com/ETmbit/simonsays.ts
Copyright: ETmbit, 2026

License:
This file is part of the ETmbit extensions for MakeCode for micro:bit.
It is free software and you may distribute it under the terms of the
GNU General Public License (version 3 or later) as published by the
Free Software Foundation. The full license text you find at
https://www.gnu.org/licenses.

Disclaimer:
ETmbit extensions are distributed without any warranty.

Dependencies:
ETmbit/general
*/

pins.setPull(DigitalPin.P0, PinPullMode.PullDown)
pins.setPull(DigitalPin.P1, PinPullMode.PullDown)
pins.setPull(DigitalPin.P2, PinPullMode.PullDown)

namespace SimonSays {

    let tminit = 1000
    let tmout = 0
    let tmdelta = 100
    let series: Color[] = []
    let ixseries = 0
    let curColor = Color.None
    let butColor = Color.None
    let busy = false
    let points = 0

    export function clearColor() {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }

    export function clearSeries() {
        busy = false
        series = []
        ixseries = 0
        points = 0
        curColor = Color.None
        butColor = Color.None
        clearColor()
    }

    export function restartSeries() {
        ixseries = 0
        curColor = Color.None
        butColor = Color.None
    }

    export function showCurrentColor() {
        clearColor()
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
        butColor = Color.None
        let tm = control.millis() + tmout
        while (tm > control.millis()) {
            if (pins.digitalReadPin(DigitalPin.P0) == 1) {
                while (pins.digitalReadPin(DigitalPin.P0) == 1) pause(1)
                butColor = Color.Red
                break
            } else
                if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                    while (pins.digitalReadPin(DigitalPin.P1) == 1) pause(1)
                    butColor = Color.Yellow
                    break
                } else
                    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
                        while (pins.digitalReadPin(DigitalPin.P2) == 1) pause(1)
                        butColor = Color.Blue
                        break
                    }
            basic.pause(1)
        }
        return butColor
    }

    export function extendSeries() {
        let clr = General.randomInt(0, 2)
        let color: Color
        switch (clr) {
            case 0: color = Color.Red; break
            case 1: color = Color.Yellow; break
            case 2: color = Color.Blue; break
        }
        series.push(color)
    }

    export function getSeriesLength(): number {
        return series.length
    }

    export function setFirstColor() {
        ixseries = 0
        tmout = tminit
        if (series.length) {
            busy = true
            curColor = series[ixseries]
        }
        else {
            busy = false
            curColor = Color.None
        }
    }

    export function setNextColor() {
        tmout -= tmdelta
        if (tmout < 100) tmout = 100
        if (ixseries < series.length)
            ixseries += 1
        if (ixseries == series.length) {
            busy = false
            curColor = Color.None
        }
        else {
            curColor = series[ixseries]
        }
    }

    export function isSeriesEnd(): boolean {
        return (ixseries >= series.length)
    }

    export function isSeriesBusy(): boolean {
        return (busy)
    }

    export function getCurrentIndex(): number {
        return (ixseries >= 0 && ixseries < series.length ? ixseries : -1)
    }

    export function getCurrentColor(): Color {
        return curColor
    }

    export function getButtonColor(): Color {
        return butColor
    }

    export function isMatchingColor(): boolean {
        return (curColor == butColor)
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

SimonSays.clearSeries()
