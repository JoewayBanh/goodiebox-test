import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import { login } from "./UserFuncs";
import axios from "axios";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resId, setResId] = useState("");
  const [resToken, setResToken] = useState("");
  const [resName, setResName] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [userInvoices, setUserInvoices] = useState([]);

  const userLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userInfo = {
      username: username,
      password: password,
    };

    login(userInfo).then((res) => {
      setResId(res.id);
      setResToken(res.token);
    });
  };

  const showInfo = () => {
    axios
      .get(`https://code-challenge-api-gm443iyhlq-ew.a.run.app/user/${resId}`, {
        headers: { Authorization: `${resToken}` },
      })
      .then((res) => {
        return setResName(res.data.firstName);
      });
  };

  const updateNameHandler = (e: React.FormEvent) => {
    e.preventDefault();

    axios.put(
      `https://code-challenge-api-gm443iyhlq-ew.a.run.app/user/${resId}`,
      { firstName: updatedName },
      { headers: { Authorization: `${resToken}` } }
    );
    setResName(updatedName);
  };

  const showInvoiceHandler = () => {
    axios
      .get(
        `https://code-challenge-api-gm443iyhlq-ew.a.run.app/user/${resId}/invoice`,
        { headers: { Authorization: `${resToken}` } }
      )
      .then((res) => {
        setUserInvoices(res.data);
        console.log(userInvoices);
      });
  };

  useEffect(() => {
    async function getInvoice() {
      let res = await axios.get(
        `https://code-challenge-api-gm443iyhlq-ew.a.run.app/user/${resId}/invoice`,
        { headers: { Authorization: `${resToken}` } }
      );
      setUserInvoices(res.data);
    }
    getInvoice();
  }, [resToken, userInvoices]);

  return (
    <>
      <form onSubmit={userLogin} className="login-container">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <button>Submit</button>
      </form>
      {resToken && (
        <button className="show-info-btn" onClick={showInfo}>
          Show user info
        </button>
      )}
      {resName && <p>Firstname: {resName}</p>}
      {resName && (
        <>
          <form className="update-name-btn" onSubmit={updateNameHandler}>
            <p>You can now change the user's name with the input below</p>
            <input
              type="text"
              value={updatedName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUpdatedName(e.target.value)
              }
            />
            <button type="submit">Update name</button>
          </form>
        </>
      )}

      <button onClick={showInvoiceHandler}>Show user's invoices</button>
      {resToken &&
        userInvoices.map((invoice) => {
          <p>{invoice}</p>;
          // for (let key in invoice) {
          //   return (
          //     <p>
          //       {key}: {invoice[key]}
          //     </p>
          //   );
          // }
        })}
    </>
  );
};

export default LoginForm;
