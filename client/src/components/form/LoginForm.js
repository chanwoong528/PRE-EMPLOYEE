import { useState } from "react";
import Input from "./input/Input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitLogin = (e) => {
    e.preventDefault();
    const req = { email, password };
    console.log(req);
    //fetch
  };
  const onClickGoogleLogin = async (e) => {
    e.preventDefault();
    console.log("google Login");
    const res = await fetch("http://localhost:5000/auth/google", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
    } else {
    }
  };

  return (
    <div>
      <h1>User Login Form</h1>
      <form onSubmit={onSubmitLogin}>
        <Input
          labelFor="email"
          labelTitle="Email: "
          inputType="text"
          setChange={setEmail}
          inputVal={email}
        />

        <Input
          labelFor="password"
          labelTitle="Password: "
          inputType="password"
          setChange={setPassword}
        />

        <input type="submit" value="Login User" />
      </form>

      <button onClick={onClickGoogleLogin}>Google</button>
    </div>
  );
}
export default LoginForm;
