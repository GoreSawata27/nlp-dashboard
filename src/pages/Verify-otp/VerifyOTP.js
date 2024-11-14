import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import MailLogo from "../../assets/img/triec-mail-img.svg";
import OtpInput from "react-otp-input";
import axios from "axios";

const Optvalidation = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    window.otpTimer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(window.otpTimer);
          setIsResendEnabled(true);
          return 30;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(window.otpTimer);
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const HandelVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        duration: 3000,
        position: "top-center",
        className: "custom-toast",
        iconTheme: {
          primary: "#ffc107",
        },
      });
      return;
    }

    try {
      setIsVerifying(true);
      const userEmail = sessionStorage.getItem("TRIEC-email");
      const response = await axios.post(
        "https://triec-uatapi.dtskill.com/triec-access/login",
        {
          data: {
            type: "authentication",
            attributes: {
              "email-address": userEmail,
              otp: parseInt(otp),
              "user-type": "admin",
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response?.data?.["access-token"];
      sessionStorage.setItem("isOtpVerified", "true");
      sessionStorage.setItem("access-token", token);
      const decoded = jwtDecode(token);
      if (decoded && decoded.userId) {
        sessionStorage.setItem("userID", decoded.userId);
      }
      navigate("/dashboard");
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
  };

  const resendOTP = async (e) => {
    e.preventDefault();
    if (!isResendEnabled) return;
    try {
      setIsResendEnabled(false);
      setRemainingTime(30);

      const email = sessionStorage.getItem("TRIEC-email");
      const response = axios.post(
        "https://triec-uatapi.dtskill.com/otp/send-otp",
        {
          data: {
            type: "otp",
            attributes: {
              "email-address": email,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
          },
        }
      );

      toast.promise(response, {
        loading: "Sending OTP...",
        success: "OTP sent successfully!",
        error: "Failed to send OTP.",
      });

      await response;

      clearInterval(window.otpTimer);
      window.otpTimer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(window.otpTimer);
            setIsResendEnabled(true);
            return 30;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    } catch (error) {
      console.log(error, "Failed to send OTP.");
      toast.error("Failed to send OTP. Please try again.", {
        duration: 3000,
        position: "top-center",
        className: "custom-toast",
      });
      setIsResendEnabled(true);
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text");
    const sanitizedData = pasteData?.replace(/\D/g, "")?.slice(0, 6);
    setOtp(sanitizedData);
    e.preventDefault();
  };
  return (
    <div className="cntnt-wraper full-height flex-center">
      <div className="triec-form txt-cntr">
        <div className="anim-icons">
          <img className="wlcom-img" alt="TRIEC verify mail" src={MailLogo} style={{ marginBottom: "0" }} />
        </div>
        <p className="wlcom-txt">
          Verification Code has been sent to your{" "}
          <span className="brnd-color">"{sessionStorage.getItem("TRIEC-email")}" </span>
          Enter the code below to complete your profile.
        </p>
        <form className="otp-vrfy-frm" onSubmit={(e) => e.preventDefault()}>
          <div className="frm-group">
            <div className="inline-frm-group">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span></span>}
                renderInput={(props) => (
                  <input {...props} type="number" inputMode="numeric" pattern="\d*" onPaste={handlePaste} />
                )}
                shouldAutoFocus={true}
                inputStyle="frm-control"
              />
            </div>
          </div>
          <div className="frm-group">
            <button
              type="button"
              onClick={HandelVerify}
              className={`btn btn-black ${otp.length !== 6 ? "btn-disabled" : ""}`}
              disabled={otp.length !== 6 || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
          <div className="resnd-otp">
            <p>
              Didn’t receive code?
              {!isResendEnabled && (
                <span className="otp-timer">
                  Resend in
                  <span className="otp-timer">
                    {`${minutes?.toString()?.padStart(2, "0")}:${seconds?.toString()?.padStart(2, "0")} min`}
                  </span>
                </span>
              )}
            </p>
            {isResendEnabled && (
              <span className="otp-timer" onClick={resendOTP}>
                Resend
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Optvalidation;
