import React, { useState, useEffect } from "react";
import GIFMa from "@/assets/gif/mama.gif";

export default function Loading({ isLoading }: { isLoading: boolean }) {
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prevCount) => (prevCount + 1) % 4);
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const dots = ".".repeat(dotCount);

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black z-50 h-full w-full transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`} // Sử dụng isLoading để điều khiển opacity
            style={{ pointerEvents: "none" }}
        >
            <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-black rounded-lg shadow-lg w-80 h-80">
                <div className="">
                    <img src={GIFMa.src} alt="Loading..." />
                </div>
                <div className="flex text-white">
                    <div className="font-poppins mr-1">LOADING</div>
                    <div>{dots}</div>
                </div>
            </div>
        </div>
    );
}