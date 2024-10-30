import { FC, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import CusomLayout from './components/Layout/Layout';
import { StatisticsProvider } from './contexts/StatisticsContext';
import { TimerContextProvider } from './contexts/TimerContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; 

const LazyHomePage = lazy(() => import('./pages/HomePage'));
const LazyStatisticsPage = lazy(() => import('./pages/StatisticsPage'));

const App: FC = () => {
  const { theme } = useTheme(); 

  return (
    <ThemeProvider> 
      <StatisticsProvider>
        <TimerContextProvider>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<CusomLayout />}> 
                  <Route index element={<LazyHomePage theme={theme} />} />
                  <Route path="/statistics" element={<LazyStatisticsPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TimerContextProvider>
      </StatisticsProvider>
    </ThemeProvider> 
  );
};

export default App;