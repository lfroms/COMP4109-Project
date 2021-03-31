const rootDir = process.env.NODE_ENV === 'production' ? 'public' : 'src';
const extensionMatcher = process.env.NODE_ENV === 'production' ? '.{js,ts}' : '.ts';

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'password',
  database: 'chat_app',
  synchronize: false,
  logging: true,
  entities: [rootDir + '/models/**/*' + extensionMatcher],
  migrations: [rootDir + '/migrations/**/*' + extensionMatcher],
  subscribers: [rootDir + '/subscribers/**/*' + extensionMatcher],
};
