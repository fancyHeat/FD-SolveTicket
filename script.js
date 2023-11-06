'use strict';

const RECAPTCHA_SITE_KEY = '6LdR6JMoAAAAAARPee2wQpRnTrJaEI9xvxcb2pH6';
const WEBHOOK_URL = 'https://hook.us1.make.com/kzamtepys7dyjrjv2bt7ssj7iwlmfrst';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if both code and ticket parameters are present
    if (urlParams.has('code') && urlParams.has('ticket')) {
        const code = removeZeroWidthSpace(decodeURIComponent(urlParams.get('code')));
        const ticket = removeZeroWidthSpace(decodeURIComponent(urlParams.get('ticket')));

        // Call the reCAPTCHA API
        grecaptcha.ready(function () {
            grecaptcha.execute(RECAPTCHA_SITE_KEY)
                .then(function (token) {
                    // Handle the token as needed (e.g., send it to the server for verification)
                    sendToWebhook({ "token": token, "code": code, "ticket": ticket });
                })
                .catch(function (error) {
                    console.error('Error executing server api call:', error);
                });
        });
    } else {
        const messageContainer = document.getElementById('message-container');
        if (messageContainer !== null) {
            messageContainer.innerHTML = 'Both code and ticket parameters are required in the URL.';
        }
        console.error('Both code and ticket parameters are required in the URL.');
    }
});

function removeZeroWidthSpace(inputString) {
    return inputString.replace(/\u200B/g, ''); // Use regular expression to globally replace all occurrences of U+200B
}

function sendToWebhook(data) {
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(responseData => {
            console.log('Webhook response:', responseData);

            const messageContainer = document.getElementById('message-container');
            if (messageContainer !== null) {
                const msgValue = responseData.msg || 'No message available';
                messageContainer.innerHTML = `${msgValue}`;
            }
        })
        .catch(error => {
            console.error('Error sending token to webhook:', error);
        });
}
