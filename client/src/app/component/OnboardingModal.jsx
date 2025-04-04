'use client';

import { useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import Image from 'next/image';

export default function OnboardingModal({ onFinish }) {
    const [step, setStep] = useState(1);
    const { t } = useLanguage();

    const nextStep = () => setStep(step + 1);
    const finish = () => {
        localStorage.setItem("hasSeenOnboarding", "true");
        onFinish();
    };

    const steps = [
        {
            title: t('Step 1. How to Use Our App?'),
            image: '/step1.png',
            list: [
                t('No Login Required*'),
                t('1. Click here to view Missing People.'),
                t('2. Click here to Report Missing Person.'),
                t('3. Click here to change language.')
            ]
        },
        {
            title: t('Step 2. Reporting'),
            image: '/step2.jpg',
            list: [
                t('1. Make sure to save Reporter Name*.')
            ]
        },
        {
            title: t('Step 3. Update Reports'),
            image: '/step3.jpg',
            list: [
                t('1. You can edit information or report found/not found.'),
                t('2. Use original reporter name* you saved to make changes.')
            ]
        },
        {
            title: t('Step 4. Stay Safe'),
            image: '/step4.jpg',
            list: [
                t('1. Click here to review this tutorial again.'),
                t('2. Click here to donate through Better Burma.'),
                t('Our thoughts are with all friends and families. Stay strong.🇲🇲')
            ]
        }
    ];

    const isFinalStep = step === steps.length;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-4 w-[95%] max-w-lg shadow-xl flex flex-col justify-between h-[90vh] max-h-[600px] max-[426px]:max-h-[450px] max-[321px]:max-h-[400px]">
                <h2 className="text-lg font-semibold text-center">{steps[step - 1].title}</h2>
                
                <div className="flex-1 flex items-center justify-between gap-4 pt-4">
                    <div className="w-1/2">
                        <Image
                            src={steps[step - 1].image}
                            alt={`Step ${step}`}
                            width={300}
                            height={300}
                            className="w-full h-auto object-contain rounded-md"
                        />
                    </div>

                    <ul className="text-sm text-left list-disc list-inside w-1/2 space-y-4 list-none">
                        {steps[step - 1].list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={isFinalStep ? finish : nextStep}
                    className={`mt-4 w-full py-2 rounded-md text-white font-semibold transition ${
                        isFinalStep ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isFinalStep ? t('Got it!') : t('Next')}
                </button>
            </div>
        </div>
    );
}
