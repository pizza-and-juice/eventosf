import { createContext } from 'react';

import { IAuthService } from './auth.service';

// @ts-expect-error - ignore
const AuthSvcContext = createContext<IAuthService>(null);

export default AuthSvcContext;
