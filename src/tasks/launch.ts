import dotenv from 'dotenv';
import server from '../api/app';

dotenv.config();

const port = 6400;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
