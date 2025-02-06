"use client"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast";

function Analysis() {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [languageName, setLanguageName] = useState("");
    const [textAnalyze, setTextAnalyze] = useState("");

    const uploadPicture = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            console.error("No file selected");
        }
    };

    useEffect(() => {
        fetch("http://localhost:9090/image-analyzer/all-languages")
            .then((res) => res.json())
            .then((data) => setLanguages(data))
            .catch((err) => console.error("Error fetching languages:", err));
    }, []);

   



    const SaveHandler = async () => {
        if (!imageFile) {
            toast.error("No file selected");
            return;
        }

        if (!selectedLanguage) {
            toast.error("No language selected");
            return;
        }

        setLanguageName(selectedLanguage);
        console.log(languageName);

        const formData = new FormData();
        formData.append("imageFile", imageFile);
        console.log(formData);

        try {
            const res = await fetch("http://localhost:9090/image-analyzer/upload-image", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                },
            });

            if (res.ok) {
                const result = await res.text();
                
                toast.success("Upload successful");

                const response = await fetch("http://localhost:9090/image-analyzer/analyze-image", {
                    method: "POST",
                    body: JSON.stringify({
                        uuidCode: result,
                        languageName: selectedLanguage
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                setTextAnalyze(data);
            } else {
                const error = await res.text();
                console.error("Error uploading image:", error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

   

    return (
        <div className="w-[80%] my-6 mx-auto bg-slate-400 flex flex-col justify-center items-center p-4">
            <div className="w-[90%] h-48 my-2 bg-slate-300 flex items-center justify-center">
                <div className="w-[100%] h-48 flex  justify-evenly items-center border-r-2">
                    <input className="w-[40%] mb-2" type="file" onChange={uploadPicture} />
                    <select onChange={(e) => setSelectedLanguage(e.target.value)} className="p-1 border rounded w-[20%] text-sm">
                        <option value="">Language</option>
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.languageName}>
                                {lang.languageName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-[30%] flex justify-center ">
                    {preview && <img src={preview} alt="Preview" className="w-[70%] h-24 object-cover border rounded" />}
                </div>
            </div>

            <div className="w-[50%] flex justify-evenly">
                <button className="bg-slate-200 w-[100px] rounded my-4 p-1 hover:bg-gray-400" onClick={SaveHandler}>
                    Analyze
                </button>

            </div>

            <div className="w-[90%] min-h-20 bg-slate-100 m-4 rounded-sm p-2 text-center text-sm text-black">
                {textAnalyze.aiResponse ? textAnalyze.aiResponse : "No requests have been registered."}

            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    );
}

export default Analysis;
