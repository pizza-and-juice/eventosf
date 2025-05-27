import { createContext } from 'react';
import { IModalService } from './modal.service';

// @ts-expect-error - will be initialized in App
const ModalSvcContext = createContext<IModalService>(null);

export default ModalSvcContext;
