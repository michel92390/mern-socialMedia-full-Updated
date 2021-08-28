//jshint esversion:6
import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { uploadPicture } from '../../actions/user.actions';

function UploadImg() {

    const [ file, setFile] = useState();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userReducer);

    const handlePicture = (e) => {
        e.preventDefault();
        //object de js qui permet de mettre dans un package notre img + des info que lon va passer
        const data = new FormData();
        data.append("name", userData.pseudo);
        data.append("userId", userData._id);
        data.append("file", file);

        //ensuite, on declenche une action
        //data que lon envoie au back pour enregistrer limage et creer limage dans notre static
        dispatch(uploadPicture(data, userData._id));
    };

    return (
        <form action="" onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file">Edit image</label>
            <input 
                type="file" 
                name="file" 
                id="file" 
                accept=".jpg, .png, .jpeg" 
                onChange={(e) => setFile(e.target.files[0])}
            />
            <br />
            <input type="submit" value="Send" />
        </form>
    )
}

export default UploadImg;
