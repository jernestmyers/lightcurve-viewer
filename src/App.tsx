import './App.css'
import { Route, Routes } from 'react-router';
import { Navigation } from './components/Navigation';
import { Sources } from './components/Sources';
import { PageNotFound } from './components/PageNotFound';
import { Source } from './components/Source';

function App() {
    return (
      <>
        <Navigation />
        <Routes>
          <Route index element={<Sources />} />
          <Route path="/source/:id" element={<Source />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </>
    )
}

export default App
