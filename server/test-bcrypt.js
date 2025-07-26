import bcrypt from 'bcryptjs';

const testBcrypt = async () => {
  try {
    console.log('🧪 Testing bcrypt...');
    
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log(`Password: ${password}`);
    console.log(`Salt: ${salt}`);
    console.log(`Hash: ${hash}`);
    console.log(`Hash length: ${hash.length}`);
    
    // Test comparison
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Comparison test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Test with wrong password
    const isWrongValid = await bcrypt.compare('wrongpassword', hash);
    console.log(`Wrong password test: ${isWrongValid ? '❌ Should be invalid' : '✅ Correctly invalid'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testBcrypt(); 