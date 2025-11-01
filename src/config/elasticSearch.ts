import { Client } from '@elastic/elasticsearch';
import env from './env';

const client = new Client({ node: env.ELASTIC_URI });

export default client;
