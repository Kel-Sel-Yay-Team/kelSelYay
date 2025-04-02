"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

export default function DonateButton() {
  const handleClick = () => {
    window.open(
      "https://www.betterburma.org/donation?link_id=4&can_id=c88a4050ad91747e7e2255ab262362db&source=email-us-and-uk-aid-cuts-are-killing-burmese-refugees-2&email_referrer=email_2676158&email_subject=myanmar-earthquake-how-you-can-help&&",
      "_blank"
    );
  };

  return (
    <div className="donate-button" onClick={handleClick} role="button" tabIndex={0}>
      <FontAwesomeIcon icon={faHandHoldingDollar} className="donate-icon" />
      <span className="donate-text">Donate</span>

      <style jsx>{`
        .donate-button {
          position: fixed;
          bottom: 1.5rem;
          left: 1.5rem;
          background-color: red;
          color: white;
          border-radius: 9999px;
          width: 56px;
          height: 56px;
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

        .donate-icon {
          font-size: 1.2rem;
        }

        .donate-text {
          margin-top: 0.2rem;
          font-size: 0.6rem;
        }

        @media (max-width: 767px) {
          .donate-button {
            width: 44px;
            height: 44px;
            font-size: 0.65rem;
            padding: 0.15rem;
          }
          .donate-icon {
            font-size: 1rem;
          }

          .donate-text {
            font-size: 0.5rem;
            margin-top: 0.15rem;
          }
        }
      `}</style>
    </div>
  );
}
