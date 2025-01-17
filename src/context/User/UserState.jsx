import React, { useReducer } from 'react'
import UserContext from './UserContext'
import UserReducer from './UserReducer'

import axiosClient from '../../config/axios';

const UserState = (props) => {
    const initialState = {
        user: {
            firstName: null,
            lastName: null,
            email: null,
        },
        authStatus: false,
        loading: true
    }


    const [globalState, dispatch] = useReducer(UserReducer, initialState)
    const registerUser = async (dataForm) => {
        console.log('** SUBMITTING FORM : ', dataForm);
        try {
            const res = await axiosClient.post("/users/create", dataForm)
            console.log('** RESPONSE: ', res.data)
            dispatch({
                type: "REGISTRO_EXITOSO",
                payload: res.data
            })

        } catch (error) {
            console.log(error)
        }
    }


    const verifyingToken = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            console.log('** SETTING TOKEN: ', token)
            axiosClient.defaults.headers.common['x-auth-token'] = token
        }
        //  else {
        //     delete axiosClient.defaults.headers.common['x-auth-token']
        // }

        try {
            const respuesta = await axiosClient.get("/users/verify")
            dispatch({
                type: "OBTENER_USUARIO",
                payload: respuesta.data.user
            })
        } catch (error) {
            dispatch({
                type: "LOGIN_ERROR"
            })
        }
    }


    const loginUser = async (dataForm) => {
        try {
            const respuesta = await axiosClient.post("/users/login", dataForm)
            dispatch({
                type: "LOGIN_EXITOSO",
                payload: respuesta.data
            })

        } catch (error) {
            dispatch({
                type: "LOGIN_ERROR"
            })
        }
    }

    const logoutUser = async () => {
        dispatch({
            type: "LOGOUT_USUARIO"
        })
    }


    const userSubmitForm = async (data) => {
        const res = await axiosClient.put("/users/update", data)
        console.log(res)
        dispatch({
            type: "OBTENER_USUARIO",
            payload: res.data
        })
    }

    return (
        <UserContext.Provider value={{
            user: globalState.user,
            authStatus: globalState.authStatus,
            loading: globalState.loading,
            registerUser,
            verifyingToken,
            loginUser,
            logoutUser,
            userSubmitForm
        }}>

            {props.children}

        </UserContext.Provider>
    )
}

export default UserState