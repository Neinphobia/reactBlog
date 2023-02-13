import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const App = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [img, setImg] = useState("");
  const [ytlink, setYtlink] = useState("");

  const [pending, setPending] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPending(true)
        const result = await axios.get("https://api-y38j.onrender.com/blogs");
        setData(result.data);
        setPending(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setPending(true)
      await axios.post("http://localhost:5000/blogs", { name, body , img , ytlink });
      setName("");
      setBody("");
      setImg("");
      setYtlink("");
      
      const result = await axios.get("http://localhost:5000/blogs");
      
      setPending(false)
      setData(result.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setPending(true)
      await axios.delete(`http://localhost:5000/blogs/${id}`);
      const result = await axios.get("http://localhost:5000/blogs");
      setData(result.data);
      setPending(false)
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="container">
      
      <form onSubmit={handleSubmit} className="form">
        <label>
          <input type="text"
          value={img}
          onChange={(event) => setImg(event.target.value)}
          className="input"
          placeholder="Lütfen fotoğrafınızın linkini giriniz."
           />
        </label>
        <br />
        <label>
          <input type="text"
          value={ytlink}
          onChange={(event) => setYtlink(event.target.value)}
          className="input"
          placeholder="Lütfen youtube videosu linkini giriniz."
           />
        </label>
        <br />
        <label>
          İsim:
          <input
            type="text"
            value={name}
            placeholder="İsminizi giriniz"
            onChange={(event) => setName(event.target.value)}
            className="input"
          />
        </label>
        <br />
        <label>
          Mesaj
          <input
            type="text"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="input"
            placeholder="Bir mesaj giriniz"
          />
        </label>
      
        <br />
        <button type="submit" className="button">
          Veri Ekle
        </button>
      </form>
     
      <h1 className="title">Gelen Veriler:</h1>
      <ul className="data-list">
        {pending && (
          
          <div className="lds-ring">
            <span className="yukleniyor">Yükleniyor..</span> 
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) }
        {data.map(item => (
          <li key={item._id} className="data-item">
            <div className="item-header">
              
              {item.img&&item.img.includes("https://") ? <img src={`${item.img}`} alt="yüklenemedi veya fotoğraf yok."/> : null }

               <br  />

               {item.ytlink&&item.ytlink.includes("youtu") ? <a href={`${item.ytlink}`} target="_blank">{item.ytlink}</a> : null}
               
              <h2 className="item-title">{item.name}</h2>
              <p className="item-body">{item.body}</p>
              

              {!pending && 
              <button
                onClick={() => handleDelete(item._id)}
                className="delete-button"
              > Veriyi Sil</button>
            }

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
