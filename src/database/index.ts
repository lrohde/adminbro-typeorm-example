import { createConnection } from 'typeorm';

export default (async () => {
  const connection = await createConnection();

  return connection;
})