function App() {

    const [frases, setFrases] = React.useState([]);
    const [frasesAleatorias, setFrasesAleatorias] = React.useState("");
    const [color, setColor] = React.useState("#111");

    React.useEffect(() => {
        async function fetchData() {
            const response = await fetch("https://type.fit/api/quotes")
            const data = await response.json();

            setFrases(data);
            let randIndex = Math.floor(Math.random() * data.length);
            setFrasesAleatorias(data[randIndex]);
        }
        fetchData()
    }, [])

    const getNewQuote = () => {
        const color = [
            "#16a085",
            "#27ae60",
            "#2c3e50",
            "#111",
            "#e74c3c",
            "#9b59b6",
            "#FB6964",
            "#342224",
            "#472E32",
            "#BDBB99",
            "#77B1A9",
            "#73A857"
        ]
        let randIndex = Math.floor(Math.random() * frases.length);
        let randColorIndex = Math.floor(Math.random() * color.length);
        setFrasesAleatorias(frases[randIndex]);
        setColor(color[randColorIndex]);
    }


    return (
        <div style={{ backgroundColor: color }} className="w-full h-screen flex justify-center items-center ">
            <div className="flex text-center justify-center items-center bg-white w-1/2 h-auto rounded-md p-10">
                <div className="flex flex-col justify-center items-center w-max h-auto">
                    {
                        frasesAleatorias ? (
                            <>
                                <p style={{ color: color }} className="w-3/4 text-center text-3xl font-normal"> ❝ {frasesAleatorias.text}</p>
                                <h5 style={{ color: color }} className="w-full text-right text-2xl font-light"> - {frasesAleatorias.author || "No author"}</h5>
                            </>
                        ) : (
                            <h2>Loading...</h2>
                        )}
                    <div className="flex flex-row w-full justify-center items-center">
                        <div style={{ color: color }} className="w-full flex mt-10 items-center justify-start items-center flex-between ">
                            
                            <a href={
                                "https://twitter.com/intent/tweet?hashtags=fraseDeHoy&related=freecodecamp&text=" +
                                encodeURIComponent('"'
                                    + frasesAleatorias.text
                                    + '"'
                                    + frasesAleatorias.author
                                )} target="_blank" className="mx-4">
                                <i className="fa-3x fab fa-twitter-square"></i>
                            </a>
                            <a href={"https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=" +
                                encodeURIComponent(frasesAleatorias.author) +
                                "&content=" +
                                encodeURIComponent(frasesAleatorias.text) +
                                "&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button"
                            } target="_blank" className="">
                                <i className="fa-3x fab fa-tumblr-square "></i>
                            </a>

                        </div>
                        <div className="mt-10">
                            <button onClick={getNewQuote} style={{ backgroundColor: color }} className="flex items-center w-28 h-11 p-4 text-white justify-end rounded-md">New quote</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )

}
ReactDOM.render(<App />, document.getElementById('app'))