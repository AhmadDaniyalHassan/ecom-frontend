import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
    return (
        <>
            <div className='text-center mt-3'>
                <ul className="list-group">
                    <h4>Admin Panel</h4>
                    <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-action">
                        Create Category
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-action">
                        Create Product
                    </NavLink>
                    <NavLink to="/dashboard/admin/products" className="list-group-item list-group-action">
                        Manage Products
                    </NavLink>
                    <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-action">
                        Manage Orders
                    </NavLink>
                    <NavLink to="/dashboard/admin/show-user" className="list-group-item list-group-action">
                        Manage Users
                    </NavLink>
                    <NavLink to="/dashboard/admin/misc" className="list-group-item list-group-action">
                        Miscellaneous
                    </NavLink>
                    <NavLink to="/dashboard/user/profile" className="list-group-item list-group-action">
                        Manage Your Own Profile
                    </NavLink>
                </ul>
            </div>
        </>
    )
}

export default AdminMenu