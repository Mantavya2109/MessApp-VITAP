import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { MenuScreen } from './screens/MenuScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const MainNavigator: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <AppShell>
      {activeTab === 'menu' && <MenuScreen />}
      {activeTab === 'profile' && <ProfileScreen />}
    </AppShell>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

export default App;
