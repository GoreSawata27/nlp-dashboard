import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import LoginLogo from "../../assets/img/email.svg";
import axios from "axios";

const VerifyEmail = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  useEffect(() => {
    sessionStorage.removeItem("TRIEC-email");
    sessionStorage.removeItem("access-token");
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|int|info|biz|name|pro|coop|museum|aero|jobs|mobi|travel|xxx|us|uk|in|ca|au|de|jp|fr|cn|ru|br|za|mx|es|it|nl|se|ch|ae|sg|app|blog|online|site|tech|store|io|ai|me|dev|asia|africa|eu|club|shop|news|photo|music|movie|law|рф|中国|السعودية)$/i;
    const valid = emailRegex.test(newEmail);
    setIsValidEmail(valid);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && email === "") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    otpInputRef.current.focus();
  }, []);

  const handleVerifyClick = useCallback(async () => {
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.", {
        duration: 3000,
        position: "top-center",
        className: "custom-toast",
      });
      return;
    }

    try {
      setIsVerifying(true);

      const payload = {
        data: {
          type: "otp",
          attributes: {
            "email-address": email,
          },
        },
      };
      await axios.post("https://triec-uatapi.dtskill.com/otp/send-otp", payload, {
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
      });

      sessionStorage.setItem("TRIEC-email", email);
      sessionStorage.setItem("isVerified", "true");
      navigate("/otpvalidation");
    } catch (error) {
      if (error?.response?.data?.errors) {
        const apiErrors = error?.response?.data?.errors;
        const errorMessage = apiErrors?.map((err) => err.detail)?.join(", ");
        toast.error(errorMessage, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      }
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      } else {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
      }
    } finally {
      setIsVerifying(false);
    }
  }, [email, isValidEmail, navigate]);

  return (
    <div className="cntnt-wraper full-height flex-center">
      <div className="triec-form dashboard-login ">
        <h1>Dashboard Access</h1>
        <form className="email-vrfy-frm">
          <div className="frm-group">
            <label htmlFor="">Email Address</label>
            <div className={`inpt-addon frm-field ${isFocused && !isValidEmail ? "draw-border" : ""}`}>
              <input
                ref={otpInputRef}
                onChange={handleEmailChange}
                value={email}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="frm-control"
                placeholder="youremailid@gmail.com"
                type="email"
                id="email"
                name="email"
                maxLength={50}
              />
              <button
                onClick={handleVerifyClick}
                disabled={!isValidEmail || isVerifying}
                type="button"
                id="button"
                className={`addon-btn ${isValidEmail && !isVerifying ? "btn-submit" : "disabled-btn"}`}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
          {!isValidEmail && email?.length > 0 && (
            <p style={{ color: "#e22424" }}>Please enter a valid email address</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
