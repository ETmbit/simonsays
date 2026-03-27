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
        serial.writeLine("clearColor")
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }

    export function clearSeries() {
        serial.writeLine("clearSeries")
        busy = false
        series = []
        ixseries = 0
        points = 0
        curColor = Color.None
        butColor = Color.None
        clearColor()
    }

    export function restartSeries() {
        serial.writeLine("restartSeries")
        ixseries = 0
        curColor = Color.None
        butColor = Color.None
    }

    export function showCurrentColor() {
        serial.writeLine("showCurrentColor")
        serial.writeLine("# color=" + curColor.toString())
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
        serial.writeLine("waitForButton")
        serial.writeLine("# timeout=" + tmout.toString())
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
        serial.writeLine("# color=" + butColor.toString())
        return butColor
    }

    export function extendSeries() {
        serial.writeLine("extendSeries")
        let clr = General.randomInt(0, 2)
        let color: Color
        switch (clr) {
            case 0: color = Color.Red; break
            case 1: color = Color.Yellow; break
            case 2: color = Color.Blue; break
        }
        serial.writeLine("# color=" + color.toString())
        series.push(color)
    }

    export function getSeriesLength(): number {
        serial.writeLine("getSeriesLength")
        serial.writeLine("# length=" + series.length.toString())
        return series.length
    }

    export function setFirstColor() {
        serial.writeLine("setFirstColor")
        ixseries = 0
        tmout = tminit
        if (series.length) {
            busy = true
            curColor = series[ixseries]
            serial.writeLine("# color=" + curColor.toString())
        }
        else {
            busy = false
            curColor = Color.None
            serial.writeLine("# [not playing]")
        }
    }

    export function setNextColor() {
        serial.writeLine("setNextColor")
        tmout -= tmdelta
        if (tmout < 100) tmout = 100
        if (ixseries < series.length)
            ixseries += 1
        if (ixseries == series.length) {
            busy = false
            curColor = Color.None
            serial.writeLine("# [not playing]")
        }
        else {
            curColor = series[ixseries]
            serial.writeLine("# color=" + curColor.toString())
        }
    }

    export function isSeriesEnd(): boolean {
        serial.writeLine("isSeriesEnd")
        serial.writeLine("# " + (ixseries >= series.length ? "true" : "false"))
        return (ixseries >= series.length)
    }

    export function isSeriesBusy(): boolean {
        serial.writeLine("isSeriesBusy")
        serial.writeLine("# " + (busy ? "true" : "false"))
        return (busy)
    }

    export function getCurrentIndex(): number {
        serial.writeLine("getCurrentIndex")
        serial.writeLine("# index=" + ixseries.toString())
        return (ixseries >= 0 && ixseries < series.length ? ixseries : -1)
    }

    export function getCurrentColor(): Color {
        serial.writeLine("getCurrentColor")
        serial.writeLine("# color=" + curColor.toString())
        return curColor
    }

    export function getButtonColor(): Color {
        serial.writeLine("getSelectedColor")
        serial.writeLine("# color=" + butColor.toString())
        return butColor
    }

    export function isMatchingColor(): boolean {
        serial.writeLine("isMatchingColor")
        serial.writeLine("# curColor=" + curColor.toString() + ", butColor=" + butColor.toString())
        return (curColor == butColor)
    }

    export function increasePoints() {
        serial.writeLine("increasePoints")
        points += 1
        serial.writeLine("# points=" + points.toString())
    }

    export function getPoints(): number {
        serial.writeLine("getPoints")
        serial.writeLine("# points=" + points.toString())
        return points
    }

    export function setInitTimeout(timeout: number) {
        serial.writeLine("setInitTimeout")
        tminit = timeout * 1000
        serial.writeLine("# tminit=" + tminit.toString())
    }

    export function setFirstTimeout(timeout: number) {
        serial.writeLine("setFirstTimeout")
        tmout = tminit
        serial.writeLine("# tmout=" + tmout.toString())
    }

    export function setNextTimeout() {
        serial.writeLine("setNextTimeout")
        if (tmout >= tmdelta) tmout -= tmdelta
        serial.writeLine("# tmout=" + tmout.toString())
    }
}

SimonSays.clearSeries()
