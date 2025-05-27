import { createContext } from 'react';
import TestService from './test.service';

const def = new TestService();

const TestSvcContext = createContext<TestService>(def);

export default TestSvcContext;
