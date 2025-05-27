import { createContext } from 'react';
import LayoutService from './layout.service';

// @ts-expect-error intialize in the context component
const LayoutSvcContext = createContext<LayoutService>(null);

export default LayoutSvcContext;
