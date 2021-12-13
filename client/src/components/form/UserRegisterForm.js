import { useState } from "react";
import Input from "./input/Input";

function UserRegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [firstname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [position, setPositions] = useState([]);
  const onSubmitRegister = async (e) => {
    e.preventDefault();
    const req = {
      email,
      password,
      passwordConf,
      firstname,
      lastname,
      position,
    };
    console.log(req);
    //fetch
    const res = await fetch("http://localhost:5000/auth/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(req),
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.msg);
    } else {
      alert(data.msg);
    }
  };
  const onClickGoogleSignUp = (e) => {
    e.preventDefault();
    console.log("google sign up");
  };
  const onChangeCheckbox = (e) => {
    let newPos = [...position, e.target.name];
    if (position.includes(e.target.name)) {
      newPos = newPos.filter((item) => item !== e.target.name);
    }
    setPositions(newPos);
  };

  return (
    <div>
      <h1>User Register Form</h1>
      <form onSubmit={onSubmitRegister}>
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
        <Input
          labelFor="passwordConf"
          labelTitle="Password Confirm: "
          inputType="password"
          setChange={setPasswordConf}
        />
        <Input
          labelFor="firstname"
          labelTitle="First Name: "
          inputType="text"
          setChange={setFname}
          inputVal={firstname}
        />
        <Input
          labelFor="lastname"
          labelTitle="Last Name: "
          inputType="text"
          setChange={setLname}
          inputVal={lastname}
        />
        <div>
          <input
            type="checkbox"
            name="front"
            onChange={(e) => {
              onChangeCheckbox(e);
            }}
          />
          <span>Front End </span>
        </div>
        <div>
          <input
            type="checkbox"
            name="back"
            onChange={(e) => {
              onChangeCheckbox(e);
            }}
          />{" "}
          <span>Back End </span>
        </div>
        <div>
          <input
            type="checkbox"
            name="designer"
            onChange={(e) => {
              onChangeCheckbox(e);
            }}
          />
          <span>Designer </span>
        </div>
        <div>
          <input
            type="checkbox"
            name="planner"
            onChange={(e) => {
              onChangeCheckbox(e);
            }}
          />
          <span>Planner </span>
        </div>
        <input type="submit" value="Register User" />
      </form>
      <button onClick={onClickGoogleSignUp}>GoogleSignUp</button>
    </div>
  );
}
export default UserRegisterForm;
