import React, { useEffect, useState } from 'react'
import './lecture.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../../main';
import Loading from '../../loading/Loading';
import toast from 'react-hot-toast';
function Lecture({ user }) {
    const [lectures, setLectures] = useState([]);
    const [lecture, setLecture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lecLoading, setLecLoading] = useState(false);
    const [show, setShow] = useState(false); // add lec

    const params = useParams();
    const navigate = useNavigate();
    const[title,setTitle] = useState("");
    const[description,setDescription] = useState("");
    const[video,setVideo] = useState(null);
    const[videoPrev,setVideoPrev] = useState("");
    const[btnLoading,setBtnLoading] = useState(false);

    if(user && user.role !== "admin" && !user.subscription.includes(params.id)){
        return navigate("/");
    }

    async function fetchLectures() {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            setLectures(data.lectures);
            setLoading(false);
        }

        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    async function fetchLecture(id) {
        setLecLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/lecture/${id}`, {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            setLecture(data.lecture);
            setLecLoading(false);
        }
        catch (err) {
            console.log(err);
            setLecLoading(false);
        }
    }
    
    const changeVideoHandler = e =>{
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend=()=>{
            setVideoPrev(reader.result);

            setVideo(file);
        };
    }
    const submitHandler = async(e)=>{
        setBtnLoading(true);
        e.preventDefault();
        const myForm = new FormData(); // passing data as from
        myForm.append("title", title);
        myForm.append("description", description);
        myForm.append("file", video);

        try{
        const {data} = await axios.post(`${server}/api/course/${params.id}`, myForm, {
            headers:{
                token: localStorage.getItem('token'),
            }
        })

        toast.success(data.message);
        setBtnLoading(false);
        setShow(false);
        fetchLectures(); // not lecture 
        setTitle(""); // to make it empty after adding a lecture
        setDescription("");
        setVideo("");
        setVideoPrev("");
        }
        catch(err){
            toast.error(err.response.data.message);
            setBtnLoading(false);
        }
    }

    const deleteHandler = async(id)=>{
        if(confirm("Are you sure you want to delete this lecture?")) { 
            try{
               const {data} = await axios.delete(`${server}/api/lecture/${id}`, {
                headers:{
                    token: localStorage.getItem('token'),
                },
               }
            )
            toast.success(data.message);
            fetchLectures(); // to update the lecture list after deletion
        }
            catch(err){
                toast.error(err.response.data.message);

            }
        }
    }

    useEffect(() => {
        fetchLectures()
    }, []);


    return (
        <>
            {loading ? <Loading /> : <>
                <div className="lecture-page">
                    <div className="left">
                        {
                            lecLoading ? <Loading /> : <>
                                {
                                    lecture.video ? <>
                                        <video src={`${server}/${lecture.video}`}
                                            width={"100%"}
            
                                            controls
                                            controlsList="nodownload noremoteplayback"
                                            disablePictureInPicture
                                            disableRemotePlayback
                                            autoPlay
                                        ></video>
                                        <h1>{lecture.title}</h1>
                                        <h3>{lecture.description}</h3>
                                    </> : <h1>Please Selct a Lecture</h1>
                                }

                            </>
                        }
                    </div>
                    <div className="right">
                        {user && user.role === 'admin' && (<button className='common-btn' onClick={()=>setShow(!show)}> {show ? "close" : "Add Lecture +"}</button>)}
                        {
                            show && (<div className='lecture-form'>
                                <h2> Add Lecture</h2>
                                <form onSubmit={submitHandler}>
                                    <label htmlFor="text">Title</label>
                                    <input type="text" 
                                    value={title} 
                                    onChange={e=>setTitle(e.target.value)} required />


                                    <label htmlFor="text">Description</label>
                                    <input type="text"
                                     value={description} 
                                    onChange={e=>setDescription(e.target.value)}
                                     required />

                                    <input type="file" placehoolder='choose video' 
                                    onChange={changeVideoHandler} 

                                    required />
                                    {
                                        videoPrev && <video src={videoPrev} alt="video preview" width={200} controls></video>
                                    }

                                    <button disabled={btnLoading} type="submit" className='common-btn'>
                                        {btnLoading ? "Adding..." : "Add Lecture"}
                                        
                                    </button>
                                </form>
                            </div>
                            )}
                        {
                            lectures && lectures.length > 0 ? lectures.map((e, i) => (
                                <>
                                    <div onClick={() => fetchLecture(e._id)} key={e._id} className={`lecture-number ${lecture._id === e._id && "active"}`}>
                                        {i + 1}.{e.title}
                                    </div>
                                    {
                                        user && user.role === "admin" && <button className='common-btn' 
                                        style={{ background: "red" }}
                                        onClick={()=>{deleteHandler(e._id)}}
                                        >Delete {e.title}</button>
                                    }
                                </>
                            )) : <p> No Lecture Yet</p>
                        }
                    </div>
                </div>
            </>}
        </>
    )
}

export default Lecture
