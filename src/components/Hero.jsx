import React, { useEffect, useRef } from 'react';

const Hero = () => {
    const intervalRef = useRef(null);

    const setInt = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const btns = document.getElementsByName("carousel");
            for (let i = 0; i < btns.length; i++) {
                if (btns[i].checked) {
                    btns[i].checked = false;
                    if (i + 1 === btns.length) {
                        btns[0].checked = true;
                    } else {
                        btns[i + 1].checked = true;
                    }
                    return;
                }
            }
        }, 5000);
    };

    useEffect(() => {
        setInt();
        return () => clearInterval(intervalRef.current); // Cleanup interval on component unmount
    }, []); // Run once on mount

    return (
        <div className="carousel">
            <input type="radio" name="carousel" id="slide-btn-1" className="slide-btn" onClick={setInt} defaultChecked />
            <input type="radio" name="carousel" id="slide-btn-2" className="slide-btn" onClick={setInt} />
            <input type="radio" name="carousel" id="slide-btn-4" className="slide-btn" onClick={setInt} />
            <input type="radio" name="carousel" id="slide-btn-5" className="slide-btn" onClick={setInt} />

            <div className="slide one parallax-effect">
                <h1>Slide 1</h1>
                <div className="credit">Made with <span style={{ color: 'tomato' }}>❤</span> by <a href="https://www.learningrobo.com/">Learning Robo</a></div>
            </div>

            <div className="slide two parallax-effect">
                <h1>Slide 2</h1>
                <div className="credit">Made with <span style={{ color: 'tomato' }}>❤</span> by <a href="https://www.learningrobo.com/">Learning Robo</a></div>
            </div>


            <div className="slide four parallax-effect">
                <h1>Slide 4</h1>
                <div className="credit">Made with <span style={{ color: 'tomato' }}>❤</span> by <a href="https://www.learningrobo.com/">Learning Robo</a></div>
            </div>

            <div className="slide five parallax-effect">
                <h1>Slide 5</h1>
                <div className="credit">Made with <span style={{ color: 'tomato' }}>❤</span> by <a href="https://www.learningrobo.com/">Learning Robo</a></div>
            </div>

            <div className="labels">
                <label htmlFor="slide-btn-1" />
                <label htmlFor="slide-btn-2" />
                <label htmlFor="slide-btn-4" />
                <label htmlFor="slide-btn-5" />
            </div>
        </div>
    );
};

export default Hero;
