'use client';

import { useState } from 'react';

export default function OnboardingModal({ onFinish }) {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(step + 1);

    const finish = () => {
        localStorage.setItem("hasSeenOnboarding", "true");
        onFinish();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white bg-opacity-90 rounded-2xl p-8 w-[90%] max-w-2xl text-center space-y-6 shadow-2xl">

                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold">Welcome to Kel Sel Yay 1</h2>
                        <img src="/testPic.png" alt="Intro" className="w-full h-48 object-cover rounded-lg" />
                        <p>This app helps you report missing people and supply needs during emergencies.</p>
                        <button 
                            onClick={nextStep} 
                            className="bg-blue-500 text-white px-6 py-3 rounded w-full hover:bg-blue-600 transition"
                        >
                            Next
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-2xl font-bold">Welcome to Kel Sel Yay 2</h2>
                        <img src="/testPic.png" alt="Intro" className="w-full h-48 object-cover rounded-lg" />
                        <p>This app helps you report missing people and supply needs during emergencies.</p>
                        <button 
                            onClick={nextStep} 
                            className="bg-blue-500 text-white px-6 py-3 rounded w-full hover:bg-blue-600 transition"
                        >
                            Next
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-2xl font-bold">Welcome to Kel Sel Yay 3</h2>
                        <img src="/testPic.png" alt="Intro" className="w-full h-48 object-cover rounded-lg" />
                        <p>This app helps you report missing people and supply needs during emergencies.</p>
                        <button 
                            onClick={nextStep} 
                            className="bg-blue-500 text-white px-6 py-3 rounded w-full hover:bg-blue-600 transition"
                        >
                            Next
                        </button>
                    </>
                )}

                

                {step === 4 && (
                    <>
                        <h2 className="text-2xl font-bold">Safety Notice</h2>
                        <img src="/testPic.png" alt="Safety" className="w-full h-48 object-cover rounded-lg" />
                        <p>No account is needed. Your reports are anonymous and only visible to aid workers.</p>
                        <button 
                            onClick={finish} 
                            className="bg-green-500 text-white px-6 py-3 rounded w-full hover:bg-green-600 transition"
                        >
                            Got it!
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
