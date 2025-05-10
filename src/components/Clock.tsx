import { useEffect } from 'react';

const Clock = () => {
    function setClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secondDeg = (seconds / 60) * 360 + 90;
        const minuteDeg = (minutes / 60) * 360 + 90;
        const hourDeg = (hours / 12) * 360 + 90;

        if (
            document.getElementById('second-hand')?.style &&
            document.getElementById('minute-hand')?.style &&
            document.getElementById('hour-hand')?.style
        ) {
            document.getElementById('second-hand')!.style.transform = `rotate(${secondDeg}deg)`;
            document.getElementById('minute-hand')!.style.transform = `rotate(${minuteDeg}deg)`;
            document.getElementById('hour-hand')!.style.transform = `rotate(${hourDeg}deg)`;
        }
    }

    useEffect(() => {
        const interval = setInterval(setClock, 1000);
        setClock();
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Clock</h1>
            <div className="clock">
                <div className="clock-face">
                    {/* <div className="number number1">1</div>
                    <div className="number number2">2</div>
                    <div className="number number3">3</div>
                    <div className="number number4">4</div>
                    <div className="number number5">5</div>
                    <div className="number number6">6</div>
                    <div className="number number7">7</div>
                    <div className="number number8">8</div>
                    <div className="number number9">9</div>
                    <div className="number number10">10</div>
                    <div className="number number11">11</div>
                    <div className="number number12">12</div> */}
                    <div className="hand hour-hand" id="hour-hand"></div>
                    <div className="hand minute-hand" id="minute-hand"></div>
                    <div className="hand second-hand" id="second-hand"></div>
                </div>
            </div>
        </div>
    );
};

export default Clock;
