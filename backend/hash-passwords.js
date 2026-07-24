const bcrypt = require('bcryptjs');
const passwords = ['Admin@123', 'Sales@123', 'Warehouse@123', 'Accounts@123'];
passwords.forEach(async (pwd, i) => {
  const hash = await bcrypt.hash(pwd, 10);
  console.log(`Role ${i+1} hash: ${hash}`);
});