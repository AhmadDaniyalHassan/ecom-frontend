import React from 'react'
const CategoryForm = ({ handleSubmit, value, setValue }) => {
    return (
        <>
            <form onSubmit={handleSubmit} className="d-flex align-items-center ">
                <div className="mb-0 me-1">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter New Category"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </>
    )
}

export default CategoryForm