bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    command_code = command.split(":")
    serial.writeLine("command code:" + command_code)
    if (command_code[0] == "P") {
        serial.writeLine("requested password")
        cmdPassword(command_code[1])
    } else if (command_code[0] == "1") {
        serial.writeLine("requested pin activation")
        activatePin()
    } else {
        serial.writeLine("invalid command")
    }
})
bluetooth.onBluetoothConnected(function () {
    serial.writeLine("connected")
    ble_connected = 1
    serial.writeLine("waiting for password")
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
})
bluetooth.onBluetoothDisconnected(function () {
    serial.writeLine("disconnected")
    ble_connected = -1
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        . # # # .
        # . . . #
        `)
    bluetooth.stopAdvertising()
    basicBLEAdvertise()
})
input.onButtonPressed(Button.A, function () {
    bluetooth.uartWriteNumber(9)
})
function publishBLEServices () {
    bluetooth.startButtonService()
}
function basicBLEAdvertise () {
    bluetooth.advertiseUid(
    0,
    0,
    7,
    true
    )
    bluetooth.startUartService()
    basic.showLeds(`
        # . # # .
        . # # . #
        . . # # .
        . # # . #
        # . # # .
        `)
}
function cmdPassword (pwd: string) {
    serial.writeLine("received password:" + pwd)
    if (pwd == SYS_PASSWORD) {
        serial.writeLine("password ok")
        ble_connected = 2
        publishBLEServices()
        basic.showLeds(`
            . . . . .
            . . . . #
            . . . # .
            # . # . .
            . # . . .
            `)
        bluetooth.uartWriteNumber(0)
    } else {
        serial.writeLine("wrong password:" + pwd)
        bluetooth.uartWriteNumber(1)
        bluetooth.stopAdvertising()
        basicBLEAdvertise()
    }
}
function activatePin () {
    serial.writeLine("activatePin")
    if (ble_connected == 2) {
        serial.writeLine("activating...")
        bluetooth.uartWriteNumber(0)
        pins.digitalWritePin(DigitalPin.P0, 1)
    } else {
        serial.writeLine("access denied")
        bluetooth.uartWriteNumber(1)
    }
}
let ble_connected = 0
let command_code: string[] = []
let command = ""
let SYS_PASSWORD = ""
serial.writeLine("started")
basicBLEAdvertise()
SYS_PASSWORD = "AAAA"
basic.forever(function () {
	
})
