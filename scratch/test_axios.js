import axios from 'axios';

const testAxios = async () => {
    const api = axios.create({
        baseURL: 'http://localhost:3000/api/v1'
    });

    try {
        console.log('Testing with leading slash...');
        // This will likely result in http://localhost:3000/billing/payment/create-order (if it follows web standard)
        // OR http://localhost:3000/api/v1/billing/payment/create-order depending on axios version.
        const res1 = await api.post('/billing/payment/create-order', {});
    } catch (e) {
        console.log('URL for /billing:', e.config.url);
        console.log('BaseURL for /billing:', e.config.baseURL);
    }

    try {
        console.log('\nTesting without leading slash...');
        // This will likely result in http://localhost:3000/api/v1billing/payment/create-order
        const res2 = await api.post('billing/payment/create-order', {});
    } catch (e) {
        console.log('URL for billing:', e.config.url);
    }
};

testAxios();
