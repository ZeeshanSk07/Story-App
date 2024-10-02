import { useEffect, useState } from "react";
import "./ProgressBar.css"

const ProgressBar = ({ slides, iteration }) => {
    const [width, setWidth] = useState(100);

    useEffect(() => {
        if (slides === 1) {
            setWidth(100);
        } else if (slides > 1) {
            setWidth(100 / slides);
        }
    }, [slides]);

    return (
        <div className='mainSlider'>
            {Array.from({ length: slides }, (_, index) => (
                <div key={index} className='mainSliders' style={{ width: `${width}%` }}>
                    <div className={index === iteration ? 'mainSlides' : 'mainSlidesNA'} ></div>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
