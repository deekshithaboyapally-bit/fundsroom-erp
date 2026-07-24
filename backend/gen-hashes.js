const bcrypt = require('bcryptjs');

async function generate() {
  const users = [
    { email: 'admin@test.com', pwd: 'Admin@123' },
    { email: 'sales@test.com', pwd: 'Sales@123' },
    { email: 'warehouse@test.com', pwd: 'Warehouse@123' },
    { email: 'accounts@test.com', pwd: 'Accounts@123' }
  ];

  console.log('\n👇 COPY & RUN THESE EXACT 4 LINES IN NEON SQL EDITOR 👇\n');
  for (const u of users) {
    const hash = await bcrypt.hash(u.pwd, 10);
    console.log(`UPDATE users SET password = '${hash}' WHERE email = '${u.email}';`);
  }
}

generate();