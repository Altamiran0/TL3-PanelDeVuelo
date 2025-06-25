import { AppHeader, InstrumentalPanel, DigitalPanel, CurrentMap } from "./components";
import "./app.css"

export function App() {
  return (
    <>
    <AppHeader />
    <div className={ 'navigationDashboard' }>
      <InstrumentalPanel />
      <DigitalPanel />
      <CurrentMap />
    </div>
    </>
  )
};
