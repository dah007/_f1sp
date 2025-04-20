import { Button } from '@/components/ui/button';
import Footer from 'components/Footer';
import Header from 'components/Header';

import './App.css';

const App = () => {
    return (
        <div className="flex flex-col h-screen justify-between light:text-gray-800 dark:text-stone-300">
            <Header />

            <main className="mb-auto h-full light:bg-gray-100 dark:bg-gray-950 p-4">
                <p>Content</p>
                <Button className="border cursor-pointer border-red-400" onClick={() => console.log('Clicked')}>
                    click me
                </Button>

                <Button>Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="link">Link</Button>
            </main>

            <Footer />
        </div>
    );
};

export default App;
