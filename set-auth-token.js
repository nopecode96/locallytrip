// Script untuk set authentication token di browser
// Jalankan ini di browser console untuk set token fresh

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI3LCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzU4MTE4NTA1LCJleHAiOjE3NTg3MjMzMDV9.hi5rdS4sCZhKoan6-zvcbCm7hhoqx9fE72az1LgUjZw";

// Set token di localStorage
localStorage.setItem('auth_token', token);

console.log('✅ Token berhasil di-set!');
console.log('Token expires at:', new Date(1758723305 * 1000));
console.log('Silakan refresh halaman atau navigate ke halaman edit experience.');
