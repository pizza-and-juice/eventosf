import DocumentTitleService from './doc-title.service';
import { createContext } from 'react';

// @ts-expect-error intialize in the context component
const DocTitleSvcContext = createContext<DocumentTitleService>(null);

export default DocTitleSvcContext;
