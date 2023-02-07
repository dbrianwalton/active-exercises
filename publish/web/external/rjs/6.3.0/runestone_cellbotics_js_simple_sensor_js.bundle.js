"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_cellbotics_js_simple_sensor_js"],{

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
/* harmony export */   "SimpleAbsoluteOrientationSensor": () => (/* binding */ SimpleAbsoluteOrientationSensor),
/* harmony export */   "SimpleAccelerometer": () => (/* binding */ SimpleAccelerometer),
/* harmony export */   "SimpleAmbientLightSensor": () => (/* binding */ SimpleAmbientLightSensor),
/* harmony export */   "SimpleGeolocationSensor": () => (/* binding */ SimpleGeolocationSensor),
/* harmony export */   "SimpleGravitySensor": () => (/* binding */ SimpleGravitySensor),
/* harmony export */   "SimpleGyroscope": () => (/* binding */ SimpleGyroscope),
/* harmony export */   "SimpleLinearAccelerationSensor": () => (/* binding */ SimpleLinearAccelerationSensor),
/* harmony export */   "SimpleMagnetometer": () => (/* binding */ SimpleMagnetometer),
/* harmony export */   "SimpleRelativeOrientationSensor": () => (/* binding */ SimpleRelativeOrientationSensor)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NlbGxib3RpY3NfanNfc2ltcGxlX3NlbnNvcl9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOzs7QUFHYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwSUFBMEksaUJBQWlCLGVBQWUsZ0JBQWdCO0FBQzFMLHlDQUF5QztBQUN6QztBQUNBLHlCQUF5QjtBQUN6QjtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLHdDQUF3QyxpQkFBaUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRVE7O0FBRXJCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsbUJBQW1CO0FBQ2hGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRVE7O0FBRXJCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxVQUFVO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEVBQThFLGVBQWU7QUFDN0Y7O0FBRUE7QUFDQSxpRkFBaUYsZUFBZTtBQUNoRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MscUJBQXFCO0FBQ3JEO0FBQ0Esa0NBQWtDLGNBQWM7QUFDaEQ7O0FBRUEsOEJBQThCLFdBQVc7QUFDekM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0MsbUNBQW1DOztBQUVuRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsS0FBSztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUVzQjtBQUNjO0FBQ0o7QUFDRjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQVM7O0FBRWpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvR0FBb0csU0FBUztBQUM3RztBQUNBLCtDQUErQyxtQkFBbUI7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBLDZDQUE2QyxpQkFBaUI7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxpQ0FBaUMsV0FBVztBQUM1QztBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWLGdDQUFnQyxXQUFXO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9hdXRvLWJpbmQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL3Blcm1pc3Npb25zX3BvbHlmaWxsLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9zZW5zb3JfcG9seWZpbGwvZ2VvbG9jYXRpb24tc2Vuc29yLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY2VsbGJvdGljcy9qcy9zZW5zb3JfcG9seWZpbGwvbW90aW9uLXNlbnNvcnMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL3NlbnNvcl9wb2x5ZmlsbC9zZW5zb3IuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jZWxsYm90aWNzL2pzL3NpbXBsZV9zZW5zb3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gLi4gQ29weXJpZ2h0IChDKSAyMDEyLTIwMjAgQnJ5YW4gQS4gSm9uZXMuXG4vL1xuLy8gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBDZWxsQm90aWNzIHN5c3RlbS5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuLy8gIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4vLyAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4vLyAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyAgVGhlIENlbGxCb3RpY3Mgc3lzdGVtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZVxuLy8gIHVzZWZ1bCwgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHlcbi8vICBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlIEdOVVxuLy8gIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vICBhbG9uZyB3aXRoIHRoZSBDZWxsQm90aWNzIHN5c3RlbS4gIElmIG5vdCwgc2VlXG4vLyAgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gQXV0b21hdGljYWxseSBiaW5kIG1ldGhvZHMgdG8gdGhlaXIgaW5zdGFuY2VzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLy8gVGhlIGZvbGxvd2luZyB0d28gZnVuY3Rpb25zIHdlcmUgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2F1dG8tYmluZC9ibG9iL21hc3Rlci9pbmRleC5qcyBhbmQgbGlnaHRseSBtb2RpZmllZC4gVGhleSBwcm92aWRlIGFuIGVhc3kgd2F5IHRvIGJpbmQgYWxsIGNhbGxhYmxlIG1ldGhvZHMgdG8gdGhlaXIgaW5zdGFuY2UuIFNlZSBgQmluZGluZyBNZXRob2RzIHRvIENsYXNzIEluc3RhbmNlIE9iamVjdHMgPGh0dHBzOi8vcG9ueWZvby5jb20vYXJ0aWNsZXMvYmluZGluZy1tZXRob2RzLXRvLWNsYXNzLWluc3RhbmNlLW9iamVjdHM+YF8gZm9yIG1vcmUgZGlzY3Vzc2lvbiBvbiB0aGlzIGNyYXp5IEphdmFTY3JpcHQgbmVjZXNzaXR5LlxuLy9cbi8vIEdldHMgYWxsIG5vbi1idWlsdGluIHByb3BlcnRpZXMgdXAgdGhlIHByb3RvdHlwZSBjaGFpblxuY29uc3QgZ2V0QWxsUHJvcGVydGllcyA9IG9iamVjdCA9PiB7XG5cdGNvbnN0IHByb3BlcnRpZXMgPSBuZXcgU2V0KCk7XG5cblx0ZG8ge1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhvYmplY3QpKSB7XG5cdFx0XHRwcm9wZXJ0aWVzLmFkZChbb2JqZWN0LCBrZXldKTtcblx0XHR9XG5cdH0gd2hpbGUgKChvYmplY3QgPSBSZWZsZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCkpICYmIG9iamVjdCAhPT0gT2JqZWN0LnByb3RvdHlwZSk7XG5cblx0cmV0dXJuIHByb3BlcnRpZXM7XG59O1xuXG5cbi8vIEludm9rZSB0aGlzIGluIHRoZSBjb25zdHJ1Y3RvciBvZiBhbiBvYmplY3QuXG5leHBvcnQgZnVuY3Rpb24gYXV0b19iaW5kKHNlbGYpIHtcbiAgICBmb3IgKGNvbnN0IFtvYmplY3QsIGtleV0gb2YgZ2V0QWxsUHJvcGVydGllcyhzZWxmLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc2VsZltrZXldID0gc2VsZltrZXldLmJpbmQoc2VsZik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyAuLiBDb3B5cmlnaHQgKEMpIDIwMTItMjAyMCBCcnlhbiBBLiBKb25lcy5cbi8vXG4vLyAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIENlbGxCb3RpY3Mgc3lzdGVtLlxuLy9cbi8vICBUaGUgQ2VsbEJvdGljcyBzeXN0ZW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4vLyAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbi8vICBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGVcbi8vICBMaWNlbnNlLCBvciAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vICBUaGUgQ2VsbEJvdGljcyBzeXN0ZW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlXG4vLyAgdXNlZnVsLCBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eVxuLy8gIG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGUgR05VXG4vLyAgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gIGFsb25nIHdpdGggdGhlIENlbGxCb3RpY3Mgc3lzdGVtLiAgSWYgbm90LCBzZWVcbi8vICA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4vL1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIFBvbHlmaWxsIGZvciB0aGUgUGVybWlzc2lvbnMgQVBJXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBpcyBwcmltYXJpbHkgZm9yIGlPUyBkZXZpY2VzIHRoYXQgZG9uJ3QgcHJvdmlkZSBQZXJtaXNzaW9ucywgYnV0IHVzZSBhbm90aGVyIG1ldGhvZCB0byBhbGxvdyBhY2Nlc3MgdG8gdmFyaW91cyBzZW5zb3JzLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gT25seSBzdXBwbHkgdGhpcyBpZiB0aGVyZSdzIG5vdCBQZXJtaXNzaW9ucyBhbmQgd2UgaGF2ZSB0bmUgaU9TIGZsYXZvciBhdmFpbGFibGUuIFNlZSBzYW1wbGUgY29kZSBpbiBodHRwczovL2Rldi50by9saS9ob3ctdG8tcmVxdWVzdHBlcm1pc3Npb24tZm9yLWRldmljZW1vdGlvbi1hbmQtZGV2aWNlb3JpZW50YXRpb24tZXZlbnRzLWluLWlvcy0xMy00NmcyIG9yIHRoZSBgVzNDIHdvcmtpbmcgZHJhZnQgPGh0dHBzOi8vd3d3LnczLm9yZy9UUi9vcmllbnRhdGlvbi1ldmVudC8jZGV2aWNlb3JpZW50YXRpb24+YF8uXG5pZiAoXG4gICAgIW5hdmlnYXRvci5wZXJtaXNzaW9ucyAmJlxuICAgICh0eXBlb2YgRGV2aWNlTW90aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIikgJiZcbiAgICAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIilcbikge1xuICAgIG5hdmlnYXRvci5wZXJtaXNzaW9ucyA9IHtcbiAgICAgICAgcXVlcnk6IG9wdGlvbnMgPT4ge1xuICAgICAgICAgICAgLy8gSWdub3JlIGV2ZXJ5dGhpbmcgYnV0IHRoZSBuYW1lLCBzaW5jZSBvdXIgdXNlIGNhc2UgaXMgb25seSBmb3IgU2ltcGxlU2Vuc29yLlxuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25zLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiYWNjZWxlcm9tZXRlclwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJneXJvc2NvcGVcIjpcbiAgICAgICAgICAgICAgICAvLyBUaGUgcmVxdWVzdGVkIHBlcm1pc3Npb25zIGRvZXNuJ3QgYWxsb3cgdXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9mIHRoZSBmb2xsb3dpbmcgdHdvIHBlcm1pc3Npb25zIHdlIG5lZWQsIHNvIGFzayBmb3IgYm90aC5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcG9seWZpbGwgZm9yIHRoZSBhY2NlbGVyb21ldGVyLCBneXJvLCBhbmQgcmVsYXRlZCBjbGFzc2VzIG5lZWRzIGp1c3QgdGhpcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIERldmljZU1vdGlvbkV2ZW50LnJlcXVlc3RQZXJtaXNzaW9uKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcG9seWZpbGwgZm9yIHRoZSBvcmllbnRhdGlvbiBzZW5zb3JzIG5lZWRzIGp1c3QgdGhpcy5cbiAgICAgICAgICAgICAgICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKVxuICAgICAgICAgICAgICAgICAgICBdKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2Ugbm93IGhhdmUgYW4gYXJyYXkgb2Ygc3RyaW5ncywgdGhlIHJlc3VsdCBvZiB0aGUgcmVxdWVzdFBlcm1pc3Npb24gY2FsbHMuIElmIGFsbCBhcmUgXCJncmFudGVkXCIsIHRoZW4gcmV0dXJuIHtzdGF0ZTogXCJncmFudGVkXCJ9LCBlbHNlIHJldHVybiB7c3RhdGU6IFwiZGVuaWVkXCJ9LlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFscyA9PiByZXNvbHZlKHtzdGF0ZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFscy5ldmVyeSh4ID0+IHggPT09IFwiZ3JhbnRlZFwiKSA/IFwiZ3JhbnRlZFwiIDogXCJkZW5pZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFRoZXJlJ3Mgbm90aGluZyBlbHNlIHRoYXQgbmVlZHMgcGVybWlzc2lvbiB0byB3b3JrLlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7c3RhdGU6IFwiZ3JhbnRlZFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBHZW9sb2NhdGlvbiBzZW5zb3IgcG9seWZpbGxcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gQHRzLWNoZWNrXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFwiLi9zZW5zb3IuanNcIjtcblxuLy9jb25zdCBzbG90ID0gX19zZW5zb3JfXztcblxuY2xhc3MgR2VvbG9jYXRpb25TZW5zb3JTaW5nbGV0b24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoIXRoaXMuY29uc3RydWN0b3IuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuaW5zdGFuY2UgPSB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuc2Vuc29ycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLndhdGNoSWQgPSBudWxsO1xuICAgIHRoaXMuYWNjdXJhY3kgPSBudWxsO1xuICAgIHRoaXMubGFzdFBvc2l0aW9uID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmluc3RhbmNlO1xuICB9XG5cbiAgYXN5bmMgb2J0YWluUGVybWlzc2lvbigpIHtcbiAgICBsZXQgc3RhdGUgPSBcInByb21wdFwiOyAvLyBEZWZhdWx0IGZvciBnZW9sb2NhdGlvbi5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKG5hdmlnYXRvci5wZXJtaXNzaW9ucykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IG5hdmlnYXRvci5wZXJtaXNzaW9ucy5xdWVyeSh7IG5hbWU6XCJnZW9sb2NhdGlvblwifSk7XG4gICAgICBzdGF0ZSA9IHBlcm1pc3Npb24uc3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3Qgc3VjY2Vzc0ZuID0gcG9zaXRpb24gPT4ge1xuICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICByZXNvbHZlKFwiZ3JhbnRlZFwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXJyb3JGbiA9IGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gZXJyLlBFUk1JU1NJT05fREVOSUVEKSB7XG4gICAgICAgICAgcmVzb2x2ZShcImRlbmllZFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBvcHRpb25zID0geyBtYXhpbXVtQWdlOiBJbmZpbml0eSwgdGltZW91dDogMTAgfTtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oc3VjY2Vzc0ZuLCBlcnJvckZuLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUFjY3VyYWN5KCkge1xuICAgIGxldCBlbmFibGVIaWdoQWNjdXJhY3kgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3Qgc2Vuc29yIG9mIHRoaXMuc2Vuc29ycykge1xuICAgICAgaWYgKHNlbnNvcltzbG90XS5vcHRpb25zLmFjY3VyYWN5ID09PSBcImhpZ2hcIikge1xuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3kgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZUhpZ2hBY2N1cmFjeTtcbiAgfVxuXG4gIGFzeW5jIHJlZ2lzdGVyKHNlbnNvcikge1xuICAgIGNvbnN0IHBlcm1pc3Npb24gPSBhd2FpdCB0aGlzLm9idGFpblBlcm1pc3Npb24oKTtcbiAgICBpZiAocGVybWlzc2lvbiAhPT0gXCJncmFudGVkXCIpIHtcbiAgICAgIHNlbnNvcltzbG90XS5ub3RpZnlFcnJvcihcIlBlcm1pc3Npb24gZGVuaWVkLlwiLCBcIk5vd0FsbG93ZWRFcnJvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sYXN0UG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IGFnZSA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5sYXN0UG9zaXRpb24udGltZVN0YW1wO1xuICAgICAgY29uc3QgbWF4QWdlID0gc2Vuc29yW3Nsb3RdLm9wdGlvbnMubWF4QWdlO1xuICAgICAgaWYgKG1heEFnZSA9PSBudWxsIHx8IGFnZSA8PSBtYXhBZ2UpIHtcbiAgICAgICAgc2Vuc29yW3Nsb3RdLmhhbmRsZUV2ZW50KGFnZSwgdGhpcy5sYXN0UG9zaXRpb24uY29vcmRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNlbnNvcnMuYWRkKHNlbnNvcik7XG5cbiAgICAvLyBDaGVjayB3aGV0aGVyIHdlIG5lZWQgdG8gcmVjb25maWd1cmUgb3VyIG5hdmlnYXRpb24uZ2VvbG9jYXRpb25cbiAgICAvLyB3YXRjaCwgaWUuIHRlYXIgaXQgZG93biBhbmQgcmVjcmVhdGUuXG4gICAgY29uc3QgYWNjdXJhY3kgPSB0aGlzLmNhbGN1bGF0ZUFjY3VyYWN5KCk7XG4gICAgaWYgKHRoaXMud2F0Y2hJZCAmJiB0aGlzLmFjY3VyYWN5ID09PSBhY2N1cmFjeSkge1xuICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byByZXNldCwgcmV0dXJuLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLndhdGNoSWQpIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMud2F0Y2hJZCk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlRXZlbnQgPSBwb3NpdGlvbiA9PiB7XG4gICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBwb3NpdGlvbi50aW1lc3RhbXAgLSBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0O1xuICAgICAgY29uc3QgY29vcmRzID0gcG9zaXRpb24uY29vcmRzO1xuXG4gICAgICBmb3IgKGNvbnN0IHNlbnNvciBvZiB0aGlzLnNlbnNvcnMpIHtcbiAgICAgICAgc2Vuc29yW3Nsb3RdLmhhbmRsZUV2ZW50KHRpbWVzdGFtcCwgY29vcmRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGVFcnJvciA9IGVycm9yID0+IHtcbiAgICAgIGxldCB0eXBlO1xuICAgICAgc3dpdGNoKGVycm9yLmNvZGUpIHtcbiAgICAgICAgY2FzZSBlcnJvci5USU1FT1VUOlxuICAgICAgICAgIHR5cGUgPSBcIlRpbWVvdXRFcnJvclwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGVycm9yLlBFUk1JU1NJT05fREVOSUVEOlxuICAgICAgICAgIHR5cGUgPSBcIk5vdEFsbG93ZWRFcnJvclwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGVycm9yLlBPU0lUSU9OX1VOQVZBSUxBQkxFOlxuICAgICAgICAgIHR5cGUgPSBcIk5vdFJlYWRhYmxlRXJyb3JcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0eXBlID0gXCJVbmtub3duRXJyb3JcIjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3Qgc2Vuc29yIG9mIHRoaXMuc2Vuc29ycykge1xuICAgICAgICBzZW5zb3Jbc2xvdF0uaGFuZGxlRXJyb3IoZXJyb3IubWVzc2FnZSwgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogYWNjdXJhY3ksXG4gICAgICBtYXhpbXVtQWdlOiAwLFxuICAgICAgdGltZW91dDogSW5maW5pdHlcbiAgICB9XG5cbiAgICB0aGlzLndhdGNoSWQgPSBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24ud2F0Y2hQb3NpdGlvbihcbiAgICAgIGhhbmRsZUV2ZW50LCBoYW5kbGVFcnJvciwgb3B0aW9uc1xuICAgICk7XG4gIH1cblxuICBkZXJlZ2lzdGVyKHNlbnNvcikge1xuICAgIHRoaXMuc2Vuc29ycy5kZWxldGUoc2Vuc29yKTtcbiAgICBpZiAoIXRoaXMuc2Vuc29ycy5zaXplICYmIHRoaXMud2F0Y2hJZCkge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy53YXRjaElkKTtcbiAgICAgIHRoaXMud2F0Y2hJZCA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IEdlb2xvY2F0aW9uU2Vuc29yID0gd2luZG93Lkdlb2xvY2F0aW9uU2Vuc29yIHx8XG5jbGFzcyBHZW9sb2NhdGlvblNlbnNvciBleHRlbmRzIFNlbnNvciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpc1tzbG90XS5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgbGF0aXR1ZGU6IG51bGwsXG4gICAgICBsb25naXR1ZGU6IG51bGwsXG4gICAgICBhbHRpdHVkZTogbnVsbCxcbiAgICAgIGFjY3VyYWN5OiBudWxsLFxuICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogbnVsbCxcbiAgICAgIGhlYWRpbmc6IG51bGwsXG4gICAgICBzcGVlZDogbnVsbFxuICAgIH1cblxuICAgIGNvbnN0IHByb3BlcnR5QmFnID0gdGhpc1tzbG90XTtcbiAgICBmb3IgKGNvbnN0IHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgICBwcm9wZXJ0eUJhZ1twcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgcHJvcE5hbWUsIHtcbiAgICAgICAgZ2V0OiAoKSA9PiBwcm9wZXJ0eUJhZ1twcm9wTmFtZV1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSAodGltZXN0YW1wLCBjb29yZHMpID0+IHtcbiAgICAgIGlmICghdGhpc1tzbG90XS5hY3RpdmF0ZWQpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlBY3RpdmF0ZWRTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzW3Nsb3RdLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcblxuICAgICAgdGhpc1tzbG90XS5hY2N1cmFjeSA9IGNvb3Jkcy5hY2N1cmFjeTtcbiAgICAgIHRoaXNbc2xvdF0uYWx0aXR1ZGUgPSBjb29yZHMuYWx0aXR1ZGU7XG4gICAgICB0aGlzW3Nsb3RdLmFsdGl0dWRlQWNjdXJhY3kgPSBjb29yZHMuYWx0aXR1ZGVBY2N1cmFjeTtcbiAgICAgIHRoaXNbc2xvdF0uaGVhZGluZyA9IGNvb3Jkcy5oZWFkaW5nO1xuICAgICAgdGhpc1tzbG90XS5sYXRpdHVkZSA9IGNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgIHRoaXNbc2xvdF0ubG9uZ2l0dWRlID0gY29vcmRzLmxvbmdpdHVkZTtcbiAgICAgIHRoaXNbc2xvdF0uc3BlZWQgPSBjb29yZHMuc3BlZWQ7XG5cbiAgICAgIHRoaXNbc2xvdF0uaGFzUmVhZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicmVhZGluZ1wiKSk7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5oYW5kbGVFcnJvciA9IChtZXNzYWdlLCB0eXBlKSA9PiB7XG4gICAgICB0aGlzW3Nsb3RdLm5vdGlmeUVycm9yKG1lc3NhZ2UsIHR5cGUpO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIChuZXcgR2VvbG9jYXRpb25TZW5zb3JTaW5nbGV0b24oKSkucmVnaXN0ZXIodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5kZWFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAobmV3IEdlb2xvY2F0aW9uU2Vuc29yU2luZ2xldG9uKCkpLmRlcmVnaXN0ZXIodGhpcyk7XG4gICAgfVxuICB9XG59IiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIE1vdGlvbiBzZW5zb3JzIHBvbHlmaWxsXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gQHRzLWNoZWNrXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFwiLi9zZW5zb3IuanNcIjtcblxuLy9jb25zdCBzbG90ID0gX19zZW5zb3JfXztcblxubGV0IG9yaWVudGF0aW9uO1xuXG4vLyBAdHMtaWdub3JlXG5pZiAoc2NyZWVuLm9yaWVudGF0aW9uKSB7XG4gIC8vIEB0cy1pZ25vcmVcbiAgb3JpZW50YXRpb24gPSBzY3JlZW4ub3JpZW50YXRpb247XG59IGVsc2UgaWYgKHNjcmVlbi5tc09yaWVudGF0aW9uKSB7XG4gIG9yaWVudGF0aW9uID0gc2NyZWVuLm1zT3JpZW50YXRpb247XG59IGVsc2Uge1xuICBvcmllbnRhdGlvbiA9IHt9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3JpZW50YXRpb24sIFwiYW5nbGVcIiwge1xuICAgIGdldDogKCkgPT4geyByZXR1cm4gKHdpbmRvdy5vcmllbnRhdGlvbiB8fCAwKSB9XG4gIH0pO1xufVxuXG5jb25zdCBEZXZpY2VPcmllbnRhdGlvbk1peGluID0gKHN1cGVyY2xhc3MsIC4uLmV2ZW50TmFtZXMpID0+IGNsYXNzIGV4dGVuZHMgc3VwZXJjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc3VwZXIoYXJncyk7XG5cbiAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBvZiBldmVudE5hbWVzKSB7XG4gICAgICBpZiAoYG9uJHtldmVudE5hbWV9YCBpbiB3aW5kb3cpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ldmVudE5hbWUgPSBldmVudE5hbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKHRoaXNbc2xvdF0uZXZlbnROYW1lLCB0aGlzW3Nsb3RdLmhhbmRsZUV2ZW50LCB7IGNhcHR1cmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5kZWFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzW3Nsb3RdLmV2ZW50TmFtZSwgdGhpc1tzbG90XS5oYW5kbGVFdmVudCwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gdG9RdWF0ZXJuaW9uRnJvbUV1bGVyKGFscGhhLCBiZXRhLCBnYW1tYSkge1xuICBjb25zdCBkZWdUb1JhZCA9IE1hdGguUEkgLyAxODBcblxuICBjb25zdCB4ID0gKGJldGEgfHwgMCkgKiBkZWdUb1JhZDtcbiAgY29uc3QgeSA9IChnYW1tYSB8fCAwKSAqIGRlZ1RvUmFkO1xuICBjb25zdCB6ID0gKGFscGhhIHx8IDApICogZGVnVG9SYWQ7XG5cbiAgY29uc3QgY1ogPSBNYXRoLmNvcyh6ICogMC41KTtcbiAgY29uc3Qgc1ogPSBNYXRoLnNpbih6ICogMC41KTtcbiAgY29uc3QgY1kgPSBNYXRoLmNvcyh5ICogMC41KTtcbiAgY29uc3Qgc1kgPSBNYXRoLnNpbih5ICogMC41KTtcbiAgY29uc3QgY1ggPSBNYXRoLmNvcyh4ICogMC41KTtcbiAgY29uc3Qgc1ggPSBNYXRoLnNpbih4ICogMC41KTtcblxuICBjb25zdCBxeCA9IHNYICogY1kgKiBjWiAtIGNYICogc1kgKiBzWjtcbiAgY29uc3QgcXkgPSBjWCAqIHNZICogY1ogKyBzWCAqIGNZICogc1o7XG4gIGNvbnN0IHF6ID0gY1ggKiBjWSAqIHNaICsgc1ggKiBzWSAqIGNaO1xuICBjb25zdCBxdyA9IGNYICogY1kgKiBjWiAtIHNYICogc1kgKiBzWjtcblxuICByZXR1cm4gW3F4LCBxeSwgcXosIHF3XTtcbn1cblxuZnVuY3Rpb24gcm90YXRlUXVhdGVybmlvbkJ5QXhpc0FuZ2xlKHF1YXQsIGF4aXMsIGFuZ2xlKSB7XG4gIGNvbnN0IHNIYWxmQW5nbGUgPSBNYXRoLnNpbihhbmdsZSAvIDIpO1xuICBjb25zdCBjSGFsZkFuZ2xlID0gTWF0aC5jb3MoYW5nbGUgLyAyKTtcblxuICBjb25zdCB0cmFuc2Zvcm1RdWF0ID0gW1xuICAgIGF4aXNbMF0gKiBzSGFsZkFuZ2xlLFxuICAgIGF4aXNbMV0gKiBzSGFsZkFuZ2xlLFxuICAgIGF4aXNbMl0gKiBzSGFsZkFuZ2xlLFxuICAgIGNIYWxmQW5nbGVcbiAgXTtcblxuICBmdW5jdGlvbiBtdWx0aXBseVF1YXRlcm5pb24oYSwgYikge1xuICAgIGNvbnN0IHF4ID0gYVswXSAqIGJbM10gKyBhWzNdICogYlswXSArIGFbMV0gKiBiWzJdIC0gYVsyXSAqIGJbMV07XG4gICAgY29uc3QgcXkgPSBhWzFdICogYlszXSArIGFbM10gKiBiWzFdICsgYVsyXSAqIGJbMF0gLSBhWzBdICogYlsyXTtcbiAgICBjb25zdCBxeiA9IGFbMl0gKiBiWzNdICsgYVszXSAqIGJbMl0gKyBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xuICAgIGNvbnN0IHF3ID0gYVszXSAqIGJbM10gLSBhWzBdICogYlswXSAtIGFbMV0gKiBiWzFdIC0gYVsyXSAqIGJbMl07XG5cbiAgICByZXR1cm4gW3F4LCBxeSwgcXosIHF3XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVF1YXRlcm5pb24ocXVhdCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChxdWF0WzBdICoqIDIgKyBxdWF0WzFdICoqIDIgKyBxdWF0WzJdICoqIDIgKyBxdWF0WzNdICoqIDIpO1xuICAgIGlmIChsZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbMCwgMCwgMCwgMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHF1YXQubWFwKHYgPT4gdiAvIGxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gbm9ybWFsaXplUXVhdGVybmlvbihtdWx0aXBseVF1YXRlcm5pb24ocXVhdCwgdHJhbnNmb3JtUXVhdCkpO1xufVxuXG5mdW5jdGlvbiB0b01hdDRGcm9tUXVhdChtYXQsIHEpIHtcbiAgY29uc3QgdHlwZWQgPSBtYXQgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHwgbWF0IGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5O1xuXG4gIGlmICh0eXBlZCAmJiBtYXQubGVuZ3RoID49IDE2KSB7XG4gICAgbWF0WzBdID0gMSAtIDIgKiAocVsxXSAqKiAyICsgcVsyXSAqKiAyKTtcbiAgICBtYXRbMV0gPSAyICogKHFbMF0gKiBxWzFdIC0gcVsyXSAqIHFbM10pO1xuICAgIG1hdFsyXSA9IDIgKiAocVswXSAqIHFbMl0gKyBxWzFdICogcVszXSk7XG4gICAgbWF0WzNdID0gMDtcblxuICAgIG1hdFs0XSA9IDIgKiAocVswXSAqIHFbMV0gKyBxWzJdICogcVszXSk7XG4gICAgbWF0WzVdID0gMSAtIDIgKiAocVswXSAqKiAyICsgcVsyXSAqKiAyKTtcbiAgICBtYXRbNl0gPSAyICogKHFbMV0gKiBxWzJdIC0gcVswXSAqIHFbM10pO1xuICAgIG1hdFs3XSA9IDA7XG5cbiAgICBtYXRbOF0gPSAyICogKHFbMF0gKiBxWzJdIC0gcVsxXSAqIHFbM10pO1xuICAgIG1hdFs5XSA9IDIgKiAocVsxXSAqIHFbMl0gKyBxWzBdICogcVszXSk7XG4gICAgbWF0WzEwXSA9IDEgLSAyICogKHFbMF0gKiogMiArIHFbMV0gKiogMik7XG4gICAgbWF0WzExXSA9IDA7XG5cbiAgICBtYXRbMTJdID0gMDtcbiAgICBtYXRbMTNdID0gMDtcbiAgICBtYXRbMTRdID0gMDtcbiAgICBtYXRbMTVdID0gMTtcbiAgfVxuXG4gIHJldHVybiBtYXQ7XG59XG5cbmZ1bmN0aW9uIHdvcmxkVG9TY3JlZW4ocXVhdGVybmlvbikge1xuICByZXR1cm4gIXF1YXRlcm5pb24gPyBudWxsIDpcbiAgICByb3RhdGVRdWF0ZXJuaW9uQnlBeGlzQW5nbGUoXG4gICAgICBxdWF0ZXJuaW9uLFxuICAgICAgWzAsIDAsIDFdLFxuICAgICAgLSBvcmllbnRhdGlvbi5hbmdsZSAqIE1hdGguUEkgLyAxODBcbiAgICApO1xufVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBSZWxhdGl2ZU9yaWVudGF0aW9uU2Vuc29yID0gd2luZG93LlJlbGF0aXZlT3JpZW50YXRpb25TZW5zb3IgfHxcbmNsYXNzIFJlbGF0aXZlT3JpZW50YXRpb25TZW5zb3IgZXh0ZW5kcyBEZXZpY2VPcmllbnRhdGlvbk1peGluKFNlbnNvciwgXCJkZXZpY2VvcmllbnRhdGlvblwiKSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgc3dpdGNoIChvcHRpb25zLmNvb3JkaW5hdGVTeXN0ZW0gfHwgJ3dvcmxkJykge1xuICAgICAgY2FzZSAnc2NyZWVuJzpcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwicXVhdGVybmlvblwiLCB7XG4gICAgICAgICAgZ2V0OiAoKSA9PiB3b3JsZFRvU2NyZWVuKHRoaXNbc2xvdF0ucXVhdGVybmlvbilcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd29ybGQnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwicXVhdGVybmlvblwiLCB7XG4gICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzW3Nsb3RdLnF1YXRlcm5pb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpc1tzbG90XS5oYW5kbGVFdmVudCA9IGV2ZW50ID0+IHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlbnNvciB3ZSB3aWxsIGdldCB2YWx1ZXMgZXF1YWwgdG8gbnVsbC5cbiAgICAgIGlmIChldmVudC5hYnNvbHV0ZSB8fCBldmVudC5hbHBoYSA9PT0gbnVsbCkge1xuICAgICAgICAvLyBTcGVjOiBUaGUgaW1wbGVtZW50YXRpb24gY2FuIHN0aWxsIGRlY2lkZSB0byBwcm92aWRlXG4gICAgICAgIC8vIGFic29sdXRlIG9yaWVudGF0aW9uIGlmIHJlbGF0aXZlIGlzIG5vdCBhdmFpbGFibGUgb3JcbiAgICAgICAgLy8gdGhlIHJlc3VsdGluZyBkYXRhIGlzIG1vcmUgYWNjdXJhdGUuIEluIGVpdGhlciBjYXNlLFxuICAgICAgICAvLyB0aGUgYWJzb2x1dGUgcHJvcGVydHkgbXVzdCBiZSBzZXQgYWNjb3JkaW5nbHkgdG8gcmVmbGVjdFxuICAgICAgICAvLyB0aGUgY2hvaWNlLlxuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUVycm9yKFwiQ291bGQgbm90IGNvbm5lY3QgdG8gYSBzZW5zb3JcIiwgXCJOb3RSZWFkYWJsZUVycm9yXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpc1tzbG90XS5hY3RpdmF0ZWQpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlBY3RpdmF0ZWRTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzW3Nsb3RdLnRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICB0aGlzW3Nsb3RdLnF1YXRlcm5pb24gPSB0b1F1YXRlcm5pb25Gcm9tRXVsZXIoXG4gICAgICAgIGV2ZW50LmFscGhhLFxuICAgICAgICBldmVudC5iZXRhLFxuICAgICAgICBldmVudC5nYW1tYVxuICAgICAgKTtcblxuICAgICAgdGhpc1tzbG90XS5oYXNSZWFkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJyZWFkaW5nXCIpKTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXNbc2xvdF0ucXVhdGVybmlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcG9wdWxhdGVNYXRyaXgobWF0KSB7XG4gICAgdG9NYXQ0RnJvbVF1YXQobWF0LCB0aGlzLnF1YXRlcm5pb24pO1xuICB9XG59XG5cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IEFic29sdXRlT3JpZW50YXRpb25TZW5zb3IgPSB3aW5kb3cuQWJzb2x1dGVPcmllbnRhdGlvblNlbnNvciB8fFxuY2xhc3MgQWJzb2x1dGVPcmllbnRhdGlvblNlbnNvciBleHRlbmRzIERldmljZU9yaWVudGF0aW9uTWl4aW4oXG4gIFNlbnNvciwgXCJkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIsIFwiZGV2aWNlb3JpZW50YXRpb25cIikge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHN3aXRjaCAob3B0aW9ucy5jb29yZGluYXRlU3lzdGVtIHx8ICd3b3JsZCcpIHtcbiAgICAgIGNhc2UgJ3NjcmVlbic6XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInF1YXRlcm5pb25cIiwge1xuICAgICAgICAgIGdldDogKCkgPT4gd29ybGRUb1NjcmVlbih0aGlzW3Nsb3RdLnF1YXRlcm5pb24pXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dvcmxkJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInF1YXRlcm5pb25cIiwge1xuICAgICAgICAgIGdldDogKCkgPT4gdGhpc1tzbG90XS5xdWF0ZXJuaW9uXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAvLyBJZiBhYnNvbHV0ZSBpcyBzZXQsIG9yIHdlYmtpdENvbXBhc3NIZWFkaW5nIGV4aXN0cyxcbiAgICAgIC8vIGFic29sdXRlIHZhbHVlcyBzaG91bGQgYmUgYXZhaWxhYmxlLlxuICAgICAgY29uc3QgaXNBYnNvbHV0ZSA9IGV2ZW50LmFic29sdXRlID09PSB0cnVlIHx8IFwid2Via2l0Q29tcGFzc0hlYWRpbmdcIiBpbiBldmVudDtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gZXZlbnQuYWxwaGEgIT09IG51bGwgfHwgZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKCFpc0Fic29sdXRlIHx8ICFoYXNWYWx1ZSkge1xuICAgICAgICAvLyBTcGVjOiBJZiBhbiBpbXBsZW1lbnRhdGlvbiBjYW4gbmV2ZXIgcHJvdmlkZSBhYnNvbHV0ZVxuICAgICAgICAvLyBvcmllbnRhdGlvbiBpbmZvcm1hdGlvbiwgdGhlIGV2ZW50IHNob3VsZCBiZSBmaXJlZCB3aXRoXG4gICAgICAgIC8vIHRoZSBhbHBoYSwgYmV0YSBhbmQgZ2FtbWEgYXR0cmlidXRlcyBzZXQgdG8gbnVsbC5cbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlFcnJvcihcIkNvdWxkIG5vdCBjb25uZWN0IHRvIGEgc2Vuc29yXCIsIFwiTm90UmVhZGFibGVFcnJvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXNbc2xvdF0uYWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5QWN0aXZhdGVkU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1tzbG90XS5oYXNSZWFkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXNbc2xvdF0udGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZyAhPSBudWxsID8gMzYwIC0gZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgOiBldmVudC5hbHBoYTtcblxuICAgICAgdGhpc1tzbG90XS5xdWF0ZXJuaW9uID0gdG9RdWF0ZXJuaW9uRnJvbUV1bGVyKFxuICAgICAgICBoZWFkaW5nLFxuICAgICAgICBldmVudC5iZXRhLFxuICAgICAgICBldmVudC5nYW1tYVxuICAgICAgKTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWRpbmdcIikpO1xuICAgIH1cblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpc1tzbG90XS5xdWF0ZXJuaW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwb3B1bGF0ZU1hdHJpeChtYXQpIHtcbiAgICB0b01hdDRGcm9tUXVhdChtYXQsIHRoaXMucXVhdGVybmlvbik7XG4gIH1cbn1cblxuLy8gQHRzLWlnbm9yZVxuY29uc3QgR3lyb3Njb3BlID0gd2luZG93Lkd5cm9zY29wZSB8fFxuY2xhc3MgR3lyb3Njb3BlIGV4dGVuZHMgRGV2aWNlT3JpZW50YXRpb25NaXhpbihTZW5zb3IsIFwiZGV2aWNlbW90aW9uXCIpIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXNbc2xvdF0uaGFuZGxlRXZlbnQgPSBldmVudCA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBzZW5zb3Igd2Ugd2lsbCBnZXQgdmFsdWVzIGVxdWFsIHRvIG51bGwuXG4gICAgICBpZiAoZXZlbnQucm90YXRpb25SYXRlLmFscGhhID09PSBudWxsKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5RXJyb3IoXCJDb3VsZCBub3QgY29ubmVjdCB0byBhIHNlbnNvclwiLCBcIk5vdFJlYWRhYmxlRXJyb3JcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzW3Nsb3RdLmFjdGl2YXRlZCkge1xuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUFjdGl2YXRlZFN0YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbc2xvdF0udGltZXN0YW1wID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgIHRoaXNbc2xvdF0ueCA9IGV2ZW50LnJvdGF0aW9uUmF0ZS5hbHBoYTtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IGV2ZW50LnJvdGF0aW9uUmF0ZS5iZXRhO1xuICAgICAgdGhpc1tzbG90XS56ID0gZXZlbnQucm90YXRpb25SYXRlLmdhbW1hO1xuXG4gICAgICB0aGlzW3Nsb3RdLmhhc1JlYWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWRpbmdcIikpO1xuICAgIH1cblxuICAgIGRlZmluZVJlYWRvbmx5UHJvcGVydGllcyh0aGlzLCBzbG90LCB7XG4gICAgICB4OiBudWxsLFxuICAgICAgeTogbnVsbCxcbiAgICAgIHo6IG51bGxcbiAgICB9KTtcblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpc1tzbG90XS54ID0gbnVsbDtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnogPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBBY2NlbGVyb21ldGVyID0gd2luZG93LkFjY2VsZXJvbWV0ZXIgfHxcbmNsYXNzIEFjY2VsZXJvbWV0ZXIgZXh0ZW5kcyBEZXZpY2VPcmllbnRhdGlvbk1peGluKFNlbnNvciwgXCJkZXZpY2Vtb3Rpb25cIikge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpc1tzbG90XS5oYW5kbGVFdmVudCA9IGV2ZW50ID0+IHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlbnNvciB3ZSB3aWxsIGdldCB2YWx1ZXMgZXF1YWwgdG8gbnVsbC5cbiAgICAgIGlmIChldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggPT09IG51bGwpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlFcnJvcihcIkNvdWxkIG5vdCBjb25uZWN0IHRvIGEgc2Vuc29yXCIsIFwiTm90UmVhZGFibGVFcnJvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXNbc2xvdF0uYWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5QWN0aXZhdGVkU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1tzbG90XS50aW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgdGhpc1tzbG90XS54ID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuICAgICAgdGhpc1tzbG90XS55ID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuICAgICAgdGhpc1tzbG90XS56ID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS56O1xuXG4gICAgICB0aGlzW3Nsb3RdLmhhc1JlYWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWRpbmdcIikpO1xuICAgIH1cblxuICAgIGRlZmluZVJlYWRvbmx5UHJvcGVydGllcyh0aGlzLCBzbG90LCB7XG4gICAgICB4OiBudWxsLFxuICAgICAgeTogbnVsbCxcbiAgICAgIHo6IG51bGxcbiAgICB9KTtcblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpc1tzbG90XS54ID0gbnVsbDtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnogPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBMaW5lYXJBY2NlbGVyYXRpb25TZW5zb3IgPSB3aW5kb3cuTGluZWFyQWNjZWxlcmF0aW9uU2Vuc29yIHx8XG5jbGFzcyBMaW5lYXJBY2NlbGVyYXRpb25TZW5zb3IgZXh0ZW5kcyBEZXZpY2VPcmllbnRhdGlvbk1peGluKFNlbnNvciwgXCJkZXZpY2Vtb3Rpb25cIikge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpc1tzbG90XS5oYW5kbGVFdmVudCA9IGV2ZW50ID0+IHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlbnNvciB3ZSB3aWxsIGdldCB2YWx1ZXMgZXF1YWwgdG8gbnVsbC5cbiAgICAgIGlmIChldmVudC5hY2NlbGVyYXRpb24ueCA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzW3Nsb3RdLm5vdGlmeUVycm9yKFwiQ291bGQgbm90IGNvbm5lY3QgdG8gYSBzZW5zb3JcIiwgXCJOb3RSZWFkYWJsZUVycm9yXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpc1tzbG90XS5hY3RpdmF0ZWQpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlBY3RpdmF0ZWRTdGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzW3Nsb3RdLnRpbWVzdGFtcCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICB0aGlzW3Nsb3RdLnggPSBldmVudC5hY2NlbGVyYXRpb24ueDtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IGV2ZW50LmFjY2VsZXJhdGlvbi55O1xuICAgICAgdGhpc1tzbG90XS56ID0gZXZlbnQuYWNjZWxlcmF0aW9uLno7XG5cbiAgICAgIHRoaXNbc2xvdF0uaGFzUmVhZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicmVhZGluZ1wiKSk7XG4gICAgfVxuXG4gICAgZGVmaW5lUmVhZG9ubHlQcm9wZXJ0aWVzKHRoaXMsIHNsb3QsIHtcbiAgICAgIHg6IG51bGwsXG4gICAgICB5OiBudWxsLFxuICAgICAgejogbnVsbFxuICAgIH0pO1xuXG4gICAgdGhpc1tzbG90XS5kZWFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzW3Nsb3RdLnggPSBudWxsO1xuICAgICAgdGhpc1tzbG90XS55ID0gbnVsbDtcbiAgICAgIHRoaXNbc2xvdF0ueiA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IEdyYXZpdHlTZW5zb3IgPSB3aW5kb3cuR3Jhdml0eVNlbnNvciB8fFxuIGNsYXNzIEdyYXZpdHlTZW5zb3IgZXh0ZW5kcyBEZXZpY2VPcmllbnRhdGlvbk1peGluKFNlbnNvciwgXCJkZXZpY2Vtb3Rpb25cIikge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpc1tzbG90XS5oYW5kbGVFdmVudCA9IGV2ZW50ID0+IHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlbnNvciB3ZSB3aWxsIGdldCB2YWx1ZXMgZXF1YWwgdG8gbnVsbC5cbiAgICAgIGlmIChldmVudC5hY2NlbGVyYXRpb24ueCA9PT0gbnVsbCB8fCBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnggPT09IG51bGwpIHtcbiAgICAgICAgdGhpc1tzbG90XS5ub3RpZnlFcnJvcihcIkNvdWxkIG5vdCBjb25uZWN0IHRvIGEgc2Vuc29yXCIsIFwiTm90UmVhZGFibGVFcnJvclwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXNbc2xvdF0uYWN0aXZhdGVkKSB7XG4gICAgICAgIHRoaXNbc2xvdF0ubm90aWZ5QWN0aXZhdGVkU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1tzbG90XS50aW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgdGhpc1tzbG90XS54ID0gZXZlbnQuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54IC0gZXZlbnQuYWNjZWxlcmF0aW9uLng7XG4gICAgICB0aGlzW3Nsb3RdLnkgPSBldmVudC5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LnkgLSBldmVudC5hY2NlbGVyYXRpb24ueTtcbiAgICAgIHRoaXNbc2xvdF0ueiA9IGV2ZW50LmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueiAtIGV2ZW50LmFjY2VsZXJhdGlvbi56O1xuXG4gICAgICB0aGlzW3Nsb3RdLmhhc1JlYWRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJlYWRpbmdcIikpO1xuICAgIH1cblxuICAgIGRlZmluZVJlYWRvbmx5UHJvcGVydGllcyh0aGlzLCBzbG90LCB7XG4gICAgICB4OiBudWxsLFxuICAgICAgeTogbnVsbCxcbiAgICAgIHo6IG51bGxcbiAgICB9KTtcblxuICAgIHRoaXNbc2xvdF0uZGVhY3RpdmF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpc1tzbG90XS54ID0gbnVsbDtcbiAgICAgIHRoaXNbc2xvdF0ueSA9IG51bGw7XG4gICAgICB0aGlzW3Nsb3RdLnogPSBudWxsO1xuICAgIH1cbiAgfVxufSIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBCYXNlIFNlbnNvciBwb2x5ZmlsbFxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoZSBgZ2VvbG9jYXRpb24tc2Vuc29yLmpzYCBhbmQgYG1vdGlvbi1zZW5zb3JzLmpzYCBmaWxlcyBkZXBlbmQgb24gdGhpcy5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIEB0cy1jaGVja1xuY29uc3QgX19zZW5zb3JfXyA9IFN5bWJvbChcIl9fc2Vuc29yX19cIik7XG5cbmNvbnN0IHNsb3QgPSBfX3NlbnNvcl9fO1xuXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgZGVzY3JpcHRpb25zKSB7XG4gIGZvciAoY29uc3QgcHJvcGVydHkgaW4gZGVzY3JpcHRpb25zKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBkZXNjcmlwdGlvbnNbcHJvcGVydHldXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgRXZlbnRUYXJnZXRNaXhpbiA9IChzdXBlcmNsYXNzLCAuLi5ldmVudE5hbWVzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHN1cGVyKGFyZ3MpO1xuICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyID0gKHR5cGUsIC4uLmFyZ3MpID0+IHtcbiAgICAgIHJldHVybiBldmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXR1cm4gZXZlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQgPSAoZXZlbnQpID0+IHtcbiAgICAgIGRlZmluZVByb3BlcnRpZXMoZXZlbnQsIHsgY3VycmVudFRhcmdldDogdGhpcyB9KTtcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoZXZlbnQsIHsgdGFyZ2V0OiB0aGlzIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXRob2ROYW1lID0gYG9uJHtldmVudC50eXBlfWA7XG4gICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kTmFtZV0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgdGhpc1ttZXRob2ROYW1lXShldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJldFZhbHVlID0gZXZlbnRUYXJnZXQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cbiAgICAgIGlmIChyZXRWYWx1ZSAmJiB0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICBkZWZpbmVQcm9wZXJ0aWVzKGV2ZW50LCB7IGN1cnJlbnRUYXJnZXQ6IG51bGwsIHRhcmdldDogbnVsbCB9KTtcblxuICAgICAgcmV0dXJuIHJldFZhbHVlO1xuICAgIH1cbiAgfVxufTtcblxuY2xhc3MgRXZlbnRUYXJnZXQgZXh0ZW5kcyBFdmVudFRhcmdldE1peGluKE9iamVjdCkge307XG5cbmZ1bmN0aW9uIGRlZmluZVJlYWRvbmx5UHJvcGVydGllcyh0YXJnZXQsIHNsb3QsIGRlc2NyaXB0aW9ucykge1xuICBjb25zdCBwcm9wZXJ0eUJhZyA9IHRhcmdldFtzbG90XTtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBkZXNjcmlwdGlvbnMpIHtcbiAgICBwcm9wZXJ0eUJhZ1twcm9wZXJ0eV0gPSBkZXNjcmlwdGlvbnNbcHJvcGVydHldO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCB7XG4gICAgICBnZXQ6ICgpID0+IHByb3BlcnR5QmFnW3Byb3BlcnR5XVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFNlbnNvckVycm9yRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGVycm9yRXZlbnRJbml0RGljdCkge1xuICAgIHN1cGVyKHR5cGUsIGVycm9yRXZlbnRJbml0RGljdCk7XG5cbiAgICBpZiAoIWVycm9yRXZlbnRJbml0RGljdCB8fCAhKGVycm9yRXZlbnRJbml0RGljdC5lcnJvciBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbikpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihcbiAgICAgICAgXCJGYWlsZWQgdG8gY29uc3RydWN0ICdTZW5zb3JFcnJvckV2ZW50JzpcIiArXG4gICAgICAgIFwiMm5kIGFyZ3VtZW50IG11Y2ggY29udGFpbiAnZXJyb3InIHByb3BlcnR5XCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiZXJyb3JcIiwge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBlcnJvckV2ZW50SW5pdERpY3QuZXJyb3JcbiAgICB9KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZGVmaW5lT25FdmVudExpc3RlbmVyKHRhcmdldCwgbmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBgb24ke25hbWV9YCwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogbnVsbFxuICB9KTtcbn1cblxuY29uc3QgU2Vuc29yU3RhdGUgPSB7XG4gIElETEU6IDEsXG4gIEFDVElWQVRJTkc6IDIsXG4gIEFDVElWRTogMyxcbn1cblxuY2xhc3MgU2Vuc29yIGV4dGVuZHMgRXZlbnRUYXJnZXQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzW3Nsb3RdID0gbmV3IFdlYWtNYXA7XG5cbiAgICBkZWZpbmVPbkV2ZW50TGlzdGVuZXIodGhpcywgXCJyZWFkaW5nXCIpO1xuICAgIGRlZmluZU9uRXZlbnRMaXN0ZW5lcih0aGlzLCBcImFjdGl2YXRlXCIpO1xuICAgIGRlZmluZU9uRXZlbnRMaXN0ZW5lcih0aGlzLCBcImVycm9yXCIpO1xuXG4gICAgZGVmaW5lUmVhZG9ubHlQcm9wZXJ0aWVzKHRoaXMsIHNsb3QsIHtcbiAgICAgIGFjdGl2YXRlZDogZmFsc2UsXG4gICAgICBoYXNSZWFkaW5nOiBmYWxzZSxcbiAgICAgIHRpbWVzdGFtcDogbnVsbFxuICAgIH0pXG5cbiAgICB0aGlzW3Nsb3RdLnN0YXRlID0gU2Vuc29yU3RhdGUuSURMRTtcblxuICAgIHRoaXNbc2xvdF0ubm90aWZ5RXJyb3IgPSAobWVzc2FnZSwgbmFtZSkgPT4ge1xuICAgICAgbGV0IGVycm9yID0gbmV3IFNlbnNvckVycm9yRXZlbnQoXCJlcnJvclwiLCB7XG4gICAgICAgIGVycm9yOiBuZXcgRE9NRXhjZXB0aW9uKG1lc3NhZ2UsIG5hbWUpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChlcnJvcik7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLm5vdGlmeUFjdGl2YXRlZFN0YXRlID0gKCkgPT4ge1xuICAgICAgbGV0IGFjdGl2YXRlID0gbmV3IEV2ZW50KFwiYWN0aXZhdGVcIik7XG4gICAgICB0aGlzW3Nsb3RdLmFjdGl2YXRlZCA9IHRydWU7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoYWN0aXZhdGUpO1xuICAgICAgdGhpc1tzbG90XS5zdGF0ZSA9IFNlbnNvclN0YXRlLkFDVElWRTtcbiAgICB9XG5cbiAgICB0aGlzW3Nsb3RdLmFjdGl2YXRlQ2FsbGJhY2sgPSAoKSA9PiB7fTtcbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjayA9ICgpID0+IHt9O1xuXG4gICAgdGhpc1tzbG90XS5mcmVxdWVuY3kgPSBudWxsO1xuXG4gICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cucGFyZW50ICE9IHdpbmRvdy50b3ApIHtcbiAgICAgIHRocm93IG5ldyBET01FeGNlcHRpb24oXCJPbmx5IGluc3RhbnRpYWJsZSBpbiBhIHRvcC1sZXZlbCBicm93c2luZyBjb250ZXh0XCIsIFwiU2VjdXJpdHlFcnJvclwiKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Yob3B0aW9ucy5mcmVxdWVuY3kpID09IFwibnVtYmVyXCIpIHtcbiAgICAgIGlmIChvcHRpb25zLmZyZXF1ZW5jeSA+IDYwKSB7XG4gICAgICAgIHRoaXMuZnJlcXVlbmN5ID0gb3B0aW9ucy5mcmVxdWVuY3k7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXNbc2xvdF0uc3RhdGUgPT09IFNlbnNvclN0YXRlLkFDVElWQVRJTkcgfHwgdGhpc1tzbG90XS5zdGF0ZSA9PT0gU2Vuc29yU3RhdGUuQUNUSVZFKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXNbc2xvdF0uc3RhdGUgPSBTZW5zb3JTdGF0ZS5BQ1RJVkFUSU5HO1xuICAgIHRoaXNbc2xvdF0uYWN0aXZhdGVDYWxsYmFjaygpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpc1tzbG90XS5zdGF0ZSA9PT0gU2Vuc29yU3RhdGUuSURMRSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzW3Nsb3RdLmFjdGl2YXRlZCA9IGZhbHNlO1xuICAgIHRoaXNbc2xvdF0uaGFzUmVhZGluZyA9IGZhbHNlO1xuICAgIHRoaXNbc2xvdF0udGltZXN0YW1wID0gbnVsbDtcbiAgICB0aGlzW3Nsb3RdLmRlYWN0aXZhdGVDYWxsYmFjaygpO1xuXG4gICAgdGhpc1tzbG90XS5zdGF0ZSA9IFNlbnNvclN0YXRlLklETEU7XG4gIH1cbn0iLCIvLyAuLiBDb3B5cmlnaHQgKEMpIDIwMTItMjAyMCBCcnlhbiBBLiBKb25lcy5cbi8vXG4vLyAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIENlbGxCb3RpY3Mgc3lzdGVtLlxuLy9cbi8vICBUaGUgQ2VsbEJvdGljcyBzeXN0ZW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4vLyAgbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbi8vICBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGVcbi8vICBMaWNlbnNlLCBvciAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vICBUaGUgQ2VsbEJvdGljcyBzeXN0ZW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlXG4vLyAgdXNlZnVsLCBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eVxuLy8gIG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGUgR05VXG4vLyAgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gIGFsb25nIHdpdGggdGhlIENlbGxCb3RpY3Mgc3lzdGVtLiAgSWYgbm90LCBzZWVcbi8vICA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4vL1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0gSW50ZXJmYWNlIHdpdGggc2Vuc29yc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBwcm92aWRlcyBjb2RlIHRvIGFjY2VzcyBgc2Vuc29yIEFQSXMgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZW5zb3JfQVBJcz5gXy5cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgXCIuL3Blcm1pc3Npb25zX3BvbHlmaWxsLmpzXCI7XG5pbXBvcnQgXCIuL3NlbnNvcl9wb2x5ZmlsbC9nZW9sb2NhdGlvbi1zZW5zb3IuanNcIjtcbmltcG9ydCBcIi4vc2Vuc29yX3BvbHlmaWxsL21vdGlvbi1zZW5zb3JzLmpzXCI7XG5pbXBvcnQgeyBhdXRvX2JpbmQgfSBmcm9tIFwiLi9hdXRvLWJpbmQuanNcIjtcblxuLy8gU2ltcGxlU2Vuc29yXG4vLyA9PT09PT09PT09PT1cbi8vIFRoaXMgY2xhc3Mgd3JhcHMgYSBgU2Vuc29yIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2Vuc29yPmBfIHdpdGggc2ltcGxlIGBgc3RhcnRgYCwgYGByZWFkeWBgLCBhbmQgYGBzdG9wYGAgZnVuY3Rpb25zLlxuY2xhc3MgU2ltcGxlU2Vuc29yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgYXV0b19iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc2Vuc29yID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBUaGlzIHdhcyBpbml0aWFsbHkgYmFzZWQgb24gdGhlIE1ETiBTZW5zb3IgQVBJIGRvY3MuXG4gICAgYXN5bmMgc3RhcnQoXG4gICAgICAgIC8vIFRoZSBjbGFzcyB0byB1c2UgZm9yIHRoZSBzZW5zb3IgdG8gc3RhcnQuIEl0IG11c3QgYmUgYmFzZWQgb24gdGhlIFNlbnNvciBpbnRlcmZhY2UuXG4gICAgICAgIHNlbnNvcl9jbGFzcyxcbiAgICAgICAgLy8gQW4gYXJyYXkgb2Ygc3RyaW5ncywgZ2l2aW5nIHRoZSBuYW1lIG9mIHRoZSBBUEkgdG8gYXNrIHBlcm1pc3Npb25zIG9mIGZvciB0aGlzIHNlbnNvci4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QZXJtaXNzaW9ucy9xdWVyeS5cbiAgICAgICAgc2Vuc29yX3Blcm1pc3Npb24sXG4gICAgICAgIC8vIE9wdGlvbnMgdG8gcGFzcyB0byB0aGlzIHNlbnNvcidzIGNvbnN0cnVjdG9yLlxuICAgICAgICBzZW5zb3Jfb3B0aW9uc1xuICAgICkge1xuICAgICAgICBpZiAodGhpcy5zZW5zb3IpIHtcbiAgICAgICAgICAgIHRocm93IFwiSW4gdXNlLiBTdG9wIHRoZSBzZW5zb3IgYmVmb3JlIHN0YXJ0aW5nIGFub3RoZXIuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzZW5zb3JfY2xhc3MgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgXCJOb3QgYXZhaWxhYmxlLlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IHBlcm1pc3Npb24gdG8gdXNlIHRoZXNlIHNlbnNvcnMsIGlmIHRoZSBBUEkgaXMgc3VwcG9ydGVkLlxuICAgICAgICBpZiAobmF2aWdhdG9yLnBlcm1pc3Npb25zKSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgUHJvbWlzZS5hbGwoc2Vuc29yX3Blcm1pc3Npb24ubWFwKHggPT4gbmF2aWdhdG9yLnBlcm1pc3Npb25zLnF1ZXJ5KHsgbmFtZTogeCB9KSkpO1xuICAgICAgICAgICAgaWYgKCFyZXN1bHQuZXZlcnkodmFsID0+IHZhbC5zdGF0ZSA9PT0gXCJncmFudGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgYFBlcm1pc3Npb24gdG8gdXNlIHRoZSAke3NlbnNvcl9wZXJtaXNzaW9ufSBzZW5zb3Igd2FzIGRlbmllZC5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVG8gYWNjZXNzIGEgc2Vuc29yOlxuICAgICAgICAvL1xuICAgICAgICAvLyAjLiAgIENyZWF0ZSBpdCwgdGhlbiBzdGFydCBpdCwgc3luY2hyb25vdXNseSBjaGVja2luZyBmb3IgZXJyb3JzIGluIHRoaXMgcHJvY2Vzcy5cbiAgICAgICAgLy8gIy4gICBBd2FpdCBmb3IgYSByZXNwb25zZSBmcm9tIHRoZSBzZW5zb3I6IGFuIGFjY2VwdGFuY2UgaW5kaWNhdGluZyB0aGUgc2Vuc29yIHdvcmtzLCBvciBhIHJlamVjdGlvbiBpbmRpY2F0aW5nIGEgZmFpbHVyZS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gU2luY2UgdGhlIGV2ZW50IGhhbmRsZXJzIHRvIGFjY2VwdCBvciByZWplY3QgdGhlIHByb21pc2UgbXVzdCBiZSBzZXQgdXAgaW4gdGhlIHN5bmNocm9ub3VzIHBoYXNlLCB3cmFwIGV2ZXJ5dGhpbmcgaW4gYSBwcm9taXNlLiBBbGwgdGhlIG9wZXJhdGlvbnMgYWJvdmUgdGhlcmVmb3JlIHN0YXJ0IHdoZW4gdGhlIHByb21pc2UgaXMgYXdhaXRlZC5cbiAgICAgICAgdGhpcy5zZW5zb3IgPSBudWxsO1xuICAgICAgICBsZXQgb25fZXJyb3I7XG4gICAgICAgIGxldCBvbl9yZWFkaW5nO1xuICAgICAgICBsZXQgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zb3IgPSBuZXcgc2Vuc29yX2NsYXNzKHNlbnNvcl9vcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBjYWxsYmFjayBlcnJvcnMgYnkgcmVqZWN0aW5nIHRoZSBwcm9taXNlLlxuICAgICAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICAgICBvbl9lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZW5zb3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIG9uX2Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHJ1bnRpbWUgZXJyb3JzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZXJyb3IubmFtZSA9PT0gJ05vdEFsbG93ZWRFcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChcIkFjY2VzcyB0byB0aGlzIHNlbnNvciBpcyBub3QgYWxsb3dlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZXJyb3IubmFtZSA9PT0gJ05vdFJlYWRhYmxlRXJyb3InICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdDYW5ub3QgY29ubmVjdCB0byB0aGUgc2Vuc29yLicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChgVW5rbm93biBlcnJvcjogJHtldmVudC5lcnJvci5uYW1lfWApO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29yLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25fZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGZpcnN0IHNlbnNvciByZWFkaW5nIHRvIGFjY2VwdCB0aGUgcHJvbWlzZS5cbiAgICAgICAgICAgICAgICBvbl9yZWFkaW5nID0gZXZlbnQgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2Vuc29yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZWFkaW5nXCIsIG9uX3JlYWRpbmcpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2Vuc29yLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkaW5nXCIsIG9uX3JlYWRpbmcpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zb3Iuc3RhcnQoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGNvbnN0cnVjdGlvbiBlcnJvcnMuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yLm5hbWUgPT09ICdTZWN1cml0eUVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWUgdGhlIG5vdGUgYWJvdmUgYWJvdXQgZmVhdHVyZSBwb2xpY3kuXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcIlNlbnNvciBjb25zdHJ1Y3Rpb24gd2FzIGJsb2NrZWQgYnkgYSBmZWF0dXJlIHBvbGljeS5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5uYW1lID09PSAnUmVmZXJlbmNlRXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcIlNlbnNvciBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBVc2VyIEFnZW50LlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU3RhcnQgdGhlIHNlbnNvciwgd2FpdGluZyB1bnRpbCBpdCBwcm9kdWNlcyBhIHJlYWRpbmcgb3IgYW4gZXJyb3IuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQXdhaXQgJHtuZXcgRGF0ZSgpfWApO1xuICAgICAgICAgICAgYXdhaXQgcDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBEb25lICR7bmV3IERhdGUoKX1gKTtcbiAgICAgICAgICAgIHRoaXMuc2Vuc29yLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBvbl9lcnJvcik7XG4gICAgICAgICAgICB0aGlzLnNlbnNvci5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVhZGluZ1wiLCBvbl9yZWFkaW5nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRydWUgaWYgdGhlIHNlbnNvciBpcyBhY3RpdmF0ZWQgYW5kIGhhcyBhIHJlYWRpbmcuXG4gICAgZ2V0IHJlYWR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IgJiYgdGhpcy5zZW5zb3IuYWN0aXZhdGVkICYmIHRoaXMuc2Vuc29yLmhhc1JlYWRpbmc7XG4gICAgfVxuXG4gICAgLy8gVG8gc2F2ZSBkZXZpY2UgcG93ZXIsIGJlIHN1cmUgdG8gc3RvcCB0aGUgc2Vuc29yIGFzIHNvb24gYXMgdGhlIHJlYWRpbmdzIGFyZSBubyBsb25nZXIgbmVlZGVkLlxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuc2Vuc29yICYmIHRoaXMuc2Vuc29yLnN0b3AoKTtcbiAgICAgICAgdGhpcy5zZW5zb3IgPSBudWxsO1xuICAgIH1cbn1cblxuXG4vLyBBYnN0cmFjdCBoZWxwZXIgY2xhc3Nlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFNldmVyYWwgc2Vuc29ycyByZXR1cm4geCwgeSwgYW5kIHogdmFsdWVzLiBDb2xsZWN0IHRoZSBjb21tb24gY29kZSBoZXJlLlxuY2xhc3MgU2ltcGxlWFlaU2Vuc29yIGV4dGVuZHMgU2ltcGxlU2Vuc29yIHtcbiAgICBnZXQgeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLng7XG4gICAgfVxuXG4gICAgZ2V0IHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci55O1xuICAgIH1cblxuICAgIGdldCB6KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IuejtcbiAgICB9XG59XG5cblxuLy8gVHdvIHNlbnNvcnMgcmV0dXJuIGEgcXVhdGVybmlvbiBvciByb3RhdGlvbiBtYXRyaXguXG5jbGFzcyBTaW1wbGVPcmllbnRhdGlvblNlbnNvciBleHRlbmRzIFNpbXBsZVNlbnNvciB7XG4gICAgZ2V0IHF1YXRlcm5pb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5xdWF0ZXJuaW9uO1xuICAgIH1cblxuICAgIHBvcHVsYXRlTWF0cml4KHRhcmdldE1hdHJpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IucG9wdWxhdGVNYXRyaXgodGFyZ2V0TWF0cml4KTtcbiAgICB9XG59XG5cblxuLy8gQ29uY3JldGUgY2xhc3Nlc1xuLy8gPT09PT09PT09PT09PT09PVxuLy8gTm90ZSB0aGUgdXNlIG9mIGBgd2luZG93LlNlbnNvck5hbWVgYCBpbnN0ZWFkIG9mIGBgU2Vuc29yTmFtZWBgIGZvciBub24tcG9seWZpbGxzLiBUaGlzIGF2b2lkcyBleGNlcHRpb25zIGlmIHRoZSBwYXJ0aWN1bGFyIHNlbnNvciBpc24ndCBkZWZpbmVkLCBwcm9kdWNpbmcgYW4gYGB1bmRlZmluZWRgYCBpbnN0ZWFkLiBGb3IgcG9seWZpbGxzLCB3ZSBtdXN0IHVzZSBgYFNlbnNvck5hbWVgYCBpbnN0ZWFkIG9mIGBgd2luZG93LlNlbnNvck5hbWVgYC5cbmV4cG9ydCBjbGFzcyBTaW1wbGVBbWJpZW50TGlnaHRTZW5zb3IgZXh0ZW5kcyBTaW1wbGVTZW5zb3Ige1xuICAgIGFzeW5jIHN0YXJ0KGFsc19vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydCh3aW5kb3cuQW1iaWVudExpZ2h0U2Vuc29yLCBbXCJhbWJpZW50LWxpZ2h0LXNlbnNvclwiXSwgYWxzX29wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldCBpbGx1bWluYW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLmlsbHVtaW5hbmNlO1xuICAgIH1cbn1cblxuXG4vLyBTZWUgdGhlIGBXM0MgZHJhZnQgc3BlYyA8aHR0cHM6Ly93M2MuZ2l0aHViLmlvL2dlb2xvY2F0aW9uLXNlbnNvci8jZ2VvbG9jYXRpb25zZW5zb3ItaW50ZXJmYWNlPmBfLlxuZXhwb3J0IGNsYXNzIFNpbXBsZUdlb2xvY2F0aW9uU2Vuc29yIGV4dGVuZHMgU2ltcGxlU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChnZW9fb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQoR2VvbG9jYXRpb25TZW5zb3IsIFtcImdlb2xvY2F0aW9uXCJdLCBnZW9fb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0IGxhdGl0dWRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5zb3IubGF0aXR1ZGU7XG4gICAgfVxuXG4gICAgZ2V0IGxvbmdpdHVkZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLmxvbmdpdHVkZTtcbiAgICB9XG5cbiAgICBnZXQgYWx0aXR1ZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5hbHRpdHVkZTtcbiAgICB9XG5cbiAgICBnZXQgYWNjdXJhY3koKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5hY2N1cmFjeTtcbiAgICB9XG5cbiAgICBnZXQgYWx0aXR1ZGVBY2N1cmFjeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLmFsdGl0dWRlQWNjdXJhY3k7XG4gICAgfVxuXG4gICAgZ2V0IGhlYWRpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbnNvci5oZWFkaW5nO1xuICAgIH1cblxuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vuc29yLnNwZWVkO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlQWNjZWxlcm9tZXRlciBleHRlbmRzIFNpbXBsZVhZWlNlbnNvciB7XG4gICAgYXN5bmMgc3RhcnQoYWNjZWxlcm9tZXRlcl9vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydChBY2NlbGVyb21ldGVyLCBbXCJhY2NlbGVyb21ldGVyXCJdLCBhY2NlbGVyb21ldGVyX29wdGlvbnMpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlR3lyb3Njb3BlIGV4dGVuZHMgU2ltcGxlWFlaU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChneXJvX29wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnN0YXJ0KEd5cm9zY29wZSwgW1wiZ3lyb3Njb3BlXCJdLCBneXJvX29wdGlvbnMpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlTGluZWFyQWNjZWxlcmF0aW9uU2Vuc29yIGV4dGVuZHMgU2ltcGxlWFlaU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChhY2NlbF9vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydChMaW5lYXJBY2NlbGVyYXRpb25TZW5zb3IsIFtcImFjY2VsZXJvbWV0ZXJcIl0sIGFjY2VsX29wdGlvbnMpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlR3Jhdml0eVNlbnNvciBleHRlbmRzIFNpbXBsZVhZWlNlbnNvciB7XG4gICAgYXN5bmMgc3RhcnQoZ3Jhdl9vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydChHcmF2aXR5U2Vuc29yLCBbXCJhY2NlbGVyb21ldGVyXCJdLCBncmF2X29wdGlvbnMpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlTWFnbmV0b21ldGVyIGV4dGVuZHMgU2ltcGxlWFlaU2Vuc29yIHtcbiAgICBhc3luYyBzdGFydChtYWdfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gc3VwZXIuc3RhcnQod2luZG93Lk1hZ25ldG9tZXRlciwgW1wibWFnbmV0b21ldGVyXCJdLCBtYWdfb3B0aW9ucyk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTaW1wbGVBYnNvbHV0ZU9yaWVudGF0aW9uU2Vuc29yIGV4dGVuZHMgU2ltcGxlT3JpZW50YXRpb25TZW5zb3Ige1xuICAgIGFzeW5jIHN0YXJ0KG9yaWVudF9vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydChBYnNvbHV0ZU9yaWVudGF0aW9uU2Vuc29yLCBbXCJhY2NlbGVyb21ldGVyXCIsIFwiZ3lyb3Njb3BlXCIsIFwibWFnbmV0b21ldGVyXCJdLCBvcmllbnRfb3B0aW9ucyk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTaW1wbGVSZWxhdGl2ZU9yaWVudGF0aW9uU2Vuc29yIGV4dGVuZHMgU2ltcGxlT3JpZW50YXRpb25TZW5zb3Ige1xuICAgIGFzeW5jIHN0YXJ0KG9yaWVudF9vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5zdGFydChSZWxhdGl2ZU9yaWVudGF0aW9uU2Vuc29yLCBbXCJhY2NlbGVyb21ldGVyXCIsIFwiZ3lyb3Njb3BlXCJdLCBvcmllbnRfb3B0aW9ucyk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9