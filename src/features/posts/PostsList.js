import React, { useState } from 'react'
import {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../api/apiSlice'

function PostsList() {
  const [addNewPost, response] = useAddNewPostMutation()
  const [deletePost] = useDeletePostMutation()

  const [inputField, setInputField] = useState({
    id: '',
    title: '',
    content: '',
  })

  const inputsHandler = (e) => {
    setInputField((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const setPostData = (data) => {
    {console.log('data', data)}
    setInputField({
      id: data._id,
      title: data.title,
      content: data.content,
    });
   

 
  }

  const onEditData = (id) => {

    // let getData = setPostData(data);
    // console.log("getData", getData);
    updatePost({
       id:id,
      title: inputField.title,
      content: inputField.content,
    })

    setInputField(() => ({
      id: '',
      title: '',
      content: '',
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { title, content } = e.target.elements

    setInputField((inputField) => ({
      ...inputField,
      [e.target.name]: e.target.value,
    }))

    let formData = {
      title: title.value,
      content: content.value,
    }

    addNewPost(formData)
      .unwrap()
      .then(() => {
        setInputField(() => ({
          title: '',
          content: '',
        }))
      })
      .then((error) => {
        console.log(error)
      })
  }

  const {
    data: posts,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetPostsQuery({ refetchOnMountOrArgChange: true })

  let postContent
console.log("postContent", postContent);
  if (isGetLoading) {

    console.log("postContent inside if", postContent);
    postContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  } else if (isGetSuccess) {
    console.log("postContent else if", postContent);
    postContent = posts.map((item) => {
      return (
        <div className="col-lg-12 mb-3" key={item._id}>
          <div className="card alert alert-secondary">
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{item.body}</p>
              <button
                onClick={() => deletePost(item._id)}
                className="btn btn-outline-danger me-2"
              >
                Remove
              </button>
              <button
                onClick={() => setPostData(item)}
                className="btn btn-outline-primary me-2"
              >
                Edit
              </button>
              <button
            onClick={()=> onEditData(item._id)}
            className="btn btn-primary"
            type="button"
          >
            Update
          </button>
            </div>
          </div>
        </div>
      )
    })
  } else if (isGetError) {
    console.log("postContent isgetError ", postContent);
    postContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-md-4 offset-md-*">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter Title</strong>
            </label>
            <input
              value={inputField.title}
              type="text"
              className="form-control"
              name="title"
              id="title"
              onChange={inputsHandler}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter content</strong>
            </label>
            <textarea
              value={inputField.content}
              className="form-control"
              rows="3"
              name="content"
              id="content"
              onChange={inputsHandler}
            ></textarea>
          </div>

          <button className="btn btn-danger me-2" type="submit">
            Submit
          </button>
        </form>
      </div>

      <div className="col-lg-8">
        <div className="row">{postContent}</div>
      </div>
    </div>
  )
}

export default PostsList
