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

    static proxyUrl = `http://localhost:5005/api/http/executeHttpRequest`;

    async executeHttpRequest(parsedFormData) {
        console.log('executeHttpRequest Parsed form data:', parsedFormData);
        const { url, method, ...otherParams } = parsedFormData;
        console.log('executeHttpRequest URL:', url);

        // Headers and body should be extracted from otherParams based on your needs
        // For example, assuming otherParams contains headers and body directly
        const headers = otherParams.headers || {};
        let body = otherParams.body || {};

        // If body is a string, try parsing it to JSON, or leave as is if parsing fails
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (error) {
                // Body remains a string if it cannot be parsed to JSON
            }
        }
        console.log('Body method url', body, method, url)
        try {
            console.log('Executing HTTP request through proxy:', body);
            const response = await axios.post(NodeExecutionService.proxyUrl, {
                url, // The actual URL to request
                method,
                headers,
                body, // Body parsed from form data, if applicable
            });

            console.log('HTTP request successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error executing HTTP request through proxy:', error);
            throw error;
        }
    }
}

export default new NodeExecutionService();
