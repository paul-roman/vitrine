import { connect } from 'react-redux';

import { AppState } from '../AppState';
import { EmulatorSettingsRow as EmulatorSettingsRowComponent } from '../components/EmulatorSettingsRow';

const mapStateToProps = (state: AppState) => ({
  platforms: state.modulesConfig.emulated.platforms,
});

const mapDispatchToProps = () => ({});

export const EmulatorSettingsRow = connect(mapStateToProps, mapDispatchToProps)(EmulatorSettingsRowComponent);
