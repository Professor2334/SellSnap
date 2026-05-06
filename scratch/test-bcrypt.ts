import bcrypt from 'bcryptjs';

const hash = '$2a$10$CHO3dvJnVUcVSe69h1oCTealOFaILhNm2nq9SpSsVnv1JniROYlnK';
const password = 'Password123!'; // I'm guessing this might be the password they used for testing

async function test() {
  const match = await bcrypt.compare(password, hash);
  console.log('Password match:', match);
}

test();
