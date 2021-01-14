bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    serial.writeLine("received command")
    command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    command_code = command.split(":")
    serial.writeLine("command code:" + command_code[0])
    if (command_code[0] == "P") {
        serial.writeLine("requested password")
        cmdPassword(command_code[1])
    } else if (command_code[0] == "A") {
        serial.writeLine("requested pin activation")
        activatePin()
    } else if (command_code[0] == "D") {
        serial.writeLine("requested pin deactivation")
        deActivatePin()
    } else if (command_code[0] == "S") {
        serial.writeLine("requested pin status")
        getStatus()
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
    if (pins.digitalReadPin(DigitalPin.P0) == 0) {
        pins.digitalWritePin(DigitalPin.P0, 1)
        basic.showLeds(`
            . # . . .
            # # . . .
            . # . . .
            . # . . .
            . # . . #
            `)
        bluetooth.uartWriteString("F:OK")
    } else {
        pins.digitalWritePin(DigitalPin.P0, 0)
        basic.showLeds(`
            # # # . .
            # . # . .
            # . # . .
            # . # . .
            # # # . #
            `)
        bluetooth.uartWriteString("F:OK")
    }
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
function deActivatePin () {
    serial.writeLine("activatePin")
    if (ble_connected == 2) {
        serial.writeLine("deactivating...")
        pins.digitalWritePin(DigitalPin.P0, 0)
        bluetooth.uartWriteString("D:OK")
        basic.showLeds(`
            # # # . .
            # . # . .
            # . # . .
            # . # . .
            # # # . .
            `)
    } else {
        serial.writeLine("access denied")
        bluetooth.uartWriteString("D:KO")
    }
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
        bluetooth.uartWriteString("P:OK")
    } else {
        serial.writeLine("wrong password:" + pwd)
        bluetooth.uartWriteString("P:KO")
        bluetooth.stopAdvertising()
        basicBLEAdvertise()
    }
}
function activatePin () {
    serial.writeLine("activatePin")
    if (ble_connected == 2) {
        serial.writeLine("activating...")
        pins.digitalWritePin(DigitalPin.P0, 1)
        bluetooth.uartWriteString("A:OK")
        basic.showLeds(`
            . # . . .
            # # . . .
            . # . . .
            . # . . .
            . # . . .
            `)
    } else {
        serial.writeLine("access denied")
        bluetooth.uartWriteString("A:KO")
    }
}
function getStatus () {
    serial.writeLine("getStatus")
    if (ble_connected == 2) {
        serial.writeLine("getting status...")
        bluetooth.uartWriteString("S:" + pins.digitalReadPin(DigitalPin.P0))
    } else {
        serial.writeLine("access denied")
        bluetooth.uartWriteString("S:KO")
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
