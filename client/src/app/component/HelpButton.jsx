"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import OnboardingModal from "./OnboardingModal";

export default function HelpButton() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleClick = () => {
    setShowOnboarding(true);
  };

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };
  
  return (
    <>
      <div className="help-button" onClick={handleClick} role="button" tabIndex={0}>
        <FontAwesomeIcon icon={faQuestion} className="help-icon" />

        <style jsx>{`
            .help-button {
            position: fixed;
            top: 1.5rem;
            left: 1.5rem;
            background-color: rgba(250, 25, 25, 0.86);
            color: white;
            border-radius: 9999px;
            width: 23px;
            height: 23px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            font-size: 0.75rem;
            padding: 0.2rem;
            text-align: center;
            z-index: 999;
          }

          .help-icon {
            font-size: 1.2rem;
          }

          .help-text {
            margin-top: 0.2rem;
            font-size: 0.6rem;
          }

          @media (max-width: 767px) {
            .help-button {
              width: 20px;
              height: 20px;
              font-size: 0.65rem;
              padding: 0.15rem;
            }
            .help-icon {
              font-size: 1rem;
            }

            .help-text {
              font-size: 0.5rem;
              margin-top: 0.15rem;
            }
          }
        `}</style>
      </div>

      {showOnboarding && <OnboardingModal onFinish={handleFinishOnboarding} />}
    </>
  );
}