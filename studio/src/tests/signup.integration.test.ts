import { UserRepository } from '../lib/repositories/user.repository';
import pool from '../lib/db';
import assert from 'assert';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Signup Integration Test
 * Verifies the user registration flow from data validation to database persistence.
 */
async function runSignupTests() {
  console.log('🚀 Starting Signup Integration Tests...');

  const userRepo = new UserRepository();
  const testId = Date.now();
  const testData = {
    username: `testuser_${testId}`,
    email: `test_${testId}@example.com`,
    password: 'Password123!',
    display_name: 'Test Integration User',
    first_name: 'Test',
    last_name: 'User',
    phone_number: '+1234567890',
  };

  try {
    // 1. Test Successful Registration Flow
    console.log('--- Case 1: Successful User Registration ---');
    
    // Simulate API logic
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(testData.password, salt);
    const verification_token = uuidv4();

    const newUser = await userRepo.create({
      username: testData.username,
      email: testData.email,
      password_hash,
      display_name: testData.display_name,
      first_name: testData.first_name,
      last_name: testData.last_name,
      phone_number: testData.phone_number,
      verification_token
    });

    assert.ok(newUser.id, 'User should be created with an ID');
    assert.strictEqual(newUser.username, testData.username);
    assert.strictEqual(newUser.email, testData.email);
    assert.strictEqual(newUser.first_name, testData.first_name);
    assert.strictEqual(newUser.is_verified, 0); // MySQL BOOLEAN is 0/1
    assert.ok(newUser.password_hash.startsWith('$2a$') || newUser.password_hash.startsWith('$2b$'), 'Password should be hashed');
    console.log(`✅ User created successfully: ${newUser.username}`);

    // 2. Test Duplicate Username
    console.log('--- Case 2: Duplicate Username Case ---');
    try {
      await userRepo.create({
        username: testData.username,
        email: `different_${testId}@example.com`,
        password_hash: 'hash',
        display_name: 'Different Email'
      });
      assert.fail('Should have thrown an error for duplicate username');
    } catch (error: any) {
      assert.ok(error.message.includes('ER_DUP_ENTRY'), 'Should throw duplicate entry error');
      console.log('✅ Duplicate username handled correctly');
    }

    // 3. Test Duplicate Email
    console.log('--- Case 3: Duplicate Email Case ---');
    try {
      await userRepo.create({
        username: `different_user_${testId}`,
        email: testData.email,
        password_hash: 'hash',
        display_name: 'Different Username'
      });
      assert.fail('Should have thrown an error for duplicate email');
    } catch (error: any) {
      assert.ok(error.message.includes('ER_DUP_ENTRY'), 'Should throw duplicate entry error');
      console.log('✅ Duplicate email handled correctly');
    }

    // 4. Test Finding User by Email
    console.log('--- Case 4: Find User by Email ---');
    const foundUser = await userRepo.findByEmail(testData.email);
    assert.ok(foundUser, 'Should find user by email');
    assert.strictEqual(foundUser.id, newUser.id);
    console.log('✅ User found by email successfully');

    // 5. Cleanup
    console.log('--- Cleaning up test data ---');
    await pool.execute('DELETE FROM user_accounts WHERE id = ?', [newUser.id]);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All Signup Integration Tests Passed!');

  } catch (error) {
    console.error('❌ Integration Tests Failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSignupTests();
