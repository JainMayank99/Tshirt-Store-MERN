import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { updateCategory, getCategory } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper'
import Base from '../core/Base'

const UpdateCategory = ({ match }) => {
    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const { user, token } = isAuthenticated();

    const handleChange = (event) => {
        setError(false);
        setName(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setError(false);
        setSuccess(false)

        //Backend Request
        //BUG: Not able to update Category  //BAD request 400
        updateCategory(match.params.categoryId, user._id, token, name)
            .then(data => {
                console.log("DATA", data);

                if (data.error) {
                    setError(true)
                }
                else {
                    setError(false)
                    setSuccess(true)
                    setName("")
                }
            })
    }

    const preload = (categoryId) => (
        getCategory(categoryId).then(data => {
            console.log("DATA", data);
            if (data.error)
                setError(true);
            else {
                setError(false)
                setName(data.name)
            }
        }
        ))

    useEffect(() => {
        preload(match.params.categoryId)
    }, [])

    const goBack = () => (
        <div className="mt-5">
            <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
        </div>
    )

    const successMessage = () => {
        if (success) {
            return <h4 className="text-success">Category updated successfully</h4>
        }
    }

    const warningMessage = () => {
        if (error) {
            return <h4 className="text-danger">Failed to update category </h4>
        }
    }

    const myCategoryForm = () => {
        return (
            <form>
                <div className="form-group">
                    <p className="lead">Enter the category</p>
                    <input type="text" className="form-control my-3" onChange={handleChange} value={name} autoFocus required />
                    <button onClick={onSubmit} className="btn btn-outline-info">Update Category</button>
                </div>
            </form>
        )
    }


    return (
        <Base
            title="Create a Category here"
            description="Add a new Category for new Tshirts"
            className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="caol-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory
