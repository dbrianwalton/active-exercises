"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_cellbotics_js_ble_js"],{

/***/ 34630:
/*!**********************************************!*\
  !*** ./runestone/cellbotics/js/auto-bind.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   auto_bind: () => (/* binding */ auto_bind)
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
/* harmony export */   cell_bot_ble_gui: () => (/* binding */ cell_bot_ble_gui)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9jZWxsYm90aWNzX2pzX2JsZV9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOzs7QUFHYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUU4Qjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQVM7O0FBRWpCO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFJQUFxSTtBQUNySTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHdEQUFTOztBQUVqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsOEJBQThCO0FBQzVGOztBQUVBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9hdXRvLWJpbmQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL2JsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAuLiBDb3B5cmlnaHQgKEMpIDIwMTItMjAyMCBCcnlhbiBBLiBKb25lcy5cbi8vXG4vLyAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIENlbGxCb3RpY3Mgc3lzdGVtLlxuLy9cbi8vICBUaGUgQ2VsbEJvdGljcyBzeXN0ZW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4vLyAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbi8vICBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGVcbi8vICBMaWNlbnNlLCBvciAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vICBUaGUgQ2VsbEJvdGljcyBzeXN0ZW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlXG4vLyAgdXNlZnVsLCBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eVxuLy8gIG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGUgR05VXG4vLyAgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gIGFsb25nIHdpdGggdGhlIENlbGxCb3RpY3Mgc3lzdGVtLiAgSWYgbm90LCBzZWVcbi8vICA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4vL1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBBdXRvbWF0aWNhbGx5IGJpbmQgbWV0aG9kcyB0byB0aGVpciBpbnN0YW5jZXNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vLyBUaGUgZm9sbG93aW5nIHR3byBmdW5jdGlvbnMgd2VyZSB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvYXV0by1iaW5kL2Jsb2IvbWFzdGVyL2luZGV4LmpzIGFuZCBsaWdodGx5IG1vZGlmaWVkLiBUaGV5IHByb3ZpZGUgYW4gZWFzeSB3YXkgdG8gYmluZCBhbGwgY2FsbGFibGUgbWV0aG9kcyB0byB0aGVpciBpbnN0YW5jZS4gU2VlIGBCaW5kaW5nIE1ldGhvZHMgdG8gQ2xhc3MgSW5zdGFuY2UgT2JqZWN0cyA8aHR0cHM6Ly9wb255Zm9vLmNvbS9hcnRpY2xlcy9iaW5kaW5nLW1ldGhvZHMtdG8tY2xhc3MtaW5zdGFuY2Utb2JqZWN0cz5gXyBmb3IgbW9yZSBkaXNjdXNzaW9uIG9uIHRoaXMgY3JhenkgSmF2YVNjcmlwdCBuZWNlc3NpdHkuXG4vL1xuLy8gR2V0cyBhbGwgbm9uLWJ1aWx0aW4gcHJvcGVydGllcyB1cCB0aGUgcHJvdG90eXBlIGNoYWluXG5jb25zdCBnZXRBbGxQcm9wZXJ0aWVzID0gb2JqZWN0ID0+IHtcblx0Y29uc3QgcHJvcGVydGllcyA9IG5ldyBTZXQoKTtcblxuXHRkbyB7XG5cdFx0Zm9yIChjb25zdCBrZXkgb2YgUmVmbGVjdC5vd25LZXlzKG9iamVjdCkpIHtcblx0XHRcdHByb3BlcnRpZXMuYWRkKFtvYmplY3QsIGtleV0pO1xuXHRcdH1cblx0fSB3aGlsZSAoKG9iamVjdCA9IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSkgJiYgb2JqZWN0ICE9PSBPYmplY3QucHJvdG90eXBlKTtcblxuXHRyZXR1cm4gcHJvcGVydGllcztcbn07XG5cblxuLy8gSW52b2tlIHRoaXMgaW4gdGhlIGNvbnN0cnVjdG9yIG9mIGFuIG9iamVjdC5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvX2JpbmQoc2VsZikge1xuICAgIGZvciAoY29uc3QgW29iamVjdCwga2V5XSBvZiBnZXRBbGxQcm9wZXJ0aWVzKHNlbGYuY29uc3RydWN0b3IucHJvdG90eXBlKSkge1xuICAgICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzZWxmW2tleV0gPSBzZWxmW2tleV0uYmluZChzZWxmKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIC4uIENvcHlyaWdodCAoQykgMjAxMi0yMDIwIEJyeWFuIEEuIEpvbmVzLlxuLy9cbi8vICBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQ2VsbEJvdGljcyBzeXN0ZW0uXG4vL1xuLy8gIFRoZSBDZWxsQm90aWNzIHN5c3RlbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3Jcbi8vICBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhc1xuLy8gIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZVxuLy8gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gIFRoZSBDZWxsQm90aWNzIHN5c3RlbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmVcbi8vICB1c2VmdWwsIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5XG4vLyAgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZSBHTlVcbi8vICBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyAgYWxvbmcgd2l0aCB0aGUgQ2VsbEJvdGljcyBzeXN0ZW0uICBJZiBub3QsIHNlZVxuLy8gIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbi8vXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBKYXZhU2NyaXB0IGNvZGUgdG8gY29ubmVjdCB3aXRoIGEgQ2VsbEJvdCB2aWEgQkxFXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgeyBhdXRvX2JpbmQgfSBmcm9tIFwiLi9hdXRvLWJpbmQuanNcIjtcblxuLy8gQ2VsbEJvdEJsZVxuLy8gPT09PT09PT09PVxuLy8gVGhpcyBzZW5kcyBhbmQgcmVjZWl2ZXMgZGF0YSB0byB0aGUgQ2VsbEJvdCB2aWEgQmx1ZXRvb3RoLlxuY2xhc3MgQ2VsbEJvdEJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGF1dG9fYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmNsZWFyX2Nvbm5lY3Rpb24oKTtcbiAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHNlcnZlciAoQkxFIGRldmljZSAvIENlbGxCb3QpIGlzIGxpdHRsZS1lbmRpYW47IGlmIGZhbHNlLCBiaWctZW5kaWFuLlxuICAgICAgICB0aGlzLmlzX2xpdHRsZV9lbmRpYW4gPSB0cnVlO1xuICAgICAgICAvLyBJZiB0cnVlLCBleHBlY3QgdmVyYm9zZSByZXR1cm5zICh0aGUgQ2VsbEJvdCB3YXMgY29tcGlsZWQgd2l0aCBgYFZFUkJPU0VfUkVUVVJOYGAgZGVmaW5lZCkuXG4gICAgICAgIHRoaXMudmVyYm9zZV9yZXR1cm4gPSB0cnVlO1xuICAgICAgICAvLyBJZiB0cnVlLCByZXR1cm4gZHVtbXkgdmFsdWVzIGluc3RlYWQgb2YgdGFsa2luZyB0byB0aGUgaGFyZHdhcmUuXG4gICAgICAgIHRoaXMuaXNfc2ltID0gZmFsc2U7XG5cbiAgICAgICAgLy8gI2RlZmluZXMgZnJvbSBBcmR1aW5vIGhlYWRlcnMuXG4gICAgICAgIHRoaXMuSU5QVVQgPSAxO1xuICAgICAgICB0aGlzLk9VVFBVVCA9IDI7XG5cbiAgICAgICAgLy8gVVVJRHMgZm9yIGVhY2ggY2hhcmFjdGVyaXN0aWMuXG4gICAgICAgIHRoaXMudXVpZCA9IHtcbiAgICAgICAgICAgIHJlc2V0SGFyZHdhcmU6IFwiNjBjYjE4MGUtODM4ZC00ZjY1LWFmZjQtMjBiNjA5YjQ1M2YzXCIsXG4gICAgICAgICAgICBwaW5Nb2RlOiBcIjZlYTZkOWI2LTdiN2UtNDUxYy1hYjQ1LTIyMTI5OGU0MzU2MlwiLFxuICAgICAgICAgICAgZGlnaXRhbFdyaXRlOiBcImQzNDIzY2Y2LTZkYTctNGRkOC1hNWJhLTNjOTgwYzc0YmQ2ZFwiLFxuICAgICAgICAgICAgZGlnaXRhbFJlYWQ6IFwiYzM3MGJjNzktMTFjMS00NTMwLTlmNjktYWI5ZDk2MWFhNDk3XCIsXG4gICAgICAgICAgICBsZWRjU2V0dXA6IFwiNmJlNTdjZWEtM2M0Ni00Njg3LTk3MmItMDM0MjlkMmFjZjliXCIsXG4gICAgICAgICAgICBsZWRjQXR0YWNoUGluOiBcIjJjZDYzODYxLTA3OGYtNDM2Zi05ZWQ5LTc5ZTU3ZWM4YjYzOFwiLFxuICAgICAgICAgICAgbGVkY0RldGFjaFBpbjogXCJiOWIwY2FiZS0yNWQ4LTQ5NjUtOTI1OS03ZDNiNjMzMGU5NDBcIixcbiAgICAgICAgICAgIGxlZGNXcml0ZTogXCI0MDY5ODAzMC1hMzQzLTQ0OGYtYTllYS01NGIzOWIwM2JmODFcIlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIENsZWFyIEJsdWV0b290aCBjb25uZWN0aW9uLXJlbGF0ZWQgb2JqZWN0cy5cbiAgICBjbGVhcl9jb25uZWN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnNlcnZpY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIEEgZGljdCBvZiBuYW1lOiBgYEJsdWV0b290aFJlbW90ZUdBVFRDaGFyYWN0ZXJpc3RpY2BgLlxuICAgICAgICB0aGlzLmNoYXJhY3RlcmlzdGljID0ge307XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRydWUgaWYgQkxFIGlzIHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuIEV2ZW4gaWYgaXQgaXMgc3VwcG9ydGVkLCBpdCBtYXkgbm90IGJlIGF2YWlsYWJsZS5cbiAgICBpc19ibGVfc3VwcG9ydGVkKCkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbihuYXZpZ2F0b3IuYmx1ZXRvb3RoKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpcyBCTEUgaXMgc3VwcG9ydGVkLiBJZiBzbywgcmVnaXN0ZXIgdGhlIHByb3ZpZGVkIGV2ZW50IGhhbmRsZXIuXG4gICAgYXN5bmMgaGFzX2JsZShvbl9hdmFpbGFiaWxpdHlfY2hhbmdlZCkge1xuICAgICAgICBpZiAodGhpcy5pc19zaW0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNfYmxlX3N1cHBvcnRlZCgpICYmIGF3YWl0IG5hdmlnYXRvci5ibHVldG9vdGguZ2V0QXZhaWxhYmlsaXR5KCkpIHtcbiAgICAgICAgICAgIG5hdmlnYXRvci5ibHVldG9vdGguYWRkRXZlbnRMaXN0ZW5lcihcImF2YWlsYWJpbGl0eWNoYW5nZWRcIiwgb25fYXZhaWxhYmlsaXR5X2NoYW5nZWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRydWUgaWYgdGhlIEJsdWV0b290aCBkZXZpY2UgKHNlcnZlcikgaXMgY29ubmVjdGVkLlxuICAgIHBhaXJlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNfc2ltIHx8ICh0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5jb25uZWN0ZWQpO1xuICAgIH1cblxuICAgIC8vIFBhaXIgd2l0aCBhIENlbGxCb3QgYW5kIHJldHVybiB0aGUgY2hhcmFjdGVyaXN0aWMgdXNlZCB0byBjb250cm9sIHRoZSBkZXZpY2UuXG4gICAgYXN5bmMgcGFpcihkaXNjb25uZWN0X2NhbGxiYWNrKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuaXNfc2ltKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTa2lwIGNvbm5lY3RpbmcgaWYgd2UncmUgYWxyZWFkeSBjb25uZWN0ZWQuXG4gICAgICAgIGlmICh0aGlzLnBhaXJlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTaHV0IGRvd24gYW55IHJlbW5hbnRzIG9mIGEgcHJldmlvdXMgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy5jbGVhcl9jb25uZWN0aW9uKCk7XG5cbiAgICAgICAgLy8gUmVxdWVzdCBhIGRldmljZSB3aXRoIHNlcnZpY2UgYFVVSURzYC4gU2VlIHRoZSBgQmx1ZXRvb3RoIEFQSSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0JsdWV0b290aD5gXy5cbiAgICAgICAgbGV0IGNlbGxCb3Rfc2VydmljZSA9IFwiNmM1MzM3OTMtOWJkNi00N2Q2LThkM2ItYzEwYTcwNGI2Yjk3XCI7XG4gICAgICAgIHRoaXMuZGV2aWNlID0gYXdhaXQgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKHtcbiAgICAgICAgICAgIGZpbHRlcnM6IFt7XG4gICAgICAgICAgICAgICAgc2VydmljZXM6IFtjZWxsQm90X3NlcnZpY2VdXG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBOb3RpZnkgb24gYSBkaXNjb25uZWN0LiBJIGNhbid0IGZpbmQgYW55IGRvY3Mgb24gdGhpcywgYnV0IGl0IGRvZXMgd29yay5cbiAgICAgICAgdGhpcy5kZXZpY2UuYWRkRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsIGRpc2Nvbm5lY3RfY2FsbGJhY2spO1xuICAgICAgICB0aGlzLmRldmljZS5hZGRFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJywgdGhpcy5jbGVhcl9jb25uZWN0aW9uKTtcblxuICAgICAgICAvLyBDb25uZWN0IHRvIGl0cyBzZXJ2ZXIuXG4gICAgICAgIHRoaXMuc2VydmVyID0gYXdhaXQgdGhpcy5kZXZpY2UuZ2F0dC5jb25uZWN0KCk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBzZXJ2aWNlIGZvciBvdXIgc2VydmVyLlxuICAgICAgICB0aGlzLnNlcnZpY2UgPSBhd2FpdCB0aGlzLnNlcnZlci5nZXRQcmltYXJ5U2VydmljZShjZWxsQm90X3NlcnZpY2UpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyaWMgYWNjZXNzIGZ1bmN0aW9uIGZvciBjYWxsaW5nIGEgZnVuY3Rpb24gb24gdGhlIEFyZHVpbm8uIEl0IHJldHVybnMgKHZhbHVlIHJldHVybmVkIGFmdGVyIGludm9raW5nIHRoZSBmdW5jdGlvbiwgbWVzc2FnZSkuXG4gICAgYXN5bmMgaW52b2tlX0FyZHVpbm8oXG4gICAgICAgIC8vIFRoZSBCbHVldG9vdGggY2hhcmFjdGVyaXN0aWMgdG8gdXNlIGZvciB0aGlzIGNhbGwuXG4gICAgICAgIGNoYXJhY3RlcmlzdGljLFxuICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGJ5dGVzIGluIHRoZSByZXR1cm4gdmFsdWU6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIC0gICAgMDogdm9pZFxuICAgICAgICAvLyAtICAgICsxLy0xOiB1bnNpZ25lZC9zaWduZWQgOC1iaXQgdmFsdWVcbiAgICAgICAgLy8gLSAgICArMi8tMjogdW5zaWduZWQvc2lnbmVkIDE2LWJpdCB2YWx1ZVxuICAgICAgICAvLyAtICAgICs0Ly00OiB1bnNpZ25lZC9zaWduZWQgMzItYml0IHZhbHVlXG4gICAgICAgIC8vIC0gICAgMC40LzAuODogMzItYml0LzY0LWJpdCBmbG9hdFxuICAgICAgICByZXR1cm5fYnl0ZXMsXG4gICAgICAgIC8vIEFuIEFycmF5QnVmZmVyIG9yIGNvbXBhdGlibGUgdHlwZSBvZiBkYXRhIGNvbnRhaW5pbmcgZW5jb2RlZCBwYXJhbWV0ZXJzIHRvIHNlbmQuXG4gICAgICAgIHBhcmFtX2FycmF5XG4gICAgKSB7XG4gICAgICAgIGlmICh0aGlzLmlzX3NpbSkge1xuICAgICAgICAgICAgcmV0dXJuIFswLCBcIlwiXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGNoYXJhY3RlcmlzdGljLndyaXRlVmFsdWUocGFyYW1fYXJyYXkpO1xuICAgICAgICAvLyBSZWFkIHRoZSByZXR1cm5lZCBkYXRhLlxuICAgICAgICBsZXQgcmV0dXJuX2RhdGEgPSBhd2FpdCBjaGFyYWN0ZXJpc3RpYy5yZWFkVmFsdWUoKTtcbiAgICAgICAgLy8gSW50ZXJwcmV0IHRoZSByZXR1cm4gdmFsdWUuXG4gICAgICAgIGxldCByZXR1cm5fdmFsdWU7XG4gICAgICAgIHN3aXRjaCAocmV0dXJuX2J5dGVzKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gcmV0dXJuX2RhdGEuZ2V0VWludDgoMCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAtMTpcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHJldHVybl9kYXRhLmdldEludDgoMCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gcmV0dXJuX2RhdGEuZ2V0VWludDE2KDApO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgLTI6XG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSByZXR1cm5fZGF0YS5nZXRJbnQxNigwLCB0aGlzLmlzX2xpdHRsZV9lbmRpYW4pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHJldHVybl9kYXRhLmdldFVpbnQzMigwLCB0aGlzLmlzX2xpdHRsZV9lbmRpYW4pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgLTQ6XG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSByZXR1cm5fZGF0YS5nZXRJbnQzMigwLCB0aGlzLmlzX2xpdHRsZV9lbmRpYW4pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMC40OlxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gcmV0dXJuX2RhdGEuZ2V0RmxvYXQzMigwLCB0aGlzLmlzX2xpdHRsZV9lbmRpYW4pO1xuICAgICAgICAgICAgcmV0dXJuX2J5dGVzID0gNDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDAuODpcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHJldHVybl9kYXRhLmdldEZsb2F0NjQoMCwgdGhpcy5pc19saXR0bGVfZW5kaWFuKTtcbiAgICAgICAgICAgIHJldHVybl9ieXRlcyA9IDg7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1lc3NhZ2UgPSByZXR1cm5fZGF0YS5idWZmZXIuc2xpY2UocmV0dXJuX2J5dGVzKTtcbiAgICAgICAgbWVzc2FnZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQ4QXJyYXkobWVzc2FnZSkpO1xuICAgICAgICBpZiAoIXRoaXMudmVyYm9zZV9yZXR1cm4pIHtcbiAgICAgICAgICAgIHRocm93IGBCTEUgcHJvdG9jb2wgZXJyb3I6ICR7bWVzc2FnZX1gXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtyZXR1cm5fdmFsdWUsIG1lc3NhZ2VdO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBleGlzdGluZyBpbnN0YW5jZSBvZiBhIGBgQmx1ZXRvb3RoUmVtb3RlR0FUVENoYXJhY3RlcmlzdGljYGAgb3IgY3JlYXRlIGEgbmV3IG9uZS5cbiAgICBhc3luYyBnZXRfY2hhcmFjdGVyaXN0aWMobmFtZSkge1xuICAgICAgICBpZiAodGhpcy5pc19zaW0pIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgaW4gdGhpcy5jaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyaXN0aWNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyaXN0aWNbbmFtZV0gPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy51dWlkW25hbWVdKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCB0aGUgaGFyZHdhcmUgb24gdGhlIGNvbm5lY3RlZCBkZXZpY2UuXG4gICAgYXN5bmMgcmVzZXRIYXJkd2FyZSgpIHtcbiAgICAgICAgLy8gQW55IHdyaXRlIGlzIGZpbmUgLS0ganVzdCBzZW5kIDEgYnl0ZS5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlX0FyZHVpbm8oYXdhaXQgdGhpcy5nZXRfY2hhcmFjdGVyaXN0aWMoXCJyZXNldEhhcmR3YXJlXCIpLCAwLCBuZXcgVWludDhBcnJheShbMV0pKTtcbiAgICB9XG5cbiAgICAvLyBJbnZva2UgYHBpbk1vZGUgPGh0dHBzOi8vd3d3LmFyZHVpbm8uY2MvcmVmZXJlbmNlL2VuL2xhbmd1YWdlL2Z1bmN0aW9ucy9kaWdpdGFsLWlvL3Bpbm1vZGUvPmBfIG9uIHRoZSBBcmR1aW5vLlxuICAgIGFzeW5jIHBpbk1vZGUodThfcGluLCB1OF9tb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwicGluTW9kZVwiKSwgMCwgbmV3IFVpbnQ4QXJyYXkoW3U4X3BpbiwgdThfbW9kZV0pKTtcbiAgICB9XG5cbiAgICAvLyBJbnZva2UgYGRpZ2l0YWxXcml0ZSA8aHR0cHM6Ly93d3cuYXJkdWluby5jYy9yZWZlcmVuY2UvZW4vbGFuZ3VhZ2UvZnVuY3Rpb25zL2RpZ2l0YWwtaW8vZGlnaXRhbHdyaXRlLz5gXyBvbiB0aGUgQXJkdWluby5cbiAgICBhc3luYyBkaWdpdGFsV3JpdGUodThfcGluLCB1OF92YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2VfQXJkdWlubyhhd2FpdCB0aGlzLmdldF9jaGFyYWN0ZXJpc3RpYyhcImRpZ2l0YWxXcml0ZVwiKSwgMCwgbmV3IFVpbnQ4QXJyYXkoW3U4X3BpbiwgdThfdmFsdWVdKSk7XG4gICAgfVxuXG4gICAgLy8gSW52b2tlIGBkaWdpdGFsUmVhZCA8aHR0cHM6Ly93d3cuYXJkdWluby5jYy9yZWZlcmVuY2UvZW4vbGFuZ3VhZ2UvZnVuY3Rpb25zL2RpZ2l0YWwtaW8vZGlnaXRhbHJlYWQvPmBfIG9uIHRoZSBBcmR1aW5vLlxuICAgIGFzeW5jIGRpZ2l0YWxSZWFkKHU4X3Bpbikge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2VfQXJkdWlubyhhd2FpdCB0aGlzLmdldF9jaGFyYWN0ZXJpc3RpYyhcImRpZ2l0YWxSZWFkXCIpLCAxLCBuZXcgVWludDhBcnJheShbdThfcGluXSkpO1xuICAgIH1cblxuICAgIC8vIEludm9rZSBgYGxlZGNTZXR1cGBgIG9uIHRoZSBBcmR1aW5vLlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHRoZSBMRURDIGNvbnRyb2wgb24gdGhlIEVTUDMyIEFyZHVpbm8gcG9ydCBpc24ndCBkb2N1bWVudGVkLiBIZXJlJ3MgbXkgYXR0ZW1wdHMuIFRoZSBiZXN0IHJlZmVyZW5jZSBpcyB0aGUgYExFRF9QV00gY2hhcHRlciBvZiB0aGUgRVNQMzIgVGVjaG5pY2FsIFJlZmVyZW5jZSBNYW51YWwgPGh0dHBzOi8vd3d3LmVzcHJlc3NpZi5jb20vc2l0ZXMvZGVmYXVsdC9maWxlcy9kb2N1bWVudGF0aW9uL2VzcDMyX3RlY2huaWNhbF9yZWZlcmVuY2VfbWFudWFsX2VuLnBkZiNwYWdlPTM4ND5gXy4gVG8gc2V0IHVwIFBXTSwgeW91IG5lZWQgdG8gc2VsZWN0OlxuICAgIC8vXG4gICAgLy8gLSAgICBBIGNoYW5uZWwgKGNoYW5uZWxzIDAtNyBhdXRvLXVwZGF0ZSBuZXcgUFdNIHBlcmlvZHMsIGNoYW5uZWxzIDgtMTUgZG9uJ3QpLlxuICAgIC8vIC0gICAgVGhlIGZyZXF1ZW5jeSB0byBkbyB0aGUgUFdNLCBpbiBIei5cbiAgICAvLyAtICAgIEEgbnVtYmVyIG9mIGJpdHMgdXNlZCB0byBkbyB0aGUgUFdNLiBUaGUgbWF4aW11bSBwb3NzaWJsZSB2YWx1ZSBpcyBmbG9vcihsb2cyKHByb2Nlc3NvciBjbG9jayBmcmVxdWVuY3kvUFdNIGZyZXF1ZW5jeSkpOyB0aGlzIGNhbm5vdCBleGNlZWQgMjAuIFRoZSBwcm9jZXNzb3IgY2xvY2sgZnJlcXVlbmN5IGlzIGVpdGhlciA4MCBNSHogb3IgMSBNSHouXG4gICAgLy9cbiAgICAvLyBUaGUgZnVuY3Rpb24gcmV0dXJucyB0aGUgYWN0dWFsIFBXTSBmcmVxdWVuY3ksIGR1ZSB0byB0aGUgbGltaXRhdGlvbnMgb2YgdGhlIGF2YWlsYWJsZSBjbG9jayBkaXZpc29yLlxuICAgIGFzeW5jIGxlZGNTZXR1cCh1OF9jaGFubmVsLCBkX2ZyZXEsIHU4X3Jlc29sdXRpb25fYml0cykge1xuICAgICAgICBsZXQgcGFyYW1fYXJyYXkgPSBuZXcgQXJyYXlCdWZmZXIoMTEpO1xuICAgICAgICBsZXQgZHYgPSBuZXcgRGF0YVZpZXcocGFyYW1fYXJyYXkpO1xuICAgICAgICBkdi5zZXRVaW50OCgwLCB1OF9jaGFubmVsKTtcbiAgICAgICAgZHYuc2V0RmxvYXQ2NCgxLCBkX2ZyZXEsIHRoaXMuaXNfbGl0dGxlX2VuZGlhbik7XG4gICAgICAgIGR2LnNldFVpbnQ4KDEwLCB1OF9yZXNvbHV0aW9uX2JpdHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2VfQXJkdWlubyhhd2FpdCB0aGlzLmdldF9jaGFyYWN0ZXJpc3RpYyhcImxlZGNTZXR1cFwiKSwgMC44LCBwYXJhbV9hcnJheSk7XG4gICAgfVxuXG4gICAgLy8gSW52b2tlIGBgbGVkY0F0dGFjaFBpbmBgIG9uIHRoZSBBcmR1aW5vLlxuICAgIC8vXG4gICAgLy8gTmV4dCwgYXR0YWNoIHRoaXMgY2hhbm5lbCB0byBhIHNwZWNpZmljIHBpbiBvbiB0aGUgQXJkdWluby5cbiAgICBhc3luYyBsZWRjQXR0YWNoUGluKHU4X3BpbiwgdThfY2hhbm5lbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2VfQXJkdWlubyhhd2FpdCB0aGlzLmdldF9jaGFyYWN0ZXJpc3RpYyhcImxlZGNBdHRhY2hQaW5cIiksIDAsIG5ldyBVaW50OEFycmF5KFt1OF9waW4sIHU4X2NoYW5uZWxdKSk7XG4gICAgfVxuXG4gICAgLy8gSW52b2tlIGBgbGVkY1dyaXRlYGAgb24gdGhlIEFyZHVpbm8uXG4gICAgLy9cbiAgICAvLyBGaW5hbGx5LCBzZWxlY3QgYSBkdXR5IGN5Y2xlIGZvciB0aGF0IGNoYW5uZWwsIGZyb20gMl5udW1fYml0cyB0byAxLlxuICAgIGFzeW5jIGxlZGNXcml0ZSh1OF9jaGFubmVsLCB1MzJfZHV0eSkge1xuICAgICAgICBsZXQgcGFyYW1fYXJyYXkgPSBuZXcgQXJyYXlCdWZmZXIoNSk7XG4gICAgICAgIGxldCBkdiA9IG5ldyBEYXRhVmlldyhwYXJhbV9hcnJheSk7XG4gICAgICAgIGR2LnNldFVpbnQ4KDAsIHU4X2NoYW5uZWwpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMSwgdTMyX2R1dHksIHRoaXMuaXNfbGl0dGxlX2VuZGlhbik7XG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZV9BcmR1aW5vKGF3YWl0IHRoaXMuZ2V0X2NoYXJhY3RlcmlzdGljKFwibGVkY1dyaXRlXCIpLCAwLCBwYXJhbV9hcnJheSk7XG4gICAgfVxuXG4gICAgLy8gSW52b2tlIGBgbGVkY0RldGFjaFBpbmBgIG9uIHRoZSBBcmR1aW5vLlxuICAgIC8vXG4gICAgLy8gTmV4dCwgYXR0YWNoIHRoaXMgY2hhbm5lbCB0byBhIHNwZWNpZmljIHBpbiBvbiB0aGUgQXJkdWluby5cbiAgICBhc3luYyBsZWRjRGV0YWNoUGluKHU4X3Bpbikge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnZva2VfQXJkdWlubyhhd2FpdCB0aGlzLmdldF9jaGFyYWN0ZXJpc3RpYyhcImxlZGNEZXRhY2hQaW5cIiksIDAsIG5ldyBVaW50OEFycmF5KFt1OF9waW5dKSk7XG4gICAgfVxufVxuXG5cbi8vIENlbGxCb3RCbGVHdWlcbi8vID09PT09PT09PT09PT1cbi8vIFByb3ZpZGUgYSBzaW1wbGUgcGFpci9kaXNjb25uZWN0IEdVSSBmb3IgdGhlIENlbGxCb3QgQmx1ZXRvb3RoIGNvbm5lY3Rpb24uXG5jbGFzcyBDZWxsQm90QmxlR3VpIHtcbiAgICBjb25zdHJ1Y3RvcihwYWlyX2J1dHRvbl9pZCwgcGFpcl9zdGF0dXNfaWQpIHtcbiAgICAgICAgYXV0b19iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuYmxlX3BhaXJfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFpcl9idXR0b25faWQpO1xuICAgICAgICB0aGlzLmJsZV9wYWlyX3N0YXR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhaXJfc3RhdHVzX2lkKTtcblxuICAgICAgICAvLyBJZiB0aGUgR1VJIGlzbid0IGF2YWlsYWJsZSwgZ2l2ZSB1cC5cbiAgICAgICAgaWYgKCF0aGlzLmJsZV9wYWlyX2J1dHRvbiB8fCAhdGhpcy5ibGVfcGFpcl9zdGF0dXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2VsbF9ib3RfYmxlID0gbmV3IENlbGxCb3RCbGUoKTtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBwYWlyIGJ1dHRvbiBiYXNlZCBvbiBCTEUgYXZhaWxhYmlsaXR5LlxuICAgICAgICB0aGlzLmNlbGxfYm90X2JsZS5oYXNfYmxlKHRoaXMub25fYXZhaWxhYmlsaXR5X2NoYW5nZWQpLnRoZW4odGhpcy5vbl9ibGVfYXZhaWxhYmxlKTtcbiAgICAgICAgLy8gUmVzcG9uZCB0byBidXR0b24gY2xpY2tzLlxuICAgICAgICB0aGlzLmJsZV9wYWlyX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgdGhpcy5hc3luY19vbl9wYWlyX2NsaWNrZWQoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhc3luYyBhc3luY19vbl9wYWlyX2NsaWNrZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5jZWxsX2JvdF9ibGUucGFpcmVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYmxlX3BhaXJfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmxlX3BhaXJfc3RhdHVzLmlubmVySFRNTCA9IFwiUGFpcmluZy4uLlwiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNlbGxfYm90X2JsZS5wYWlyKHRoaXMub25fZGlzY29ubmVjdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9zdGF0dXMuaW5uZXJIVE1MID0gYFBhaXJlZCB0byAke3RoaXMuY2VsbF9ib3RfYmxlLmRldmljZS5uYW1lfS5gO1xuICAgICAgICAgICAgICAgIHRoaXMuYmxlX3BhaXJfYnV0dG9uLmlubmVySFRNTCA9IFwiRGlzY29ubmVjdFwiO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJsZV9wYWlyX3N0YXR1cy5pbm5lckhUTUwgPSBcIlVuYWJsZSB0byBwYWlyLlwiO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jZWxsX2JvdF9ibGUuc2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uX2F2YWlsYWJpbGl0eV9jaGFuZ2VkKGV2ZW50KSB7XG4gICAgICAgIC8vIFRPRE86IEkgZG9uJ3Qga25vdyB3aGF0IHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBldmVudCBpcy5cbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgIH1cblxuICAgIG9uX2JsZV9hdmFpbGFibGUoaGFzX2JsZSkge1xuICAgICAgICB0aGlzLmJsZV9wYWlyX2J1dHRvbi5kaXNhYmxlZCA9ICFoYXNfYmxlO1xuICAgICAgICBpZiAoaGFzX2JsZSkge1xuICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9zdGF0dXMuaW5uZXJIVE1MID0gXCJOb3QgY29ubmVjdGVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ibGVfcGFpcl9zdGF0dXMuaW5uZXJIVE1MID0gXCJOb3QgYXZhaWxhYmxlLlwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25fZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy5ibGVfcGFpcl9zdGF0dXMuaW5uZXJIVE1MID0gXCJEaXNjb25uZWN0ZWQuXCI7XG4gICAgICAgIHRoaXMuYmxlX3BhaXJfYnV0dG9uLmlubmVySFRNTCA9IFwiUGFpclwiO1xuICAgIH1cbn1cblxuXG4vLyBBbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLlxuZXhwb3J0IGxldCBjZWxsX2JvdF9ibGVfZ3VpO1xuXG4vLyBIYW5kbGVyXG4vLyA9PT09PT09XG4vLyBUaGlzIG11c3QgYmUgaW52b2tlZCB3aGVuIHRoZSBET00gaXMgcmVhZHksIGJlZm9yZSBjYWxsaW5nIGFueSBvdGhlciBmdW5jdGlvbiBpbiB0aGlzIGZpbGUuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgY2VsbF9ib3RfYmxlX2d1aSA9IG5ldyBDZWxsQm90QmxlR3VpKFwiYmxlX3BhaXJfYnV0dG9uXCIsIFwiYmxlX3BhaXJfc3RhdHVzXCIpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=