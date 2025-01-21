import React, { useState, useEffect } from 'react';
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";

const sliderData = [
    {
        image: image1,
        title: 'Exciting',
        subtitle: 'Be Patient, we are building something special for you!',
    },
    {
        image: image3,
        title: 'Exciting',
        subtitle: 'Be Patient, we are building something special for you!',
    }
];

const Type = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderData.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full min-h-screen mx-auto mt-10 bg-primary">
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out mb-10"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {sliderData.map((slide, index) => (
                        <div key={index} className="flex-none w-full px-4 sm:px-6">
                            <div className="relative">
                                <img
                                    src={slide.image}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-auto max-w-[90%] sm:max-w-[80%] mx-auto blur-sm"
                                />
                                <div className="absolute inset-0 flex justify-center items-center text-center text-white">
                                    <div className="bg-black bg-opacity-70 p-6 rounded-lg sm:max-w-[70%]">
                                        <h2 className="text-2xl sm:text-3xl font-semibold font-inter">{slide.title}</h2>
                                        <p className="mt-2 text-base sm:text-lg font-inter">{slide.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Type;
