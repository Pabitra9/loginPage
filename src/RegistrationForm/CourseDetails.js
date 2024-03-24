import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";
import ProgressBar from "@ramonak/react-progress-bar";

const CourseDetails = ({ userId }) => {
  const [courseNames, setCourseNames] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [courseProgresses, setCourseProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([])
  const [fetchingLessons, setFetchingLessons] = useState(false);
  const [fetchingIndex, setFetchingIndex] = useState(null);
  const [page, setPage] = useState(1)
  const [isTheLastPage, setIsTheLastPage] = useState(false)
  const userToken = JSON.parse(localStorage.getItem('userDatas'));

  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const coursesRes = await axios.get(`https://academy.chrmp.com/wp-json/ldlms/v1/users/${userId}/courses?page=${page}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (coursesRes.status === 200) {

            const courseIds = coursesRes.data;

            const fetchedCourseNames = [];
            const fetchedLessons = [];
            const fetchedCourseProgresses = [];
            const fetchProgress = [];

            for (const courseId of courseIds) {
              const courseRes = await axios.get(`https://academy.chrmp.com/wp-json/ldlms/v1/sfwd-courses/${courseId}`, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              });

              if (courseRes.status === 200) {
                const courseName = courseRes.data.title.rendered;
                const currentCourseId = courseId
                const finalCourse = {"courseName" : courseName,
                                      "courseId" : currentCourseId}
                console.log("courseName",courseName);
                fetchedCourseNames.push(finalCourse);

                // Fetch course progress
                const progressRes = await axios.get(`https://academy.chrmp.com/wp-json/custom-app/v1/get-user-course-steps/?user_id=${userId}&course_id=${courseId}`, {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                });

                if (progressRes.status === 200) {
                  const courseProgress = progressRes.data.map((course) => ({
                    course_status: course.step_status,
                    // console.log(lesson_name);
                    course_id: course.step,
                  }));;
                  let progress = 0; // Declare progress as a variable
                  for (const output of courseProgress) {
                    // console.log(output);
                    if (output.course_status === true) {
                      progress++;
                      console.log(progress);
                      // fetchProgress.push(progress);
                    } else {
                      console.log("nothing happened");
                    }
                  }
                  fetchProgress.push(progress)
                  console.log("courseProgress",courseProgress);
                  fetchedCourseProgresses.push(courseProgress);
                } else {
                  console.error("Course progress request failed");
                  fetchedCourseProgresses.push(null);
                }
              } else {
                console.error("Course name request failed");
              }
            }
            setCourseNames(fetchedCourseNames);
            setLessons(fetchedLessons);
            setCourseProgresses(fetchedCourseProgresses);
            console.log(fetchedCourseProgresses);
            setProgress(fetchProgress)
            console.log(fetchProgress);
          } else {
            console.error("Course id request failed");
          }
        } catch (error) {
          if (error.response.data.code == "rest_post_invalid_page_number") {
            setIsTheLastPage(true)
            console.log('this is the last page');
          }else{
            console.error('AxiosError:', error);
            console.log(error.response.data.code);
            
          }
          console.error("Request error:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [userId, userToken,page]);

  const handlePrevPage = () => {
    // if (currentPage > 1) {
      setPage(page - 1);
      setLoading(true);
      console.log("prev click hela");
    // }
  };

  const handleNextPage = () => {
    // if (currentPage) {
      setPage(page + 1);
      setLoading(true);
      console.log("next click hela");
    // }
  };

  const toggleDetails = async (courseId, index) => {
    console.log(courseId);
    console.log(index);
    if (lessons[index]?.isOpen) {
      const updatedLessons = [...lessons];
      updatedLessons[index] = { ...updatedLessons[index], isOpen: false };
      setLessons(updatedLessons);
      return;
    }

    try {
      setFetchingLessons(true);
      setFetchingIndex(index); 
      const lessonsRes = await axios.get(`https://academy.chrmp.com/wp-json/ldlms/v2/sfwd-lessons?course=${courseId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (lessonsRes.status === 200) {
        const courseLessons = lessonsRes.data.map((lesson) => ({
          lesson_name: lesson.title.rendered,
          lesson_id: lesson.id,
        }));
        const updatedLessons = [...lessons];
        updatedLessons[index] = { lessons: courseLessons, isOpen: true };
        setLessons(updatedLessons);
        console.log(courseLessons);
      } else {
        console.error("Lessons request failed");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setFetchingLessons(false);
      setFetchingIndex(null);  // Set fetchingLessons to false when fetch completes
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Details</h1>
      <h2 className="text-xl font-semibold mb-2">{userId}</h2>
      {!isTheLastPage ? (
      loading ? (
        <div className="text-gray-600">Loading ...</div>
      ) : (
        <>
          <div>
            {courseNames.map((courseName, index) => (
              <div key={index} className="text-white  rounded-md mb-4 border-solid border-2 border-gray-200">
                <div className="flex justify-between items-center text-[#2960A1] border-b border-gray-200 w-full">
                  <button className="flex items-center p-4 gap-2 w-full" onClick={() => toggleDetails(courseName.courseId, index)}>
                    <span>{lessons[index]?.isOpen ? <BiSolidDownArrow  className='text-[#2960A1] text-base'/> : <BiSolidRightArrow className='text-[#2960A1] text-base'/>}</span>
                    <div className='flex justify-between items-center w-full'>
                      <span className="mr-2 text-[#2960A1] font-semibold text-lg">{courseName.courseName}</span>
                      {progress[index] > 0 ? (
                        <ProgressBar completed={Math.floor((progress[index]/courseProgresses[index].length)*100)} className='w-72' bgColor={"#8DC162"}/>
                      ) : (
                        <div className="text-sm text-gray-500">Not started yet</div>
                      )}
                    </div>
                  </button>
                </div>
                {fetchingLessons && index === fetchingIndex ? ( // Display "Please wait..." message while fetching lessons for the corresponding course
                  <div className="text-gray-600">Please wait ...</div>
                ) : (
                  lessons[index]?.isOpen && (
                    <div className="mt-2 text-slate-800 p-3">
                      <ul>
                        {lessons[index].lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center">
                            {courseProgresses[index]?.map((course, courseIndex) => (
                              (course.course_id === lesson.lesson_id) && ( 
                                <input
                                type="radio"
                                key={courseIndex}
                                checked={course.course_status}
                                className={`mr-2 h-4 w-4 border-2 rounded-full ${course.course_status ? "bg-green-500 border-green-800" : "border-white"}`}
                                readOnly
                                />
                                )
                                ))}
                            {lesson.lesson_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </>
      )):<h1 className='text-base'>No more course to load</h1>}
          <div className='flex justify-end items-center gap-3'>
            <button className='p-2 bg-black text-white rounded-md' onClick={handlePrevPage}>Previous</button>
            <button className='p-2 bg-black text-white rounded-md' onClick={handleNextPage}>Next</button>
          </div>
    </div>
  );
  
};

export default CourseDetails;
