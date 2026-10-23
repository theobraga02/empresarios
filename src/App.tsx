import React, { useState, useEffect } from 'react';
import { useLocalData } from './hooks/useLocalData';
import { TodayScreen } from './screens/TodayScreen';
import { AgendaScreen } from './screens/AgendaScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MoreScreen } from './screens/MoreScreen';
import { NetworkScreen } from './screens/NetworkScreen';
import { BusinessScreen } from './screens/BusinessScreen';
import { LearnScreen } from './screens/LearnScreen';
import { BottomNav } from './components/BottomNav';
import { NewHabitModal } from './components/NewHabitModal';
import type { TabType, Habit } from './types';

export const App: React.FC = () => {
  const { data, update } = useLocalData();
  const [activeTab, setActiveTab] = useState<TabType>('hoje');
  const [subView, setSubView] = useState<'rede' | 'negocio' | 'aprender' | null>(null);
  const [showNewHabitModal, setShowNewHabitModal] = useState(false);

  // Manutenção automática de streak com base em hábitos concluídos
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const hasAnyCompleted = data.habits.some(h => h.completed);

    if (hasAnyCompleted && data.lastActiveDate !== today) {
      update(prev => ({
        ...prev,
        streak: prev.lastActiveDate ? prev.streak + 1 : 1,
        lastActiveDate: today,
      }));
    }
  }, [data.habits, data.lastActiveDate, update]);

  const handleToggleHabit = (id: string) => {
    update(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === id ? { ...h, completed: !h.completed } : h)),
    }));
  };

  const handleSaveNewHabit = (newHabit: Habit) => {
    update(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  };

  const handleSelectTab = (tab: TabType) => {
    setSubView(null);
    setActiveTab(tab);
  };

  const handleNavigate = (destination: string) => {
    if (destination === 'rede' || destination === 'negocio' || destination === 'aprender') {
      setSubView(destination);
    } else {
      setSubView(null);
      setActiveTab(destination as TabType);
    }
  };

  return (
    <div className="app-viewport">
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* SUB-TELAS */}
        {subView === 'rede' && (
          <NetworkScreen
            data={data}
            update={update}
            onBack={() => setSubView(null)}
          />
        )}

        {subView === 'negocio' && (
          <BusinessScreen
            data={data}
            update={update}
            onBack={() => setSubView(null)}
          />
        )}

        {subView === 'aprender' && (
          <LearnScreen
            data={data}
            update={update}
            onBack={() => setSubView(null)}
          />
        )}

        {/* TELAS PRINCIPAIS */}
        {subView === null && (
          <>
            {activeTab === 'hoje' && (
              <TodayScreen
                data={data}
                onToggleHabit={handleToggleHabit}
                onNavigate={handleNavigate}
                onOpenNewHabit={() => setShowNewHabitModal(true)}
              />
            )}

            {activeTab === 'agenda' && (
              <AgendaScreen
                data={data}
                update={update}
              />
            )}

            {activeTab === 'registrar' && (
              <RegisterScreen
                data={data}
                update={update}
                onDone={() => setActiveTab('hoje')}
              />
            )}

            {activeTab === 'painel' && (
              <DashboardScreen
                data={data}
              />
            )}

            {activeTab === 'mais' && (
              <MoreScreen
                data={data}
                update={update}
                onNavigate={handleNavigate}
                onOpenNewHabit={() => setShowNewHabitModal(true)}
              />
            )}
          </>
        )}
      </main>

      {/* MODAL DE NOVO HÁBITO GLOBAL */}
      <NewHabitModal
        isOpen={showNewHabitModal}
        onClose={() => setShowNewHabitModal(false)}
        onSaveHabit={handleSaveNewHabit}
      />

      {/* BARRA INFERIOR DE NAVEGAÇÃO */}
      <BottomNav active={activeTab} onSelect={handleSelectTab} />
    </div>
  );
};

export default App;
