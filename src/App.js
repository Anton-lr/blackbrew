import './App.css';
//Data imports
import keys from "./data/keys.json"
import secrets from "./data/secrets.json"
import traits from "./data/traits.json"
import { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
//Component imports
import Block from './Block';


const App = () => {

  const [saved, setSaved] = useState([]);
  const [preview, setPreview] = useState([])

  const [input, setInput] = useState('')
  const [viewSaved, setViewSaved] = useState(false)
  const [currentType, setCurrentType] = useState()
  const [keyCount, setKeyCount] = useState(0)
  const [traitCount, setTraitCount] = useState(0)
  const [secretCount, setSecretCount] = useState(0)

  const inputRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    console.log("hiii")
    console.log(fileRef)
  }, [fileRef])

  useEffect(() => {
    if (input != "") {
      console.log("searching...")
      search()
    }
  }, [input])

  useEffect(() => {
    var k = 0;
    var t = 0;
    var s = 0
    saved.map(i => {
 
      if (i.type === "key") {
        k++
      }
      if (i.type === "trait") {
        t++
      }
      if (i.type === "secret") {
        s++
      }
    })
    setKeyCount(k)
    setTraitCount(t)
    setSecretCount(s)

  }, [saved])

  function click(x) {
    console.log(preview)
    setCurrentType(x)
    setViewSaved(false)
    setPreview(generate(x, 6))
  }

  function search() {
    setInput(inputRef.current.value)
    const i = input.toLowerCase()
    console.log(i)
    const relevant = [...keys.filter(item => item.full.includes(i)), 
      ...traits.filter(item => item.full.includes(i)), 
      ...secrets.filter(item => item.full.includes(i))]

    console.log("relevant: ", relevant)
    setPreview(generate(relevant, relevant.length))
    setViewSaved(false)
    
  }

  function generate(source, count) {
    const size = Object.keys(source).length;
    let nums = new Set();
    console.log("count: ", count)
    while (nums.size < count) {
      var ranNum = Math.floor(Math.random() * (size - 1 + 1) + 1)
      nums.add(source[ranNum - 1])
      console.log("ranNum: ", ranNum)
    }
    console.log("nums: ", nums)
    return [...nums]
  }
  
  function addToSaved (x) {
    var check = true
    for (var i = 0; i<saved.length;i++) {
      if (saved[i].id === x.id) {
        check = false
      }
    }
    if (check) {
      const target = x
      const replacement = generate(currentType, 1)[0]
      setSaved([x, ...saved])
      setPreview(preview.map( i => {
        if (i.id === target.id) {
          return replacement
        }
        else {
          return i
        }


      })
      )
      console.log(generate(currentType, 1))
    }
  }

  function handleDelete (x) {
    const b = saved.filter(i => i.id != x.id)
    setSaved(b)
  }

  function saveToFile() {
    var blob = new Blob([JSON.stringify(saved)], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "character.json")
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      setSaved(JSON.parse(reader.result))
    }
    reader.onerror = () => {
      console.log("file error", reader.error)
    }
  }

  return (
    <div className="main">
      <div className="fileManager">
        <input className="cfp" type="file" onChange={handleChange} placeholder="Upload Character"></input>
        <button className="nav" onClick={() => saveToFile()}>Download Character</button>
      </div>
      <div className="overview">
        <input className="nav" ref={inputRef} placeholder="Search"></input>
        <button className="nav" onClick={() => search()}>Search</button>
        <div className="f">keys: {keyCount}/3</div>
        <div className="f">traits: {traitCount}/4</div>
        <div className="f">secrets: {secretCount}/2</div>
      </div>
      <div className="navbar">
        <button className="nav" onClick={() => setViewSaved(true)}>Edit Character</button>
        <button className="nav" onClick={() => click(keys)}>Generate Keys</button>
        <button className="nav" onClick={() => click(traits)}>Generate Traits</button>
        <button className="nav" onClick={() => click(secrets)}>Generate Secrets</button>
      </div>
      {viewSaved == false &&
        <div className="saved">
          <p>Click on an item to add it to your character</p>
          {preview.slice(0, Math.ceil(preview.length / 2)).map(i => (
            <Block data={i} func={addToSaved} setting={"discover"} key={i.id} />
        ))}
        </div>}
      {viewSaved == false &&
        <div className="discover">
          <p>Saving an item will reveal a new one</p>
          {preview.slice(-Math.ceil(preview.length / 2)).map(i => (
            <Block data={i} func={addToSaved} setting={"discover"} key={i.id} />
          ))}
      </div>}
      {viewSaved == true &&
        <div className="saved">
          <p>Your keys and secrets (click item to remove)</p>
            {saved.filter(i => i.type != "trait").map(i => (
              <Block data={i} func={handleDelete} setting={"saved"} key={i.id} />
          ))}
        </div>}
      {viewSaved == true &&
        <div className="discover">
          <p>Your traits (click trait to remove)</p>
          {saved.filter(i => i.type == "trait").map(i => (
            <Block data={i} func={handleDelete} setting={"saved"} key={i.id} />
          ))}
        </div>}
    </div>
  );
}

export default App;
