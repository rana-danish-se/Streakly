import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

async function testOTPFlow() {
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };

  console.log('--- Step 1: Register User ---');
  try {
    const regRes = await axios.post(`${API_URL}/register`, testUser);
    console.log('Registration Success:', regRes.data.message);
  } catch (err) {
    console.error('Registration Failed:', err.response?.data || err.message);
    return;
  }

  console.log('\n--- Step 2: Login Unverified ---');
  try {
    await axios.post(`${API_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login Unverified: FAILED (should have failed)');
  } catch (err) {
    console.log('Login Unverified: PASSED (failed as expected)', err.response?.data?.message);
  }

  console.log('\n--- Step 3: Resend OTP ---');
  try {
    const resendRes = await axios.post(`${API_URL}/resend-otp`, { email: testUser.email });
    console.log('Resend OTP:', resendRes.data.message);
  } catch (err) {
    console.error('Resend OTP Failed:', err.response?.data || err.message);
  }

  console.log('\n--- Step 4: Verify Email (Manual check needed for OTP) ---');
  console.log('NOTE: Since OTP is sent to email/Ethereal, you need to provide the OTP manually if testing for real.');
  console.log('Check the terminal where npm run dev is running for the OTP preview URL.');
}

// Check if running on localhost:5000 or if we should skip
testOTPFlow();
