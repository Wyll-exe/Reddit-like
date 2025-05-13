import { useEffect } from 'react'
import { useNavigate } from 'react-router';

export default function NotFound() {
    let navigate = useNavigate();
    function redirection() {
        setTimeout(() => {
            navigate('/homepage')
        }, 4000)
    }

    useEffect(() => {
        redirection()
    }, [])

return(
    <div className='w-full h-screen bg-[#e8f4e8] dark:bg-[#111827] flex flex-col justify-center items-center'>
        <h2>Vous êtes perdu ?</h2>
        <p>Veuillez patienter nous vous redirigeons vers l'accueil</p>
    </div>
)
}