import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FSCTOR = 10
const MAX_LOGIN_ATTEMPS = 5
const LOCK_TIME = 5 * 60 * 1000
const Schema = mongoose.Schema

const UserSchema = new Schema({
    role: {
        type: String,
        default: 'user'
    },
    username: String,
    nickName: String,
    avatarUrl: String,
    password: String,
    hashed_password: String,
    loginAttemps: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

UserSchema.pre('save', function(next) {
    let user = this
    // 是否修改过
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_WORK_FSCTOR, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, (errs, hash) => {
            if (errs) return next(errs)
            user.password = hash
            next()
        })
    })
})

UserSchema.methods = {
    comparePassword: function(_password, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, function(err, isMatch) {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },
    incLoginAttemps: function(user) {
        const that = this
        return new Promise((resolve, reject) => {
            // 已过锁定时间
            if (that.lockUntil && that.lockUntil < Date.now()) {
                that.update({
                    // 设定
                    $set: {
                        loginAttemps: 1
                    },
                    // 删除
                    $unset: {
                        lockUntil: 1
                    }
                }, function(err) {
                    if (err) reject(err)
                    else resolve(true)
                })
            } else {
                let updates = {
                    // 原子加减
                    $inc: {
                        loginAttemps: 1
                    }
                }

                if (that.loginAttemps + 1 >= MAX_LOGIN_ATTEMPS && !that.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                that.update(updates, err => {
                    if (err) reject(err)
                    else resolve(true)
                })
            }
        })
    }
}

mongoose.model('User', UserSchema)







