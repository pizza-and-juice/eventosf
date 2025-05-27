import { createContext } from 'react';
import { IUserService } from './user.service';

// @ts-expect-error initialized in context component
const UserSvcContext = createContext<IUserService>(null);

export default UserSvcContext;
