'use client';

import { useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import Image from 'next/image';

export default function OnboardingModal({ onFinish }) {
    const [step, setStep] = useState(1);

    const {t} = useLanguage();

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
                        <h2 className="text-2xl font-bold">{t('Step 1. How to Use Our App?')}</h2>
                        <Image
                            src="/step1.png"
                            alt="Map Overview"
                            width={800}
                            height={300}
                            className="w-full h-48 object-contain rounded-lg"
                        />
                            <ul>
                                <li>{t('No Login Required.')}</li>
                                <li>{t('1. Click here to view Missing People.')}</li>
                                <li>{t('2. Click here to Report Missing Person.')}</li>
                                <li>{t('3. Click here to change language.')}</li>
                            </ul>
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
                        <h2 className="text-2xl font-bold">{t('Step 2. Reporting')}</h2>
                        <Image
                            src="/step2.png"
                            alt="Report Form"
                            width={800}
                            height={300}
                            className="w-full h-48 object-contain rounded-lg"
                        />
                            <ul>
                                <li>{t('1. Make sure to save Reporter Name*.')}</li>
                            </ul>
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
                        <h2 className="text-2xl font-bold">{t('Step 3. Update Reports')}</h2>
                        <Image
                            src="/step3.png"
                            alt="Update Reports"
                            width={800}
                            height={300}
                            className="w-full h-48 object-contain rounded-lg"
                        />
                            <ul>
                                <li>{t('1. You can edit information or report found/not found.')}</li>
                                <li>{t('2. Use original reporter name* you saved to make changes.')} </li>
                            </ul>
                        <button 
                            onClick={nextStep} 
                            className="bg-blue-500 text-white px-6 py-3 rounded w-full hover:bg-blue-600 transition"
                        >
                            {t('Next')}
                        </button>
                    </>
                )}

                {step === 4 && (
                    <>
                        <h2 className="text-2xl font-bold">{t('Step 4. Stay Safe')}</h2>
                        <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                        <Image
                            src="/step4.jpg"
                            alt="Safety Notice"
                            width={800}
                            height={300}
                            className="w-full h-48 object-contain rounded-lg"
                        />
                        </div>
                        {/* <p> */}
                            <ul>
                                <li>{t('1. Click here to review this tutorial again.')}</li>
                                <li>{t('We are accepting donations through Better Burma.')}</li>
                                <li>{t('Stay Strong Friends & Families.')}</li>
                            </ul>
                        {/* </p> */}
                        <button 
                            onClick={finish} 
                            className="bg-green-500 text-white px-6 py-3 rounded w-full hover:bg-green-600 transition"
                        >
                            {t('Got it!')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
