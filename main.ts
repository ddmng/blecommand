bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    serial.writeLine("received command:" + command.substr(0, 1))
    if (command.substr(0, 1) == "9") {
        serial.writeLine("requested password")
        cmdPassword(command.substr(1, 1))
    } else if (command.substr(0, 1) == "1") {
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
        . . . # .
        # # # # #
        . . . # .
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
    basic.showLeds(`
        # . # # .
        . # # . #
        . . # # .
        . # # . #
        # . # # .
        `)
    bluetooth.startUartService()
}
function cmdPassword (pwd: string) {
    serial.writeLine("received password:" + pwd)
    if (pwd == "9") {
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
    } else {
        let password = 0
        serial.writeLine("password ko")
        serial.writeLine("" + (password))
        bluetooth.stopAdvertising()
        basicBLEAdvertise()
    }
}
function activatePin () {
    serial.writeLine("activatePin")
    if (ble_connected == 2) {
        serial.writeLine("activating...")
    } else {
        serial.writeLine("denied")
    }
}
let ble_connected = 0
let command = ""
serial.writeLine("started")
basicBLEAdvertise()
basic.forever(function () {
	
})
