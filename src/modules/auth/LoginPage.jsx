import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useNavigate } from "react-router-dom";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Login() {
    
  const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");



    const handleLogin = async (e) => {

        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({

            email,

            password,

        });

        if (error) {

            alert(error.message);

        }
        // LOGIN CORRECTO

        navigate("/");


    };



    return (

        <div className="login-page">

            <Card className="login-card">

                <div className="login-header">

                    <h1>SistemaLeos</h1>

                    <p>

                        Sistema de Gestión de Vestimentas Folclóricas

                    </p>

                </div>



                <form

                    className="login-form"

                    onSubmit={handleLogin}

                >

                    <Input

                        label="Correo electrónico"

                        type="email"

                        placeholder="Ingrese su correo"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                        required

                    />



                    <Input

                        label="Contraseña"

                        type="password"

                        placeholder="Ingrese su contraseña"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                        required

                    />



                    <Button

                        type="submit"

                        variant="primary"

                        className="login-button"

                    >

                        Ingresar

                    </Button>

                </form>

            </Card>

        </div>

    );

}