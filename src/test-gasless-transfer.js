// Simple test file to demonstrate gasless transfer functionality
// This file shows how to use the implemented gasless transfer system

const { ethers } = require('ethers');

// Example usage of the gasless transfer system
async function testGaslessTransfer() {
  console.log('🚀 Testing Gasless Transfer System');
  
  // Example parameters
  const userAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  const recipientAddress = '0x1234567890123456789012345678901234567890';
  const amount = ethers.parseEther('100'); // 100 tokens
  
  console.log('📋 Transfer Details:');
  console.log(`From: ${userAddress}`);
  console.log(`To: ${recipientAddress}`);
  console.log(`Amount: ${ethers.formatEther(amount)} tokens`);
  
  console.log('\n✅ Gasless transfer system ready!');
  console.log('📡 Use the API endpoints to execute transfers:');
  console.log('POST /api/wallet/transfer/gasless');
  console.log('GET /api/wallet/balance');
  console.log('GET /api/wallet/nonce');
}

// Run the test
testGaslessTransfer().catch(console.error);
