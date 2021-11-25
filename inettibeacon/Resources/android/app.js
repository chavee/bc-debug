/**
 * Alloy for Titanium by Appcelerator
 * This is generated code, DO NOT MODIFY - changes will be lost!
 * Copyright (c) 2012 by Appcelerator, Inc.
 */
var Alloy = require('/alloy'),
_ = Alloy._,
Backbone = Alloy.Backbone;

// The globals should be configured by the bootstrap script, however if anyone is using an SDK
// older than 7.5.0 that won't get ran. So set them here if they don't exist
if (!global.Alloy) {
  global.Alloy = Alloy;
  global._ = _;
  global.Backbone = Backbone;
}

// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function () {
  const ACS = require('ti.cloud');
  const env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development';
  const username = Ti.App.Properties.getString(`acs-username-${env}`);
  const password = Ti.App.Properties.getString(`acs-password-${env}`);

  // if not configured, just return
  if (!env || !username || !password) {
    return;
  }
  /**
   * Appcelerator Cloud (ACS) Admin User Login Logic
   *
   * fires login.success with the user as argument on success
   * fires login.failed with the result as argument on error
   */
  ACS.Users.login({
    login: username,
    password: password },
  function (result) {
    if (env === 'development') {
      Ti.API.info(`ACS Login Results for environment ${env}`);
      Ti.API.info(result);
    }
    if (result && result.success && result.users && result.users.length) {
      Ti.App.fireEvent('login.success', result.users[0], env);
    } else {
      Ti.App.fireEvent('login.failed', result, env);
    }
  });

})();



// Open root window if a new UI session has started. Can happen more than once in app's lifetime.
// Event can only be fired if "tiapp.xml" property "run-in-background" is set true.
Ti.UI.addEventListener('sessionbegin', function () {
  Alloy.createController('index');
});

// Open the root window immediately if an active UI session exists on startup.
// Note: The Ti.UI.hasSession property was added as of Titanium 9.1.0.
if (typeof Ti.UI.hasSession === 'undefined' || Ti.UI.hasSession) {
  Alloy.createController('index');
}
//# sourceMappingURL=file://d:\GIANT\ww2\inettibeacon/build/map/Resources\android\app.js.map