import dev from './config-dev.json';
import prod from './config-prod.json';

export default process.env.NODE_ENV !== 'production' ? dev : prod;