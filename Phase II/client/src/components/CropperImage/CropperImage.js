import React, { useEffect, useState } from 'react'
import Cropper from 'react-easy-crop';
import "./CropperImage.scss"
import CloseIcon from '@mui/icons-material/Close';
import { getCroppedImg } from '../../utils/cropImage';
import { dataURLToFile } from '../../utils/dataURLToFile';

const CropperImage = ({userData, image}) => {
    const [ crop, setCrop ] = useState({ x: 0, y: 0 });
    const [ zoom, setZoom ] = useState(1);
    const [ croppedArea, setCroppedArea ] = useState(null);  
    const [ isCropping, setIsCropping ] = useState(false);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const closeCrop = () => {
        setIsCropping(false);
    }

    const uploadImage = async () => {
        if(!image) alert("Please select an image!");

        const canvas = await getCroppedImg(image, croppedArea);
        const canvasDataURL = canvas.toDataURL('image/jpeg');
        const convertedURLToFile = dataURLToFile(canvasDataURL, `image.jpeg`);

        try{
            const formData = new FormData();
            const userID = userData._id;

            formData.append("croppedImage", convertedURLToFile);
            formData.append("userID", userID);

            const res = await fetch("http://localhost:3001/upload-profile-pic", {
                method: "POST",
                body: formData,
            });

            const res2 = await res.json();
            console.log(res2);
        }catch(err){
            console.error(err);
        }
    };

    useEffect(() => {
        setIsCropping(true);
    }, [])

    return (
        <div className="main-container">
            {
                isCropping ?
                <>

                    <CloseIcon className='close-icon' onClick={closeCrop}/>

                    <div className="container-cropper">
                        <div className="cropper">
                            <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}/>
                        </div>
                    </div>

                    <div className="container-buttons">
                        <button className='upload-button' onClick={uploadImage}>Upload</button>
                    </div>
                </>
                :
                null
            }
        </div>
  )
}

export default CropperImage;