import { Router } from 'express';
import apiV1 from './apis/v1';

const api = Router()
  .use(apiV1)

export default Router().use('/api/', api);