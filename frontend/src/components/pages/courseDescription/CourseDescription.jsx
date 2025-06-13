import React, { useEffect, useState } from 'react'
import "./courseDescription.css"
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../../context/CourseContext';
import { server } from '../../../main';
import toast from 'react-hot-toast';
import { UserData } from '../../../context/UserContex';
import Loading from '../../loading/Loading.jsx';
import axios from 'axios';
function CourseDescription({ user }) {
    const params = useParams(); // get the id from parameter
    const navigate = useNavigate();
    const { fetchCourse, course , fetchCourses, fetchMyCourse } = CourseData();

    const [loading, setLoading] = useState(false);
    const {fetchUser} = UserData();

    useEffect(() => {
        fetchCourse(params.id)
    }, []);

    const checkoutHandler = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
    
        const {
          data: { order },
        } = await axios.post(
          `${server}/api/course/checkout/${params.id}`,
          {},
          {
            headers: {
              token,
            // Authorization: `Bearer ${token}`, 
            },
          }
        );
    
        const options = {
          key: "rzp_test_4Doiegl9AyArqf", // Enter the Key ID generated from the Dashboard
          amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "EduBlaze", //your business name
          description: "Learn with us",
          order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    
          handler: async function (response) {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
              response;
    
            try {
              const { data } = await axios.post(
                `${server}/api/verification/${params.id}`,
                {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                },
                {
                  headers: {
                    token,
                    // Authorization: `Bearer ${token}`,
                  },
                }
              );
    
              await fetchUser();
              await fetchCourses();
              await fetchCourse();
              await fetchMyCourse();
              toast.success(data.message);
              setLoading(false);
              navigate(`/payment-success/${razorpay_payment_id}`);
            } catch (error) {
              toast.error(error.response.data.message);
              setLoading(false);
            }
          },
          theme: {
            color: "#8a4baf",
          },
        };
        const razorpay = new window.Razorpay(options);
    
        razorpay.open();
      };
    

    
    return (
        <>
        {
            loading ? <Loading/> : <>
            {course && <div className='course-description'>
                <div className='course-header'>
                    <img src={`${server}/${course.image}`} alt="" className='course-image' />
                    <div className="course-info">
                        <h2>{course.title}</h2>
                        <p>Instructor:{course.createdBy}</p>
                        <p>Duration:{course.duration} weeks</p>
                    </div>

                </div>
                
                <p>{course.description}</p>


                <p> Let's get started with this course at ₹{course.price}</p>

                {
                    user && user.subscription.includes(course._id) ? <button onClick={() => navigate(`/course/study/${course._id}`)} className='common-btn1'> Study </button> :
                        <button onClick={checkoutHandler} className='common-btn1'>Buy Now</button>
                }
            </div>}
        </>
        }
        </>
    )
}

export default CourseDescription
