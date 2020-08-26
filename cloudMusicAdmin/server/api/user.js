import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function login(params) {
    let match = false
    const user = await User.findOne({username: params.username}).exec()
    
    if (user) {
        match = await user.comparePassword(params.password, user.password)
    }
    return {
        match,
        user
    }
}

export function logout() {
    return true
}