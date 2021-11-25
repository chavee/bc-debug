/* eslint-disable no-alert */
/* eslint-disable no-loop-func */

function peripheralManagerWin(BLE, serviceUUID, heartRateCharacteristicUUID) {
	var central = null;
	var channel = null;
	var logs = [];
	var psmBuffer = null;
	var charProperties = [ BLE.CHARACTERISTIC_PROPERTIES_READ, BLE.CHARACTERISTIC_PROPERTIES_INDICATE ];
	var charPermissions = [ BLE.CHARACTERISTIC_PERMISSION_READABLE ];
	var descriptor = BLE.createDescriptor({
		uuid: BLE.CBUUID_CLIENT_CHARACTERISTIC_CONFIGURATION_STRING,
		permission: BLE.DESCRIPTOR_PERMISSION_WRITE
	});
	var heartRateCharacteristic = BLE.createMutableCharacteristic({
		uuid: heartRateCharacteristicUUID,
		properties: charProperties,
		permissions: charPermissions,
		descriptors: [ descriptor ]
	});
	var heartRateService = null;

	var manager = null;
	var deviceWindow = Ti.UI.createWindow({
		backgroundColor: 'white',
		title: 'Peripheral Manager',
		titleAttributes: { color: 'blue' }
	});
	var win = Ti.UI.createNavigationWindow({
		window: deviceWindow
	});
	var closeButton = Titanium.UI.createButton({
		top: 100,
		title: 'Close'
	});
	closeButton.addEventListener('click', function () {
		win.close();
	});

	deviceWindow.add(closeButton);
	var InitializePeripheralManager = Titanium.UI.createButton({
		top: 140,
		title: 'Initialize Peripheral Manager'
	});
	InitializePeripheralManager.addEventListener('click', function () {
		if (manager === null) {
			manager = BLE.initPeripheralManager();
			manager.addEventListener('didUpdateState', function (e) {
				Ti.API.info('didUpdateState');
				switch (e.state) {
					case BLE.MANAGER_STATE_RESETTING:
						logs.push('Manager state updated to Resetting');
						alert('Resetting');
						break;

					case BLE.MANAGER_STATE_UNSUPPORTED:
						logs.push('Manager state updated to Unsupported');
						alert('Unsupported');
						break;

					case BLE.MANAGER_STATE_UNAUTHORIZED:
						logs.push('Manager state updated to Unauthorized');
						alert('Unauthorized');
						break;

					case BLE.MANAGER_STATE_POWERED_OFF:
						logs.push('Manager state updated to powered Off');
						alert('Peripheral Manager is powered Off');
						break;

					case BLE.MANAGER_STATE_POWERED_ON:
						logs.push('Manager state updated to powered On');
						alert('Peripheral Manager is powered On');
						break;

					case BLE.MANAGER_STATE_UNKNOWN:
					default:
						logs.push('Manager state updated to Unknown');
						alert('Unknown');
						break;
				}
				setData(logs);
			});
			if (heartRateService === null) {
				heartRateService = manager.addService({
					uuid: serviceUUID,
					primary: true,
					characteristics: [ heartRateCharacteristic ]
				});
				logs.push('Adding Heart Rate Service (uuid: 180D) with characteristic (uuid: 2A37)');
				setData(logs);
			}
			manager.addEventListener('didStartAdvertising', function (e) {
				Ti.API.info('Peripheral Manager started advertising');
				logs.push('Peripheral Manager started advertising');
				setData(logs);
			});
			manager.addEventListener('willRestoreState', function (e) {
				Ti.API.info('Peripheral Manager will restore state');
				logs.push('Peripheral Manager will restore state');
				setData(logs);
			});
			manager.addEventListener('didAddService', function (e) {
				if ((typeof e.errorCode !== 'undefined' && e.errorCode !== null) || (typeof e.errorDomain !== 'undefined' && e.errorDomain !== null)) {
					Ti.API.info('Error while adding service');
					if (typeof e.errorDescription !== 'undefined' && e.errorDescription !== null) {
						alert('Error while adding service (error: ' + e.errorDescription + ')');
						return;
					}
					alert('Error while adding service');
					return;
				}
				heartRateService = e.service;
				Ti.API.info('Peripheral Manager added service');
				logs.push('Did Added Service (uuid: 180D) with characteristic (uuid: ' + heartRateCharacteristicUUID + ')');
				setData(logs);
			});
			manager.addEventListener('didSubscribeToCharacteristic', function (e) {
				Ti.API.info('Peripheral Manager subscribed to characteristic');
				central = e.central;
				logs.push('Central Manager Subscribed to ' + e.characteristic.uuid);
				setData(logs);
			});

			manager.addEventListener('didUnsubscribeFromCharacteristic', function (e) {
				Ti.API.info('Peripheral Manager unsubscribed to characteristic');
				central = null;
				logs.push('Central Manager Unsubscribed to ' + e.characteristic.uuid);
				setData(logs);
			});

			manager.addEventListener('didReceiveReadRequest', function (e) {
				Ti.API.info('Peripheral Manager received read request');
				logs.push('Received Read Request from Central Manager');
				setData(logs);
				e.request.updateValue({
					value: psmBuffer
				});
				manager.respondToRequest({
					request: e.request,
					result: 0
				});

			});
			manager.addEventListener('didReceiveWriteRequests', function (e) {
				Ti.API.info('Peripheral Manager received write request');
				var requests = e.requests;
				if (requests.length === 0) {
					for (var i = 0; i < requests.length; i++) {
						logs.push('Value from Central Manager: ' + requests[i].value);
					}
				} else {
					logs.push('Received Write Request from Central Manager');
				}
				setData(logs);
			});

			manager.addEventListener('readyToUpdateSubscribers', function (e) {
				Ti.API.info('Peripheral Manager ready to update subscribers');
				logs.push('readyToUpdateSubscribers');
				setData(logs);
			});

			manager.addEventListener('didPublishL2CAPChannel', function (e) {
				Ti.API.info('Peripheral Manager published L2CAP channel psm - ' + e.psm);
				logs.push('didPublishL2CAPChannel psm - ' + e.psm);
				setData(logs);
				psmBuffer = Ti.createBuffer({ value: e.psm + '' });
				var centrals = [];
				if (central !== null) {
					centrals.push(central);
				}
				manager.updateValue({
					characteristic: heartRateCharacteristic,
					data: psmBuffer,
					central: centrals
				});
			});
			manager.addEventListener('didUnpublishL2CAPChannel', function (e) {
				Ti.API.info('Peripheral Manager unpublished L2CAP channel');
				logs.push('Peripheral Manager unpublished L2CAP channel');
				setData(logs);
			});
			manager.addEventListener('didOpenL2CAPChannel', function (e) {
				Ti.API.info('Peripheral Manager opened L2CAP channel');
				logs.push('Peripheral Manager opened L2CAP channel');
				setData(logs);
				channel = e.channel;
				e.channel.addEventListener('onDataReceived', function (e) {
					Ti.API.info('Peripheral Manager received read data from channel');
					logs.push('Data Received from channel: ' + e.data);
					setData(logs);
				});
				e.channel.addEventListener('onStreamError', function (e) {
					Ti.API.info('Peripheral Manager get error');
					logs.push('Got Stream Error: ' + e.errorDescription);
					setData(logs);
				});
			});
		} else {
			Ti.API.info('Peripheral Manager already Initialized');
			alert('Peripheral Manager already Initialized');
		}
	});

	deviceWindow.add(InitializePeripheralManager);

	var startAdvertisingButton = Titanium.UI.createButton({
		top: 180,
		title: 'Start Advertising'
	});
	startAdvertisingButton.addEventListener('click', function () {
		if (manager === null) {
			Ti.API.info('Peripheral Manager is Not Initialized. Please click \'Initialize Peripheral Manager\'');
			alert('Peripheral Manager is Not Initialized. Please click \'Initialize Peripheral Manager\'');
		} else {
			if (manager.isAdvertising === true) {
				Ti.API.info('Peripheral Manager is already advertising');
				alert('Peripheral Manager is already advertising');
				return;
			}
			var name = IOS ? 'BLE-Sample' : true;
			var encryptionValue = 0;
			manager.publishL2CAPChannel({
				encryptionRequired: encryptionValue
			});
			var servicesUUIDs = [];
			if (heartRateService !== null) {
				servicesUUIDs.push(heartRateService.uuid);
			}
			manager.startAdvertising({
				localName: name,
				serviceUUIDs: servicesUUIDs
			});
		}
	});
	deviceWindow.add(startAdvertisingButton);

	var stopAdvertisingButton = Titanium.UI.createButton({
		top: 220,
		title: 'Stop Advertising'
	});
	stopAdvertisingButton.addEventListener('click', function () {
		if (manager === null) {
			Ti.API.info('Peripheral Manager is Not Initialized. Please click \'Initialize Peripheral Manager\'');
			alert('Peripheral Manager is Not Initialized. Please click \'Initialize Peripheral Manager\'');
		} else {
			if (manager.isAdvertising === false) {
				Ti.API.info('Peripheral Manager is not advertising');
				alert('Peripheral Manager is not advertising');
				return;
			}
			Ti.API.info('Peripheral Manager has stopped advertising');
			alert('Peripheral Manager has stopped advertising');
			manager.stopAdvertising();
		}
	});
	deviceWindow.add(stopAdvertisingButton);

	var updateValue = Titanium.UI.createButton({
		top: 260,
		title: 'Send Image On Channel'
	});
	updateValue.addEventListener('click', function () {
		if (manager === null) {
			Ti.API.info('Peripheral Manager is Not Initialized. Please click \'Initialize Peripheral Manager\'');
			alert('Peripheral Manager is Not Initialized. Please click \'Initialize Peripheral Manager\'');
		} else {
			if (channel === null) {
				alert('Channel is not opened yet');
				return;
			}
			Ti.Media.openPhotoGallery({
				allowMultiple: false,
				mediaTypes: [ Titanium.Media.MEDIA_TYPE_PHOTO ],
				success: function (e) {
					var myBlob = e.media;
					var blobStream = Ti.Stream.createStream({ source: myBlob, mode: Ti.Stream.MODE_READ });
					var newBuffer = Ti.createBuffer({ length: myBlob.length });
					var bytes = 0;
					do {
						bytes = blobStream.read(newBuffer);
					} while (bytes > 0);
					channel.write({
						data: newBuffer
					});
				},
				error: function (e) {
					alert('error opening image: ' + e);
				}
			});
		}
	});
	deviceWindow.add(updateValue);

	var tableView = Titanium.UI.createTableView({
		top: 300,
		scrollable: true,
		backgroundColor: 'White',
		separatorColor: '#DBE1E2',
		bottom: '5%',
	});
	var tbl_data = [];
	function setData(list) {
		tbl_data.splice(0, tbl_data.length);
		if (list.length > 0) {
			var initalValue = list.length - 1;
			for (var i = initalValue; i >= 0; i--) {
				var btDevicesRow = Ti.UI.createTableViewRow({
					height: 50,
					row: i,
					hasChild: true
				});
				var uuidLabel = Ti.UI.createLabel({
					left: 5,
					right: 5,
					color: 'blue',
					top: 5,
					font: { fontSize: 11 },
					text: list[i]
				});
				btDevicesRow.add(uuidLabel);
				tbl_data.push(btDevicesRow);
			}
		}
		tableView.setData(tbl_data);
	}
	setData(logs);
	deviceWindow.add(tableView);

	deviceWindow.addEventListener('close', function () {
		if (channel) {
			channel.close();
		}
		if (manager !== null) {
			manager.closePeripheral();
		}
	});

	return win;
}
exports.peripheralManagerWin = peripheralManagerWin;
