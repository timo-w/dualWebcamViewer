document.getElementById('openWebcams').addEventListener('click', async function() {
    try {
        // Get the list of connected devices (cameras)
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Filter out video input devices (cameras)
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
            alert('No cameras found.');
            return;
        }

        // Open two popup windows
        const popup1 = window.open('', 'webcam1', 'width=640,height=480');
        const popup2 = window.open('', 'webcam2', 'width=640,height=480');

        // Create video elements in the popups
        popup1.document.write('<html><head><link rel="stylesheet" href="styles.css"><title>Webcam 1</title></head><body><div class="video-container"><video id="video1" autoplay muted></video></div></body></html>');
        popup2.document.write('<html><head><link rel="stylesheet" href="styles.css"><title>Webcam 2</title></head><body><div class="video-container"><video id="video2" autoplay muted></video></div></body></html>');

        // Ensure the popups are fully loaded before accessing their contents
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Access video elements in the popups
        const video1 = popup1.document.querySelector('#video1');
        const video2 = popup2.document.querySelector('#video2');

        // Assign video streams to video elements in the popups
        if (videoDevices.length === 1) {
            // Only one camera connected
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { deviceId: videoDevices[0].deviceId },
                audio: false 
            });
            video1.srcObject = stream;
            video2.srcObject = stream;
        } else {
            // Two cameras connected
            const stream1 = await navigator.mediaDevices.getUserMedia({ 
                video: { deviceId: videoDevices[0].deviceId },
                audio: false 
            });
            const stream2 = await navigator.mediaDevices.getUserMedia({ 
                video: { deviceId: videoDevices[1].deviceId },
                audio: false 
            });

            video1.srcObject = stream1;
            video2.srcObject = stream2;
        }

    } catch (error) {
        console.error('Error accessing media devices.', error);
        alert('Error accessing media devices: ' + error.message);
    }
});
