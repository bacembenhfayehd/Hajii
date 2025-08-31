"use client";

import Loading from "@/components/Loading";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const LoginSignup = () => {
  const {syncCartAfterLogin} = useContext(AppContext)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingOrregister, setLoggingOrRegister] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `http://localhost:5000/api/auth/${loggingOrregister}`;

      const requestData =
        loggingOrregister === "register"
          ? { name: username, email, password }
          : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || `${loggingOrregister} failed`);
      }

      const { user, accessToken } = result.data;
      localStorage.setItem("auth-token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      if (result.data.refreshToken) {
        localStorage.setItem("refresh-token", result.data.refreshToken);
      }

      window.dispatchEvent(new Event("storage"));
      await syncCartAfterLogin();

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-green-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        {" "}
        {/*onSubmit={register}*/}
        {loggingOrregister === "register" ? (
          <>
            <input
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              type="text"
              className="block w-full rounded-sm p-2 mb-2 border"
              placeholder="nom utilisateur"
            />
            <input
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              type="email"
              className="block w-full rounded-sm p-2 mb-2 border"
              placeholder="email@exemple.com"
            />
            <input
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              type="password"
              className="block w-full rounded-sm p-2 mb-2 border"
              placeholder="mot de passe"
            />
          </>
        ) : (
          <>
            <input
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              type="email"
              className="block w-full rounded-sm p-2 mb-2 border"
              placeholder="email@exemple.com"
            />
            <input
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              type="password"
              className="block w-full rounded-sm p-2 mb-2 border"
              placeholder="mot de passe"
            />
          </>
        )}
        <button className="bg-green-700 text-white w-full block rounded-sm p-2">
          {loggingOrregister === "register" ? `S'inscrire` : "Se connecter"}
        </button>
        <div className="mt-2 text-center">
          {loggingOrregister === "register" && (
            <div>
              Déjà un compte ?
              <button
                className="text-green-700"
                onClick={() => setLoggingOrRegister("login")}
              >
                Connectez-vous
              </button>
            </div>
          )}
          {loggingOrregister === "login" && (
            <div>
              Pas de compte ?
              <button
                className="text-green-700"
                onClick={() => setLoggingOrRegister("register")}
              >
                Inscrivez-vous
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginSignup;

/*import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./Usercontext";


export default function RegisterLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const[loggingOrregister,setLoggingOrRegister] = useState('register')
  const {setUsername:setLoggedinUsername,setId} = useContext(UserContext)

  async function register(ev) {
    ev.preventDefault();
    const url = loggingOrregister === 'register' ? 'http://localhost:4040/register' : 'http://localhost:4040/login'
      const {data} = await axios.post(url, { username, password });
      setLoggedinUsername(username);
      setId(data.id)
   
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={register}>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          className=" block w-full rounded-sm p-2 mb-2 border"
          placeholder="username"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          className="block w-full rounded-sm p-2 mb-2 border"
          placeholder="password"
        />
        <button className="bg-blue-500 text-white w-full block rounded-sm p-2">
          {loggingOrregister === 'register' ? 'Register' : 'Login'}
        </button>
        <div className="mt-2 text-center">
          {loggingOrregister === 'register' && (
            <div>
              Already a member?
             <button onClick={() => setLoggingOrRegister('login')}>Login here</button>
              </div>
          )}
          {loggingOrregister === 'login' && (
            <div>
              Dont have an acoount?
             <button onClick={() => setLoggingOrRegister('register')} >Register</button>
             
              </div>
          )}
         </div>
      </form>
    </div>
  );
}
*/
