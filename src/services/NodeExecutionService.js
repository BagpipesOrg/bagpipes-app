// import axios from './AxiosService';
import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';

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

    async executeHttpRequest(url, method, body = null, headers = {}) {
        try {
            // Include CSRF token in headers if available
            if (this.csrfToken) {
                headers['X-CSRF-TOKEN'] = this.csrfToken;
            }

            const config = {
                method: method,
                url: url,
                headers: headers,
                withCredentials: true,
            };

            // Include body in the request if it's a POST/PUT/PATCH method
            if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                config.data = body;
            }

            const response = await axios(config);

            // Log and return the response data
            console.log(`[executeHttpRequest] Request successful with response data:`, response.data);
            return response.data;

        } catch (error) {
            console.error(`[executeHttpRequest] Error executing HTTP request to ${url}:`, error);
            throw error; // Rethrow the error for handling in the calling function
        }
    }
}

export default new NodeExecutionService();
