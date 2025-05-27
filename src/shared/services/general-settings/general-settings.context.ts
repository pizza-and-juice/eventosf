import appStorage from 'src/shared/app-storage/app-storage';
import GeneralSettingsService from './general-settings.service';
import { createContext } from 'react';

const def = new GeneralSettingsService(appStorage);

const geneneralSettingsSvcContext = createContext<GeneralSettingsService>(def);

export default geneneralSettingsSvcContext;
