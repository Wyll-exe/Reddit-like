
import { useState } from "react";
import "../style.css";

function Sub() {
    const [sub, setSub] = useState("");
    
    const handleChange = (e) => {
        setSub(e.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(sub);
    };
    
    return (
        <div className="bg-red-500">
        <form onSubmit={handleSubmit}>
            <input type="text" value={sub} onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
        </div>
    );

}

export default Sub;