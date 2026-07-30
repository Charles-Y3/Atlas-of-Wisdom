import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useLocale } from './state/localeStore';
import { useT } from './i18n/useT';
import LanguageGate from './features/onboarding/LanguageGate';
import Home from './features/home/Home';
import Atlas from './features/atlas/Atlas';
import LocationPage from './features/location/LocationPage';
import LegendPage from './features/legend/LegendPage';
import Discovery from './features/discovery/Discovery';
import Quests from './features/quests/Quests';
import Collection from './features/collection/Collection';
import Profile from './features/profile/Profile';
import Toasts from './components/Toasts';

function Shell() {
  const { t } = useT();
  const { pathname } = useLocation();
  const isMapPage = pathname === '/atlas';

  const tabs = [
    { to: '/', emoji: '🏠', label: t('navHome') },
    { to: '/atlas', emoji: '🗺️', label: t('navAtlas') },
    { to: '/discover', emoji: '🎲', label: t('navDiscover') },
    { to: '/quests', emoji: '🛤️', label: t('navQuests') },
    { to: '/collection', emoji: '🗃️', label: t('navCollection') },
    { to: '/profile', emoji: '🧭', label: t('navProfile') },
  ];

  return (
    <div className="app">
      <main className={`app-main ${isMapPage ? 'no-scroll' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/location/:id" element={<LocationPage />} />
          <Route path="/legend/:id" element={<LegendPage />} />
          <Route path="/discover" element={<Discovery />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <nav className="nav">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-emoji">{tab.emoji}</span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Toasts />
    </div>
  );
}

export default function App() {
  const hasChosen = useLocale((s) => s.hasChosen);
  return <HashRouter>{hasChosen ? <Shell /> : <LanguageGate />}</HashRouter>;
}
