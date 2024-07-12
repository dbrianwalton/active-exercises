"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_cellbotics_js_ble_js"],{

/***/ 34630:
/*!**********************************************!*\
  !*** ./runestone/cellbotics/js/auto-bind.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "auto_bind": () => (/* binding */ auto_bind)
/* harmony export */ });
// .. Copyright (C) 2012-2020 Bryan A. Jones.
//
//  This file is part of the CellBotics system.
//
//  The CellBotics system is free software: you can redistribute it and/or
//  modify it under the terms of the GNU General Public License as
//  published by the Free Software Foundation, either version 3 of the
//  License, or (at your option) any later version.
//
//  The CellBotics system is distributed in the hope that it will be
//  useful, but WITHOUT ANY WARRANTY; without even the implied warranty
//  of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
//  General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with the CellBotics system.  If not, see
//  <http://www.gnu.org/licenses/>.
//
// *********************************************************
// |docname| - Automatically bind methods to their instances
// *********************************************************




// The following two functions were taken from https://github.com/sindresorhus/auto-bind/blob/master/index.js and lightly modified. They provide an easy way to bind all callable methods to their instance. See `Binding Methods to Class Instance Objects <https://ponyfoo.com/articles/binding-methods-to-class-instance-objects>`_ for more discussion on this crazy JavaScript necessity.
//
// Gets all non-builtin properties up the prototype chain
const getAllProperties = object => {
	const properties = new Set();

	do {
		for (const key of Reflect.ownKeys(object)) {
			properties.add([object, key]);
		}
	} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

	return properties;
};


// Invoke this in the constructor of an object.
function auto_bind(self) {
    for (const [object, key] of getAllProperties(self.constructor.prototype)) {
        if (key === 'constructor') {
            continue;
        }

        const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
        if (descriptor && typeof descriptor.value === 'function') {
            self[key] = self[key].bind(self);
        }
    }
}


/***/ }),

/***/ 14818:
/*!****************************************!*\
  !*** ./runestone/cellbotics/js/ble.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cell_bot_ble_gui": () => (/* binding */ cell_bot_ble_gui)
/* harmony export */ });
/* harmony import */ var _auto_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auto-bind.js */ 34630);
// .. Copyright (C) 2012-2020 Bryan A. Jones.
//
//  This file is part of the CellBotics system.
//
//  The CellBotics system is free software: you can redistribute it and/or
//  modify it under the terms of the GNU General Public License as
//  published by the Free Software Foundation, either version 3 of the
//  License, or (at your option) any later version.
//
//  The CellBotics system is distributed in the hope that it will be
//  useful, but WITHOUT ANY WARRANTY; without even the implied warranty
//  of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
//  General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with the CellBotics system.  If not, see
//  <http://www.gnu.org/licenses/>.
//
// *************************************************************
// |docname| - JavaScript code to connect with a CellBot via BLE
// *************************************************************





// CellBotBle
// ==========
// This sends and receives data to the CellBot via Bluetooth.
class CellBotBle {
    constructor() {
        (0,_auto_bind_js__WEBPACK_IMPORTED_MODULE_0__.auto_bind)(this);

        this.clear_connection();
        // If true, the server (BLE device / CellBot) is little-endian; if false, big-endian.
        this.is_little_endian = true;
        // If true, expect verbose returns (the CellBot was compiled with ``VERBOSE_RETURN`` defined).
        this.verbose_return = true;
        // If true, return dummy values instead of talking to the hardware.
        this.is_sim = false;

        // #defines from Arduino headers.
        this.INPUT = 1;
        this.OUTPUT = 2;

        // UUIDs for each characteristic.
        this.uuid = {
            resetHardware: "60cb180e-838d-4f65-aff4-20b609b453f3",
            pinMode: "6ea6d9b6-7b7e-451c-ab45-221298e43562",
            digitalWrite: "d3423cf6-6da7-4dd8-a5ba-3c980c74bd6d",
            digitalRead: "c370bc79-11c1-4530-9f69-ab9d961aa497",
            ledcSetup: "6be57cea-3c46-4687-972b-03429d2acf9b",
            ledcAttachPin: "2cd63861-078f-436f-9ed9-79e57ec8b638",
            ledcDetachPin: "b9b0cabe-25d8-4965-9259-7d3b6330e940",
            ledcWrite: "40698030-a343-448f-a9ea-54b39b03bf81"
        };
    }

    // Clear Bluetooth connection-related objects.
    clear_connection() {
        this.server && this.server.disconnect();
        this.server = undefined;
        this.service = undefined;
        // A dict of name: ``BluetoothRemoteGATTCharacteristic``.
        this.characteristic = {};
    }

    // Return true if BLE is supported by this browser. Even if it is supported, it may not be available.
    is_ble_supported() {
        return Boolean(navigator.bluetooth);
    }

    // Return true is BLE is supported. If so, register the provided event handler.
    async has_ble(on_availability_changed) {
        if (this.is_sim) {
            return true;
        }

        if (this.is_ble_supported() && await navigator.bluetooth.getAvailability()) {
            navigator.bluetooth.addEventListener("availabilitychanged", on_availability_changed);
            return true;
        } else {
            return false;
        }
    }

    // Returns true if the Bluetooth device (server) is connected.
    paired() {
        return this.is_sim || (this.server && this.server.connected);
    }

    // Pair with a CellBot and return the characteristic used to control the device.
    async pair(disconnect_callback)
    {
        if (this.is_sim) {
            return;
        }

        // Skip connecting if we're already connected.
        if (this.paired()) {
            return;
        }

        // Shut down any remnants of a previous connection.
        this.clear_connection();

        // Request a device with service `UUIDs`. See the `Bluetooth API <https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth>`_.
        let cellBot_service = "6c533793-9bd6-47d6-8d3b-c10a704b6b97";
        this.device = await navigator.bluetooth.requestDevice({
            filters: [{
                services: [cellBot_service]
            }]
        });

        // Notify on a disconnect. I can't find any docs on this, but it does work.
        this.device.addEventListener('gattserverdisconnected', disconnect_callback);
        this.device.addEventListener('gattserverdisconnected', this.clear_connection);

        // Connect to its server.
        this.server = await this.device.gatt.connect();

        // Get the service for our server.
        this.service = await this.server.getPrimaryService(cellBot_service);
    }

    // Generic access function for calling a function on the Arduino. It returns (value returned after invoking the function, message).
    async invoke_Arduino(
        // The Bluetooth characteristic to use for this call.
        characteristic,
        // The number of bytes in the return value:
        //
        // -    0: void
        // -    +1/-1: unsigned/signed 8-bit value
        // -    +2/-2: unsigned/signed 16-bit value
        // -    +4/-4: unsigned/signed 32-bit value
        // -    0.4/0.8: 32-bit/64-bit float
        return_bytes,
        // An ArrayBuffer or compatible type of data containing encoded parameters to send.
        param_array
    ) {
        if (this.is_sim) {
            return [0, ""];
        }

        await characteristic.writeValue(param_array);
        // Read the returned data.
        let return_data = await characteristic.readValue();
        // Interpret the return value.
        let return_value;
        switch (return_bytes) {
            case 0:
            return_value = undefined;
            break;

            case 1:
            return_value = return_data.getUint8(0);
            break;

            case -1:
            return_value = return_data.getInt8(0);
            break;

            case 2:
            return_value = return_data.getUint16(0);
            break;

            case -2:
            return_value = return_data.getInt16(0, this.is_little_endian);
            break;

            case 4:
            return_value = return_data.getUint32(0, this.is_little_endian);
            break;

            case -4:
            return_value = return_data.getInt32(0, this.is_little_endian);
            break;

            case 0.4:
            return_value = return_data.getFloat32(0, this.is_little_endian);
            return_bytes = 4;
            break;

            case 0.8:
            return_value = return_data.getFloat64(0, this.is_little_endian);
            return_bytes = 8;
            break;

        }

        let message = return_data.buffer.slice(return_bytes);
        message = String.fromCharCode.apply(null, new Uint8Array(message));
        if (!this.verbose_return) {
            throw `BLE protocol error: ${message}`
        }
        return [return_value, message];
    }

    // Return an existing instance of a ``BluetoothRemoteGATTCharacteristic`` or create a new one.
    async get_characteristic(name) {
        if (this.is_sim) {
            return name;
        }

        if (name in this.characteristic) {
            return this.characteristic[name];
        }
        return this.characteristic[name] = await this.service.getCharacteristic(this.uuid[name]);
    }

    // Reset the hardware on the connected device.
    async resetHardware() {
        // Any write is fine -- just send 1 byte.
        return this.invoke_Arduino(await this.get_characteristic("resetHardware"), 0, new Uint8Array([1]));
    }

    // Invoke `pinMode <https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/>`_ on the Arduino.
    async pinMode(u8_pin, u8_mode) {
        return this.invoke_Arduino(await this.get_characteristic("pinMode"), 0, new Uint8Array([u8_pin, u8_mode]));
    }

    // Invoke `digitalWrite <https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/>`_ on the Arduino.
    async digitalWrite(u8_pin, u8_value) {
        return this.invoke_Arduino(await this.get_characteristic("digitalWrite"), 0, new Uint8Array([u8_pin, u8_value]));
    }

    // Invoke `digitalRead <https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/>`_ on the Arduino.
    async digitalRead(u8_pin) {
        return this.invoke_Arduino(await this.get_characteristic("digitalRead"), 1, new Uint8Array([u8_pin]));
    }

    // Invoke ``ledcSetup`` on the Arduino.
    //
    // Note that the LEDC control on the ESP32 Arduino port isn't documented. Here's my attempts. The best reference is the `LED_PWM chapter of the ESP32 Technical Reference Manual <https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf#page=384>`_. To set up PWM, you need to select:
    //
    // -    A channel (channels 0-7 auto-update new PWM periods, channels 8-15 don't).
    // -    The frequency to do the PWM, in Hz.
    // -    A number of bits used to do the PWM. The maximum possible value is floor(log2(processor clock frequency/PWM frequency)); this cannot exceed 20. The processor clock frequency is either 80 MHz or 1 MHz.
    //
    // The function returns the actual PWM frequency, due to the limitations of the available clock divisor.
    async ledcSetup(u8_channel, d_freq, u8_resolution_bits) {
        let param_array = new ArrayBuffer(11);
        let dv = new DataView(param_array);
        dv.setUint8(0, u8_channel);
        dv.setFloat64(1, d_freq, this.is_little_endian);
        dv.setUint8(10, u8_resolution_bits);
        return this.invoke_Arduino(await this.get_characteristic("ledcSetup"), 0.8, param_array);
    }

    // Invoke ``ledcAttachPin`` on the Arduino.
    //
    // Next, attach this channel to a specific pin on the Arduino.
    async ledcAttachPin(u8_pin, u8_channel) {
        return this.invoke_Arduino(await this.get_characteristic("ledcAttachPin"), 0, new Uint8Array([u8_pin, u8_channel]));
    }

    // Invoke ``ledcWrite`` on the Arduino.
    //
    // Finally, select a duty cycle for that channel, from 2^num_bits to 1.
    async ledcWrite(u8_channel, u32_duty) {
        let param_array = new ArrayBuffer(5);
        let dv = new DataView(param_array);
        dv.setUint8(0, u8_channel);
        dv.setUint32(1, u32_duty, this.is_little_endian);
        return this.invoke_Arduino(await this.get_characteristic("ledcWrite"), 0, param_array);
    }

    // Invoke ``ledcDetachPin`` on the Arduino.
    //
    // Next, attach this channel to a specific pin on the Arduino.
    async ledcDetachPin(u8_pin) {
        return this.invoke_Arduino(await this.get_characteristic("ledcDetachPin"), 0, new Uint8Array([u8_pin]));
    }
}


// CellBotBleGui
// =============
// Provide a simple pair/disconnect GUI for the CellBot Bluetooth connection.
class CellBotBleGui {
    constructor(pair_button_id, pair_status_id) {
        (0,_auto_bind_js__WEBPACK_IMPORTED_MODULE_0__.auto_bind)(this);

        this.ble_pair_button = document.getElementById(pair_button_id);
        this.ble_pair_status = document.getElementById(pair_status_id);

        // If the GUI isn't available, give up.
        if (!this.ble_pair_button || !this.ble_pair_status) {
            return;
        }

        this.cell_bot_ble = new CellBotBle();
        // Update the pair button based on BLE availability.
        this.cell_bot_ble.has_ble(this.on_availability_changed).then(this.on_ble_available);
        // Respond to button clicks.
        this.ble_pair_button.addEventListener("click", event => {
            this.async_on_pair_clicked();
        })
    }

    async async_on_pair_clicked() {
        if (!this.cell_bot_ble.paired()) {
            this.ble_pair_button.disabled = true;
            this.ble_pair_status.innerHTML = "Pairing...";
            try {
                await this.cell_bot_ble.pair(this.on_disconnect);
                this.ble_pair_status.innerHTML = `Paired to ${this.cell_bot_ble.device.name}.`;
                this.ble_pair_button.innerHTML = "Disconnect";

            } catch (err) {
                this.ble_pair_status.innerHTML = "Unable to pair.";
                throw err;
            } finally {
                this.ble_pair_button.disabled = false;
            }

        } else {
            this.cell_bot_ble.server.disconnect();
        }
    }

    on_availability_changed(event) {
        // TODO: I don't know what the structure of this event is.
        console.log(event);
    }

    on_ble_available(has_ble) {
        this.ble_pair_button.disabled = !has_ble;
        if (has_ble) {
            this.ble_pair_status.innerHTML = "Not connected.";
        } else {
            this.ble_pair_status.innerHTML = "Not available.";
        }
    }

    on_disconnect() {
        this.ble_pair_status.innerHTML = "Disconnected.";
        this.ble_pair_button.innerHTML = "Pair";
    }
}


// An instance of this class.
let cell_bot_ble_gui;

// Handler
// =======
// This must be invoked when the DOM is ready, before calling any other function in this file.
$(document).ready(function () {
    cell_bot_ble_gui = new CellBotBleGui("ble_pair_button", "ble_pair_status");
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NlbGxib3RpY3NfanNfYmxlX2pzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7OztBQUdiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7OztBQUdBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRThCOztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx3REFBUzs7QUFFakI7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUlBQXFJO0FBQ3JJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQVM7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCw4QkFBOEI7QUFDNUY7O0FBRUEsY0FBYztBQUNkO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL2F1dG8tYmluZC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NlbGxib3RpY3MvanMvYmxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIC4uIENvcHlyaWdodCAoQykgMjAxMi0yMDIwIEJyeWFuIEEuIEpvbmVzLlxuLy9cbi8vICBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQ2VsbEJvdGljcyBzeXN0ZW0uXG4vL1xuLy8gIFRoZSBDZWxsQm90aWNzIHN5c3RlbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3Jcbi8vICBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhc1xuLy8gIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZVxuLy8gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gIFRoZSBDZWxsQm90aWNzIHN5c3RlbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmVcbi8vICB1c2VmdWwsIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5XG4vLyAgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZSBHTlVcbi8vICBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyAgYWxvbmcgd2l0aCB0aGUgQ2VsbEJvdGljcyBzeXN0ZW0uICBJZiBub3QsIHNlZVxuLy8gIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbi8vXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIEF1dG9tYXRpY2FsbHkgYmluZCBtZXRob2RzIHRvIHRoZWlyIGluc3RhbmNlc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8vIFRoZSBmb2xsb3dpbmcgdHdvIGZ1bmN0aW9ucyB3ZXJlIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hdXRvLWJpbmQvYmxvYi9tYXN0ZXIvaW5kZXguanMgYW5kIGxpZ2h0bHkgbW9kaWZpZWQuIFRoZXkgcHJvdmlkZSBhbiBlYXN5IHdheSB0byBiaW5kIGFsbCBjYWxsYWJsZSBtZXRob2RzIHRvIHRoZWlyIGluc3RhbmNlLiBTZWUgYEJpbmRpbmcgTWV0aG9kcyB0byBDbGFzcyBJbnN0YW5jZSBPYmplY3RzIDxodHRwczovL3Bvbnlmb28uY29tL2FydGljbGVzL2JpbmRpbmctbWV0aG9kcy10by1jbGFzcy1pbnN0YW5jZS1vYmplY3RzPmBfIGZvciBtb3JlIGRpc2N1c3Npb24gb24gdGhpcyBjcmF6eSBKYXZhU2NyaXB0IG5lY2Vzc2l0eS5cbi8vXG4vLyBHZXRzIGFsbCBub24tYnVpbHRpbiBwcm9wZXJ0aWVzIHVwIHRoZSBwcm90b3R5cGUgY2hhaW5cbmNvbnN0IGdldEFsbFByb3BlcnRpZXMgPSBvYmplY3QgPT4ge1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gbmV3IFNldCgpO1xuXG5cdGRvIHtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMob2JqZWN0KSkge1xuXHRcdFx0cHJvcGVydGllcy5hZGQoW29iamVjdCwga2V5XSk7XG5cdFx0fVxuXHR9IHdoaWxlICgob2JqZWN0ID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpKSAmJiBvYmplY3QgIT09IE9iamVjdC5wcm90b3R5cGUpO1xuXG5cdHJldHVybiBwcm9wZXJ0aWVzO1xufTtcblxuXG4vLyBJbnZva2UgdGhpcyBpbiB0aGUgY29uc3RydWN0b3Igb2YgYW4gb2JqZWN0LlxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9fYmluZChzZWxmKSB7XG4gICAgZm9yIChjb25zdCBbb2JqZWN0LCBrZXldIG9mIGdldEFsbFByb3BlcnRpZXMoc2VsZi5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHNlbGZba2V5XSA9IHNlbGZba2V5XS5iaW5kKHNlbGYpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gLi4gQ29weXJpZ2h0IChDKSAyMDEyLTIwMjAgQnJ5YW4gQS4gSm9uZXMuXG4vL1xuLy8gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBDZWxsQm90aWNzIHN5c3RlbS5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuLy8gIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4vLyAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4vLyAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZVxuLy8gIHVzZWZ1bCwgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHlcbi8vICBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlIEdOVVxuLy8gIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vICBhbG9uZyB3aXRoIHRoZSBDZWxsQm90aWNzIHN5c3RlbS4gIElmIG5vdCwgc2VlXG4vLyAgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIEphdmFTY3JpcHQgY29kZSB0byBjb25uZWN0IHdpdGggYSBDZWxsQm90IHZpYSBCTEVcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IGF1dG9fYmluZCB9IGZyb20gXCIuL2F1dG8tYmluZC5qc1wiO1xuXG4vLyBDZWxsQm90QmxlXG4vLyA9PT09PT09PT09XG4vLyBUaGlzIHNlbmRzIGFuZCByZWNlaXZlcyBkYXRhIHRvIHRoZSBDZWxsQm90IHZpYSBCbHVldG9vdGguXG5jbGFzcyBDZWxsQm90QmxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgYXV0b19iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY2xlYXJfY29ubmVjdGlvbigpO1xuICAgICAgICAvLyBJZiB0cnVlLCB0aGUgc2VydmVyIChCTEUgZGV2aWNlIC8gQ2VsbEJvdCkgaXMgbGl0dGxlLWVuZGlhbjsgaWYgZmFsc2UsIGJpZy1lbmRpYW4uXG4gICAgICAgIHRoaXMuaXNfbGl0dGxlX2VuZGlhbiA9IHRydWU7XG4gICAgICAgIC8vIElmIHRydWUsIGV4cGVjdCB2ZXJib3NlIHJldHVybnMgKHRoZSBDZWxsQm90IHdhcyBjb21waWxlZCB3aXRoIGBgVkVSQk9TRV9SRVRVUk5gYCBkZWZpbmVkKS5cbiAgICAgICAgdGhpcy52ZXJib3NlX3JldHVybiA9IHRydWU7XG4gICAgICAgIC8vIElmIHRydWUsIHJldHVybiBkdW1teSB2YWx1ZXMgaW5zdGVhZCBvZiB0YWxraW5nIHRvIHRoZSBoYXJkd2FyZS5cbiAgICAgICAgdGhpcy5pc19zaW0gPSBmYWxzZTtcblxuICAgICAgICAvLyAjZGVmaW5lcyBmcm9tIEFyZHVpbm8gaGVhZGVycy5cbiAgICAgICAgdGhpcy5JTlBVVCA9IDE7XG4gICAgICAgIHRoaXMuT1VUUFVUID0gMjtcblxuICAgICAgICAvLyBVVUlEcyBmb3IgZWFjaCBjaGFyYWN0ZXJpc3RpYy5cbiAgICAgICAgdGhpcy51dWlkID0ge1xuICAgICAgICAgICAgcmVzZXRIYXJkd2FyZTogXCI2MGNiMTgwZS04MzhkLTRmNjUtYWZmNC0yMGI2MDliNDUzZjNcIixcbiAgICAgICAgICAgIHBpbk1vZGU6IFwiNmVhNmQ5YjYtN2I3ZS00NTFjLWFiNDUtMjIxMjk4ZTQzNTYyXCIsXG4gICAgICAgICAgICBkaWdpdGFsV3JpdGU6IFwiZDM0MjNjZjYtNmRhNy00ZGQ4LWE1YmEtM2M5ODBjNzRiZDZkXCIsXG4gICAgICAgICAgICBkaWdpdGFsUmVhZDogXCJjMzcwYmM3OS0xMWMxLTQ1MzAtOWY2OS1hYjlkOTYxYWE0OTdcIixcbiAgICAgICAgICAgIGxlZGNTZXR1cDogXCI2YmU1N2NlYS0zYzQ2LTQ2ODctOTcyYi0wMzQyOWQyYWNmOWJcIixcbiAgICAgICAgICAgIGxlZGNBdHRhY2hQaW46IFwiMmNkNjM4NjEtMDc4Zi00MzZmLTllZDktNzllNTdlYzhiNjM4XCIsXG4gICAgICAgICAgICBsZWRjRGV0YWNoUGluOiBcImI5YjBjYWJlLTI1ZDgtNDk2NS05MjU5LTdkM2I2MzMwZTk0MFwiLFxuICAgICAgICAgICAgbGVkY1dyaXRlOiBcIjQwNjk4MDMwLWEzNDMtNDQ4Zi1hOWVhLTU0YjM5YjAzYmY4MVwiXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgQmx1ZXRvb3RoIGNvbm5lY3Rpb24tcmVsYXRlZCBvYmplY3RzLlxuICAgIGNsZWFyX2Nvbm5lY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VydmVyICYmIHRoaXMuc2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc2VydmljZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gQSBkaWN0IG9mIG5hbWU6IGBgQmx1ZXRvb3RoUmVtb3RlR0FUVENoYXJhY3RlcmlzdGljYGAuXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyaXN0aWMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiBCTEUgaXMgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlci4gRXZlbiBpZiBpdCBpcyBzdXBwb3J0ZWQsIGl0IG1heSBub3QgYmUgYXZhaWxhYmxlLlxuICAgIGlzX2JsZV9zdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKG5hdmlnYXRvci5ibHVldG9vdGgpO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0cnVlIGlzIEJMRSBpcyBzdXBwb3J0ZWQuIElmIHNvLCByZWdpc3RlciB0aGUgcHJvdmlkZWQgZXZlbnQgaGFuZGxlci5cbiAgICBhc3luYyBoYXNfYmxlKG9uX2F2YWlsYWJpbGl0eV9jaGFuZ2VkKSB7XG4gICAgICAgIGlmICh0aGlzLmlzX3NpbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc19ibGVfc3VwcG9ydGVkKCkgJiYgYXdhaXQgbmF2aWdhdG9yLmJsdWV0b290aC5nZXRBdmFpbGFiaWxpdHkoKSkge1xuICAgICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5hZGRFdmVudExpc3RlbmVyKFwiYXZhaWxhYmlsaXR5Y2hhbmdlZFwiLCBvbl9hdmFpbGFiaWxpdHlfY2hhbmdlZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZiB0aGUgQmx1ZXRvb3RoIGRldmljZSAoc2VydmVyKSBpcyBjb25uZWN0ZWQuXG4gICAgcGFpcmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc19zaW0gfHwgKHRoaXMuc2VydmVyICYmIHRoaXMuc2VydmVyLmNvbm5lY3RlZCk7XG4gICAgfVxuXG4gICAgLy8gUGFpciB3aXRoIGEgQ2VsbEJvdCBhbmQgcmV0dXJuIHRoZSBjaGFyYWN0ZXJpc3RpYyB1c2VkIHRvIGNvbnRyb2wgdGhlIGRldmljZS5cbiAgICBhc3luYyBwYWlyKGRpc2Nvbm5lY3RfY2FsbGJhY2spXG4gICAge1xuICAgICAgICBpZiAodGhpcy5pc19zaW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNraXAgY29ubmVjdGluZyBpZiB3ZSdyZSBhbHJlYWR5IGNvbm5lY3RlZC5cbiAgICAgICAgaWYgKHRoaXMucGFpcmVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNodXQgZG93biBhbnkgcmVtbmFudHMgb2YgYSBwcmV2aW91cyBjb25uZWN0aW9uLlxuICAgICAgICB0aGlzLmNsZWFyX2Nvbm5lY3Rpb24oKTtcblxuICAgICAgICAvLyBSZXF1ZXN0IGEgZGV2aWNlIHdpdGggc2VydmljZSBgVVVJRHNgLiBTZWUgdGhlIGBCbHVldG9vdGggQVBJIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQmx1ZXRvb3RoPmBfLlxuICAgICAgICBsZXQgY2VsbEJvdF9zZXJ2aWNlID0gXCI2YzUzMzc5My05YmQ2LTQ3ZDYtOGQzYi1jMTBhNzA0YjZiOTdcIjtcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBhd2FpdCBuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2Uoe1xuICAgICAgICAgICAgZmlsdGVyczogW3tcbiAgICAgICAgICAgICAgICBzZXJ2aWNlczogW2NlbGxCb3Rfc2VydmljZV1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5vdGlmeSBvbiBhIGRpc2Nvbm5lY3QuIEkgY2FuJ3QgZmluZCBhbnkgZG9jcyBvbiB0aGlzLCBidXQgaXQgZG9lcyB3b3JrLlxuICAgICAgICB0aGlzLmRldmljZS5hZGRFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJywgZGlzY29ubmVjdF9jYWxsYmFjayk7XG4gICAgICAgIHRoaXMuZGV2aWNlLmFkZEV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLCB0aGlzLmNsZWFyX2Nvbm5lY3Rpb24pO1xuXG4gICAgICAgIC8vIENvbm5lY3QgdG8gaXRzIHNlcnZlci5cbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBhd2FpdCB0aGlzLmRldmljZS5nYXR0LmNvbm5lY3QoKTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNlcnZpY2UgZm9yIG91ciBzZXJ2ZXIuXG4gICAgICAgIHRoaXMuc2VydmljZSA9IGF3YWl0IHRoaXMuc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKGNlbGxCb3Rfc2VydmljZSk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJpYyBhY2Nlc3MgZnVuY3Rpb24gZm9yIGNhbGxpbmcgYSBmdW5jdGlvbiBvbiB0aGUgQXJkdWluby4gSXQgcmV0dXJucyAodmFsdWUgcmV0dXJuZWQgYWZ0ZXIgaW52b2tpbmcgdGhlIGZ1bmN0aW9uLCBtZXNzYWdlKS5cbiAgICBhc3luYyBpbnZva2VfQXJkdWlubyhcbiAgICAgICAgLy8gVGhlIEJsdWV0b290aCBjaGFyYWN0ZXJpc3RpYyB0byB1c2UgZm9yIHRoaXMgY2FsbC5cbiAgICAgICAgY2hhcmFjdGVyaXN0aWMsXG4gICAgICAgIC8vIFRoZSBudW1iZXIgb2YgYnl0ZXMgaW4gdGhlIHJldHVybiB2YWx1ZTpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gLSAgICAwOiB2b2lkXG4gICAgICAgIC8vIC0gICAgKzEvLTE6IHVuc2lnbmVkL3NpZ25lZCA4LWJpdCB2YWx1ZVxuICAgICAgICAvLyAtICAgICsyLy0yOiB1bnNpZ25lZC9zaWduZWQgMTYtYml0IHZhbHVlXG4gICAgICAgIC8vIC0gICAgKzQvLTQ6IHVuc2lnbmVkL3NpZ25lZCAzMi1iaXQgdmFsdWVcbiAgICAgICAgLy8gLSAgICAwLjQvMC44OiAzMi1iaXQvNjQtYml0IGZsb2F0XG4gICAgICAgIHJldHVybl9ieXRlcyxcbiAgICAgICAgLy8gQW4gQXJyYXlCdWZmZXIgb3IgY29tcGF0aWJsZSB0eXBlIG9mIGRhdGEgY29udGFpbmluZyBlbmNvZGVkIHBhcmFtZXRlcnMgdG8gc2VuZC5cbiAgICAgICAgcGFyYW1fYXJyYXlcbiAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuaXNfc2ltKSB7XG4gICAgICAgICAgICByZXR1cm4gWzAsIFwiXCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShwYXJhbV9hcnJheSk7XG4gICAgICAgIC8vIFJlYWQgdGhlIHJldHVybmVkIGRhdGEuXG4gICAgICAgIGxldCByZXR1cm5fZGF0YSA9IGF3YWl0IGNoYXJhY3RlcmlzdGljLnJlYWRWYWx1ZSgpO1xuICAgICAgICAvLyBJbnRlcnByZXQgdGhlIHJldHVybiB2YWx1ZS5cbiAgICAgICAgbGV0IHJldHVybl92YWx1ZTtcbiAgICAgICAgc3dpdGNoIChyZXR1cm5fYnl0ZXMpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSByZXR1cm5fZGF0YS5nZXRVaW50OCgwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gcmV0dXJuX2RhdGEuZ2V0SW50OCgwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSByZXR1cm5fZGF0YS5nZXRVaW50MTYoMCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAtMjpcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHJldHVybl9kYXRhLmdldEludDE2KDAsIHRoaXMuaXNfbGl0dGxlX2VuZGlhbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gcmV0dXJuX2RhdGEuZ2V0VWludDMyKDAsIHRoaXMuaXNfbGl0dGxlX2VuZGlhbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAtNDpcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHJldHVybl9kYXRhLmdldEludDMyKDAsIHRoaXMuaXNfbGl0dGxlX2VuZGlhbik7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAwLjQ6XG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSByZXR1cm5fZGF0YS5nZXRGbG9hdDMyKDAsIHRoaXMuaXNfbGl0dGxlX2VuZGlhbik7XG4gICAgICAgICAgICByZXR1cm5fYnl0ZXMgPSA0O1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMC44OlxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gcmV0dXJuX2RhdGEuZ2V0RmxvYXQ2NCgwLCB0aGlzLmlzX2xpdHRsZV9lbmRpYW4pO1xuICAgICAgICAgICAgcmV0dXJuX2J5dGVzID0gODtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWVzc2FnZSA9IHJldHVybl9kYXRhLmJ1ZmZlci5zbGljZShyZXR1cm5fYnl0ZXMpO1xuICAgICAgICBtZXNzYWdlID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDhBcnJheShtZXNzYWdlKSk7XG4gICAgICAgIGlmICghdGhpcy52ZXJib3NlX3JldHVybikge1xuICAgICAgICAgICAgdGhyb3cgYEJMRSBwcm90b2NvbCBlcnJvcjogJHttZXNzYWdlfWBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3JldHVybl92YWx1ZSwgbWVzc2FnZV07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGV4aXN0aW5nIGluc3RhbmNlIG9mIGEgYGBCbHVldG9vdGhSZW1vdGVHQVRUQ2hhcmFjdGVyaXN0aWNgYCBvciBjcmVhdGUgYSBuZXcgb25lLlxuICAgIGFzeW5jIGdldF9jaGFyYWN0ZXJpc3RpYyhuYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmlzX3NpbSkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSBpbiB0aGlzLmNoYXJhY3RlcmlzdGljKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJpc3RpY1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJpc3RpY1tuYW1lXSA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLnV1aWRbbmFtZV0pO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IHRoZSBoYXJkd2FyZSBvbiB0aGUgY29ubmVjdGVkIGRldmljZS5cbiAgICBhc3luYyByZXNldEhhcmR3YXJlKCkge1xuICAgICAgICAvLyBBbnkgd3JpdGUgaXMgZmluZSAtLSBqdXN0IHNlbmQgMSBieXRlLlxuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2VfQXJkdWlubyhhd2FpdCB0aGlzLmdldF9jaGFyYWN0ZXJpc3RpYyhcInJlc2V0SGFyZHdhcmVcIiksIDAsIG5ldyBVaW50OEFycmF5KFsxXSkpO1xuICAgIH1cblxuICAgIC8vIEludm9rZSBgcGluTW9kZSA8aHR0cHM6Ly93d3cuYXJkdWluby5jYy9yZWZlcmVuY2UvZW4vbGFuZ3VhZ2UvZnVuY3Rpb25zL2RpZ2l0YWwtaW8vcGlubW9kZS8+YF8gb24gdGhlIEFyZHVpbm8uXG4gICAgYXN5bmMgcGluTW9kZSh1OF9waW4sIHU4X21vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlX0FyZHVpbm8oYXdhaXQgdGhpcy5nZXRfY2hhcmFjdGVyaXN0aWMoXCJwaW5Nb2RlXCIpLCAwLCBuZXcgVWludDhBcnJheShbdThfcGluLCB1OF9tb2RlXSkpO1xuICAgIH1cblxuICAgIC8vIEludm9rZSBgZGlnaXRhbFdyaXRlIDxodHRwczovL3d3dy5hcmR1aW5vLmNjL3JlZmVyZW5jZS9lbi9sYW5ndWFnZS9mdW5jdGlvbnMvZGlnaXRhbC1pby9kaWdpdGFsd3JpdGUvPmBfIG9uIHRoZSBBcmR1aW5vLlxuICAgIGFzeW5jIGRpZ2l0YWxXcml0ZSh1OF9waW4sIHU4X3ZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwiZGlnaXRhbFdyaXRlXCIpLCAwLCBuZXcgVWludDhBcnJheShbdThfcGluLCB1OF92YWx1ZV0pKTtcbiAgICB9XG5cbiAgICAvLyBJbnZva2UgYGRpZ2l0YWxSZWFkIDxodHRwczovL3d3dy5hcmR1aW5vLmNjL3JlZmVyZW5jZS9lbi9sYW5ndWFnZS9mdW5jdGlvbnMvZGlnaXRhbC1pby9kaWdpdGFscmVhZC8+YF8gb24gdGhlIEFyZHVpbm8uXG4gICAgYXN5bmMgZGlnaXRhbFJlYWQodThfcGluKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwiZGlnaXRhbFJlYWRcIiksIDEsIG5ldyBVaW50OEFycmF5KFt1OF9waW5dKSk7XG4gICAgfVxuXG4gICAgLy8gSW52b2tlIGBgbGVkY1NldHVwYGAgb24gdGhlIEFyZHVpbm8uXG4gICAgLy9cbiAgICAvLyBOb3RlIHRoYXQgdGhlIExFREMgY29udHJvbCBvbiB0aGUgRVNQMzIgQXJkdWlubyBwb3J0IGlzbid0IGRvY3VtZW50ZWQuIEhlcmUncyBteSBhdHRlbXB0cy4gVGhlIGJlc3QgcmVmZXJlbmNlIGlzIHRoZSBgTEVEX1BXTSBjaGFwdGVyIG9mIHRoZSBFU1AzMiBUZWNobmljYWwgUmVmZXJlbmNlIE1hbnVhbCA8aHR0cHM6Ly93d3cuZXNwcmVzc2lmLmNvbS9zaXRlcy9kZWZhdWx0L2ZpbGVzL2RvY3VtZW50YXRpb24vZXNwMzJfdGVjaG5pY2FsX3JlZmVyZW5jZV9tYW51YWxfZW4ucGRmI3BhZ2U9Mzg0PmBfLiBUbyBzZXQgdXAgUFdNLCB5b3UgbmVlZCB0byBzZWxlY3Q6XG4gICAgLy9cbiAgICAvLyAtICAgIEEgY2hhbm5lbCAoY2hhbm5lbHMgMC03IGF1dG8tdXBkYXRlIG5ldyBQV00gcGVyaW9kcywgY2hhbm5lbHMgOC0xNSBkb24ndCkuXG4gICAgLy8gLSAgICBUaGUgZnJlcXVlbmN5IHRvIGRvIHRoZSBQV00sIGluIEh6LlxuICAgIC8vIC0gICAgQSBudW1iZXIgb2YgYml0cyB1c2VkIHRvIGRvIHRoZSBQV00uIFRoZSBtYXhpbXVtIHBvc3NpYmxlIHZhbHVlIGlzIGZsb29yKGxvZzIocHJvY2Vzc29yIGNsb2NrIGZyZXF1ZW5jeS9QV00gZnJlcXVlbmN5KSk7IHRoaXMgY2Fubm90IGV4Y2VlZCAyMC4gVGhlIHByb2Nlc3NvciBjbG9jayBmcmVxdWVuY3kgaXMgZWl0aGVyIDgwIE1IeiBvciAxIE1Iei5cbiAgICAvL1xuICAgIC8vIFRoZSBmdW5jdGlvbiByZXR1cm5zIHRoZSBhY3R1YWwgUFdNIGZyZXF1ZW5jeSwgZHVlIHRvIHRoZSBsaW1pdGF0aW9ucyBvZiB0aGUgYXZhaWxhYmxlIGNsb2NrIGRpdmlzb3IuXG4gICAgYXN5bmMgbGVkY1NldHVwKHU4X2NoYW5uZWwsIGRfZnJlcSwgdThfcmVzb2x1dGlvbl9iaXRzKSB7XG4gICAgICAgIGxldCBwYXJhbV9hcnJheSA9IG5ldyBBcnJheUJ1ZmZlcigxMSk7XG4gICAgICAgIGxldCBkdiA9IG5ldyBEYXRhVmlldyhwYXJhbV9hcnJheSk7XG4gICAgICAgIGR2LnNldFVpbnQ4KDAsIHU4X2NoYW5uZWwpO1xuICAgICAgICBkdi5zZXRGbG9hdDY0KDEsIGRfZnJlcSwgdGhpcy5pc19saXR0bGVfZW5kaWFuKTtcbiAgICAgICAgZHYuc2V0VWludDgoMTAsIHU4X3Jlc29sdXRpb25fYml0cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwibGVkY1NldHVwXCIpLCAwLjgsIHBhcmFtX2FycmF5KTtcbiAgICB9XG5cbiAgICAvLyBJbnZva2UgYGBsZWRjQXR0YWNoUGluYGAgb24gdGhlIEFyZHVpbm8uXG4gICAgLy9cbiAgICAvLyBOZXh0LCBhdHRhY2ggdGhpcyBjaGFubmVsIHRvIGEgc3BlY2lmaWMgcGluIG9uIHRoZSBBcmR1aW5vLlxuICAgIGFzeW5jIGxlZGNBdHRhY2hQaW4odThfcGluLCB1OF9jaGFubmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwibGVkY0F0dGFjaFBpblwiKSwgMCwgbmV3IFVpbnQ4QXJyYXkoW3U4X3BpbiwgdThfY2hhbm5lbF0pKTtcbiAgICB9XG5cbiAgICAvLyBJbnZva2UgYGBsZWRjV3JpdGVgYCBvbiB0aGUgQXJkdWluby5cbiAgICAvL1xuICAgIC8vIEZpbmFsbHksIHNlbGVjdCBhIGR1dHkgY3ljbGUgZm9yIHRoYXQgY2hhbm5lbCwgZnJvbSAyXm51bV9iaXRzIHRvIDEuXG4gICAgYXN5bmMgbGVkY1dyaXRlKHU4X2NoYW5uZWwsIHUzMl9kdXR5KSB7XG4gICAgICAgIGxldCBwYXJhbV9hcnJheSA9IG5ldyBBcnJheUJ1ZmZlcig1KTtcbiAgICAgICAgbGV0IGR2ID0gbmV3IERhdGFWaWV3KHBhcmFtX2FycmF5KTtcbiAgICAgICAgZHYuc2V0VWludDgoMCwgdThfY2hhbm5lbCk7XG4gICAgICAgIGR2LnNldFVpbnQzMigxLCB1MzJfZHV0eSwgdGhpcy5pc19saXR0bGVfZW5kaWFuKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlX0FyZHVpbm8oYXdhaXQgdGhpcy5nZXRfY2hhcmFjdGVyaXN0aWMoXCJsZWRjV3JpdGVcIiksIDAsIHBhcmFtX2FycmF5KTtcbiAgICB9XG5cbiAgICAvLyBJbnZva2UgYGBsZWRjRGV0YWNoUGluYGAgb24gdGhlIEFyZHVpbm8uXG4gICAgLy9cbiAgICAvLyBOZXh0LCBhdHRhY2ggdGhpcyBjaGFubmVsIHRvIGEgc3BlY2lmaWMgcGluIG9uIHRoZSBBcmR1aW5vLlxuICAgIGFzeW5jIGxlZGNEZXRhY2hQaW4odThfcGluKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwibGVkY0RldGFjaFBpblwiKSwgMCwgbmV3IFVpbnQ4QXJyYXkoW3U4X3Bpbl0pKTtcbiAgICB9XG59XG5cblxuLy8gQ2VsbEJvdEJsZUd1aVxuLy8gPT09PT09PT09PT09PVxuLy8gUHJvdmlkZSBhIHNpbXBsZSBwYWlyL2Rpc2Nvbm5lY3QgR1VJIGZvciB0aGUgQ2VsbEJvdCBCbHVldG9vdGggY29ubmVjdGlvbi5cbmNsYXNzIENlbGxCb3RCbGVHdWkge1xuICAgIGNvbnN0cnVjdG9yKHBhaXJfYnV0dG9uX2lkLCBwYWlyX3N0YXR1c19pZCkge1xuICAgICAgICBhdXRvX2JpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5ibGVfcGFpcl9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYWlyX2J1dHRvbl9pZCk7XG4gICAgICAgIHRoaXMuYmxlX3BhaXJfc3RhdHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFpcl9zdGF0dXNfaWQpO1xuXG4gICAgICAgIC8vIElmIHRoZSBHVUkgaXNuJ3QgYXZhaWxhYmxlLCBnaXZlIHVwLlxuICAgICAgICBpZiAoIXRoaXMuYmxlX3BhaXJfYnV0dG9uIHx8ICF0aGlzLmJsZV9wYWlyX3N0YXR1cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jZWxsX2JvdF9ibGUgPSBuZXcgQ2VsbEJvdEJsZSgpO1xuICAgICAgICAvLyBVcGRhdGUgdGhlIHBhaXIgYnV0dG9uIGJhc2VkIG9uIEJMRSBhdmFpbGFiaWxpdHkuXG4gICAgICAgIHRoaXMuY2VsbF9ib3RfYmxlLmhhc19ibGUodGhpcy5vbl9hdmFpbGFiaWxpdHlfY2hhbmdlZCkudGhlbih0aGlzLm9uX2JsZV9hdmFpbGFibGUpO1xuICAgICAgICAvLyBSZXNwb25kIHRvIGJ1dHRvbiBjbGlja3MuXG4gICAgICAgIHRoaXMuYmxlX3BhaXJfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLmFzeW5jX29uX3BhaXJfY2xpY2tlZCgpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIGFzeW5jX29uX3BhaXJfY2xpY2tlZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNlbGxfYm90X2JsZS5wYWlyZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9zdGF0dXMuaW5uZXJIVE1MID0gXCJQYWlyaW5nLi4uXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2VsbF9ib3RfYmxlLnBhaXIodGhpcy5vbl9kaXNjb25uZWN0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmJsZV9wYWlyX3N0YXR1cy5pbm5lckhUTUwgPSBgUGFpcmVkIHRvICR7dGhpcy5jZWxsX2JvdF9ibGUuZGV2aWNlLm5hbWV9LmA7XG4gICAgICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9idXR0b24uaW5uZXJIVE1MID0gXCJEaXNjb25uZWN0XCI7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxlX3BhaXJfc3RhdHVzLmlubmVySFRNTCA9IFwiVW5hYmxlIHRvIHBhaXIuXCI7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJsZV9wYWlyX2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNlbGxfYm90X2JsZS5zZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25fYXZhaWxhYmlsaXR5X2NoYW5nZWQoZXZlbnQpIHtcbiAgICAgICAgLy8gVE9ETzogSSBkb24ndCBrbm93IHdoYXQgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIGV2ZW50IGlzLlxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgfVxuXG4gICAgb25fYmxlX2F2YWlsYWJsZShoYXNfYmxlKSB7XG4gICAgICAgIHRoaXMuYmxlX3BhaXJfYnV0dG9uLmRpc2FibGVkID0gIWhhc19ibGU7XG4gICAgICAgIGlmIChoYXNfYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmJsZV9wYWlyX3N0YXR1cy5pbm5lckhUTUwgPSBcIk5vdCBjb25uZWN0ZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJsZV9wYWlyX3N0YXR1cy5pbm5lckhUTUwgPSBcIk5vdCBhdmFpbGFibGUuXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbl9kaXNjb25uZWN0KCkge1xuICAgICAgICB0aGlzLmJsZV9wYWlyX3N0YXR1cy5pbm5lckhUTUwgPSBcIkRpc2Nvbm5lY3RlZC5cIjtcbiAgICAgICAgdGhpcy5ibGVfcGFpcl9idXR0b24uaW5uZXJIVE1MID0gXCJQYWlyXCI7XG4gICAgfVxufVxuXG5cbi8vIEFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MuXG5leHBvcnQgbGV0IGNlbGxfYm90X2JsZV9ndWk7XG5cbi8vIEhhbmRsZXJcbi8vID09PT09PT1cbi8vIFRoaXMgbXVzdCBiZSBpbnZva2VkIHdoZW4gdGhlIERPTSBpcyByZWFkeSwgYmVmb3JlIGNhbGxpbmcgYW55IG90aGVyIGZ1bmN0aW9uIGluIHRoaXMgZmlsZS5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBjZWxsX2JvdF9ibGVfZ3VpID0gbmV3IENlbGxCb3RCbGVHdWkoXCJibGVfcGFpcl9idXR0b25cIiwgXCJibGVfcGFpcl9zdGF0dXNcIik7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==