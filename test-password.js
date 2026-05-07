const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'password';
  
  console.log('Testing password hashing...');
  console.log('Original password:', password);
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashedPassword);
  
  // Test comparison
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password comparison result:', isValid);
  
  // Test with the hardcoded hash from the API
  const hardcodedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const isValidHardcoded = await bcrypt.compare(password, hardcodedHash);
  console.log('Hardcoded hash comparison result:', isValidHardcoded);
}

testPassword().catch(console.error); 