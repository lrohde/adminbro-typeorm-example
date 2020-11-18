import express from 'express';
import AdminBro from 'admin-bro';
import * as AdminBroExpress from '@admin-bro/express'
import { Database, Resource } from '@admin-bro/typeorm';
import { createConnection } from 'typeorm';
import { validate } from 'class-validator';
import 'reflect-metadata';

import User from './models/User';

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

( async () =>
{
    await createConnection();

    const AdminBroOptions = {
      resources: [
        { resource: User, options: { parent: { name: 'Usuários' } } }
      ],
      rootPath: '/admin',
    }

    const adminBro = new AdminBro(AdminBroOptions);

    const app = express();
    
    const router = AdminBroExpress.buildRouter(adminBro);
    
    app.use(adminBro.options.rootPath, router);
    
    app.get('/', (req, res) => {
      return res.send('Hello WOrld');
    });
    
    app.listen(3333, () => console.log('AdminBro is under localhost:3333/admin'))
})();