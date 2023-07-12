import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");

  // const userType = localStorage.getItem("userType");
  const secretKeyFromLocal = localStorage.getItem("secretKey");

  console.log(userType);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password);
    if (userType === "Admin") {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        // "user-type": userType, // add the user type header
        // "secret-key": secretKey, // add the secret key header
      };
      // console.log(headers); // log headers object to console
      fetch("http://localhost:5000/login-user/user", {
        method: "POST",
        // crossDomain: true,
        headers: headers,
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
          if (data.status === "ok") {
            alert("login successful");
            window.localStorage.setItem("token", data.data);
            window.localStorage.setItem("loggedIn", true);
            window.location.href = "./admin-home";
            if ("login Successful") {
              navigate("/admin-home"); // navigate to event management system page
            }
          }
        });
    } else {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "user-type": userType, // add the user type header
        "secret-key": secretKey, // add the secret key header
      };
      // console.log(headers); // log headers object to console
      fetch("http://localhost:5000/login-user/user", {
        method: "POST",
        // crossDomain: true,
        headers: headers,
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
          if (data.status === "ok") {
            alert("login successful");
            window.localStorage.setItem("token", data.data);
            window.localStorage.setItem("loggedIn", true);
            window.location.href = "./event";
            if ("login Successful") {
              navigate("/event"); // navigate to event management system page
            }
          }
        });
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();

    console.log(resetEmail);
    fetch("http://localhost:5000/forgot-password", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email: resetEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "resetPassword");
        if (data.status === "ok") {
          alert("reset password link sent to your email");
          setForgotPassword(false);
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        {forgotPassword ? (
          <form onSubmit={handleResetSubmit}>
            <h3>Reset Password</h3>

            <div className="mb-3">
              <label htmlFor="reset-email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="reset-email"
                placeholder="Enter email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>

            <p className="forgot-password text-center">
              <button
                className="link-button"
                onClick={() => setForgotPassword(false)}
              >
                Back to Login
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h3>Sign In</h3>
            <div>
              <input
                type="radio"
                name="UserType"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              User
              <input
                type="radio"
                name="UserType"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </div>
            {userType === "Admin" ? (
              <div className="mb-3">
                <label>Secret Key</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Secret Key"
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            ) : null}

            <div className="mb-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            {/* forget password start */}
            <div>
              <span
                onClick={() => setForgotPassword(true)}
                style={{ cursor: "pointer" }}
              >
                Forget Password?
              </span>
            </div>
            {/* forget password end */}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-center">
              <a href="/sign-up">Sign Up</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
