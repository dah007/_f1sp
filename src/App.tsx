import { Button } from 'components/ui/button';
import Header from 'components/Header';

import NextReactBanner from './components/NextRaceBanner';
import { LucideSquareArrowOutUpRight } from 'lucide-react';
import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router';
import CardContainer from './components/CardContainer';
import Home from './routes/Home';

function list() {
    console.log('List button clicked');
}

const App = () => {
    return (
        <>
            <Header />
            <div
                className="
                border-b 
                border-primary
                flex 
                flex-col 
                gap-12 
                p-10
                sm:p-4 sm:pt-4
                shadow-md"
            >
                <NextReactBanner />
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Router>
            </div>
        </>
    );
};

export default App;
