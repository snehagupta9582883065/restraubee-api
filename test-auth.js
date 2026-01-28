const axios = require('axios');

const API_URL = 'http://localhost:8080/api/auth/';
const TEST_URL = 'http://localhost:8080/api/test/';

async function test() {
    try {
        console.log("1. Testing Hello World...");
        const resHello = await axios.get('http://localhost:8080/');
        console.log("Response:", resHello.data);

        console.log("\n2. Testing Signup (Default User)...");
        const resSignup = await axios.post(API_URL + 'signup', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log("Response:", resSignup.data);

        console.log("\n3. Testing Signin...");
        const resSignin = await axios.post(API_URL + 'signin', {
            username: 'testuser',
            password: 'password123'
        });
        console.log("Signin Success. Roles:", resSignin.data.roles);
        const token = resSignin.data.accessToken;

        console.log("\n4. Testing Protected User Route...");
        const resUser = await axios.get(TEST_URL + 'user', {
            headers: { 'x-access-token': token }
        });
        console.log("Response:", resUser.data);

        console.log("\n5. Testing Admin Route (Should Fail for testuser)...");
        try {
            await axios.get(TEST_URL + 'admin', {
                headers: { 'x-access-token': token }
            });
        } catch (error) {
            console.log("Expected Error:", error.response.data.message);
        }

    } catch (error) {
        console.error("Test failed:", error.message);
        if (error.response) console.error("Response data:", error.response.data);
    }
}

// Note: This script assumes the server is running.
// test();
