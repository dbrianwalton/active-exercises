"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_cellbotics_js_simple_sensor_js"],{

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

/***/ 64617:
/*!*********************************************************!*\
  !*** ./runestone/cellbotics/js/permissions_polyfill.js ***!
  \*********************************************************/
/***/ (() => {

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
// ********************************************
// |docname| - Polyfill for the Permissions API
// ********************************************
// This is primarily for iOS devices that don't provide Permissions, but use another method to allow access to various sensors.



// Only supply this if there's not Permissions and we have tne iOS flavor available. See sample code in https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2 or the `W3C working draft <https://www.w3.org/TR/orientation-event/#deviceorientation>`_.
if (
    !navigator.permissions &&
    (typeof DeviceMotionEvent.requestPermission === "function") &&
    (typeof DeviceOrientationEvent.requestPermission === "function")
) {
    navigator.permissions = {
        query: options => {
            // Ignore everything but the name, since our use case is only for SimpleSensor.
            switch (options.name) {
                case "accelerometer":
                case "gyroscope":
                // The requested permissions doesn't allow us to determine which of the following two permissions we need, so ask for both.
                return new Promise((resolve, reject) => {
                    Promise.all([
                        // The polyfill for the accelerometer, gyro, and related classes needs just this.
                        DeviceMotionEvent.requestPermission(),
                        // The polyfill for the orientation sensors needs just this.
                        DeviceOrientationEvent.requestPermission()
                    ]).then(
                        // We now have an array of strings, the result of the requestPermission calls. If all are "granted", then return {state: "granted"}, else return {state: "denied"}.
                        vals => resolve({state:
                            (vals.every(x => x === "granted") ? "granted" : "denied")
                        })
                    )
                });

                // There's nothing else that needs permission to work.
                default:
                return Promise.resolve({state: "granted"});
            }
        }
    };
}


/***/ }),

/***/ 6713:
/*!***********************************************************************!*\
  !*** ./runestone/cellbotics/js/sensor_polyfill/geolocation-sensor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sensor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sensor.js */ 28660);
/* harmony import */ var _sensor_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sensor_js__WEBPACK_IMPORTED_MODULE_0__);
// ***************************************
// |docname| - Geolocation sensor polyfill
// ***************************************
// @ts-check




//const slot = __sensor__;

class GeolocationSensorSingleton {
  constructor() {
    if (!this.constructor.instance) {
      this.constructor.instance = this;
    }

    this.sensors = new Set();
    this.watchId = null;
    this.accuracy = null;
    this.lastPosition = null;

    return this.constructor.instance;
  }

  async obtainPermission() {
    let state = "prompt"; // Default for geolocation.
    // @ts-ignore
    if (navigator.permissions) {
      // @ts-ignore
      const permission = await navigator.permissions.query({ name:"geolocation"});
      state = permission.state;
    }

    return new Promise(resolve => {
      const successFn = position => {
        this.lastPosition = position;
        resolve("granted");
      }

      const errorFn = err => {
        if (err.code === err.PERMISSION_DENIED) {
          resolve("denied");
        } else {
          resolve(state);
        }
      }

      const options = { maximumAge: Infinity, timeout: 10 };
      navigator.geolocation.getCurrentPosition(successFn, errorFn, options);
    });
  }

  calculateAccuracy() {
    let enableHighAccuracy = false;

    for (const sensor of this.sensors) {
      if (sensor[slot].options.accuracy === "high") {
        enableHighAccuracy = true;
        break;
      }
    }
    return enableHighAccuracy;
  }

  async register(sensor) {
    const permission = await this.obtainPermission();
    if (permission !== "granted") {
      sensor[slot].notifyError("Permission denied.", "NowAllowedError");
      return;
    }

    if (this.lastPosition) {
      const age = performance.now() - this.lastPosition.timeStamp;
      const maxAge = sensor[slot].options.maxAge;
      if (maxAge == null || age <= maxAge) {
        sensor[slot].handleEvent(age, this.lastPosition.coords);
      }
    }

    this.sensors.add(sensor);

    // Check whether we need to reconfigure our navigation.geolocation
    // watch, ie. tear it down and recreate.
    const accuracy = this.calculateAccuracy();
    if (this.watchId && this.accuracy === accuracy) {
      // We don't need to reset, return.
      return;
    }

    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    const handleEvent = position => {
      this.lastPosition = position;

      const timestamp = position.timestamp - performance.timing.navigationStart;
      const coords = position.coords;

      for (const sensor of this.sensors) {
        sensor[slot].handleEvent(timestamp, coords);
      }
    }

    const handleError = error => {
      let type;
      switch(error.code) {
        case error.TIMEOUT:
          type = "TimeoutError";
          break;
        case error.PERMISSION_DENIED:
          type = "NotAllowedError";
          break;
        case error.POSITION_UNAVAILABLE:
          type = "NotReadableError";
          break;
        default:
          type = "UnknownError";
      }
      for (const sensor of this.sensors) {
        sensor[slot].handleError(error.message, type);
      }
    }

    const options = {
      enableHighAccuracy: accuracy,
      maximumAge: 0,
      timeout: Infinity
    }

    this.watchId = navigator.geolocation.watchPosition(
      handleEvent, handleError, options
    );
  }

  deregister(sensor) {
    this.sensors.delete(sensor);
    if (!this.sensors.size && this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

// @ts-ignore
const GeolocationSensor = window.GeolocationSensor ||
class GeolocationSensor extends Sensor {
  constructor(options = {}) {
    super(options);

    this[slot].options = options;

    const props = {
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    }

    const propertyBag = this[slot];
    for (const propName in props) {
      propertyBag[propName] = props[propName];
      Object.defineProperty(this, propName, {
        get: () => propertyBag[propName]
      });
    }

    this[slot].handleEvent = (timestamp, coords) => {
      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].timestamp = timestamp;

      this[slot].accuracy = coords.accuracy;
      this[slot].altitude = coords.altitude;
      this[slot].altitudeAccuracy = coords.altitudeAccuracy;
      this[slot].heading = coords.heading;
      this[slot].latitude = coords.latitude;
      this[slot].longitude = coords.longitude;
      this[slot].speed = coords.speed;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    this[slot].handleError = (message, type) => {
      this[slot].notifyError(message, type);
    }

    this[slot].activateCallback = () => {
      (new GeolocationSensorSingleton()).register(this);
    }

    this[slot].deactivateCallback = () => {
      (new GeolocationSensorSingleton()).deregister(this);
    }
  }
}

/***/ }),

/***/ 1981:
/*!*******************************************************************!*\
  !*** ./runestone/cellbotics/js/sensor_polyfill/motion-sensors.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sensor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sensor.js */ 28660);
/* harmony import */ var _sensor_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sensor_js__WEBPACK_IMPORTED_MODULE_0__);
// ***********************************
// |docname| - Motion sensors polyfill
// ***********************************
// @ts-check




//const slot = __sensor__;

let orientation;

// @ts-ignore
if (screen.orientation) {
  // @ts-ignore
  orientation = screen.orientation;
} else if (screen.msOrientation) {
  orientation = screen.msOrientation;
} else {
  orientation = {};
  Object.defineProperty(orientation, "angle", {
    get: () => { return (window.orientation || 0) }
  });
}

const DeviceOrientationMixin = (superclass, ...eventNames) => class extends superclass {
  constructor(...args) {
    // @ts-ignore
    super(args);

    for (const eventName of eventNames) {
      if (`on${eventName}` in window) {
        this[slot].eventName = eventName;
        break;
      }
    }

    this[slot].activateCallback = () => {
      window.addEventListener(this[slot].eventName, this[slot].handleEvent, { capture: true });
    }

    this[slot].deactivateCallback = () => {
      window.removeEventListener(this[slot].eventName, this[slot].handleEvent, { capture: true });
    }
  }
};

function toQuaternionFromEuler(alpha, beta, gamma) {
  const degToRad = Math.PI / 180

  const x = (beta || 0) * degToRad;
  const y = (gamma || 0) * degToRad;
  const z = (alpha || 0) * degToRad;

  const cZ = Math.cos(z * 0.5);
  const sZ = Math.sin(z * 0.5);
  const cY = Math.cos(y * 0.5);
  const sY = Math.sin(y * 0.5);
  const cX = Math.cos(x * 0.5);
  const sX = Math.sin(x * 0.5);

  const qx = sX * cY * cZ - cX * sY * sZ;
  const qy = cX * sY * cZ + sX * cY * sZ;
  const qz = cX * cY * sZ + sX * sY * cZ;
  const qw = cX * cY * cZ - sX * sY * sZ;

  return [qx, qy, qz, qw];
}

function rotateQuaternionByAxisAngle(quat, axis, angle) {
  const sHalfAngle = Math.sin(angle / 2);
  const cHalfAngle = Math.cos(angle / 2);

  const transformQuat = [
    axis[0] * sHalfAngle,
    axis[1] * sHalfAngle,
    axis[2] * sHalfAngle,
    cHalfAngle
  ];

  function multiplyQuaternion(a, b) {
    const qx = a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1];
    const qy = a[1] * b[3] + a[3] * b[1] + a[2] * b[0] - a[0] * b[2];
    const qz = a[2] * b[3] + a[3] * b[2] + a[0] * b[1] - a[1] * b[0];
    const qw = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2];

    return [qx, qy, qz, qw];
  }

  function normalizeQuaternion(quat) {
    const length = Math.sqrt(quat[0] ** 2 + quat[1] ** 2 + quat[2] ** 2 + quat[3] ** 2);
    if (length === 0) {
      return [0, 0, 0, 1];
    }

    return quat.map(v => v / length);
  }

  return normalizeQuaternion(multiplyQuaternion(quat, transformQuat));
}

function toMat4FromQuat(mat, q) {
  const typed = mat instanceof Float32Array || mat instanceof Float64Array;

  if (typed && mat.length >= 16) {
    mat[0] = 1 - 2 * (q[1] ** 2 + q[2] ** 2);
    mat[1] = 2 * (q[0] * q[1] - q[2] * q[3]);
    mat[2] = 2 * (q[0] * q[2] + q[1] * q[3]);
    mat[3] = 0;

    mat[4] = 2 * (q[0] * q[1] + q[2] * q[3]);
    mat[5] = 1 - 2 * (q[0] ** 2 + q[2] ** 2);
    mat[6] = 2 * (q[1] * q[2] - q[0] * q[3]);
    mat[7] = 0;

    mat[8] = 2 * (q[0] * q[2] - q[1] * q[3]);
    mat[9] = 2 * (q[1] * q[2] + q[0] * q[3]);
    mat[10] = 1 - 2 * (q[0] ** 2 + q[1] ** 2);
    mat[11] = 0;

    mat[12] = 0;
    mat[13] = 0;
    mat[14] = 0;
    mat[15] = 1;
  }

  return mat;
}

function worldToScreen(quaternion) {
  return !quaternion ? null :
    rotateQuaternionByAxisAngle(
      quaternion,
      [0, 0, 1],
      - orientation.angle * Math.PI / 180
    );
}

// @ts-ignore
const RelativeOrientationSensor = window.RelativeOrientationSensor ||
class RelativeOrientationSensor extends DeviceOrientationMixin(Sensor, "deviceorientation") {
  constructor(options = {}) {
    super(options);

    switch (options.coordinateSystem || 'world') {
      case 'screen':
        Object.defineProperty(this, "quaternion", {
          get: () => worldToScreen(this[slot].quaternion)
        });
        break;
      case 'world':
      default:
        Object.defineProperty(this, "quaternion", {
          get: () => this[slot].quaternion
        });
    }

    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.absolute || event.alpha === null) {
        // Spec: The implementation can still decide to provide
        // absolute orientation if relative is not available or
        // the resulting data is more accurate. In either case,
        // the absolute property must be set accordingly to reflect
        // the choice.
        this[slot].notifyError("Could not connect to a sensor", "NotReadableError");
        return;
      }

      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].timestamp = performance.now();

      this[slot].quaternion = toQuaternionFromEuler(
        event.alpha,
        event.beta,
        event.gamma
      );

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    this[slot].deactivateCallback = () => {
      this[slot].quaternion = null;
    }
  }

  populateMatrix(mat) {
    toMat4FromQuat(mat, this.quaternion);
  }
}

// @ts-ignore
const AbsoluteOrientationSensor = window.AbsoluteOrientationSensor ||
class AbsoluteOrientationSensor extends DeviceOrientationMixin(
  Sensor, "deviceorientationabsolute", "deviceorientation") {
  constructor(options = {}) {
    super(options);

    switch (options.coordinateSystem || 'world') {
      case 'screen':
        Object.defineProperty(this, "quaternion", {
          get: () => worldToScreen(this[slot].quaternion)
        });
        break;
      case 'world':
      default:
        Object.defineProperty(this, "quaternion", {
          get: () => this[slot].quaternion
        });
    }

    this[slot].handleEvent = event => {
      // If absolute is set, or webkitCompassHeading exists,
      // absolute values should be available.
      const isAbsolute = event.absolute === true || "webkitCompassHeading" in event;
      const hasValue = event.alpha !== null || event.webkitCompassHeading !== undefined;

      if (!isAbsolute || !hasValue) {
        // Spec: If an implementation can never provide absolute
        // orientation information, the event should be fired with
        // the alpha, beta and gamma attributes set to null.
        this[slot].notifyError("Could not connect to a sensor", "NotReadableError");
        return;
      }

      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].hasReading = true;
      this[slot].timestamp = performance.now();

      const heading = event.webkitCompassHeading != null ? 360 - event.webkitCompassHeading : event.alpha;

      this[slot].quaternion = toQuaternionFromEuler(
        heading,
        event.beta,
        event.gamma
      );

      this.dispatchEvent(new Event("reading"));
    }

    this[slot].deactivateCallback = () => {
      this[slot].quaternion = null;
    }
  }

  populateMatrix(mat) {
    toMat4FromQuat(mat, this.quaternion);
  }
}

// @ts-ignore
const Gyroscope = window.Gyroscope ||
class Gyroscope extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.rotationRate.alpha === null) {
        this[slot].notifyError("Could not connect to a sensor", "NotReadableError");
        return;
      }

      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.rotationRate.alpha;
      this[slot].y = event.rotationRate.beta;
      this[slot].z = event.rotationRate.gamma;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      x: null,
      y: null,
      z: null
    });

    this[slot].deactivateCallback = () => {
      this[slot].x = null;
      this[slot].y = null;
      this[slot].z = null;
    }
  }
}

// @ts-ignore
const Accelerometer = window.Accelerometer ||
class Accelerometer extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.accelerationIncludingGravity.x === null) {
        this[slot].notifyError("Could not connect to a sensor", "NotReadableError");
        return;
      }

      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.accelerationIncludingGravity.x;
      this[slot].y = event.accelerationIncludingGravity.y;
      this[slot].z = event.accelerationIncludingGravity.z;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      x: null,
      y: null,
      z: null
    });

    this[slot].deactivateCallback = () => {
      this[slot].x = null;
      this[slot].y = null;
      this[slot].z = null;
    }
  }
}

// @ts-ignore
const LinearAccelerationSensor = window.LinearAccelerationSensor ||
class LinearAccelerationSensor extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.acceleration.x === null) {
        this[slot].notifyError("Could not connect to a sensor", "NotReadableError");
        return;
      }

      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.acceleration.x;
      this[slot].y = event.acceleration.y;
      this[slot].z = event.acceleration.z;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      x: null,
      y: null,
      z: null
    });

    this[slot].deactivateCallback = () => {
      this[slot].x = null;
      this[slot].y = null;
      this[slot].z = null;
    }
  }
}

// @ts-ignore
const GravitySensor = window.GravitySensor ||
 class GravitySensor extends DeviceOrientationMixin(Sensor, "devicemotion") {
  constructor(options) {
    super(options);
    this[slot].handleEvent = event => {
      // If there is no sensor we will get values equal to null.
      if (event.acceleration.x === null || event.accelerationIncludingGravity.x === null) {
        this[slot].notifyError("Could not connect to a sensor", "NotReadableError");
        return;
      }

      if (!this[slot].activated) {
        this[slot].notifyActivatedState();
      }

      this[slot].timestamp = performance.now();

      this[slot].x = event.accelerationIncludingGravity.x - event.acceleration.x;
      this[slot].y = event.accelerationIncludingGravity.y - event.acceleration.y;
      this[slot].z = event.accelerationIncludingGravity.z - event.acceleration.z;

      this[slot].hasReading = true;
      this.dispatchEvent(new Event("reading"));
    }

    defineReadonlyProperties(this, slot, {
      x: null,
      y: null,
      z: null
    });

    this[slot].deactivateCallback = () => {
      this[slot].x = null;
      this[slot].y = null;
      this[slot].z = null;
    }
  }
}

/***/ }),

/***/ 28660:
/*!***********************************************************!*\
  !*** ./runestone/cellbotics/js/sensor_polyfill/sensor.js ***!
  \***********************************************************/
/***/ (() => {

// ********************************
// |docname| - Base Sensor polyfill
// ********************************
// The `geolocation-sensor.js` and `motion-sensors.js` files depend on this.



// @ts-check
const __sensor__ = Symbol("__sensor__");

const slot = __sensor__;

function defineProperties(target, descriptions) {
  for (const property in descriptions) {
    Object.defineProperty(target, property, {
      configurable: true,
      value: descriptions[property]
    });
  }
}

const EventTargetMixin = (superclass, ...eventNames) => class extends superclass {
  constructor(...args) {
    // @ts-ignore
    super(args);
    const eventTarget = document.createDocumentFragment();

    this.addEventListener = (type, ...args) => {
      return eventTarget.addEventListener(type, ...args);
    }

    this.removeEventListener = (...args) => {
      // @ts-ignore
      return eventTarget.removeEventListener(...args);
    }

    this.dispatchEvent = (event) => {
      defineProperties(event, { currentTarget: this });
      if (!event.target) {
        defineProperties(event, { target: this });
      }

      const methodName = `on${event.type}`;
      if (typeof this[methodName] == "function") {
          this[methodName](event);
      }

      const retValue = eventTarget.dispatchEvent(event);

      if (retValue && this.parentNode) {
        this.parentNode.dispatchEvent(event);
      }

      defineProperties(event, { currentTarget: null, target: null });

      return retValue;
    }
  }
};

class EventTarget extends EventTargetMixin(Object) {};

function defineReadonlyProperties(target, slot, descriptions) {
  const propertyBag = target[slot];
  for (const property in descriptions) {
    propertyBag[property] = descriptions[property];
    Object.defineProperty(target, property, {
      get: () => propertyBag[property]
    });
  }
}

class SensorErrorEvent extends Event {
  constructor(type, errorEventInitDict) {
    super(type, errorEventInitDict);

    if (!errorEventInitDict || !(errorEventInitDict.error instanceof DOMException)) {
      throw TypeError(
        "Failed to construct 'SensorErrorEvent':" +
        "2nd argument much contain 'error' property"
      );
    }

    Object.defineProperty(this, "error", {
      configurable: false,
      writable: false,
      value: errorEventInitDict.error
    });
  }
};

function defineOnEventListener(target, name) {
  Object.defineProperty(target, `on${name}`, {
    enumerable: true,
    configurable: false,
    writable: true,
    value: null
  });
}

const SensorState = {
  IDLE: 1,
  ACTIVATING: 2,
  ACTIVE: 3,
}

class Sensor extends EventTarget {
  constructor(options) {
    super();
    this[slot] = new WeakMap;

    defineOnEventListener(this, "reading");
    defineOnEventListener(this, "activate");
    defineOnEventListener(this, "error");

    defineReadonlyProperties(this, slot, {
      activated: false,
      hasReading: false,
      timestamp: null
    })

    this[slot].state = SensorState.IDLE;

    this[slot].notifyError = (message, name) => {
      let error = new SensorErrorEvent("error", {
        error: new DOMException(message, name)
      });
      this.dispatchEvent(error);
      this.stop();
    }

    this[slot].notifyActivatedState = () => {
      let activate = new Event("activate");
      this[slot].activated = true;
      this.dispatchEvent(activate);
      this[slot].state = SensorState.ACTIVE;
    }

    this[slot].activateCallback = () => {};
    this[slot].deactivateCallback = () => {};

    this[slot].frequency = null;

    if (window && window.parent != window.top) {
      throw new DOMException("Only instantiable in a top-level browsing context", "SecurityError");
    }

    if (options && typeof(options.frequency) == "number") {
      if (options.frequency > 60) {
        this.frequency = options.frequency;
      }
    }
  }

  start() {
    if (this[slot].state === SensorState.ACTIVATING || this[slot].state === SensorState.ACTIVE) {
      return;
    }
    this[slot].state = SensorState.ACTIVATING;
    this[slot].activateCallback();
  }

  stop() {
    if (this[slot].state === SensorState.IDLE) {
      return;
    }
    this[slot].activated = false;
    this[slot].hasReading = false;
    this[slot].timestamp = null;
    this[slot].deactivateCallback();

    this[slot].state = SensorState.IDLE;
  }
}

/***/ }),

/***/ 72389:
/*!**************************************************!*\
  !*** ./runestone/cellbotics/js/simple_sensor.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SimpleAbsoluteOrientationSensor: () => (/* binding */ SimpleAbsoluteOrientationSensor),
/* harmony export */   SimpleAccelerometer: () => (/* binding */ SimpleAccelerometer),
/* harmony export */   SimpleAmbientLightSensor: () => (/* binding */ SimpleAmbientLightSensor),
/* harmony export */   SimpleGeolocationSensor: () => (/* binding */ SimpleGeolocationSensor),
/* harmony export */   SimpleGravitySensor: () => (/* binding */ SimpleGravitySensor),
/* harmony export */   SimpleGyroscope: () => (/* binding */ SimpleGyroscope),
/* harmony export */   SimpleLinearAccelerationSensor: () => (/* binding */ SimpleLinearAccelerationSensor),
/* harmony export */   SimpleMagnetometer: () => (/* binding */ SimpleMagnetometer),
/* harmony export */   SimpleRelativeOrientationSensor: () => (/* binding */ SimpleRelativeOrientationSensor)
/* harmony export */ });
/* harmony import */ var _permissions_polyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./permissions_polyfill.js */ 64617);
/* harmony import */ var _permissions_polyfill_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_permissions_polyfill_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sensor_polyfill_geolocation_sensor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sensor_polyfill/geolocation-sensor.js */ 6713);
/* harmony import */ var _sensor_polyfill_motion_sensors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sensor_polyfill/motion-sensors.js */ 1981);
/* harmony import */ var _auto_bind_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auto-bind.js */ 34630);
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
// **********************************
// |docname| - Interface with sensors
// **********************************
// This provides code to access `sensor APIs <https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs>`_.







// SimpleSensor
// ============
// This class wraps a `Sensor <https://developer.mozilla.org/en-US/docs/Web/API/Sensor>`_ with simple ``start``, ``ready``, and ``stop`` functions.
class SimpleSensor {
    constructor() {
        (0,_auto_bind_js__WEBPACK_IMPORTED_MODULE_3__.auto_bind)(this);

        this.sensor = null;
    }

    // This was initially based on the MDN Sensor API docs.
    async start(
        // The class to use for the sensor to start. It must be based on the Sensor interface.
        sensor_class,
        // An array of strings, giving the name of the API to ask permissions of for this sensor. See https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query.
        sensor_permission,
        // Options to pass to this sensor's constructor.
        sensor_options
    ) {
        if (this.sensor) {
            throw "In use. Stop the sensor before starting another.";
        }
        if (typeof sensor_class !== "function") {
            throw "Not available.";
        }

        // Get permission to use these sensors, if the API is supported.
        if (navigator.permissions) {
            let result = await Promise.all(sensor_permission.map(x => navigator.permissions.query({ name: x })));
            if (!result.every(val => val.state === "granted")) {
                throw `Permission to use the ${sensor_permission} sensor was denied.`;
            }
        }

        // To access a sensor:
        //
        // #.   Create it, then start it, synchronously checking for errors in this process.
        // #.   Await for a response from the sensor: an acceptance indicating the sensor works, or a rejection indicating a failure.
        //
        // Since the event handlers to accept or reject the promise must be set up in the synchronous phase, wrap everything in a promise. All the operations above therefore start when the promise is awaited.
        this.sensor = null;
        let on_error;
        let on_reading;
        let p = new Promise((resolve, reject) => {
            try {
                this.sensor = new sensor_class(sensor_options);

                // Handle callback errors by rejecting the promise.
                let that = this;
                on_error = event => {
                    that.sensor.removeEventListener("error", on_error);
                    // Handle runtime errors.
                    if (event.error.name === 'NotAllowedError') {
                        reject("Access to this sensor is not allowed.");
                    } else if (event.error.name === 'NotReadableError' ) {
                        reject('Cannot connect to the sensor.');
                    }
                    reject(`Unknown error: ${event.error.name}`);

                }
                this.sensor.addEventListener('error', on_error);

                // Wait for the first sensor reading to accept the promise.
                on_reading = event => {

                    that.sensor.removeEventListener("reading", on_reading);
                    resolve();
                }
                this.sensor.addEventListener("reading", on_reading);

                this.sensor.start();
            } catch (error) {
                // Handle construction errors.
                if (error.name === 'SecurityError') {
                    // See the note above about feature policy.
                    reject("Sensor construction was blocked by a feature policy.");
                } else if (error.name === 'ReferenceError') {
                    reject("Sensor is not supported by the User Agent.");
                } else {
                    reject(error);
                }
            }
        });

        // Start the sensor, waiting until it produces a reading or an error.
        try {
            console.log(`Await ${new Date()}`);
            await p;
        } catch (err) {
            this.stop();
            throw err;
        } finally {
            console.log(`Done ${new Date()}`);
            this.sensor.removeEventListener("error", on_error);
            this.sensor.removeEventListener("reading", on_reading);
        }
    }

    // True if the sensor is activated and has a reading.
    get ready() {
        return this.sensor && this.sensor.activated && this.sensor.hasReading;
    }

    // To save device power, be sure to stop the sensor as soon as the readings are no longer needed.
    stop() {
        this.sensor && this.sensor.stop();
        this.sensor = null;
    }
}


// Abstract helper classes
// =======================
// Several sensors return x, y, and z values. Collect the common code here.
class SimpleXYZSensor extends SimpleSensor {
    get x() {
        return this.sensor.x;
    }

    get y() {
        return this.sensor.y;
    }

    get z() {
        return this.sensor.z;
    }
}


// Two sensors return a quaternion or rotation matrix.
class SimpleOrientationSensor extends SimpleSensor {
    get quaternion() {
        return this.sensor.quaternion;
    }

    populateMatrix(targetMatrix) {
        return this.sensor.populateMatrix(targetMatrix);
    }
}


// Concrete classes
// ================
// Note the use of ``window.SensorName`` instead of ``SensorName`` for non-polyfills. This avoids exceptions if the particular sensor isn't defined, producing an ``undefined`` instead. For polyfills, we must use ``SensorName`` instead of ``window.SensorName``.
class SimpleAmbientLightSensor extends SimpleSensor {
    async start(als_options) {
        return super.start(window.AmbientLightSensor, ["ambient-light-sensor"], als_options);
    }

    get illuminance() {
        return this.sensor.illuminance;
    }
}


// See the `W3C draft spec <https://w3c.github.io/geolocation-sensor/#geolocationsensor-interface>`_.
class SimpleGeolocationSensor extends SimpleSensor {
    async start(geo_options) {
        return super.start(GeolocationSensor, ["geolocation"], geo_options);
    }

    get latitude() {
        return this.sensor.latitude;
    }

    get longitude() {
        return this.sensor.longitude;
    }

    get altitude() {
        return this.sensor.altitude;
    }

    get accuracy() {
        return this.sensor.accuracy;
    }

    get altitudeAccuracy() {
        return this.sensor.altitudeAccuracy;
    }

    get heading() {
        return this.sensor.heading;
    }

    get speed() {
        return this.sensor.speed;
    }
}


class SimpleAccelerometer extends SimpleXYZSensor {
    async start(accelerometer_options) {
        return super.start(Accelerometer, ["accelerometer"], accelerometer_options);
    }
}


class SimpleGyroscope extends SimpleXYZSensor {
    async start(gyro_options) {
        return super.start(Gyroscope, ["gyroscope"], gyro_options);
    }
}


class SimpleLinearAccelerationSensor extends SimpleXYZSensor {
    async start(accel_options) {
        return super.start(LinearAccelerationSensor, ["accelerometer"], accel_options);
    }
}


class SimpleGravitySensor extends SimpleXYZSensor {
    async start(grav_options) {
        return super.start(GravitySensor, ["accelerometer"], grav_options);
    }
}


class SimpleMagnetometer extends SimpleXYZSensor {
    async start(mag_options) {
        return super.start(window.Magnetometer, ["magnetometer"], mag_options);
    }
}


class SimpleAbsoluteOrientationSensor extends SimpleOrientationSensor {
    async start(orient_options) {
        return super.start(AbsoluteOrientationSensor, ["accelerometer", "gyroscope", "magnetometer"], orient_options);
    }
}


class SimpleRelativeOrientationSensor extends SimpleOrientationSensor {
    async start(orient_options) {
        return super.start(RelativeOrientationSensor, ["accelerometer", "gyroscope"], orient_options);
    }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9jZWxsYm90aWNzX2pzX3NpbXBsZV9zZW5zb3JfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7O0FBR2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7O0FBR0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMElBQTBJLGlCQUFpQixlQUFlLGdCQUFnQjtBQUMxTCx5Q0FBeUM7QUFDekM7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSx3Q0FBd0MsaUJBQWlCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUVROztBQUVyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELG1CQUFtQjtBQUNoRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0I7QUFDeEI7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUVROztBQUVyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsVUFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhFQUE4RSxlQUFlO0FBQzdGOztBQUVBO0FBQ0EsaUZBQWlGLGVBQWU7QUFDaEc7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDL1pBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLHFCQUFxQjtBQUNyRDtBQUNBLGtDQUFrQyxjQUFjO0FBQ2hEOztBQUVBLDhCQUE4QixXQUFXO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDLG1DQUFtQzs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLEtBQUs7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFc0I7QUFDYztBQUNKO0FBQ0Y7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHdEQUFTOztBQUVqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0dBQW9HLFNBQVM7QUFDN0c7QUFDQSwrQ0FBK0MsbUJBQW1CO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSw2Q0FBNkMsaUJBQWlCOztBQUU5RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsaUNBQWlDLFdBQVc7QUFDNUM7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVixnQ0FBZ0MsV0FBVztBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ087QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NlbGxib3RpY3MvanMvYXV0by1iaW5kLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9wZXJtaXNzaW9uc19wb2x5ZmlsbC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NlbGxib3RpY3MvanMvc2Vuc29yX3BvbHlmaWxsL2dlb2xvY2F0aW9uLXNlbnNvci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NlbGxib3RpY3MvanMvc2Vuc29yX3BvbHlmaWxsL21vdGlvbi1zZW5zb3JzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9zZW5zb3JfcG9seWZpbGwvc2Vuc29yLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9zaW1wbGVfc2Vuc29yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIC4uIENvcHlyaWdodCAoQykgMjAxMi0yMDIwIEJyeWFuIEEuIEpvbmVzLlxuLy9cbi8vICBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQ2VsbEJvdGljcyBzeXN0ZW0uXG4vL1xuLy8gIFRoZSBDZWxsQm90aWNzIHN5c3RlbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3Jcbi8vICBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhc1xuLy8gIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZVxuLy8gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gIFRoZSBDZWxsQm90aWNzIHN5c3RlbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmVcbi8vICB1c2VmdWwsIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5XG4vLyAgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZSBHTlVcbi8vICBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyAgYWxvbmcgd2l0aCB0aGUgQ2VsbEJvdGljcyBzeXN0ZW0uICBJZiBub3QsIHNlZVxuLy8gIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbi8vXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIEF1dG9tYXRpY2FsbHkgYmluZCBtZXRob2RzIHRvIHRoZWlyIGluc3RhbmNlc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8vIFRoZSBmb2xsb3dpbmcgdHdvIGZ1bmN0aW9ucyB3ZXJlIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hdXRvLWJpbmQvYmxvYi9tYXN0ZXIvaW5kZXguanMgYW5kIGxpZ2h0bHkgbW9kaWZpZWQuIFRoZXkgcHJvdmlkZSBhbiBlYXN5IHdheSB0byBiaW5kIGFsbCBjYWxsYWJsZSBtZXRob2RzIHRvIHRoZWlyIGluc3RhbmNlLiBTZWUgYEJpbmRpbmcgTWV0aG9kcyB0byBDbGFzcyBJbnN0YW5jZSBPYmplY3RzIDxodHRwczovL3Bvbnlmb28uY29tL2FydGljbGVzL2JpbmRpbmctbWV0aG9kcy10by1jbGFzcy1pbnN0YW5jZS1vYmplY3RzPmBfIGZvciBtb3JlIGRpc2N1c3Npb24gb24gdGhpcyBjcmF6eSBKYXZhU2NyaXB0IG5lY2Vzc2l0eS5cbi8vXG4vLyBHZXRzIGFsbCBub24tYnVpbHRpbiBwcm9wZXJ0aWVzIHVwIHRoZSBwcm90b3R5cGUgY2hhaW5cbmNvbnN0IGdldEFsbFByb3BlcnRpZXMgPSBvYmplY3QgPT4ge1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gbmV3IFNldCgpO1xuXG5cdGRvIHtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMob2JqZWN0KSkge1xuXHRcdFx0cHJvcGVydGllcy5hZGQoW29iamVjdCwga2V5XSk7XG5cdFx0fVxuXHR9IHdoaWxlICgob2JqZWN0ID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpKSAmJiBvYmplY3QgIT09IE9iamVjdC5wcm90b3R5cGUpO1xuXG5cdHJldHVybiBwcm9wZXJ0aWVzO1xufTtcblxuXG4vLyBJbnZva2UgdGhpcyBpbiB0aGUgY29uc3RydWN0b3Igb2YgYW4gb2JqZWN0LlxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9fYmluZChzZWxmKSB7XG4gICAgZm9yIChjb25zdCBbb2JqZWN0LCBrZXldIG9mIGdldEFsbFByb3BlcnRpZXMoc2VsZi5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHNlbGZba2V5XSA9IHNlbGZba2V5XS5iaW5kKHNlbGYpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gLi4gQ29weXJpZ2h0IChDKSAyMDEyLTIwMjAgQnJ5YW4gQS4gSm9uZXMuXG4vL1xuLy8gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBDZWxsQm90aWNzIHN5c3RlbS5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuLy8gIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4vLyAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4vLyAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZVxuLy8gIHVzZWZ1bCwgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHlcbi8vICBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlIEdOVVxuLy8gIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vICBhbG9uZyB3aXRoIHRoZSBDZWxsQm90aWNzIHN5c3RlbS4gIElmIG5vdCwgc2VlXG4vLyAgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBQb2x5ZmlsbCBmb3IgdGhlIFBlcm1pc3Npb25zIEFQSVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgaXMgcHJpbWFyaWx5IGZvciBpT1MgZGV2aWNlcyB0aGF0IGRvbid0IHByb3ZpZGUgUGVybWlzc2lvbnMsIGJ1dCB1c2UgYW5vdGhlciBtZXRob2QgdG8gYWxsb3cgYWNjZXNzIHRvIHZhcmlvdXMgc2Vuc29ycy5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIE9ubHkgc3VwcGx5IHRoaXMgaWYgdGhlcmUncyBub3QgUGVybWlzc2lvbnMgYW5kIHdlIGhhdmUgdG5lIGlPUyBmbGF2b3IgYXZhaWxhYmxlLiBTZWUgc2FtcGxlIGNvZGUgaW4gaHR0cHM6Ly9kZXYudG8vbGkvaG93LXRvLXJlcXVlc3RwZXJtaXNzaW9uLWZvci1kZXZpY2Vtb3Rpb24tYW5kLWRldmljZW9yaWVudGF0aW9uLWV2ZW50cy1pbi1pb3MtMTMtNDZnMiBvciB0aGUgYFczQyB3b3JraW5nIGRyYWZ0IDxodHRwczovL3d3dy53My5vcmcvVFIvb3JpZW50YXRpb24tZXZlbnQvI2RldmljZW9yaWVudGF0aW9uPmBfLlxuaWYgKFxuICAgICFuYXZpZ2F0b3IucGVybWlzc2lvbnMgJiZcbiAgICAodHlwZW9mIERldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSBcImZ1bmN0aW9uXCIpICYmXG4gICAgKHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uID09PSBcImZ1bmN0aW9uXCIpXG4pIHtcbiAgICBuYXZpZ2F0b3IucGVybWlzc2lvbnMgPSB7XG4gICAgICAgIHF1ZXJ5OiBvcHRpb25zID0+IHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBldmVyeXRoaW5nIGJ1dCB0aGUgbmFtZSwgc2luY2Ugb3VyIHVzZSBjYXNlIGlzIG9ubHkgZm9yIFNpbXBsZVNlbnNvci5cbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImFjY2VsZXJvbWV0ZXJcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZ3lyb3Njb3BlXCI6XG4gICAgICAgICAgICAgICAgLy8gVGhlIHJlcXVlc3RlZCBwZXJtaXNzaW9ucyBkb2Vzbid0IGFsbG93IHVzIHRvIGRldGVybWluZSB3aGljaCBvZiB0aGUgZm9sbG93aW5nIHR3byBwZXJtaXNzaW9ucyB3ZSBuZWVkLCBzbyBhc2sgZm9yIGJvdGguXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHBvbHlmaWxsIGZvciB0aGUgYWNjZWxlcm9tZXRlciwgZ3lybywgYW5kIHJlbGF0ZWQgY2xhc3NlcyBuZWVkcyBqdXN0IHRoaXMuXG4gICAgICAgICAgICAgICAgICAgICAgICBEZXZpY2VNb3Rpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHBvbHlmaWxsIGZvciB0aGUgb3JpZW50YXRpb24gc2Vuc29ycyBuZWVkcyBqdXN0IHRoaXMuXG4gICAgICAgICAgICAgICAgICAgICAgICBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKClcbiAgICAgICAgICAgICAgICAgICAgXSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIG5vdyBoYXZlIGFuIGFycmF5IG9mIHN0cmluZ3MsIHRoZSByZXN1bHQgb2YgdGhlIHJlcXVlc3RQZXJtaXNzaW9uIGNhbGxzLiBJZiBhbGwgYXJlIFwiZ3JhbnRlZFwiLCB0aGVuIHJldHVybiB7c3RhdGU6IFwiZ3JhbnRlZFwifSwgZWxzZSByZXR1cm4ge3N0YXRlOiBcImRlbmllZFwifS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgPT4gcmVzb2x2ZSh7c3RhdGU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHMuZXZlcnkoeCA9PiB4ID09PSBcImdyYW50ZWRcIikgPyBcImdyYW50ZWRcIiA6IFwiZGVuaWVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBUaGVyZSdzIG5vdGhpbmcgZWxzZSB0aGF0IG5lZWRzIHBlcm1pc3Npb24gdG8gd29yay5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe3N0YXRlOiBcImdyYW50ZWRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gR2VvbG9jYXRpb24gc2Vuc29yIHBvbHlmaWxsXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEB0cy1jaGVja1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4vc2Vuc29yLmpzXCI7XG5cbi8vY29uc3Qgc2xvdCA9IF9fc2Vuc29yX187XG5cbmNsYXNzIEdlb2xvY2F0aW9uU2Vuc29yU2luZ2xldG9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnN0cnVjdG9yLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmluc3RhbmNlID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLnNlbnNvcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy53YXRjaElkID0gbnVsbDtcbiAgICB0aGlzLmFjY3VyYWN5ID0gbnVsbDtcbiAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5pbnN0YW5jZTtcbiAgfVxuXG4gIGFzeW5jIG9idGFpblBlcm1pc3Npb24oKSB7XG4gICAgbGV0IHN0YXRlID0gXCJwcm9tcHRcIjsgLy8gRGVmYXVsdCBmb3IgZ2VvbG9jYXRpb24uXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmIChuYXZpZ2F0b3IucGVybWlzc2lvbnMpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IHBlcm1pc3Npb24gPSBhd2FpdCBuYXZpZ2F0b3IucGVybWlzc2lvbnMucXVlcnkoeyBuYW1lOlwiZ2VvbG9jYXRpb25cIn0pO1xuICAgICAgc3RhdGUgPSBwZXJtaXNzaW9uLnN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3NGbiA9IHBvc2l0aW9uID0+IHtcbiAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgcmVzb2x2ZShcImdyYW50ZWRcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVycm9yRm4gPSBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IGVyci5QRVJNSVNTSU9OX0RFTklFRCkge1xuICAgICAgICAgIHJlc29sdmUoXCJkZW5pZWRcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgbWF4aW11bUFnZTogSW5maW5pdHksIHRpbWVvdXQ6IDEwIH07XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKHN1Y2Nlc3NGbiwgZXJyb3JGbiwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVBY2N1cmFjeSgpIHtcbiAgICBsZXQgZW5hYmxlSGlnaEFjY3VyYWN5ID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHNlbnNvciBvZiB0aGlzLnNlbnNvcnMpIHtcbiAgICAgIGlmIChzZW5zb3Jbc2xvdF0ub3B0aW9ucy5hY2N1cmFjeSA9PT0gXCJoaWdoXCIpIHtcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5ID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVIaWdoQWNjdXJhY3k7XG4gIH1cblxuICBhc3luYyByZWdpc3RlcihzZW5zb3IpIHtcbiAgICBjb25zdCBwZXJtaXNzaW9uID0gYXdhaXQgdGhpcy5vYnRhaW5QZXJtaXNzaW9uKCk7XG4gICAgaWYgKHBlcm1pc3Npb24gIT09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICBzZW5zb3Jbc2xvdF0ubm90aWZ5RXJyb3IoXCJQZXJtaXNzaW9uIGRlbmllZC5cIiwgXCJOb3dBbGxvd2VkRXJyb3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGFzdFBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBhZ2UgPSBwZXJmb3JtYW5jZS5ub3coKSAtIHRoaXMubGFzdFBvc2l0aW9uLnRpbWVTdGFtcDtcbiAgICAgIGNvbnN0IG1heEFnZSA9IHNlbnNvcltzbG90XS5vcHRpb25zLm1heEFnZTtcbiAgICAgIGlmIChtYXhBZ2UgPT0gbnVsbCB8fCBhZ2UgPD0gbWF4QWdlKSB7XG4gICAgICAgIHNlbnNvcltzbG90XS5oYW5kbGVFdmVudChhZ2UsIHRoaXMubGFzdFBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZW5zb3JzLmFkZChzZW5zb3IpO1xuXG4gICAgLy8gQ2hlY2sgd2hldGhlciB3ZSBuZWVkIHRvIHJlY29uZmlndXJlIG91ciBuYXZpZ2F0aW9uLmdlb2xvY2F0aW9uXG4gICAgLy8gd2F0Y2gsIGllLiB0ZWFyIGl0IGRvd24gYW5kIHJlY3JlYXRlLlxuICAgIGNvbnN0IGFjY3VyYWN5ID0gdGhpcy5jYWxjdWxhdGVBY2N1cmFjeSgpO1xuICAgIGlmICh0aGlzLndhdGNoSWQgJiYgdGhpcy5hY2N1cmFjeSA9PT0gYWNjdXJhY3kpIHtcbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gcmVzZXQsIHJldHVybi5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy53YXRjaElkKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaCh0aGlzLndhdGNoSWQpO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZUV2ZW50ID0gcG9zaXRpb24gPT4ge1xuICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgY29uc3QgdGltZXN0YW1wID0gcG9zaXRpb24udGltZXN0YW1wIC0gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDtcbiAgICAgIGNvbnN0IGNvb3JkcyA9IHBvc2l0aW9uLmNvb3JkcztcblxuICAgICAgZm9yIChjb25zdCBzZW5zb3Igb2YgdGhpcy5zZW5zb3JzKSB7XG4gICAgICAgIHNlbnNvcltzbG90XS5oYW5kbGVFdmVudCh0aW1lc3RhbXAsIGNvb3Jkcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlRXJyb3IgPSBlcnJvciA9PiB7XG4gICAgICBsZXQgdHlwZTtcbiAgICAgIHN3aXRjaChlcnJvci5jb2RlKSB7XG4gICAgICAgIGNhc2UgZXJyb3IuVElNRU9VVDpcbiAgICAgICAgICB0eXBlID0gXCJUaW1lb3V0RXJyb3JcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBlcnJvci5QRVJNSVNTSU9OX0RFTklFRDpcbiAgICAgICAgICB0eXBlID0gXCJOb3RBbGxvd2VkRXJyb3JcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBlcnJvci5QT1NJVElPTl9VTkFWQUlMQUJMRTpcbiAgICAgICAgICB0eXBlID0gXCJOb3RSZWFkYWJsZUVycm9yXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdHlwZSA9IFwiVW5rbm93bkVycm9yXCI7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IHNlbnNvciBvZiB0aGlzLnNlbnNvcnMpIHtcbiAgICAgICAgc2Vuc29yW3Nsb3RdLmhhbmRsZUVycm9yKGVycm9yLm1lc3NhZ2UsIHR5cGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IGFjY3VyYWN5LFxuICAgICAgbWF4aW11bUFnZTogMCxcbiAgICAgIHRpbWVvdXQ6IEluZmluaXR5XG4gICAgfVxuXG4gICAgdGhpcy53YXRjaElkID0gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24oXG4gICAgICBoYW5kbGVFdmVudCwgaGFuZGxlRXJyb3IsIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgZGVyZWdpc3RlcihzZW5zb3IpIHtcbiAgICB0aGlzLnNlbnNvcnMuZGVsZXRlKHNlbnNvcik7XG4gICAgaWYgKCF0aGlzLnNlbnNvcnMuc2l6ZSAmJiB0aGlzLndhdGNoSWQpIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMud2F0Y2hJZCk7XG4gICAgICB0aGlzLndhdGNoSWQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBHZW9sb2NhdGlvblNlbnNvciA9IHdpbmRvdy5HZW9sb2NhdGlvblNlbnNvciB8fFxuY2xhc3MgR2VvbG9jYXRpb25TZW5zb3IgZXh0ZW5kcyBTZW5zb3Ige1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXNbc2xvdF0ub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIGxhdGl0dWRlOiBudWxsLFxuICAgICAgbG9uZ2l0dWRlOiBudWxsLFxuICAgICAgYWx0aXR1ZGU6IG51bGwsXG4gICAgICBhY2N1cmFjeTogbnVsbCxcbiAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IG51bGwsXG4gICAgICBoZWFkaW5nOiBudWxsLFxuICAgICAgc3BlZWQ6IG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wZXJ0eUJhZyA9IHRoaXNbc2xvdF07XG4gICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgcHJvcGVydHlCYWdbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHByb3BOYW1lLCB7XG4gICAgICAgIGdldDogKCkgPT4gcHJvcGVydHlCYWdbcHJvcE5hbWVdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmhhbmRsZUV2ZW50ID0gKHRpbWVzdGFtcCwgY29vcmRzKSA9PiB7XG4gICAgICBpZiAoIXRoaXNbc2xvdF0uYWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5QWN0aXZhdGVkU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1tzbG90XS50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG5cbiAgICAgIHRoaXNbc2xvdF0uYWNjdXJhY3kgPSBjb29yZHMuYWNjdXJhY3k7XG4gICAgICB0aGlzW3Nsb3RdLmFsdGl0dWRlID0gY29vcmRzLmFsdGl0dWRlO1xuICAgICAgdGhpc1tzbG90XS5hbHRpdHVkZUFjY3VyYWN5ID0gY29vcmRzLmFsdGl0dWRlQWNjdXJhY3k7XG4gICAgICB0aGlzW3Nsb3RdLmhlYWRpbmcgPSBjb29yZHMuaGVhZGluZztcbiAgICAgIHRoaXNbc2xvdF0ubGF0aXR1ZGUgPSBjb29yZHMubGF0aXR1ZGU7XG4gICAgICB0aGlzW3Nsb3RdLmxvbmdpdHVkZSA9IGNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICB0aGlzW3Nsb3RdLnNwZWVkID0gY29vcmRzLnNwZWVkO1xuXG4gICAgICB0aGlzW3Nsb3RdLmhhc1JlYWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWRpbmdcIikpO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXJyb3IgPSAobWVzc2FnZSwgdHlwZSkgPT4ge1xuICAgICAgdGhpc1tzbG90XS5ub3RpZnlFcnJvcihtZXNzYWdlLCB0eXBlKTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAobmV3IEdlb2xvY2F0aW9uU2Vuc29yU2luZ2xldG9uKCkpLnJlZ2lzdGVyKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgKG5ldyBHZW9sb2NhdGlvblNlbnNvclNpbmdsZXRvbigpKS5kZXJlZ2lzdGVyKHRoaXMpO1xuICAgIH1cbiAgfVxufSIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBNb3Rpb24gc2Vuc29ycyBwb2x5ZmlsbFxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEB0cy1jaGVja1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4vc2Vuc29yLmpzXCI7XG5cbi8vY29uc3Qgc2xvdCA9IF9fc2Vuc29yX187XG5cbmxldCBvcmllbnRhdGlvbjtcblxuLy8gQHRzLWlnbm9yZVxuaWYgKHNjcmVlbi5vcmllbnRhdGlvbikge1xuICAvLyBAdHMtaWdub3JlXG4gIG9yaWVudGF0aW9uID0gc2NyZWVuLm9yaWVudGF0aW9uO1xufSBlbHNlIGlmIChzY3JlZW4ubXNPcmllbnRhdGlvbikge1xuICBvcmllbnRhdGlvbiA9IHNjcmVlbi5tc09yaWVudGF0aW9uO1xufSBlbHNlIHtcbiAgb3JpZW50YXRpb24gPSB7fTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9yaWVudGF0aW9uLCBcImFuZ2xlXCIsIHtcbiAgICBnZXQ6ICgpID0+IHsgcmV0dXJuICh3aW5kb3cub3JpZW50YXRpb24gfHwgMCkgfVxuICB9KTtcbn1cblxuY29uc3QgRGV2aWNlT3JpZW50YXRpb25NaXhpbiA9IChzdXBlcmNsYXNzLCAuLi5ldmVudE5hbWVzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHN1cGVyKGFyZ3MpO1xuXG4gICAgZm9yIChjb25zdCBldmVudE5hbWUgb2YgZXZlbnROYW1lcykge1xuICAgICAgaWYgKGBvbiR7ZXZlbnROYW1lfWAgaW4gd2luZG93KSB7XG4gICAgICAgIHRoaXNbc2xvdF0uZXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcih0aGlzW3Nsb3RdLmV2ZW50TmFtZSwgdGhpc1tzbG90XS5oYW5kbGVFdmVudCwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpc1tzbG90XS5ldmVudE5hbWUsIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQsIHsgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHRvUXVhdGVybmlvbkZyb21FdWxlcihhbHBoYSwgYmV0YSwgZ2FtbWEpIHtcbiAgY29uc3QgZGVnVG9SYWQgPSBNYXRoLlBJIC8gMTgwXG5cbiAgY29uc3QgeCA9IChiZXRhIHx8IDApICogZGVnVG9SYWQ7XG4gIGNvbnN0IHkgPSAoZ2FtbWEgfHwgMCkgKiBkZWdUb1JhZDtcbiAgY29uc3QgeiA9IChhbHBoYSB8fCAwKSAqIGRlZ1RvUmFkO1xuXG4gIGNvbnN0IGNaID0gTWF0aC5jb3MoeiAqIDAuNSk7XG4gIGNvbnN0IHNaID0gTWF0aC5zaW4oeiAqIDAuNSk7XG4gIGNvbnN0IGNZID0gTWF0aC5jb3MoeSAqIDAuNSk7XG4gIGNvbnN0IHNZID0gTWF0aC5zaW4oeSAqIDAuNSk7XG4gIGNvbnN0IGNYID0gTWF0aC5jb3MoeCAqIDAuNSk7XG4gIGNvbnN0IHNYID0gTWF0aC5zaW4oeCAqIDAuNSk7XG5cbiAgY29uc3QgcXggPSBzWCAqIGNZICogY1ogLSBjWCAqIHNZICogc1o7XG4gIGNvbnN0IHF5ID0gY1ggKiBzWSAqIGNaICsgc1ggKiBjWSAqIHNaO1xuICBjb25zdCBxeiA9IGNYICogY1kgKiBzWiArIHNYICogc1kgKiBjWjtcbiAgY29uc3QgcXcgPSBjWCAqIGNZICogY1ogLSBzWCAqIHNZICogc1o7XG5cbiAgcmV0dXJuIFtxeCwgcXksIHF6LCBxd107XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZVF1YXRlcm5pb25CeUF4aXNBbmdsZShxdWF0LCBheGlzLCBhbmdsZSkge1xuICBjb25zdCBzSGFsZkFuZ2xlID0gTWF0aC5zaW4oYW5nbGUgLyAyKTtcbiAgY29uc3QgY0hhbGZBbmdsZSA9IE1hdGguY29zKGFuZ2xlIC8gMik7XG5cbiAgY29uc3QgdHJhbnNmb3JtUXVhdCA9IFtcbiAgICBheGlzWzBdICogc0hhbGZBbmdsZSxcbiAgICBheGlzWzFdICogc0hhbGZBbmdsZSxcbiAgICBheGlzWzJdICogc0hhbGZBbmdsZSxcbiAgICBjSGFsZkFuZ2xlXG4gIF07XG5cbiAgZnVuY3Rpb24gbXVsdGlwbHlRdWF0ZXJuaW9uKGEsIGIpIHtcbiAgICBjb25zdCBxeCA9IGFbMF0gKiBiWzNdICsgYVszXSAqIGJbMF0gKyBhWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdO1xuICAgIGNvbnN0IHF5ID0gYVsxXSAqIGJbM10gKyBhWzNdICogYlsxXSArIGFbMl0gKiBiWzBdIC0gYVswXSAqIGJbMl07XG4gICAgY29uc3QgcXogPSBhWzJdICogYlszXSArIGFbM10gKiBiWzJdICsgYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbiAgICBjb25zdCBxdyA9IGFbM10gKiBiWzNdIC0gYVswXSAqIGJbMF0gLSBhWzFdICogYlsxXSAtIGFbMl0gKiBiWzJdO1xuXG4gICAgcmV0dXJuIFtxeCwgcXksIHF6LCBxd107XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVRdWF0ZXJuaW9uKHF1YXQpIHtcbiAgICBjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQocXVhdFswXSAqKiAyICsgcXVhdFsxXSAqKiAyICsgcXVhdFsyXSAqKiAyICsgcXVhdFszXSAqKiAyKTtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gWzAsIDAsIDAsIDFdO1xuICAgIH1cblxuICAgIHJldHVybiBxdWF0Lm1hcCh2ID0+IHYgLyBsZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZVF1YXRlcm5pb24obXVsdGlwbHlRdWF0ZXJuaW9uKHF1YXQsIHRyYW5zZm9ybVF1YXQpKTtcbn1cblxuZnVuY3Rpb24gdG9NYXQ0RnJvbVF1YXQobWF0LCBxKSB7XG4gIGNvbnN0IHR5cGVkID0gbWF0IGluc3RhbmNlb2YgRmxvYXQzMkFycmF5IHx8IG1hdCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheTtcblxuICBpZiAodHlwZWQgJiYgbWF0Lmxlbmd0aCA+PSAxNikge1xuICAgIG1hdFswXSA9IDEgLSAyICogKHFbMV0gKiogMiArIHFbMl0gKiogMik7XG4gICAgbWF0WzFdID0gMiAqIChxWzBdICogcVsxXSAtIHFbMl0gKiBxWzNdKTtcbiAgICBtYXRbMl0gPSAyICogKHFbMF0gKiBxWzJdICsgcVsxXSAqIHFbM10pO1xuICAgIG1hdFszXSA9IDA7XG5cbiAgICBtYXRbNF0gPSAyICogKHFbMF0gKiBxWzFdICsgcVsyXSAqIHFbM10pO1xuICAgIG1hdFs1XSA9IDEgLSAyICogKHFbMF0gKiogMiArIHFbMl0gKiogMik7XG4gICAgbWF0WzZdID0gMiAqIChxWzFdICogcVsyXSAtIHFbMF0gKiBxWzNdKTtcbiAgICBtYXRbN10gPSAwO1xuXG4gICAgbWF0WzhdID0gMiAqIChxWzBdICogcVsyXSAtIHFbMV0gKiBxWzNdKTtcbiAgICBtYXRbOV0gPSAyICogKHFbMV0gKiBxWzJdICsgcVswXSAqIHFbM10pO1xuICAgIG1hdFsxMF0gPSAxIC0gMiAqIChxWzBdICoqIDIgKyBxWzFdICoqIDIpO1xuICAgIG1hdFsxMV0gPSAwO1xuXG4gICAgbWF0WzEyXSA9IDA7XG4gICAgbWF0WzEzXSA9IDA7XG4gICAgbWF0WzE0XSA9IDA7XG4gICAgbWF0WzE1XSA9IDE7XG4gIH1cblxuICByZXR1cm4gbWF0O1xufVxuXG5mdW5jdGlvbiB3b3JsZFRvU2NyZWVuKHF1YXRlcm5pb24pIHtcbiAgcmV0dXJuICFxdWF0ZXJuaW9uID8gbnVsbCA6XG4gICAgcm90YXRlUXVhdGVybmlvbkJ5QXhpc0FuZ2xlKFxuICAgICAgcXVhdGVybmlvbixcbiAgICAgIFswLCAwLCAxXSxcbiAgICAgIC0gb3JpZW50YXRpb24uYW5nbGUgKiBNYXRoLlBJIC8gMTgwXG4gICAgKTtcbn1cblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgUmVsYXRpdmVPcmllbnRhdGlvblNlbnNvciA9IHdpbmRvdy5SZWxhdGl2ZU9yaWVudGF0aW9uU2Vuc29yIHx8XG5jbGFzcyBSZWxhdGl2ZU9yaWVudGF0aW9uU2Vuc29yIGV4dGVuZHMgRGV2aWNlT3JpZW50YXRpb25NaXhpbihTZW5zb3IsIFwiZGV2aWNlb3JpZW50YXRpb25cIikge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHN3aXRjaCAob3B0aW9ucy5jb29yZGluYXRlU3lzdGVtIHx8ICd3b3JsZCcpIHtcbiAgICAgIGNhc2UgJ3NjcmVlbic6XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInF1YXRlcm5pb25cIiwge1xuICAgICAgICAgIGdldDogKCkgPT4gd29ybGRUb1NjcmVlbih0aGlzW3Nsb3RdLnF1YXRlcm5pb24pXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dvcmxkJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInF1YXRlcm5pb25cIiwge1xuICAgICAgICAgIGdldDogKCkgPT4gdGhpc1tzbG90XS5xdWF0ZXJuaW9uXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBzZW5zb3Igd2Ugd2lsbCBnZXQgdmFsdWVzIGVxdWFsIHRvIG51bGwuXG4gICAgICBpZiAoZXZlbnQuYWJzb2x1dGUgfHwgZXZlbnQuYWxwaGEgPT09IG51bGwpIHtcbiAgICAgICAgLy8gU3BlYzogVGhlIGltcGxlbWVudGF0aW9uIGNhbiBzdGlsbCBkZWNpZGUgdG8gcHJvdmlkZVxuICAgICAgICAvLyBhYnNvbHV0ZSBvcmllbnRhdGlvbiBpZiByZWxhdGl2ZSBpcyBub3QgYXZhaWxhYmxlIG9yXG4gICAgICAgIC8vIHRoZSByZXN1bHRpbmcgZGF0YSBpcyBtb3JlIGFjY3VyYXRlLiBJbiBlaXRoZXIgY2FzZSxcbiAgICAgICAgLy8gdGhlIGFic29sdXRlIHByb3BlcnR5IG11c3QgYmUgc2V0IGFjY29yZGluZ2x5IHRvIHJlZmxlY3RcbiAgICAgICAgLy8gdGhlIGNob2ljZS5cbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlFcnJvcihcIkNvdWxkIG5vdCBjb25uZWN0IHRvIGEgc2Vuc29yXCIsIFwiTm90UmVhZGFibGVFcnJvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXNbc2xvdF0uYWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5QWN0aXZhdGVkU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1tzbG90XS50aW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgdGhpc1tzbG90XS5xdWF0ZXJuaW9uID0gdG9RdWF0ZXJuaW9uRnJvbUV1bGVyKFxuICAgICAgICBldmVudC5hbHBoYSxcbiAgICAgICAgZXZlbnQuYmV0YSxcbiAgICAgICAgZXZlbnQuZ2FtbWFcbiAgICAgICk7XG5cbiAgICAgIHRoaXNbc2xvdF0uaGFzUmVhZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicmVhZGluZ1wiKSk7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5kZWFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzW3Nsb3RdLnF1YXRlcm5pb24gPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHBvcHVsYXRlTWF0cml4KG1hdCkge1xuICAgIHRvTWF0NEZyb21RdWF0KG1hdCwgdGhpcy5xdWF0ZXJuaW9uKTtcbiAgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBBYnNvbHV0ZU9yaWVudGF0aW9uU2Vuc29yID0gd2luZG93LkFic29sdXRlT3JpZW50YXRpb25TZW5zb3IgfHxcbmNsYXNzIEFic29sdXRlT3JpZW50YXRpb25TZW5zb3IgZXh0ZW5kcyBEZXZpY2VPcmllbnRhdGlvbk1peGluKFxuICBTZW5zb3IsIFwiZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZVwiLCBcImRldmljZW9yaWVudGF0aW9uXCIpIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICBzd2l0Y2ggKG9wdGlvbnMuY29vcmRpbmF0ZVN5c3RlbSB8fCAnd29ybGQnKSB7XG4gICAgICBjYXNlICdzY3JlZW4nOlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJxdWF0ZXJuaW9uXCIsIHtcbiAgICAgICAgICBnZXQ6ICgpID0+IHdvcmxkVG9TY3JlZW4odGhpc1tzbG90XS5xdWF0ZXJuaW9uKVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3b3JsZCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJxdWF0ZXJuaW9uXCIsIHtcbiAgICAgICAgICBnZXQ6ICgpID0+IHRoaXNbc2xvdF0ucXVhdGVybmlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmhhbmRsZUV2ZW50ID0gZXZlbnQgPT4ge1xuICAgICAgLy8gSWYgYWJzb2x1dGUgaXMgc2V0LCBvciB3ZWJraXRDb21wYXNzSGVhZGluZyBleGlzdHMsXG4gICAgICAvLyBhYnNvbHV0ZSB2YWx1ZXMgc2hvdWxkIGJlIGF2YWlsYWJsZS5cbiAgICAgIGNvbnN0IGlzQWJzb2x1dGUgPSBldmVudC5hYnNvbHV0ZSA9PT0gdHJ1ZSB8fCBcIndlYmtpdENvbXBhc3NIZWFkaW5nXCIgaW4gZXZlbnQ7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IGV2ZW50LmFscGhhICE9PSBudWxsIHx8IGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghaXNBYnNvbHV0ZSB8fCAhaGFzVmFsdWUpIHtcbiAgICAgICAgLy8gU3BlYzogSWYgYW4gaW1wbGVtZW50YXRpb24gY2FuIG5ldmVyIHByb3ZpZGUgYWJzb2x1dGVcbiAgICAgICAgLy8gb3JpZW50YXRpb24gaW5mb3JtYXRpb24sIHRoZSBldmVudCBzaG91bGQgYmUgZmlyZWQgd2l0aFxuICAgICAgICAvLyB0aGUgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGF0dHJpYnV0ZXMgc2V0IHRvIG51bGwuXG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5RXJyb3IoXCJDb3VsZCBub3QgY29ubmVjdCB0byBhIHNlbnNvclwiLCBcIk5vdFJlYWRhYmxlRXJyb3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzW3Nsb3RdLmFjdGl2YXRlZCkge1xuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUFjdGl2YXRlZFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbc2xvdF0uaGFzUmVhZGluZyA9IHRydWU7XG4gICAgICB0aGlzW3Nsb3RdLnRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICBjb25zdCBoZWFkaW5nID0gZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT0gbnVsbCA/IDM2MCAtIGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nIDogZXZlbnQuYWxwaGE7XG5cbiAgICAgIHRoaXNbc2xvdF0ucXVhdGVybmlvbiA9IHRvUXVhdGVybmlvbkZyb21FdWxlcihcbiAgICAgICAgaGVhZGluZyxcbiAgICAgICAgZXZlbnQuYmV0YSxcbiAgICAgICAgZXZlbnQuZ2FtbWFcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJyZWFkaW5nXCIpKTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXNbc2xvdF0ucXVhdGVybmlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcG9wdWxhdGVNYXRyaXgobWF0KSB7XG4gICAgdG9NYXQ0RnJvbVF1YXQobWF0LCB0aGlzLnF1YXRlcm5pb24pO1xuICB9XG59XG5cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IEd5cm9zY29wZSA9IHdpbmRvdy5HeXJvc2NvcGUgfHxcbmNsYXNzIEd5cm9zY29wZSBleHRlbmRzIERldmljZU9yaWVudGF0aW9uTWl4aW4oU2Vuc29yLCBcImRldmljZW1vdGlvblwiKSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzW3Nsb3RdLmhhbmRsZUV2ZW50ID0gZXZlbnQgPT4ge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gc2Vuc29yIHdlIHdpbGwgZ2V0IHZhbHVlcyBlcXVhbCB0byBudWxsLlxuICAgICAgaWYgKGV2ZW50LnJvdGF0aW9uUmF0ZS5hbHBoYSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUVycm9yKFwiQ291bGQgbm90IGNvbm5lY3QgdG8gYSBzZW5zb3JcIiwgXCJOb3RSZWFkYWJsZUVycm9yXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpc1tzbG90XS5hY3RpdmF0ZWQpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlBY3RpdmF0ZWRTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzW3Nsb3RdLnRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICB0aGlzW3Nsb3RdLnggPSBldmVudC5yb3RhdGlvblJhdGUuYWxwaGE7XG4gICAgICB0aGlzW3Nsb3RdLnkgPSBldmVudC5yb3RhdGlvblJhdGUuYmV0YTtcbiAgICAgIHRoaXNbc2xvdF0ueiA9IGV2ZW50LnJvdGF0aW9uUmF0ZS5nYW1tYTtcblxuICAgICAgdGhpc1tzbG90XS5oYXNSZWFkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJyZWFkaW5nXCIpKTtcbiAgICB9XG5cbiAgICBkZWZpbmVSZWFkb25seVByb3BlcnRpZXModGhpcywgc2xvdCwge1xuICAgICAgeDogbnVsbCxcbiAgICAgIHk6IG51bGwsXG4gICAgICB6OiBudWxsXG4gICAgfSk7XG5cbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXNbc2xvdF0ueCA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnkgPSBudWxsO1xuICAgICAgdGhpc1tzbG90XS56ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgQWNjZWxlcm9tZXRlciA9IHdpbmRvdy5BY2NlbGVyb21ldGVyIHx8XG5jbGFzcyBBY2NlbGVyb21ldGVyIGV4dGVuZHMgRGV2aWNlT3JpZW50YXRpb25NaXhpbihTZW5zb3IsIFwiZGV2aWNlbW90aW9uXCIpIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBzZW5zb3Igd2Ugd2lsbCBnZXQgdmFsdWVzIGVxdWFsIHRvIG51bGwuXG4gICAgICBpZiAoZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ID09PSBudWxsKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5RXJyb3IoXCJDb3VsZCBub3QgY29ubmVjdCB0byBhIHNlbnNvclwiLCBcIk5vdFJlYWRhYmxlRXJyb3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzW3Nsb3RdLmFjdGl2YXRlZCkge1xuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUFjdGl2YXRlZFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbc2xvdF0udGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgIHRoaXNbc2xvdF0ueCA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcbiAgICAgIHRoaXNbc2xvdF0ueiA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkuejtcblxuICAgICAgdGhpc1tzbG90XS5oYXNSZWFkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJyZWFkaW5nXCIpKTtcbiAgICB9XG5cbiAgICBkZWZpbmVSZWFkb25seVByb3BlcnRpZXModGhpcywgc2xvdCwge1xuICAgICAgeDogbnVsbCxcbiAgICAgIHk6IG51bGwsXG4gICAgICB6OiBudWxsXG4gICAgfSk7XG5cbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXNbc2xvdF0ueCA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnkgPSBudWxsO1xuICAgICAgdGhpc1tzbG90XS56ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgTGluZWFyQWNjZWxlcmF0aW9uU2Vuc29yID0gd2luZG93LkxpbmVhckFjY2VsZXJhdGlvblNlbnNvciB8fFxuY2xhc3MgTGluZWFyQWNjZWxlcmF0aW9uU2Vuc29yIGV4dGVuZHMgRGV2aWNlT3JpZW50YXRpb25NaXhpbihTZW5zb3IsIFwiZGV2aWNlbW90aW9uXCIpIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBzZW5zb3Igd2Ugd2lsbCBnZXQgdmFsdWVzIGVxdWFsIHRvIG51bGwuXG4gICAgICBpZiAoZXZlbnQuYWNjZWxlcmF0aW9uLnggPT09IG51bGwpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlFcnJvcihcIkNvdWxkIG5vdCBjb25uZWN0IHRvIGEgc2Vuc29yXCIsIFwiTm90UmVhZGFibGVFcnJvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXNbc2xvdF0uYWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5QWN0aXZhdGVkU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1tzbG90XS50aW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgdGhpc1tzbG90XS54ID0gZXZlbnQuYWNjZWxlcmF0aW9uLng7XG4gICAgICB0aGlzW3Nsb3RdLnkgPSBldmVudC5hY2NlbGVyYXRpb24ueTtcbiAgICAgIHRoaXNbc2xvdF0ueiA9IGV2ZW50LmFjY2VsZXJhdGlvbi56O1xuXG4gICAgICB0aGlzW3Nsb3RdLmhhc1JlYWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWRpbmdcIikpO1xuICAgIH1cblxuICAgIGRlZmluZVJlYWRvbmx5UHJvcGVydGllcyh0aGlzLCBzbG90LCB7XG4gICAgICB4OiBudWxsLFxuICAgICAgeTogbnVsbCxcbiAgICAgIHo6IG51bGxcbiAgICB9KTtcblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpc1tzbG90XS54ID0gbnVsbDtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnogPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBHcmF2aXR5U2Vuc29yID0gd2luZG93LkdyYXZpdHlTZW5zb3IgfHxcbiBjbGFzcyBHcmF2aXR5U2Vuc29yIGV4dGVuZHMgRGV2aWNlT3JpZW50YXRpb25NaXhpbihTZW5zb3IsIFwiZGV2aWNlbW90aW9uXCIpIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBzZW5zb3Igd2Ugd2lsbCBnZXQgdmFsdWVzIGVxdWFsIHRvIG51bGwuXG4gICAgICBpZiAoZXZlbnQuYWNjZWxlcmF0aW9uLnggPT09IG51bGwgfHwgZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54ID09PSBudWxsKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5RXJyb3IoXCJDb3VsZCBub3QgY29ubmVjdCB0byBhIHNlbnNvclwiLCBcIk5vdFJlYWRhYmxlRXJyb3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzW3Nsb3RdLmFjdGl2YXRlZCkge1xuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUFjdGl2YXRlZFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbc2xvdF0udGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgIHRoaXNbc2xvdF0ueCA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueCAtIGV2ZW50LmFjY2VsZXJhdGlvbi54O1xuICAgICAgdGhpc1tzbG90XS55ID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55IC0gZXZlbnQuYWNjZWxlcmF0aW9uLnk7XG4gICAgICB0aGlzW3Nsb3RdLnogPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnogLSBldmVudC5hY2NlbGVyYXRpb24uejtcblxuICAgICAgdGhpc1tzbG90XS5oYXNSZWFkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJyZWFkaW5nXCIpKTtcbiAgICB9XG5cbiAgICBkZWZpbmVSZWFkb25seVByb3BlcnRpZXModGhpcywgc2xvdCwge1xuICAgICAgeDogbnVsbCxcbiAgICAgIHk6IG51bGwsXG4gICAgICB6OiBudWxsXG4gICAgfSk7XG5cbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXNbc2xvdF0ueCA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnkgPSBudWxsO1xuICAgICAgdGhpc1tzbG90XS56ID0gbnVsbDtcbiAgICB9XG4gIH1cbn0iLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gQmFzZSBTZW5zb3IgcG9seWZpbGxcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGUgYGdlb2xvY2F0aW9uLXNlbnNvci5qc2AgYW5kIGBtb3Rpb24tc2Vuc29ycy5qc2AgZmlsZXMgZGVwZW5kIG9uIHRoaXMuXG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyBAdHMtY2hlY2tcbmNvbnN0IF9fc2Vuc29yX18gPSBTeW1ib2woXCJfX3NlbnNvcl9fXCIpO1xuXG5jb25zdCBzbG90ID0gX19zZW5zb3JfXztcblxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIGRlc2NyaXB0aW9ucykge1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIGRlc2NyaXB0aW9ucykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogZGVzY3JpcHRpb25zW3Byb3BlcnR5XVxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IEV2ZW50VGFyZ2V0TWl4aW4gPSAoc3VwZXJjbGFzcywgLi4uZXZlbnROYW1lcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdXBlcihhcmdzKTtcbiAgICBjb25zdCBldmVudFRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciA9ICh0eXBlLCAuLi5hcmdzKSA9PiB7XG4gICAgICByZXR1cm4gZXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSAoLi4uYXJncykgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIGV2ZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50ID0gKGV2ZW50KSA9PiB7XG4gICAgICBkZWZpbmVQcm9wZXJ0aWVzKGV2ZW50LCB7IGN1cnJlbnRUYXJnZXQ6IHRoaXMgfSk7XG4gICAgICBpZiAoIWV2ZW50LnRhcmdldCkge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKGV2ZW50LCB7IHRhcmdldDogdGhpcyB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IGBvbiR7ZXZlbnQudHlwZX1gO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZE5hbWVdID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0oZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXRWYWx1ZSA9IGV2ZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG4gICAgICBpZiAocmV0VmFsdWUgJiYgdGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgZGVmaW5lUHJvcGVydGllcyhldmVudCwgeyBjdXJyZW50VGFyZ2V0OiBudWxsLCB0YXJnZXQ6IG51bGwgfSk7XG5cbiAgICAgIHJldHVybiByZXRWYWx1ZTtcbiAgICB9XG4gIH1cbn07XG5cbmNsYXNzIEV2ZW50VGFyZ2V0IGV4dGVuZHMgRXZlbnRUYXJnZXRNaXhpbihPYmplY3QpIHt9O1xuXG5mdW5jdGlvbiBkZWZpbmVSZWFkb25seVByb3BlcnRpZXModGFyZ2V0LCBzbG90LCBkZXNjcmlwdGlvbnMpIHtcbiAgY29uc3QgcHJvcGVydHlCYWcgPSB0YXJnZXRbc2xvdF07XG4gIGZvciAoY29uc3QgcHJvcGVydHkgaW4gZGVzY3JpcHRpb25zKSB7XG4gICAgcHJvcGVydHlCYWdbcHJvcGVydHldID0gZGVzY3JpcHRpb25zW3Byb3BlcnR5XTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwge1xuICAgICAgZ2V0OiAoKSA9PiBwcm9wZXJ0eUJhZ1twcm9wZXJ0eV1cbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBTZW5zb3JFcnJvckV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBlcnJvckV2ZW50SW5pdERpY3QpIHtcbiAgICBzdXBlcih0eXBlLCBlcnJvckV2ZW50SW5pdERpY3QpO1xuXG4gICAgaWYgKCFlcnJvckV2ZW50SW5pdERpY3QgfHwgIShlcnJvckV2ZW50SW5pdERpY3QuZXJyb3IgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoXG4gICAgICAgIFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnU2Vuc29yRXJyb3JFdmVudCc6XCIgK1xuICAgICAgICBcIjJuZCBhcmd1bWVudCBtdWNoIGNvbnRhaW4gJ2Vycm9yJyBwcm9wZXJ0eVwiXG4gICAgICApO1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImVycm9yXCIsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogZXJyb3JFdmVudEluaXREaWN0LmVycm9yXG4gICAgfSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGRlZmluZU9uRXZlbnRMaXN0ZW5lcih0YXJnZXQsIG5hbWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgYG9uJHtuYW1lfWAsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IG51bGxcbiAgfSk7XG59XG5cbmNvbnN0IFNlbnNvclN0YXRlID0ge1xuICBJRExFOiAxLFxuICBBQ1RJVkFUSU5HOiAyLFxuICBBQ1RJVkU6IDMsXG59XG5cbmNsYXNzIFNlbnNvciBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpc1tzbG90XSA9IG5ldyBXZWFrTWFwO1xuXG4gICAgZGVmaW5lT25FdmVudExpc3RlbmVyKHRoaXMsIFwicmVhZGluZ1wiKTtcbiAgICBkZWZpbmVPbkV2ZW50TGlzdGVuZXIodGhpcywgXCJhY3RpdmF0ZVwiKTtcbiAgICBkZWZpbmVPbkV2ZW50TGlzdGVuZXIodGhpcywgXCJlcnJvclwiKTtcblxuICAgIGRlZmluZVJlYWRvbmx5UHJvcGVydGllcyh0aGlzLCBzbG90LCB7XG4gICAgICBhY3RpdmF0ZWQ6IGZhbHNlLFxuICAgICAgaGFzUmVhZGluZzogZmFsc2UsXG4gICAgICB0aW1lc3RhbXA6IG51bGxcbiAgICB9KVxuXG4gICAgdGhpc1tzbG90XS5zdGF0ZSA9IFNlbnNvclN0YXRlLklETEU7XG5cbiAgICB0aGlzW3Nsb3RdLm5vdGlmeUVycm9yID0gKG1lc3NhZ2UsIG5hbWUpID0+IHtcbiAgICAgIGxldCBlcnJvciA9IG5ldyBTZW5zb3JFcnJvckV2ZW50KFwiZXJyb3JcIiwge1xuICAgICAgICBlcnJvcjogbmV3IERPTUV4Y2VwdGlvbihtZXNzYWdlLCBuYW1lKVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXJyb3IpO1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5ub3RpZnlBY3RpdmF0ZWRTdGF0ZSA9ICgpID0+IHtcbiAgICAgIGxldCBhY3RpdmF0ZSA9IG5ldyBFdmVudChcImFjdGl2YXRlXCIpO1xuICAgICAgdGhpc1tzbG90XS5hY3RpdmF0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGFjdGl2YXRlKTtcbiAgICAgIHRoaXNbc2xvdF0uc3RhdGUgPSBTZW5zb3JTdGF0ZS5BQ1RJVkU7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5hY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge307XG4gICAgdGhpc1tzbG90XS5kZWFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7fTtcblxuICAgIHRoaXNbc2xvdF0uZnJlcXVlbmN5ID0gbnVsbDtcblxuICAgIGlmICh3aW5kb3cgJiYgd2luZG93LnBhcmVudCAhPSB3aW5kb3cudG9wKSB7XG4gICAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKFwiT25seSBpbnN0YW50aWFibGUgaW4gYSB0b3AtbGV2ZWwgYnJvd3NpbmcgY29udGV4dFwiLCBcIlNlY3VyaXR5RXJyb3JcIik7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mKG9wdGlvbnMuZnJlcXVlbmN5KSA9PSBcIm51bWJlclwiKSB7XG4gICAgICBpZiAob3B0aW9ucy5mcmVxdWVuY3kgPiA2MCkge1xuICAgICAgICB0aGlzLmZyZXF1ZW5jeSA9IG9wdGlvbnMuZnJlcXVlbmN5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzW3Nsb3RdLnN0YXRlID09PSBTZW5zb3JTdGF0ZS5BQ1RJVkFUSU5HIHx8IHRoaXNbc2xvdF0uc3RhdGUgPT09IFNlbnNvclN0YXRlLkFDVElWRSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzW3Nsb3RdLnN0YXRlID0gU2Vuc29yU3RhdGUuQUNUSVZBVElORztcbiAgICB0aGlzW3Nsb3RdLmFjdGl2YXRlQ2FsbGJhY2soKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXNbc2xvdF0uc3RhdGUgPT09IFNlbnNvclN0YXRlLklETEUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpc1tzbG90XS5hY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICB0aGlzW3Nsb3RdLmhhc1JlYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzW3Nsb3RdLnRpbWVzdGFtcCA9IG51bGw7XG4gICAgdGhpc1tzbG90XS5kZWFjdGl2YXRlQ2FsbGJhY2soKTtcblxuICAgIHRoaXNbc2xvdF0uc3RhdGUgPSBTZW5zb3JTdGF0ZS5JRExFO1xuICB9XG59IiwiLy8gLi4gQ29weXJpZ2h0IChDKSAyMDEyLTIwMjAgQnJ5YW4gQS4gSm9uZXMuXG4vL1xuLy8gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBDZWxsQm90aWNzIHN5c3RlbS5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuLy8gIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4vLyAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4vLyAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZVxuLy8gIHVzZWZ1bCwgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHlcbi8vICBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlIEdOVVxuLy8gIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vICBhbG9uZyB3aXRoIHRoZSBDZWxsQm90aWNzIHN5c3RlbS4gIElmIG5vdCwgc2VlXG4vLyAgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIEludGVyZmFjZSB3aXRoIHNlbnNvcnNcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgcHJvdmlkZXMgY29kZSB0byBhY2Nlc3MgYHNlbnNvciBBUElzIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2Vuc29yX0FQSXM+YF8uXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFwiLi9wZXJtaXNzaW9uc19wb2x5ZmlsbC5qc1wiO1xuaW1wb3J0IFwiLi9zZW5zb3JfcG9seWZpbGwvZ2VvbG9jYXRpb24tc2Vuc29yLmpzXCI7XG5pbXBvcnQgXCIuL3NlbnNvcl9wb2x5ZmlsbC9tb3Rpb24tc2Vuc29ycy5qc1wiO1xuaW1wb3J0IHsgYXV0b19iaW5kIH0gZnJvbSBcIi4vYXV0by1iaW5kLmpzXCI7XG5cbi8vIFNpbXBsZVNlbnNvclxuLy8gPT09PT09PT09PT09XG4vLyBUaGlzIGNsYXNzIHdyYXBzIGEgYFNlbnNvciA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlbnNvcj5gXyB3aXRoIHNpbXBsZSBgYHN0YXJ0YGAsIGBgcmVhZHlgYCwgYW5kIGBgc3RvcGBgIGZ1bmN0aW9ucy5cbmNsYXNzIFNpbXBsZVNlbnNvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGF1dG9fYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLnNlbnNvciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gVGhpcyB3YXMgaW5pdGlhbGx5IGJhc2VkIG9uIHRoZSBNRE4gU2Vuc29yIEFQSSBkb2NzLlxuICAgIGFzeW5jIHN0YXJ0KFxuICAgICAgICAvLyBUaGUgY2xhc3MgdG8gdXNlIGZvciB0aGUgc2Vuc29yIHRvIHN0YXJ0LiBJdCBtdXN0IGJlIGJhc2VkIG9uIHRoZSBTZW5zb3IgaW50ZXJmYWNlLlxuICAgICAgICBzZW5zb3JfY2xhc3MsXG4gICAgICAgIC8vIEFuIGFycmF5IG9mIHN0cmluZ3MsIGdpdmluZyB0aGUgbmFtZSBvZiB0aGUgQVBJIHRvIGFzayBwZXJtaXNzaW9ucyBvZiBmb3IgdGhpcyBzZW5zb3IuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUGVybWlzc2lvbnMvcXVlcnkuXG4gICAgICAgIHNlbnNvcl9wZXJtaXNzaW9uLFxuICAgICAgICAvLyBPcHRpb25zIHRvIHBhc3MgdG8gdGhpcyBzZW5zb3IncyBjb25zdHJ1Y3Rvci5cbiAgICAgICAgc2Vuc29yX29wdGlvbnNcbiAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29yKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkluIHVzZS4gU3RvcCB0aGUgc2Vuc29yIGJlZm9yZSBzdGFydGluZyBhbm90aGVyLlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2Vuc29yX2NsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IFwiTm90IGF2YWlsYWJsZS5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCBwZXJtaXNzaW9uIHRvIHVzZSB0aGVzZSBzZW5zb3JzLCBpZiB0aGUgQVBJIGlzIHN1cHBvcnRlZC5cbiAgICAgICAgaWYgKG5hdmlnYXRvci5wZXJtaXNzaW9ucykge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IFByb21pc2UuYWxsKHNlbnNvcl9wZXJtaXNzaW9uLm1hcCh4ID0+IG5hdmlnYXRvci5wZXJtaXNzaW9ucy5xdWVyeSh7IG5hbWU6IHggfSkpKTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmV2ZXJ5KHZhbCA9PiB2YWwuc3RhdGUgPT09IFwiZ3JhbnRlZFwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBQZXJtaXNzaW9uIHRvIHVzZSB0aGUgJHtzZW5zb3JfcGVybWlzc2lvbn0gc2Vuc29yIHdhcyBkZW5pZWQuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRvIGFjY2VzcyBhIHNlbnNvcjpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gIy4gICBDcmVhdGUgaXQsIHRoZW4gc3RhcnQgaXQsIHN5bmNocm9ub3VzbHkgY2hlY2tpbmcgZm9yIGVycm9ycyBpbiB0aGlzIHByb2Nlc3MuXG4gICAgICAgIC8vICMuICAgQXdhaXQgZm9yIGEgcmVzcG9uc2UgZnJvbSB0aGUgc2Vuc29yOiBhbiBhY2NlcHRhbmNlIGluZGljYXRpbmcgdGhlIHNlbnNvciB3b3Jrcywgb3IgYSByZWplY3Rpb24gaW5kaWNhdGluZyBhIGZhaWx1cmUuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNpbmNlIHRoZSBldmVudCBoYW5kbGVycyB0byBhY2NlcHQgb3IgcmVqZWN0IHRoZSBwcm9taXNlIG11c3QgYmUgc2V0IHVwIGluIHRoZSBzeW5jaHJvbm91cyBwaGFzZSwgd3JhcCBldmVyeXRoaW5nIGluIGEgcHJvbWlzZS4gQWxsIHRoZSBvcGVyYXRpb25zIGFib3ZlIHRoZXJlZm9yZSBzdGFydCB3aGVuIHRoZSBwcm9taXNlIGlzIGF3YWl0ZWQuXG4gICAgICAgIHRoaXMuc2Vuc29yID0gbnVsbDtcbiAgICAgICAgbGV0IG9uX2Vycm9yO1xuICAgICAgICBsZXQgb25fcmVhZGluZztcbiAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29yID0gbmV3IHNlbnNvcl9jbGFzcyhzZW5zb3Jfb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgY2FsbGJhY2sgZXJyb3JzIGJ5IHJlamVjdGluZyB0aGUgcHJvbWlzZS5cbiAgICAgICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgb25fZXJyb3IgPSBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2Vuc29yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBvbl9lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBydW50aW1lIGVycm9ycy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmVycm9yLm5hbWUgPT09ICdOb3RBbGxvd2VkRXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJBY2Nlc3MgdG8gdGhpcyBzZW5zb3IgaXMgbm90IGFsbG93ZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmVycm9yLm5hbWUgPT09ICdOb3RSZWFkYWJsZUVycm9yJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnQ2Fubm90IGNvbm5lY3QgdG8gdGhlIHNlbnNvci4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZWplY3QoYFVua25vd24gZXJyb3I6ICR7ZXZlbnQuZXJyb3IubmFtZX1gKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNlbnNvci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uX2Vycm9yKTtcblxuICAgICAgICAgICAgICAgIC8vIFdhaXQgZm9yIHRoZSBmaXJzdCBzZW5zb3IgcmVhZGluZyB0byBhY2NlcHQgdGhlIHByb21pc2UuXG4gICAgICAgICAgICAgICAgb25fcmVhZGluZyA9IGV2ZW50ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNlbnNvci5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVhZGluZ1wiLCBvbl9yZWFkaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNlbnNvci5hZGRFdmVudExpc3RlbmVyKFwicmVhZGluZ1wiLCBvbl9yZWFkaW5nKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29yLnN0YXJ0KCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBjb25zdHJ1Y3Rpb24gZXJyb3JzLlxuICAgICAgICAgICAgICAgIGlmIChlcnJvci5uYW1lID09PSAnU2VjdXJpdHlFcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VlIHRoZSBub3RlIGFib3ZlIGFib3V0IGZlYXR1cmUgcG9saWN5LlxuICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJTZW5zb3IgY29uc3RydWN0aW9uIHdhcyBibG9ja2VkIGJ5IGEgZmVhdHVyZSBwb2xpY3kuXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IubmFtZSA9PT0gJ1JlZmVyZW5jZUVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJTZW5zb3IgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgVXNlciBBZ2VudC5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSBzZW5zb3IsIHdhaXRpbmcgdW50aWwgaXQgcHJvZHVjZXMgYSByZWFkaW5nIG9yIGFuIGVycm9yLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEF3YWl0ICR7bmV3IERhdGUoKX1gKTtcbiAgICAgICAgICAgIGF3YWl0IHA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRG9uZSAke25ldyBEYXRlKCl9YCk7XG4gICAgICAgICAgICB0aGlzLnNlbnNvci5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgb25fZXJyb3IpO1xuICAgICAgICAgICAgdGhpcy5zZW5zb3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlYWRpbmdcIiwgb25fcmVhZGluZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcnVlIGlmIHRoZSBzZW5zb3IgaXMgYWN0aXZhdGVkIGFuZCBoYXMgYSByZWFkaW5nLlxuICAgIGdldCByZWFkeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yICYmIHRoaXMuc2Vuc29yLmFjdGl2YXRlZCAmJiB0aGlzLnNlbnNvci5oYXNSZWFkaW5nO1xuICAgIH1cblxuICAgIC8vIFRvIHNhdmUgZGV2aWNlIHBvd2VyLCBiZSBzdXJlIHRvIHN0b3AgdGhlIHNlbnNvciBhcyBzb29uIGFzIHRoZSByZWFkaW5ncyBhcmUgbm8gbG9uZ2VyIG5lZWRlZC5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLnNlbnNvciAmJiB0aGlzLnNlbnNvci5zdG9wKCk7XG4gICAgICAgIHRoaXMuc2Vuc29yID0gbnVsbDtcbiAgICB9XG59XG5cblxuLy8gQWJzdHJhY3QgaGVscGVyIGNsYXNzZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTZXZlcmFsIHNlbnNvcnMgcmV0dXJuIHgsIHksIGFuZCB6IHZhbHVlcy4gQ29sbGVjdCB0aGUgY29tbW9uIGNvZGUgaGVyZS5cbmNsYXNzIFNpbXBsZVhZWlNlbnNvciBleHRlbmRzIFNpbXBsZVNlbnNvciB7XG4gICAgZ2V0IHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci54O1xuICAgIH1cblxuICAgIGdldCB5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IueTtcbiAgICB9XG5cbiAgICBnZXQgeigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLno7XG4gICAgfVxufVxuXG5cbi8vIFR3byBzZW5zb3JzIHJldHVybiBhIHF1YXRlcm5pb24gb3Igcm90YXRpb24gbWF0cml4LlxuY2xhc3MgU2ltcGxlT3JpZW50YXRpb25TZW5zb3IgZXh0ZW5kcyBTaW1wbGVTZW5zb3Ige1xuICAgIGdldCBxdWF0ZXJuaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IucXVhdGVybmlvbjtcbiAgICB9XG5cbiAgICBwb3B1bGF0ZU1hdHJpeCh0YXJnZXRNYXRyaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLnBvcHVsYXRlTWF0cml4KHRhcmdldE1hdHJpeCk7XG4gICAgfVxufVxuXG5cbi8vIENvbmNyZXRlIGNsYXNzZXNcbi8vID09PT09PT09PT09PT09PT1cbi8vIE5vdGUgdGhlIHVzZSBvZiBgYHdpbmRvdy5TZW5zb3JOYW1lYGAgaW5zdGVhZCBvZiBgYFNlbnNvck5hbWVgYCBmb3Igbm9uLXBvbHlmaWxscy4gVGhpcyBhdm9pZHMgZXhjZXB0aW9ucyBpZiB0aGUgcGFydGljdWxhciBzZW5zb3IgaXNuJ3QgZGVmaW5lZCwgcHJvZHVjaW5nIGFuIGBgdW5kZWZpbmVkYGAgaW5zdGVhZC4gRm9yIHBvbHlmaWxscywgd2UgbXVzdCB1c2UgYGBTZW5zb3JOYW1lYGAgaW5zdGVhZCBvZiBgYHdpbmRvdy5TZW5zb3JOYW1lYGAuXG5leHBvcnQgY2xhc3MgU2ltcGxlQW1iaWVudExpZ2h0U2Vuc29yIGV4dGVuZHMgU2ltcGxlU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChhbHNfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQod2luZG93LkFtYmllbnRMaWdodFNlbnNvciwgW1wiYW1iaWVudC1saWdodC1zZW5zb3JcIl0sIGFsc19vcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXQgaWxsdW1pbmFuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5pbGx1bWluYW5jZTtcbiAgICB9XG59XG5cblxuLy8gU2VlIHRoZSBgVzNDIGRyYWZ0IHNwZWMgPGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9nZW9sb2NhdGlvbi1zZW5zb3IvI2dlb2xvY2F0aW9uc2Vuc29yLWludGVyZmFjZT5gXy5cbmV4cG9ydCBjbGFzcyBTaW1wbGVHZW9sb2NhdGlvblNlbnNvciBleHRlbmRzIFNpbXBsZVNlbnNvciB7XG4gICAgYXN5bmMgc3RhcnQoZ2VvX29wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnN0YXJ0KEdlb2xvY2F0aW9uU2Vuc29yLCBbXCJnZW9sb2NhdGlvblwiXSwgZ2VvX29wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBsYXRpdHVkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLmxhdGl0dWRlO1xuICAgIH1cblxuICAgIGdldCBsb25naXR1ZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5sb25naXR1ZGU7XG4gICAgfVxuXG4gICAgZ2V0IGFsdGl0dWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IuYWx0aXR1ZGU7XG4gICAgfVxuXG4gICAgZ2V0IGFjY3VyYWN5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IuYWNjdXJhY3k7XG4gICAgfVxuXG4gICAgZ2V0IGFsdGl0dWRlQWNjdXJhY3koKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5hbHRpdHVkZUFjY3VyYWN5O1xuICAgIH1cblxuICAgIGdldCBoZWFkaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IuaGVhZGluZztcbiAgICB9XG5cbiAgICBnZXQgc3BlZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5zcGVlZDtcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNpbXBsZUFjY2VsZXJvbWV0ZXIgZXh0ZW5kcyBTaW1wbGVYWVpTZW5zb3Ige1xuICAgIGFzeW5jIHN0YXJ0KGFjY2VsZXJvbWV0ZXJfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQoQWNjZWxlcm9tZXRlciwgW1wiYWNjZWxlcm9tZXRlclwiXSwgYWNjZWxlcm9tZXRlcl9vcHRpb25zKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNpbXBsZUd5cm9zY29wZSBleHRlbmRzIFNpbXBsZVhZWlNlbnNvciB7XG4gICAgYXN5bmMgc3RhcnQoZ3lyb19vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydChHeXJvc2NvcGUsIFtcImd5cm9zY29wZVwiXSwgZ3lyb19vcHRpb25zKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNpbXBsZUxpbmVhckFjY2VsZXJhdGlvblNlbnNvciBleHRlbmRzIFNpbXBsZVhZWlNlbnNvciB7XG4gICAgYXN5bmMgc3RhcnQoYWNjZWxfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQoTGluZWFyQWNjZWxlcmF0aW9uU2Vuc29yLCBbXCJhY2NlbGVyb21ldGVyXCJdLCBhY2NlbF9vcHRpb25zKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNpbXBsZUdyYXZpdHlTZW5zb3IgZXh0ZW5kcyBTaW1wbGVYWVpTZW5zb3Ige1xuICAgIGFzeW5jIHN0YXJ0KGdyYXZfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQoR3Jhdml0eVNlbnNvciwgW1wiYWNjZWxlcm9tZXRlclwiXSwgZ3Jhdl9vcHRpb25zKTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNpbXBsZU1hZ25ldG9tZXRlciBleHRlbmRzIFNpbXBsZVhZWlNlbnNvciB7XG4gICAgYXN5bmMgc3RhcnQobWFnX29wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnN0YXJ0KHdpbmRvdy5NYWduZXRvbWV0ZXIsIFtcIm1hZ25ldG9tZXRlclwiXSwgbWFnX29wdGlvbnMpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlQWJzb2x1dGVPcmllbnRhdGlvblNlbnNvciBleHRlbmRzIFNpbXBsZU9yaWVudGF0aW9uU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChvcmllbnRfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQoQWJzb2x1dGVPcmllbnRhdGlvblNlbnNvciwgW1wiYWNjZWxlcm9tZXRlclwiLCBcImd5cm9zY29wZVwiLCBcIm1hZ25ldG9tZXRlclwiXSwgb3JpZW50X29wdGlvbnMpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlUmVsYXRpdmVPcmllbnRhdGlvblNlbnNvciBleHRlbmRzIFNpbXBsZU9yaWVudGF0aW9uU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChvcmllbnRfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQoUmVsYXRpdmVPcmllbnRhdGlvblNlbnNvciwgW1wiYWNjZWxlcm9tZXRlclwiLCBcImd5cm9zY29wZVwiXSwgb3JpZW50X29wdGlvbnMpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==