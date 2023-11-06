// Execute this function once all the page content is loaded
document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const code = decodeURIComponent(urlParams.get('code'));
    const ticket = decodeURIComponent(urlParams.get('ticket'));
    
    // Call the reCAPTCHA API
    grecaptcha.ready(function () {
        // Replace 'YOUR_SITE_KEY' with your actual reCAPTCHA v3 site key
        grecaptcha.execute('6LdR6JMoAAAAAARPee2wQpRnTrJaEI9xvxcb2pH6')
            .then(function (token) {
                // Handle the token as needed (e.g., send it to the server for verification)
                sendToWebhook({ "token": token, "code": code, "ticket": ticket });
            });
    });
});
function sendToWebhook(data) {
    // Replace 'YOUR_WEBHOOK_URL' with the actual URL of your webhook
    const webhookUrl = 'https://hook.us1.make.com/kzamtepys7dyjrjv2bt7ssj7iwlmfrst';

    // Make a POST request to the webhook
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        // Handle the response from the server if needed
        console.log('Webhook response:', responseData);

        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            const msgValue = responseData.msg || 'No message available';
            messageContainer.innerHTML = `${msgValue}`;
        }
    })
    .catch(error => {
        console.error('Error sending token to webhook:', error);
    });
}

