// import axios from './AxiosService';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';
import axios from 'axios';

class NodeExecutionService {
    constructor() {
        this.csrfToken = null;
    }

    initialize(token) {
        this.csrfToken = token;
    }

    async createScenario(initialData) {
        try {
            const response = await axios.post('/api/scenario/createScenario', { initialData, _csrf: this.csrfToken }, { withCredentials: true });
            if (response.status === 201) {
                const scenarioId = response.data._id; // Rename _id to scenarioId
                console.log(`[createScenario] scenario created successfully with scenarioId: ${scenarioId}`);
                return scenarioId;
            }
            return null; // Scenario not created
        } catch (error) {
            console.error("Error creating scenario:", error);
            throw error;
        }
    }

// example:  curl -X POST "https://httpbin.org/anything" -H "accept: application/json" -d "{'test': 'hello'}"
    async executeHttpRequest(parsedFormData) {

        console.log('executeHttpRequest Parsed form data:', parsedFormData);
        try {
            const { value = {} } = parsedFormData;
              // Use the value as the request body directly
              const url = parsedFormData.url; 
              const method = parsedFormData.method; 
        let requestBody = value;
        const headersraw = parsedFormData.headers;

        const headers = {};

            // Iterate over the raw array and construct headers object
            headersraw.forEach(item => {
            const key = item.key.replace(':', ''); // Remove ':' from the key
            headers[key] = item.value;
            });


    //    console.log(`response builder: `, method, url, formattedHeaders, requestBody);
        // Execute the HTTP request with Axios
        console.log(`sending http call`);
        console.log(`response: method, url, headers, data: `, method, url, headers, requestBody);
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: requestBody
        });

        // Log the part of the response you're interested in, for debugging
        console.log('HTTP request successful, status:', response.status);

    
            //const response = await axios.post(NodeExecutionService.proxyUrl, parsedFormData);
            console.log('HTTP request data successful:', response.data);
            return response; // return the entire response  
        } catch (error) {
            console.error('Error executing HTTP request through proxy:', error);
            throw error;
        }
    }
    
}

export default new NodeExecutionService();
