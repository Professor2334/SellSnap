import bcrypt from 'bcryptjs';

const hash = '$2a$10$80sUqHNrWGdtjTqS6Ffe3udvmGYxt/4/EBsl1RLdOtJlhmtlE/iYe';
const password = 'Password123!';

async function test() {
  const match = await bcrypt.compare(password, hash);
  console.log('Password match:', match);
}

test();
