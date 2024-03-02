import axios from 'axios';

const baseURL = 'http://localhost:5005';

class WebhooksService {
    constructor() {
        this.csrfToken = null;
    }

    initialize(token) {
        this.csrfToken = token;
    }


    async callCreateWebhookAPI() {
      try {
        console.log("Calling createWebhook API...");
        // const response = await axios.post(`${baseURL}/api/createWebhook`, { withCredentials: true });
    const response = await fetch(`${baseURL}/api/webhook/createWebhook`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // No CORS headers should be here
      },
      // include body if required
    });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("createWebhook API response...");
    
        const data = await response.json();
        return data.uuid;
      } catch (error) {
        console.error("Failed to create webhook:", error);
      }
    }
        
    

 async fetchWebhookEvents(eventReceived) {

    if (eventReceived) {
        return; // Exit the function if an event has already been received
      }

    try {
      const response = await axios.get('http://localhost:5005/api/webhook/webhookEvents'); // Replace with your actual API endpoint
      console.log('createWebhook Received Webhook Event:', response.data); // Log the event data
      return response.data; // Return the data
    //   return response.data; // Return the data for further processing
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };

  async fetchLatestFromWebhookSite(uuid) {
    try {
        console.log('Fetching the latest webhook data with webhook id UUID:', uuid);   
        const response = await axios.get(`http://localhost:5005/api/webhook/fetchWebhookData/${uuid}`); // Replace with your actual API endpoint
        console.log('Latest Webhook Data:', response.data); // Log the data
        console.log('Webhook event received:', response.data.data);

        return response.data; // Return the data for further processing
    } catch (error) {
        console.error('Error fetching latest webhook data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
  
}


}

  export default new WebhooksService();

  