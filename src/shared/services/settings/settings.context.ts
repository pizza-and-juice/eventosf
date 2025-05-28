import { createContext } from 'react';
import { ISettingsService } from './settings.service';

// @ts-expect-error init later
const SettingsSvcContext = createContext<ISettingsService>(null);
export default SettingsSvcContext;
