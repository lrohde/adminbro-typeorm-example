import express from 'express';
import AdminBro, { ActionRequest, ActionContext } from 'admin-bro';
import * as AdminBroExpress from '@admin-bro/express';
import { Database, Resource } from '@admin-bro/typeorm';
import { createConnection } from 'typeorm';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import 'reflect-metadata';

import User from './models/User';

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

(async () => {
  await createConnection();

  const canModifyUsers = ({ currentAdmin }: ActionContext) =>
    currentAdmin && currentAdmin.role === 'admin';

  const AdminBroOptions = {
    resources: [
      {
        resource: User,
        options: {
          parent: {
            name: 'Usuários',
          },
          properties: {
            encryptedPassword: {
              isVisible: false,
            },
            password: {
              type: 'string',
              isVisible: {
                list: false,
                edit: true,
                filter: false,
                show: false,
              },
            },
          },
          actions: {
            new: {
              before: async (request: ActionRequest) => {
                if (request?.payload?.password) {
                  request.payload = {
                    ...request,
                    encryptedPassword: await bcrypt.hash(
                      request.payload.password,
                      10,
                    ),
                    password: undefined,
                  };
                }
                return request;
              },
              isAccessible: canModifyUsers,
            },
            edit: { isAccessible: canModifyUsers },
            delete: { isAccessible: canModifyUsers },
          },
        },
      },
    ],
    rootPath: '/admin',
  };

  const adminBro = new AdminBro(AdminBroOptions);

  const app = express();

  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email: string, password: string) => {
      const user = await User.findOne({ email });
      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: 'kibras2435*',
  });

  app.use(adminBro.options.rootPath, router);

  app.get('/', (req, res) => {
    return res.send('Hello WOrld');
  });

  app.listen(3333, () => console.log('AdminBro is under localhost:3333/admin'));
})();
