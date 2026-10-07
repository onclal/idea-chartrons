import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SmartBanner } from './SmartBanner';
import { BottomNav } from './BottomNav';
import { SiteFooter } from './SiteFooter';
import { ToastContainer } from './ToastContainer';
import { NearbyAlerts } from './NearbyAlerts';
import { PwaStatusBanner } from './PwaStatusBanner';
import { AISidePanel } from './AISidePanel';
import { DemoNotice } from './DemoNotice';

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <SmartBanner />
      <ToastContainer />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-[5.5rem] flex flex-col">
        <div className="flex-1">
          <DemoNotice />
          <PwaStatusBanner />
          <NearbyAlerts />
          <Outlet />
        </div>
        <SiteFooter />
      </main>
      <BottomNav />
      <AISidePanel />
    </div>
  );
}
