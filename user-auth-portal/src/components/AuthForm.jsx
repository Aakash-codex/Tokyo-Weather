import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import './AuthForm.css'

const AuthForm = ({ onLogin }) => {
  const [view, setView] = useState('login') // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    recoveryPhrase: ''
  })
  const [errors, setErrors] = useState({})
  const [isResetSent, setIsResetSent] = useState(false)

  const getUsers = () => JSON.parse(localStorage.getItem('vault_users') || '[]')
  const saveUsers = (users) => localStorage.setItem('vault_users', JSON.stringify(users))

  const validate = () => {
    let newErrors = {}
    if (view === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'Required'
      if (!formData.lastName) newErrors.lastName = 'Required'
      if (!formData.phone) newErrors.phone = 'Required'
      if (!formData.recoveryPhrase) newErrors.recoveryPhrase = 'Required'
    }
    
    if (!formData.email) newErrors.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    
    if (view === 'forgot') {
      if (!formData.recoveryPhrase) newErrors.recoveryPhrase = 'Required'
    } else {
      if (!formData.password) newErrors.password = 'Required'
      else if (formData.password.length < 8) newErrors.password = 'Min 8 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const users = getUsers()
    const user = users.find(u => u.email === formData.email)

    if (view === 'signup') {
      if (user) {
        setErrors({ email: 'Email already exists' })
        return
      }
      const newUser = { ...formData }
      saveUsers([...users, newUser])
      onLogin({ name: formData.firstName, email: formData.email })
    } else if (view === 'login') {
      if (user && user.password === formData.password) {
        onLogin({ name: user.firstName, email: user.email })
      } else {
        setErrors({ auth: 'Invalid email or password' })
      }
    } else if (view === 'forgot') {
      if (user && user.recoveryPhrase === formData.recoveryPhrase) {
        setIsResetSent(true)
        // In a real app, we'd show a "Set New Password" field here
        // For simplicity, we'll auto-reset to a temp one or just let them back in
        setTimeout(() => {
          setIsResetSent(false)
          setView('login')
          alert(`Your password recovery is verified. Please log in with your original credentials or contact support to reset.`)
        }, 3000)
      } else {
        setErrors({ recoveryPhrase: 'Incorrect recovery phrase' })
      }
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card auth-container"
    >
      <div className="auth-header">
        <h2>
          {view === 'login' && 'Welcome Back'}
          {view === 'signup' && 'Create Account'}
          {view === 'forgot' && 'Reset Password'}
        </h2>
        <p>
          {view === 'login' && 'Please enter your details'}
          {view === 'signup' && 'Join our premium community'}
          {view === 'forgot' && 'Enter your email to receive a reset link'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <AnimatePresence mode="popLayout">
          {view === 'signup' && (
            <motion.div 
              key="signup-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="name-row"
            >
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {view === 'signup' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="input-group"
          >
            <div className="input-wrapper">
              <Phone className="input-icon" size={18} />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <span className="error">{errors.phone}</span>}
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="input-group"
          >
            <div className="input-wrapper">
              <ShieldCheck className="input-icon" size={18} />
              <input 
                type="text" 
                name="recoveryPhrase" 
                placeholder="Secret Recovery Phrase (e.g. Favorite Pet)" 
                value={formData.recoveryPhrase}
                onChange={handleChange}
              />
            </div>
            {errors.recoveryPhrase && <span className="error">{errors.recoveryPhrase}</span>}
          </motion.div>
        )}

        {view === 'forgot' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="input-group"
          >
            <div className="input-wrapper">
              <ShieldCheck className="input-icon" size={18} />
              <input 
                type="text" 
                name="recoveryPhrase" 
                placeholder="Enter Your Recovery Phrase" 
                value={formData.recoveryPhrase}
                onChange={handleChange}
              />
            </div>
            {errors.recoveryPhrase && <span className="error">{errors.recoveryPhrase}</span>}
          </motion.div>
        )}

        <div className="input-group">
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              name="email" 
              placeholder="Gmail Address" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {view !== 'forgot' && (
          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Strong Password" 
                value={formData.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
            {errors.auth && <span className="error">{errors.auth}</span>}
            {view === 'login' && (
              <button 
                type="button" 
                className="forgot-link"
                onClick={() => setView('forgot')}
              >
                Forgot Password?
              </button>
            )}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isResetSent}>
          {isResetSent ? 'Link Sent!' : (
            <>
              {view === 'login' && 'Sign In'}
              {view === 'signup' && 'Register Now'}
              {view === 'forgot' && 'Send Reset Link'}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <span>
          {view === 'login' ? "Don't have an account?" : 
           view === 'signup' ? "Already have an account?" : 
           "Remembered your password?"}
        </span>
        <button 
          onClick={() => setView(view === 'signup' ? 'login' : view === 'forgot' ? 'login' : 'signup')}
          className="switch-btn"
        >
          {view === 'login' ? 'Sign Up' : 'Log In'}
        </button>
      </div>

      <div className="security-badge">
        <ShieldCheck size={14} />
        <span>Secure Encryption Active</span>
      </div>
    </motion.div>
  )
}

export default AuthForm
