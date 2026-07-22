import axios from 'axios';

async function test() {
  try {
    const email = `test-user-${Date.now()}@gmail.com`;
    console.log(`Sending signup request for ${email}...`);
    const res = await axios.post('http://localhost:5001/register', {
      name: 'Test Signup User',
      email: email,
      password: 'Password@123'
    });
    console.log('Signup response:', res.data);
    process.exit(0);
  } catch (err) {
    console.error('Signup failed detail:');
    console.error('Status:', err.response?.status);
    console.error('Data:', JSON.stringify(err.response?.data));
    console.error('Message:', err.message);
    process.exit(1);
  }
}

test();
