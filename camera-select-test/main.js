'use strict';

const videoElement = document.querySelector('video');
const videoSelect = document.querySelector('select#videoSource');

function gotDevices(deviceInfos) {
  // Clear existing options
  while (videoSelect.firstChild) {
    videoSelect.removeChild(videoSelect.firstChild);
  }

  // Populate video input options
  deviceInfos.forEach(deviceInfo => {
    if (deviceInfo.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  });

  // Set the default selected video source if available
  if (videoSelect.options.length > 0) {
    videoSelect.value = videoSelect.options[0].value;
    start();
  }
}

function start() {
  const videoSource = videoSelect.value;
  const constraints = {
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      videoElement.srcObject = stream;
    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
    });
}

function handleError(error) {
  console.error('Error occurred: ', error);
}

// Handle video source selection change
videoSelect.onchange = start;

// Get and list devices
navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(handleError);
