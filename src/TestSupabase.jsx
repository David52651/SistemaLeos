import { useEffect } from 'react'
import { supabase } from './lib/supabase'

function TestSupabase() {

  useEffect(() => {

    const cargar = async () => {

      const { data, error } =
        await supabase
          .from('categorias')
          .select('*')

      console.log(data)
      console.log(error)

    }

    cargar()

  }, [])

  return (
    <h1>Probando Supabase...</h1>
  )
}

export default TestSupabase