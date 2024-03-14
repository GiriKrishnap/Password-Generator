//..............................................................................................

import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//LINKS.........................................................................................


//Pages.........................................................................................

//user pages
const HomePage = lazy(() => import('./pages/homePage'));
const NotFound404 = lazy(() => import('./pages/404page'));



//........................................................................................

function App() {

  return (

    <div className="App">
      <div><Toaster /></div>
      <Router>

        <Suspense fallback={''}>

          <Routes>

            <Route path='/' exact element={<HomePage />} />

            <Route path='*' exact element={<NotFound404 />} />

          </Routes>
        </Suspense>
      </Router>

    </div >

  );

}

//...............................................................................................
export default App;