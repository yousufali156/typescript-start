import { add, format } from "date-fns";
import './App.css'

function App() {

  return (
    <>
      Tomorrow's Date: {format(add(new Date(), { days: 1 }), "do MMMM yyyy")}
    </>
  )
}


export default App
