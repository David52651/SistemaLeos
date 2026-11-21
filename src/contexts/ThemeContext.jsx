import {
    useEffect,
    useState
} from "react";
import { ThemeContext } from "./themeContextStore";



export function ThemeProvider({children}){


    const [theme,setTheme] = useState(() => {
        return localStorage.getItem("theme") || "system";
    });




    useEffect(()=>{


        const root =
            document.documentElement;



        if(theme === "system"){


            const systemDark =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;



            root.setAttribute(

                "data-theme",

                systemDark
                ? "dark"
                : "light"

            );


        }
        else{


            root.setAttribute(

                "data-theme",

                theme

            );


        }



        localStorage.setItem(
            "theme",
            theme
        );



    },[theme]);




    return (

        <ThemeContext.Provider

            value={{
                theme,
                setTheme
            }}

        >

            {children}

        </ThemeContext.Provider>

    );


}