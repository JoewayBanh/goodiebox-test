import React from "react";
import axios from "axios";

type LoginInfo = {
  username: string;
  password: string;
};
export const login = ({ username, password }: LoginInfo) => {
  return axios
    .get(
      `https://code-challenge-api-gm443iyhlq-ew.a.run.app/user/login?username=${username}&password=${password}`
    )
    .then((res) => {
      return res.data;
    });
};
