const bcrypt = require('bcrypt');
const storedHash = '$2b$10$pcgein3Y8V6gvmFHjnajfOlT12IRyvcv5t4ujRozh0.uAD/H0d7ry';
bcrypt.compare('StrongP@ssw0rd!', storedHash).then(console.log);
