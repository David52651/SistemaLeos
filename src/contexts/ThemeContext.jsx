import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


const ThemeContext = createContext();



export function ThemeProvider({children}){


    const [theme,setTheme] = useState(
        "system"
    );



    useEffect(()=>{


        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        if(savedTheme){

            setTheme(savedTheme);

        }


    },[]);




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




export function useTheme(){

    return useContext(
        ThemeContext
    );

}