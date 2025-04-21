import F1SPlogo from 'assets/f1sp.png';
import F1SPlogoHorizontal from 'assets/f1sp-logo_horizontal.png';

const Header: React.FC = () => {
    return (
        <header className="flex md:flex-col lg:flex-col xl:flex-col row-auto xl:bg-pink-300 lg:bg-green-300 md:bg-blue-300 sm:bg-red-300 bg-yellow-300 p-4 rounded-lg">
            <div className="hidden md:flex lg:flex xl:flex justify-start">
                <img src={F1SPlogo} alt="F1SP Logo" className="h-32" />
            </div>

            <div className="flex md:hidden lg:hidden xl:hidden justify-start">
                <img src={F1SPlogoHorizontal} alt="F1SP Logo" className="h-8" />
            </div>

            <h1 className="text-lg xl:text-3xl lg:text-3xl md:text-2xl italic font-extrabold racing-sans-one-regular">
                Formula 1 - Stats & Predictions
            </h1>
        </header>
    );
};

export default Header;
