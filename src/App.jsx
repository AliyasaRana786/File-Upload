import { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FaFileImage, FaFilePdf, FaFileWord, FaFilePowerpoint } from "react-icons/fa";
import { Document, Page } from "react-pdf";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [editedImages, setEditedImages] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });

  function handleChange(e) {
    const selectedFiles = e.target.files;
    const filesArray = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const url = URL.createObjectURL(file);
      filesArray.push({ file, url });
    }

    setFiles(filesArray);
  }

  function handleSave() {
    const editedImagesArray = [];
    files.forEach((item, index) => {
      if (item.file.type.includes("image")) {
        const canvas = editorRefs[index].getImage();
        const dataURL = canvas.toDataURL();
        editedImagesArray.push(dataURL);
      }
    });
    setEditedImages(editedImagesArray);
  }

  function handlePositionChange(position) {
    setPosition(position);
  }

  function handleScaleChange(e) {
    setScale(parseFloat(e.target.value));
  }

  let editorRefs = [];

  const downloadEditedImage = (dataURL, fileName) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = (url, fileName) => {
    saveAs(url, fileName);
  };

  return (
    <div className="App">
      <div className="fileinput">
      <h2>Upload Files</h2>
      <input type="file" onChange={handleChange} multiple accept=".jpg,.jpeg,.png,.doc,.pdf,.ppt,.pptx" />
      </div>
    
      
      {files.map((item, index) => (
        <div key={index} className="file-item">
          {item.file.type.includes("image") ? (
            <>
              <img className="image" src={item.url} alt={`file-${index}`} />
              <div>
                <label>Scale: </label>
                <input type="range" min="1" max="2" step="0.01" value={scale} onChange={handleScaleChange} />
              </div>
              <AvatarEditor
                ref={(ref) => (editorRefs[index] = ref)}
                image={item.url}
                width={250}
                height={250}
                scale={scale}
                position={position}
                onPositionChange={handlePositionChange}
              />
            </>
          ) : (
            <>
              {item.file.type.includes("pdf") ? (
                <div>
                  <FaFilePdf size={50} />
                  <Document file={item.url}>
                    <Page pageNumber={1} width={250} />
                  </Document>
                  <button onClick={() => downloadPDF(item.url, item.file.name)}>Download PDF</button>
                </div>
              ) : (
                <div>
                  {item.file.type.includes("word") ? (
                    <FaFileWord size={50} />
                  ) : item.file.type.includes("powerpoint") ? (
                    <FaFilePowerpoint size={50} />
                  ) : (
                    <FaFileImage size={50} />
                  )}
                  <a href={item.url} download={item.file.name}>Download {item.file.name}</a>
                </div>
              )}
            </>
          )}
        </div>
      ))}


      <button className="editbtn" onClick={handleSave}>Edit only image</button>

      {editedImages.map((imageUrl, index) => (
        <div key={index} className="edited-image">
          <h2>Edited Image {index + 1}:</h2>
          <img src={imageUrl} alt={`edited-${index}`} />
          <button onClick={() => downloadEditedImage(imageUrl, `edited-${index}.jpg`)}>
            Download Edited File
          </button>
        </div>
      ))}

    </div>
  );
}

export default App;
